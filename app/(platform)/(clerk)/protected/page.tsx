"use client"

import { UserButton } from "@clerk/nextjs"

const ProtectedPage = () => {

    return (
        <div>
            <UserButton appearance={{ variables: { colorPrimary: "#5866DD", colorNeutral: "#5866DD", colorTextSecondary: "#ffff" } }} />
        </div>
    )
}

export default ProtectedPage