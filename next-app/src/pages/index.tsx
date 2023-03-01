import { GitHubSvg } from "@/components/github-svg";
import { motion } from "framer-motion";
import Head from "next/head";
import Image from "next/image";
import { Fragment, useState } from "react";
import classnames from "classnames";
import { SendIcon } from "@/components/send-icon";
import { ExternalSvg } from "@/components/external-svg";
import { useQuery } from "react-query";
import { ChatResult } from "./api/chat";

export default function Home() {
  const queryFn = async (): Promise<ChatResult> => {
    const search_result = await fetch("/api/chat", {
      body: JSON.stringify({ query: search_query }),
      method: "POST",
      headers: { "content-type": "application/json" },
    }).then((res) => res.json());

    return search_result;
  };

  const [started, set_started] = useState(false);
  const [search_query, set_search_query] = useState("");
  const { refetch, data, isLoading } = useQuery({
    queryFn: queryFn,
    enabled: false,
  });
  const handle_search = () => {
    refetch();
  };
  const handle_search_query_change = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    set_search_query(event.target.value!);
  };
  return (
    <>
      <Head>
        <title>DocuChat</title>
        <meta name="description" content="Contextual GitHub Docs Search" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Fragment>
        <Image
          fill
          className="object-cover -z-10 absolute"
          alt=""
          src={"/background.png"}
        ></Image>
        <main className="2xl:container transition-all duration-300 mx-auto relative flex justify-center h-screen items-center">
          <a
            href="https://github.com/amir002001/DocuChat"
            className="absolute right-6 top-6 rounded-full bg-gray-800 text-gray-100 px-4 py-2 shadow-md"
          >
            view source
          </a>
          <div className="flex flex-col max-w-[640px] items-center justify-center gap-9 w-full">
            <GitHubSvg className="w-24" />
            <div
              className={classnames(
                "flex flex-col justify-center items-center",
                started ? "w-2/3 " : ""
              )}
            >
              {started ? (
                <>
                  <motion.div
                    initial={{ width: "10%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 0.2 }}
                    className={classnames(
                      "w-full text-lg bg-gray-200 px-6 py-4 gap-1 rounded-full shadow-md flex justify-between"
                    )}
                  >
                    <input
                      value={search_query}
                      onChange={handle_search_query_change}
                      type="text"
                      className={classnames(
                        "bg-gray-200 w-full transition-all duration-300 outline-none "
                      )}
                    />
                    <button disabled={isLoading} onClick={handle_search}>
                      <SendIcon className="w-6" />
                    </button>
                  </motion.div>
                  {data !== undefined ? (
                    <div>
                      <p>{data.response}</p>
                      {data.sources.map((source) => (
                        <div key={source.url} className="flex gap-1">
                          <a href={source.url}>{source.url}</a>
                          <ExternalSvg className="w-5" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <></>
                  )}
                </>
              ) : (
                <button
                  className={classnames(
                    "font-semibold text-lg bg-gray-200 px-6 py-4 rounded-full shadow-md w-full"
                  )}
                  onClick={() => set_started((prev) => !prev)}
                >
                  ask me
                </button>
              )}
            </div>
          </div>
        </main>
      </Fragment>
    </>
  );
}
