import { HomeIcon } from '@radix-ui/react-icons'
import Link from 'next/link'
import React from 'react'
import { BsNewspaper } from 'react-icons/bs'
let sidebar = [
    {
        id: 1,
        name: "home",
        icon: HomeIcon,
        url: "/admin"
    },
    {
        id: 2,
        name: "blog",
        icon: BsNewspaper,
        url: "/admin/blog"
    }
]
export const Sidebar = () => {
    return (
        <div className='sidebar h-screen w-[10rem] text-white bg-slate-950'>
            <p className='text-xl text-center p-2'>sidebar</p>
            <nav className='p-3'>
                <ul className='list-none p-0'>
                    {sidebar.map((item) => (
                        <li key={item.id} className='py-3 capitalize flex gap-2'>
                            {item.icon && <item.icon className='h-6 w-6' />}
                            <Link href={item.url}>{item.name}</Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    )
}
