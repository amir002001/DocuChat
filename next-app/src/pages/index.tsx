import { GitHubSvg } from "@/components/github-svg";
import { motion } from "framer-motion";
import Head from "next/head";
import Image from "next/image";
import { Fragment, useState } from "react";
import classnames from "classnames";
import { SendIcon } from "@/components/send-icon";

export default function Home() {
  const [started, set_started] = useState(false);
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
        <main className="xl:container transition-all duration-300 mx-auto relative flex justify-center h-screen items-center">
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
                <motion.div
                  initial={{ width: "10%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 0.2 }}
                  className={classnames(
                    "w-full text-lg bg-gray-200 px-6 py-4 gap-1 rounded-full shadow-md flex justify-between"
                  )}
                >
                  <input
                    type="text"
                    className={classnames(
                      "bg-gray-200 w-full transition-all duration-300 outline-none "
                    )}
                  />
                  <SendIcon className="w-6" />
                </motion.div>
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
