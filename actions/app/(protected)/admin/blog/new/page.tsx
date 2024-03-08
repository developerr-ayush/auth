import React from 'react'
import axios from 'axios'
import {CreateForm} from '@/components/blog/create-form'
const page = async () => {

    return (
        <div>
            <h3 className='text-2xl text-center'>Create a new blog</h3>
            <CreateForm />
        </div>
    )
}

export default page