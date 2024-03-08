"use client"
import { HomeIcon } from '@radix-ui/react-icons'
import Link from 'next/link'
import React, { useState } from 'react'
import { BsNewspaper } from 'react-icons/bs'
import { FaHamburger, FaUser, FaWrench } from 'react-icons/fa'
import niruvanaLogo from "@/images/niruvana.svg"
import { IoMdMenu } from "react-icons/io";
import Image from 'next/image'
import { logout } from '@/actions/logout'
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
    },
    {
        id: 3,
        name: "add user",
        icon: FaUser,
        url: "/auth/register"
    },

]
export const Sidebar = () => {
    const [open, setOpen] = useState(false)
    let handleLogout = () => {
        logout().then(() => { })
    }
    return (
        <div className={`sidebar h-screen w-[12rem] pr-[2rem] text-white bg-[#744730] top-0 relative shrink-0 transition-all md:ml-[0rem] ${!open ? "ml-[-9.5rem]" : ""}`} >
            <button className="btn-hamburger p-1  absolute top-4 right-0 md:hidden" onClick={() => {
                setOpen(!open)
            }}>
                <IoMdMenu size={30} />
            </button>
            <p className='text-xl text-center p-2'><Image width={300} src={niruvanaLogo} alt="niruvana logo" className="filter invert brightness-0" /></p>
            <nav className='p-3'>
                <ul className='list-none p-0'>
                    {sidebar.map((item) => (
                        <li key={item.id} className='py-3 capitalize flex gap-2'>
                            {item.icon && <item.icon className='h-6 w-6' />}
                            <Link href={item.url}>{item.name}</Link>
                        </li>
                    ))}
                    <li className='py-3 capitalize flex gap-2'>
                        <FaUser className='h-6 w-6' />
                        <button onClick={handleLogout}>Logout</button>
                    </li>
                </ul>
            </nav>
        </div>
    )
}
