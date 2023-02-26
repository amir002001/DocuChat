import { PineconeClient } from "@pinecone-database/pinecone";
import { VectorOperationsApi } from "@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch";

export const init_pinecone_client = async () => {
    const pinecone = new PineconeClient();
    await pinecone.init({
        environment: process.env.PINECONE_ENVIRONMENT ?? "",
        apiKey: process.env.PINECONE_API_KEY ?? "",
    });
    return pinecone;
};

export const check_has_id_been_upserted = async (
    id: string,
    index: VectorOperationsApi,
) => {
    const res = await index.fetch({
        ids: [id],
    });
    const vectors = res?.vectors;
    if (!vectors) return false;
    const vector = vectors[id];
    if (!vector) return false;
    return vector.id === id;
};

export const upsert_vector = async (
    {
        id,
        vector,
        index,
    }: {
        id: string;
        vector: number[];
        index: VectorOperationsApi;
    },
): Promise<boolean> => {
    const response = await index.upsert({
        upsertRequest: {
            vectors: [{ id: id, values: vector }],
        },
    });
    return response.upsertedCount !== 0;
};

export const retrieve_index = (
    index_name: string,
    pinecone: PineconeClient,
): VectorOperationsApi => {
    const index = pinecone.Index(index_name);
    return index;
};

export const check_does_index_exist = async (
    index_name: string,
    pinecone: PineconeClient,
): Promise<boolean> => {
    const indexes = await pinecone.listIndexes();
    return indexes.includes(index_name);
};

export const create_index = async (
    index_name: string,
    pinecone: PineconeClient,
): Promise<void> => {
    pinecone.createIndex({
        createRequest: {
            name: index_name,
            podType: "s1",
            metric: "cosine",
            dimension: 4096,
        },
    });
};
