import Link from "next/link";
import Image from "next/image";
import localFont from "next/font/local";

import { cn } from "@/lib/utils";

const headingFont = localFont({
    src: "../public/fonts/font.woff2",
});

export const Logo = () => {
    return (
        <Link href="/" data-testid="logo">
            <div className="hover:opacity-75 duration-200 items-center gap-x-2 hidden md:flex gap-2 group hover:gap-3
              ">
                <Image src="/logo.svg" alt="Logo" height={30} width={30} className="group-hover:scale-105 duration-150" />
                <div
                    className={cn(
                        "text-lg text-neutral-700  flex   decoration-2 pt-1  ",
                        headingFont.className
                    )}
                >
                    Task<p className="text-main">Flow</p>
                </div>
            </div>
        </Link>
    );
};
