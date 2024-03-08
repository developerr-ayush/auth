import { Sidebar } from '@/components/admin/sidebar'
import React from 'react'

const layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex">
            <Sidebar />
            <div className="p-3 flex-1">
                {children}
            </div>
        </div>
    )
}

export default layout