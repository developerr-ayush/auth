import { auth } from '@/auth';
import { Users } from '@/components/admin/user'
import React from 'react'

const page = async () => {
  const session = await auth();
  if (session?.user?.role !== "SUPER_ADMIN") return (<div>Not authorized</div>)
  return (
    <div><Users /></div>
  )
}

export default page