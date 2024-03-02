import { BlogTable } from '@/components/blog/blog-table'
import Link from 'next/link'
import React from 'react'

const blog = () => {
    return (
        <div className=''>
            <div className="flex justify-between items-center">

                <h3 className='text-2xl '>Here are all your blogs</h3>

            </div>
            <BlogTable />
        </div>
    )
}

export default blog