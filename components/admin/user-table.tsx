import { User } from 'next-auth'
import React from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from '../ui/button'
import { DeleteUser } from '../auth/delete-user'

export const Usertable = ({ allUsers }: { allUsers: User[] }) => {
    return (
        <div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        {/* <TableHead>Edit</TableHead> */}
                        <TableHead>Delete</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {allUsers.map((user) => {
                        return (
                            <TableRow key={user.id}>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.role}</TableCell>
                                {/* <TableCell><Button >Edit</Button></TableCell> */}
                                {user.id && <TableCell><DeleteUser id={user.id} /></TableCell>}
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </div>
    )
}
