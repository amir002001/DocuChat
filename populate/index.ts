import * as dotenv from "dotenv";
dotenv.config();
import { embed_text, init_cohere_client, summarize_text } from "./cohere";
import { readFileSync } from "fs";
import { readdir } from "fs/promises";
import { relative, resolve } from "path";
import {
    check_does_index_exist,
    check_has_id_been_upserted,
    create_index,
    init_pinecone_client,
    retrieve_index,
    upsert_vector,
} from "./pinecone";

const main = async () => {
    async function* getFiles(dir: string): AsyncGenerator<
        {
            file_name: string;
            file_path: string;
            relative_path: string;
        },
        boolean,
        unknown
    > {
        const dirents = await readdir(dir, {
            withFileTypes: true,
        });
        for (const dirent of dirents) {
            const res = resolve(dir, dirent.name);
            if (dirent.isDirectory()) {
                yield* getFiles(res);
            } else {
                const relative_path = relative(resolve(__dirname, doc_path), res);
                yield {
                    file_name: dirent.name,
                    file_path: res,
                    relative_path: relative_path,
                };
            }
        }
        return true;
    }

    const embed_file = async (file_path: string): Promise<number[]> => {
        const file_content = readFileSync(file_path, {
            encoding: "utf8",
            flag: "r",
        });
        console.log("getting file summary");
        const summary = await summarize_text(file_content, cohere_client);
        console.log(summary);
        console.log("getting vector");
        const vector = await embed_text(summary, cohere_client);
        console.log(vector)
        if (summary === undefined || vector === undefined || vector.length === 0) throw new Error("cohere moment")
        return vector;
    };

    const process_docs = async ({
        doc_path,
        ignore,
    }: {
        doc_path: string;
        ignore: string[];
    }) => {
        const ignore_set = new Set(ignore);
        for await (const file of getFiles(doc_path)) {
            if (!ignore_set.has(file.file_name)) {
                const index = retrieve_index(doc_path, pinecone_client);
                if (await check_has_id_been_upserted(file.relative_path, index)) {
                    console.log(`id ${file.relative_path} exists`);
                } else {
                    let vector = null
                    try {
                        vector = await embed_file(file.file_path);
                    } catch (e: unknown) {
                        if (e instanceof Error) console.error(e.message)
                        continue
                    }
                    if (!vector) continue
                    await upsert_vector(
                        {
                            id: file.relative_path,
                            vector: vector,
                            index: index,
                        },
                    );
                    console.log(`upserting id ${file.relative_path}`);
                    await new Promise(r => setTimeout(r, 7000));
                }
            }
        }
    };

    const cohere_client = init_cohere_client();
    const pinecone_client = await init_pinecone_client();
    const doc_path = "docs";
    if (await check_does_index_exist(doc_path, pinecone_client))
        console.log("index exists");
    else {
        console.log("index does not exist. creating index");
        await create_index(doc_path, pinecone_client);
        process.exit()
    }
    //    while (!(await check_is_index_ready(doc_path, pinecone_client))) {
    //        console.log("index is not ready")
    //        await new Promise(r => setTimeout(r, 1000))
    //    }
    //    endpoint doesn't work for now not my fault
    //    check via console and run again
    process_docs({
        doc_path: doc_path,
        ignore: ["index.md", "changelog.md", ".DS_Store"],
    });
};

main();
