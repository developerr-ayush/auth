import { BlogTable } from '@/components/blog/blog-table'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

const blog = () => {

    return (
        <div className=''>
            <div className="flex justify-between items-center">

                <h3 className='text-2xl '>Here are all your blogs</h3>
                <Button asChild={true}>
                    <Link href="/admin/blog/new">Create New Blog</Link>
                </Button>
            </div>
            <BlogTable />
        </div>
    )
}

export default blog