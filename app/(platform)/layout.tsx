import { ModalProvider } from '@/components/modals/providers/modal-provider'
import { QueryProvider } from '@/components/modals/providers/query-provider'
import { ClerkProvider } from '@clerk/nextjs'
import React from 'react'

const PlatformLayout = ({
    children
}: {
    children: React.ReactNode
}) => {
    return (
        <ClerkProvider>
            <QueryProvider>
                <ModalProvider />
                {children}
            </QueryProvider>
        </ClerkProvider>
    )
}

export default PlatformLayout