import React from 'react'

import { DataTable } from './datatable'
import { Blogs, columns } from './columns'

async function getData(): Promise<Blogs[]> {

    let getData = await fetch(process.env.VERCEL_URL + "/api/blog", { cache: "no-cache" })
    return getData.json()

}
export const BlogTable = async () => {
    const data = await getData()
    return (
        <div className='w-full mt-5'>
            <div className="rounded-md border">
                <DataTable columns={columns} data={data} />
            </div>
        </div>
    )
}

