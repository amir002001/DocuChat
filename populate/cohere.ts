import cohere from "cohere-ai";

export const init_cohere_client = () => {
	cohere.init(process.env.COHERE_API_KEY ?? "");
	return cohere;
};

export const summarize_text = async (
	text: string,
	co: typeof cohere,
): Promise<string> => {
	const summary = await co.summarize({
		text: text,
		length: "long",
		format: "bullets",
	});
	return summary.body.summary;
};

export const embed_text = async (text: string, co: typeof cohere) => {
	const vector = await co.embed({
		model: "large",
		texts: [text],
	});
	return vector.body.embeddings[0];
};
