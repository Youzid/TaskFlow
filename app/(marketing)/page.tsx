import Link from "next/link";
import localFont from "next/font/local";
import { Poppins } from "next/font/google";
import { Medal } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const headingFont = localFont({
    src: "../../public/fonts/font.woff2",
});

const textFont = Poppins({
    subsets: ["latin"],
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const MarketingPage = () => {
    return (
        <div className=" flex justify-center items-center gap-20  animate-slidedown ">

            <div className="flex items-center justify-center flex-col animate-slidedown2 ">
                <div
                    className={cn(
                        "flex items-center justify-center flex-col",
                        headingFont.className
                    )}
                >
                    <div
                        className="text-3xl md:text-6xl bg-gradient-to-r mb-6 from-main to-indigo-600 text-white px-4 p-2 rounded-md w-fit"
                        data-testid="main_subtitle"
                    >
                        Simplify
                    </div>
                    <h1
                        className="text-3xl md:text-6xl text-center text-neutral-800 "
                        data-testid="main_title"
                    >
                        Your Team workflow
                    </h1>

                </div>
                <div
                    className={cn(
                        "text-sm md:text-xl text-neutral-400 mt-4 max-w-xs md:max-w-2xl text-center mx-auto",
                        textFont.className
                    )}
                    data-testid="main_description"
                >
                    Simplify team collaboration and boost productivity. Manage projects effortlessly </div>
                <Button className="mt-6 hover:bg-main duration-300 group" size="lg" asChild data-testid="main_button">
                    <Link href="/sign-up" className="flex gap-1 group-hover:text-main duration-300">Get Task Flow  <div className="text-main group-hover:text-white duration-300 pr-2 font-bold uppercase"> free</div></Link>
                </Button>
            </div>
            <div className="w-[700px] h-[600px] relative">
                <Image src="/landing2.svg" alt="Logo" fill className="object-contain" />
            </div>
        </div>
    );
};

export default MarketingPage;
