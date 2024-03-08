import React from 'react'
import { Button } from '../ui/button'
import { deleteBlog } from '@/actions/blog'
import { useRouter } from 'next/navigation'

const BlogHead = ({ id }: { id: string }) => {
    let router = useRouter()
    const handledelete = () => {
        let x = confirm('Are you sure you want to delete this blog?')
        if (x) {
            deleteBlog(id).then((data: any) => {
                if (data?.error) {
                    alert(data.error)
                } else {
                    alert(data.success)
                    router.push('/admin/blog')
                }
            })
        }
    }
    return (
        <div className="flex justify-between items-center">
            <h3 className='text-2xl '>Edit Your Blog</h3>
            <Button onClick={handledelete}>Delete blog</Button>
        </div>
    )
}

export default BlogHead