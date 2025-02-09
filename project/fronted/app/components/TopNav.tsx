"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";
import { useEffect } from "react";
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
export function TopNav() {
    const pathname = usePathname();
    const [currentPath, setCurrentPath] = useState(pathname);
    const suiAccount = useCurrentAccount();
    const docsLink = process.env.NEXT_PUBLIC_DOCS;
    useEffect(() => {
        setCurrentPath(pathname); // 强制组件重新渲染
    }, [pathname]);

    useEffect(() => {
        localStorage.setItem('suiAccount', String(suiAccount?.address) || '');
    }, [suiAccount]);
 
    return (
        <div className="fade-in">
        <div className="flex w-full h-24 bg-nav flex-row z-50">
            <div className=" ml-5 w-1/4 flex flex-row text-white items-center">
                <Image
                    className="relative mr-3 dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
                   src="/logo.png"
                    alt="Logo"
                    width={40}
                    height={40}
                    priority
                />
                <p className="mt-1 text-4xl">Fate3AI</p>
            </div>
            <div className="w-1/2 flex flex-between items-center bg-nav text-2xl">
                <div className="w-1/6  text-white/50">
                    <Link
                        className={`link ${pathname === "/" ? "text-white" : ""
                            } block w-full h-full leading-[52px]`}
                        href="/"
                    >
                        Home
                    </Link>
                </div>
                <div className="w-1/6  text-white/50">
                    <Link
                        className={`link ${pathname.startsWith("/lottery") ? "text-white" : ""
                            } block w-full h-full leading-[52px]`}
                        href="/lottery"
                    >
                        Lottery
                    </Link>
                </div>
                <div className="w-1/6  text-white/50">
                    <Link
                        className={`link ${pathname.startsWith("/divination") ? "text-white" : ""
                            } block w-full h-full leading-[52px]`}
                        href="/divination"
                    >
                        Divination
                    </Link>
                </div>
                <div className="w-1/6  text-white/50">
                    <Link
                        className={`link ${pathname.startsWith("/checkin") ? "text-white" : ""
                            } block w-full h-full leading-[52px]`}
                        href="/checkin"
                    >
                        Check in
                    </Link>
                </div>
                <div className="w-1/6  text-white/50">
                    <Link
                        className={`link ${pathname.startsWith("/swap") ? "text-white" : ""
                            } block w-full h-full leading-[52px]`}
                        href="/swap"
                    >
                        Swap
                    </Link>
                </div>
                {/* <div className="w-1/6  text-white/50">
                    <a
                        rel="noopener noreferrer"
                        href={docsLink}
                        className="block text-white/50 focus:outline-none data-[active]:text-white data-[hover]:text-white data-[focus]:outline-1 data-[focus]:outline-white">
                        Check in
                    </a>
                </div> */}
                <div className="w-1/6  text-white/50">
                    <Popover className="relative">
                        <PopoverButton className="block text-white/50 focus:outline-none data-[active]:text-white data-[hover]:text-white data-[focus]:outline-1 data-[focus]:outline-white">
                            Contact
                        </PopoverButton>
                        <PopoverPanel
                            transition
                            anchor="bottom"
                            className="absolute z-50 mt-2 w-32 bg-customPopover rounded-lg shadow-lg divide-y divide-white/5 rounded-xl text-sm/6 transition duration-200 ease-in-out [--anchor-gap:var(--spacing-5)] data-[closed]:-translate-y-1 data-[closed]:opacity-0"
                            style={{ top: "100%" }}
                        >
                            <div className="p-3">
                                <a href="" className="block rounded-lg py-2 px-3 transition hover:bg-white/5">
                                    <p className="font-semibold text-white">Telegrame</p>
                                </a>
                                <a className="block rounded-lg py-2 px-3 transition hover:bg-white/5" href="#">
                                    <p className="font-semibold text-white">Twitter</p>
                                </a>
                                <a className="block rounded-lg py-2 px-3 transition hover:bg-white/5" href="#">
                                    <p className="font-semibold text-white">Discord</p>
                                </a>
                                <a className="block rounded-lg py-2 px-3 transition hover:bg-white/5" href="#">
                                    <p className="font-semibold text-white">Community</p>
                                </a>
                            </div>
                        </PopoverPanel>
                    </Popover>
                </div>
                <div className="w-1/6 text-white/50">
                    <Link
                        className={`link ${pathname.startsWith("/more") ? "text-white" : ""
                            } block w-full h-full leading-[52px]`}
                        href="/more"
                    >
                        More
                    </Link>
                </div>

            </div>

            <div className="w-1/4 flex flex-row items-center justify-end bg-nav text-xl mr-5">
                <ConnectButton />
            </div>
        </div>
        </div>
    );
}
