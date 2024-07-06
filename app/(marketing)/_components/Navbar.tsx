import Link from "next/link";

import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";

export const Navbar = () => {
    return (
        <div
            className="fixed top-0 w-full h-14 px-4 border-b shadow bg-slate-100
 flex items-center"
            data-testid="navbar_wrapper"
        >
            <div className="md:max-w-screen-2xl mx-auto flex items-center w-full justify-between">
                <Logo />
                <div className="space-x-4 md:block md:w-auto flex items-center justify-between w-full">
                    <Button
                        size="sm"
                        variant="outline"
                        asChild
                        data-testid="navbar_login_button"
                    >
                        <Link href="/sign-in">Login</Link>
                    </Button>
                    <Button size="sm" variant="primary" className="shadow-main/40 hover:shadow-md duration-200" asChild data-testid="navbar_get_taskFlow_button">
                        <Link href="/sign-up">SignUp Free</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
};
