import React, { FC } from 'react'
import axios from 'axios'
import { UpdateForm } from '@/components/blog/update-form'

const page = ({ params }: { params: { id: string } }) => {
  console.log(params.id)
  return (
    <div>
      <h3 className='text-2xl text-center'>Create a new blog</h3>
      <UpdateForm id={params.id} />
    </div>
  )
}

export default page