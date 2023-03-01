import { GitHubSvg } from "@/components/github-svg";
import { motion } from "framer-motion";
import Head from "next/head";
import Image from "next/image";
import { Fragment, useRef, useState } from "react";
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
  const { refetch, data, isFetching, isRefetching } = useQuery({
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
  const handle_search_key_down = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      button_ref.current?.click();
    }
  };
  const button_ref = useRef<HTMLButtonElement | null>(null);
  return (
    <>
      <Head>
        <title>DocuChat</title>
        <meta name="description" content="Contextual GitHub Docs Search" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Fragment>
        <Image
          priority
          fill
          className="object-cover -z-10 absolute"
          alt=""
          src={
            "https://res.cloudinary.com/df3h8ffly/image/upload/q_auto:eco/v1677695515/image_rfa338.webp"
          }
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
                started ? "w-full" : ""
              )}
            >
              {started ? (
                <>
                  <motion.div
                    initial={{ width: "10%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 0.2 }}
                    className={classnames(
                      "w-full text-lg bg-gray-200 px-6 py-4 gap-1 rounded-full shadow-md flex justify-between items-center"
                    )}
                  >
                    <input
                      value={search_query}
                      onChange={handle_search_query_change}
                      onKeyDown={handle_search_key_down}
                      type="text"
                      className={classnames(
                        "bg-gray-200 w-full transition-all duration-300 outline-none "
                      )}
                    />
                    {!isFetching && !isRefetching ? (
                      <button
                        ref={button_ref}
                        disabled={isFetching || isRefetching}
                        onClick={handle_search}
                      >
                        <SendIcon className={classnames("w-6")} />
                      </button>
                    ) : (
                      <div role="status">
                        <svg
                          aria-hidden="true"
                          className="w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                          viewBox="0 0 100 101"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="currentColor"
                          />
                          <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentFill"
                          />
                        </svg>
                        <span className="sr-only">Loading...</span>
                      </div>
                    )}
                  </motion.div>
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
            {data !== undefined ? (
              <motion.div className="w-full bg-gray-200 rounded-xl p-4">
                <p>{data.response}</p>
                {data.sources.map((source) => (
                  <a
                    key={source.url}
                    target="_blank"
                    className="funderline text-blue-600 flex gap-1"
                    href={source.url}
                  >
                    {source.name}
                    <ExternalSvg className="w-5" />
                  </a>
                ))}
              </motion.div>
            ) : (
              <></>
            )}
          </div>
        </main>
      </Fragment>
    </>
  );
}
