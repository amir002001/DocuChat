import { GitHubSvg } from "@/components/github-svg";
import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>DocuChat</title>
        <meta name="description" content="Contextual GitHub Docs Search" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex items-center justify-center w-screen h-screen">
        <div className="flex flex-col items-center justify-center gap-9">
          <GitHubSvg className="w-24" />
          <div>
            <input className="hidden" type="text" />
            <button className="font-semibold text-lg bg-gray-200 px-6 py-4 rounded-full">
              ask me
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
