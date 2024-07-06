import { SignIn } from "@clerk/nextjs";

export default function Page() {
    return <div className="relative">
        <SignIn appearance={{ variables: { colorPrimary: "#5866DD", } }} />
    </div>
}