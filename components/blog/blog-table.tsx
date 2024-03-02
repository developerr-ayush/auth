import React from 'react'
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { DataTable } from './datatable'


export const BlogTable = () => {
    return (
        <div className='w-full'>
            <div className="rounded-md border">
                <DataTable />
            </div>
        </div>
    )
}

