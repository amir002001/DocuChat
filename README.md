# DocuChat

* [Figma](https://www.figma.com/file/NtnDH1izHCYzvBjVWNN9wR/DocuChat?node-id=1202%3A1041)
* [Link](https://docuchat.amir.day/)

## **💡 Inspiration 💡**

As a SWE, I often found myself struggling to find the information I needed on GitHub Docs. Traditional keyword-based search engines often returned irrelevant results, making it difficult to quickly and efficiently find the information I was looking for.

That's when I realized that a more effective search system would need to take into account the context and meaning of my search queries, rather than just matching keywords. I became interested in exploring the potential of machine learning and natural language processing to improve search accuracy and efficiency.

After discovering Cohere's Large Language Model and experimenting with a vector database, I was inspired by the possibilities of these technologies to transform the way we search for information online. I decided to build a contextual search feature for GitHub's documentation that would make it easier for developers like me to find the information we need quickly and accurately.

Through this project, I hope to inspire other developers to explore the potential of machine learning and natural language processing in search applications. By leveraging these technologies, we can create more intelligent, intuitive, and user-friendly search systems that improve the overall user experience.

## **🛠️ What it does 🛠️**

This project is a contextual search feature for GitHub's documentation that leverages Cohere's Large Language Model and a vector database. Using this feature, users can ask questions about a specific topic on GitHub and the system will find the closest documentation to that topic from the vector database.

The system works by summarizing all of GitHub's documentation using Cohere's Large Language Model and tokenizing the summary. The tokenized summary is then stored in a vector database, which allows the system to quickly retrieve the closest documentation to a user's query.

This approach enables more accurate and efficient search results compared to traditional keyword-based search engines. By analyzing the meaning and context of natural language queries, the system is able to identify the most relevant documentation and present it to the user in a clear and organized format.

Overall, this project aims to make it easier for developers to find the information they need on GitHub quickly and efficiently, by leveraging the power of machine learning and natural language processing.

## **🏗️ How I built it 🏗️**

I built the project using a Node.JS scraper in the backend that scrapes every doc on GitHub docs, summarizes them, and then embeds them. 

On the front-end I used Next.JS, React Query, and TailwindCSS to make it all look pretty!

## **🧗‍♂️ Challenges I ran into 🧗‍♂️**

One of the biggest challenges I faced during the development of this project was the API rate limit for Cohere's Large Language Model. Due to the rate limit, I had to be mindful of the number of API requests I was making and implement caching strategies to minimize unnecessary requests.

Another challenge I encountered was ensuring the accuracy of the search results. While Cohere's Large Language Model and vector database were powerful tools for contextual search, there were still some cases where the system returned results that were only partially related to the user's query. I had to experiment with different methods for tokenizing and summarizing the documentation to improve the system's accuracy.

Finally, I also faced some challenges with the user interface design. I wanted to create a simple and intuitive interface that would make it easy for users to search for documentation, but I also wanted to include enough information to help users understand the context and relevance of the search results. It took some trial and error to find the right balance between simplicity and information density.

Despite these challenges, I'm proud of the final product and believe that it has the potential to help developers find the information they need on GitHub more efficiently and accurately.

## **📕 What we learned 📕**

Building this project was a great learning experience for me, as it allowed me to explore the potential of large language models, vector embeddings, and vector databases for natural language processing and contextual search.

Through my work with Cohere's Large Language Model, I gained a deeper understanding of how machine learning models can be trained to understand the meaning and context of natural language queries. I also learned how to leverage these models to summarize large bodies of text and create vector embeddings that capture the semantic relationships between words and phrases.

Working with a vector database was also a new experience for me. I learned how to efficiently store and retrieve large numbers of vector embeddings, which was essential for creating a fast and responsive search system.

Overall, this project helped me develop a deeper understanding of the power of machine learning and natural language processing for search applications. It also taught me valuable lessons in data management, caching strategies, and user interface design. I look forward to applying these skills to future projects and continuing to explore the possibilities of these exciting technologies.

## **⏭️ What's next for DocuChat ⏭️**

- **Integration with Confluence:** One of the most exciting possibilities for DocuChat is the integration with Confluence, TD's documentation platform. By leveraging Cohere's Large Language Model and vector database, DocuChat could be used to power contextual search within Confluence, making it easier for developers to find the information they need.
- **Improving search accuracy:** While DocuChat is already quite accurate, there is always room for improvement. I plan to experiment with different tokenization and summarization strategies to further improve the system's ability to identify and retrieve the most relevant documentation.
- **Adding support for more languages:** Currently, DocuChat only supports English-language documentation. However, with Cohere's Large Language Model, it's possible to expand support to other languages, which would be a valuable addition for global organizations like TD.
- **Adding more advanced search features:** In addition to contextual search, I plan to add more advanced search features, such as the ability to search by date, author, or specific keywords.


## Tech Stack

**Web App:**
* SvelteKit 
* tRPC
* TanStack Query 
* TailwindCSS 
* Vercel


**Embedding Docs:** 
* Node 
* TypeScript
* Rome

![Vercel](https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white)

![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)

![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)

![React Query](https://img.shields.io/badge/-React%20Query-FF4154?style=for-the-badge&logo=react%20query&logoColor=white)

![Svelte](https://img.shields.io/badge/svelte-%23f1413d.svg?style=for-the-badge&logo=svelte&logoColor=white)

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)


