import React, { useEffect, useRef, useState } from 'react'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import Link from 'next/link'
import axios from 'axios'

function Layout({ children }) {
    const profileBtnRef = useRef()
    const [open, setOpen] = useState(false)
    const [offset, setOffset] = useState({
        top : null,
        left : null
    })

    useEffect(() => {
        setOffset({
            top: profileBtnRef.current.offsetTop,
            left: profileBtnRef.current.offsetLeft
        })
    }, [])

    const logout = async () => {
        await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/logout`, {
            withCredentials: true
        })
            .then(res => {
                console.log(res)
                location.reload()
            })
    }

    const Menu = () => {
        return (
            <div onClick={() => setOpen(false)} className={`absolute ${!open && `hidden`} w-[100vw] h-[100vh] top-0 right-0 z-[10000]`}>
                <div
                    className='absolute w-[100px] border-2 z-[10001] bg-white'
                    style={{
                        top: offset.top + 30,
                        left: offset.left - 50
                    }}>
                        <Link href='/dashboard/profile'><button>Profile</button></Link>
                    <button onClick={logout}>Logout</button>
                </div>
            </div>
        )
    }
    return (
        <>
            <div className='w-full h-[100vw]'>
                <div className='flex row h-[90px] border-b-2 items-center justify-between'>
                    <div className='flex row gap-[30px] ml-5'>
                        <h1>Blogger</h1>
                        <input placeholder='Search users' />
                    </div>
                    <div className='flex row gap-[20px] mr-5'>
                        <button>
                            <NotificationsNoneIcon />
                        </button>
                        <button onClick={() => setOpen(true)} ref={profileBtnRef}>
                            <PermIdentityIcon />
                        </button>
                    </div>
                </div>
                <div className='w-1/2 border-2 h-full mx-auto'>
                    {children}
                </div>
            </div>
            <Menu/>
        </>
    )
}

export default Layout