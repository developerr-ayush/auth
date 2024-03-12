"use client"
import React, { useEffect, useState } from 'react'
import { DataTable } from './datatable'
import { Blogs, columns } from './columns'

export const BlogTable = () => {
    let [data, setData] = useState<Blogs[] | null | any>(null)

    const [pending, setPending] = useState(false)
    useEffect(() => {
        let getData = async () => {
            setPending(true)
            let getData = await fetch("/api/blog", { cache: "no-cache" })
            let newData = await getData.json()
            setData(newData)
            setPending(false)
        }
        getData()
    }, [])
    if (pending) {
        return (
            <p>Loading Data..</p>
        )
    }
    return !!data && (
        <div className='w-full mt-5'>
            <div className="rounded-md border">
                <DataTable columns={columns} data={data} />
            </div>
        </div>
    )
}

