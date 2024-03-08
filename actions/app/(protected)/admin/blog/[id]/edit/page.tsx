"use client"
import React, { FC } from 'react'
import { UpdateForm } from '@/components/blog/update-form'
import { Button } from '@/components/ui/button'
import { deleteBlog } from '@/actions/blog'
import { useRouter } from 'next/router'
import BlogHead from '@/components/blog/blog-head'

const page = ({ params }: { params: { id: string } }) => {
  return (
    <div>
      <BlogHead id={params.id} />
      <UpdateForm id={params.id} />
    </div>
  )
}

export default page