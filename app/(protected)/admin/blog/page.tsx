import { BlogTable } from '@/components/blog/blog-table'
import React from 'react'

const blog = () => {
    return (
        <div className=''>
            <h3 className='text-2xl text-center'>Here are all your blogs</h3>
            <BlogTable />
        </div>
    )
}

export default blog