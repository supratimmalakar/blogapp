import React, { useEffect, useRef, useState } from 'react'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import Link from 'next/link'
import axios from 'axios'
import { useFetch } from '../utils/useFetch'

function Layout({ children, token }) {
    const profileBtnRef = useRef()
    const searchRef = useRef()
    const [results, setResults] = useState([])
    const [open, setOpen] = useState(false)
    const [showSearch, setShowSearch] = useState(false)
    const [offset, setOffset] = useState({
        top: null,
        left: null
    })
    const [searchOffset, setSearchOffset] = useState({
        top: null,
        left: null
    })

    const [search, setSearch] = useState("");

    useEffect(() => {
        setOffset({
            top: profileBtnRef.current.offsetTop,
            left: profileBtnRef.current.offsetLeft
        })
        setSearchOffset({
            top: searchRef.current.offsetTop,
            left: searchRef.current.offsetLeft
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

    // const searchOnChange = async (e) => {
    //     setSearch(e.target.value);
    //     if (e.target.value.length > 0) {
    //         await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/search?` +
    //             new URLSearchParams({
    //                 q: e.target.value
    //             }).toString()
    //             , {
    //                 headers: {
    //                     Authorization: 'Bearer ' + token
    //                 }
    //             })
    //             .then(res => {
    //                 console.log(res.data)
    //             })
    //             .catch(err => console.log(err))
    //     }
    // }

    useEffect(() => {
        if (search.length > 0) setShowSearch(true)
        else setShowSearch(false)
    }, [search])

    const SearchResultsMenu = () => {
        return (
            <div
                className={`absolute ${!showSearch && `hidden`} w-[250px] h-[100px]`}
                style={{
                    top: searchOffset.top + 40,
                    left: searchOffset.left
                }}>
                <h1>Search Results</h1>
            </div>
        )
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
            <div className='w-full h-[100vh]'>
                <div className='flex row h-[90px] border-b-2 items-center justify-between'>
                    <div className='flex row gap-[30px] ml-5 items-center'>
                        <h1>Blogger</h1>
                        <input ref={searchRef} onChange={searchOnChange} placeholder='Search users' className='w-[250px] h-[40px] px-2' />
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
                <div className='w-1/2 border-2 h-[calc(100vh-90px)] mx-auto min-w-[550px]'>
                    {children}
                </div>
            </div>
            <Menu />
            <SearchResultsMenu />
        </>
    )
}

export default Layout