import { auth } from '@/auth'
import { Sidebar } from '@/components/admin/sidebar'
import React from 'react'

const layout = async ({ children }: { children: React.ReactNode }) => {
    let session = await auth()
    return (!!session && !!session.user) && (
        <div className="flex">
            <Sidebar user={session.user} />
            <div className="p-3 w-[calc(100%-3rem)] flex-1">
                {children}
            </div>
        </div>
    )
}

export default layout