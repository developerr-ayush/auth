"use client"
import { GetUsers } from '@/actions/users'
import { User } from 'next-auth'
import React, { useEffect, useState } from 'react'
import { Usertable } from './user-table'
export const Users = () => {
    const [allUser, setAllUser] = useState<null | User[] | { error: string }>(null)
    useEffect(() => {
        GetUsers().then((res) => {
            setAllUser(res)
        })
    }, [])
    if (allUser === null) return (<div>Loading...</div>)
    if ('error' in allUser) return (<div>{allUser.error}</div>)
    return (
        <div>
            <Usertable allUsers={allUser} />
        </div>
    )
}
