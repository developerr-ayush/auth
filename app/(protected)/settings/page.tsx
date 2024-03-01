import { auth, signOut } from '@/auth';
import React from 'react'

const Settings = async () => {
    const session = await auth();
    return (
        <div>
            <p>{JSON.stringify(session)}</p>

            <form action={async () => {
                "use server";
                await signOut()
            }}>
                <button>SignOut</button>
            </form>
        </div>
    )
}

export default Settings