import * as dotenv from 'dotenv'
import { readdir } from 'fs/promises';
import { resolve } from 'path';
dotenv.config()
import { get_pinecone_client } from "./client"

async function* getFiles(dir: string): AsyncGenerator<{ file_name: string, file_path: string }, boolean, unknown> {
    const dirents = await readdir(dir, { withFileTypes: true });
    for (const dirent of dirents) {
        const res = resolve(dir, dirent.name);
        if (dirent.isDirectory()) {
            yield* getFiles(res);
        } else {
            yield { file_name: dirent.name, file_path: res };
        }
    }
    return true
}
const process_docs = async ({ doc_path, ignore }: { doc_path: string, ignore: string[] }) => {
    const ignore_set = new Set(ignore)
    for await (const file of getFiles("./docs")) {
        if (!ignore_set.has(file.file_name))
            console.log(file)
    }
}

const main = async () => {
    const pinecone = await get_pinecone_client()

    const indexes = await pinecone.listIndexes()
    if (!indexes.includes("docs")) {
        console.log("index does not exist. attempting to create")
        pinecone.createIndex({ createRequest: { name: "docs", podType: "s1", metric: "cosine", dimension: 4096 } })
    } else {
        console.log("index exists")
    }
    process_docs({
        doc_path: "docs", ignore: ["index.md", "changelog.md"]
    })
}

main()
