"use client";

import Link from "next/link";
import React from "react";
import Image from "next/image";
import { ConnectButton } from "./connect-button";
// import { useAccount, useSignMessage } from "wagmi";

export const HeroHeader = () => {
  // const { signMessageAsync } = useSignMessage();
  // const { address, isConnected } = useAccount();

  // useEffect(() => {
  //   if (isConnected && !token) {
  //     async function loginWithWallet() {
  //       try {
  //         const message = `Sign this message to log in with your wallet: ${address}`;
  //         const signature = await signMessageAsync({ message });

  //         const res = await fetch("/api/auth/login", {
  //           body: JSON.stringify({
  //             wallet_address: address,
  //             signed_message: signature,
  //           }),
  //         });

  //         if (!res.ok) {
  //           const error = await res.json();
  //           console.error("Login failed:", error);
  //           return;
  //         }

  //         const result = await res.json();
  //         console.log("Login success:", result);
  //       } catch (err) {
  //         console.error("Wallet login error:", err);
  //       }
  //     }

  //     loginWithWallet();
  //   }
  // }, [address, isConnected, signMessageAsync, token]);

  return (
    <header className="fixed z-20 w-full px-2 py-10 ">
      <div className="mx-auto transition-all duration-300 px-4 max-w-[986px] rounded-[10px] border bg-black">
        <div className="relative flex flex-wrap items-center justify-between gap-6 py-2">
          <div className="flex w-full justify-between lg:w-auto">
            <Link
              href="/"
              aria-label="home"
              className="flex items-center space-x-2"
            >
              <Image
                src={"https://mine.hii.link/hiilink_header1.png"}
                alt="HiiLink"
                width={100}
                height={26.5}
              />
            </Link>

            <div className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden">
              <ConnectButton />
            </div>
          </div>

          {/* <div className="absolute inset-0 m-auto hidden size-fit lg:block">
              <ul className="flex gap-8 text-base">
                {menuItems.map((item, index) => (
                  <li key={index}>
                    <Link
                      href={item.href}
                      className="text-muted-foreground hover:text-accent-foreground block duration-150"
                    >
                      <span>{item.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div> */}

          <div className="bg-background in-data-[state=active]:hidden lg:in-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent">
            {/* <div className="lg:hidden">
                <ul className="space-y-6 text-base">
                  {menuItems.map((item, index) => (
                    <li key={index}>
                      <Link
                        href={item.href}
                        className="text-muted-foreground hover:text-accent-foreground block duration-150"
                      >
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div> */}
            <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
              <ConnectButton />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
