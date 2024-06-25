import { ClerkProvider } from '@clerk/nextjs'
import React from 'react'
import { Toaster } from 'sonner'

const PlatformLayout = ({
    children
}: {
    children: React.ReactNode
}) => {
    return (
        <ClerkProvider>
            <Toaster richColors position='bottom-center' />
            {children}
        </ClerkProvider>
    )
}

export default PlatformLayout