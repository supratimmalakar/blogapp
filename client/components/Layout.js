import React, { useEffect, useRef, useState } from 'react'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import Link from 'next/link'
import axios from 'axios'
import { useFetch } from '../utils/useFetch'
import { openToast, errorToast } from '../redux/toastReducer';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Cookies from 'js-cookie';

function Layout({ children, token, user, className, title }) {
    const router = useRouter()
    const dispatch = useDispatch();
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
        Cookies.remove("blogToken")
        dispatch(openToast({
            message: "Logged out successfully",
            severity: "success"
        }))
        location.reload()

    }

    const searchOnChange = async (e) => {
        setSearch(e.target.value);
        if (e.target.value.length > 0) {
            await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/q?` +
                new URLSearchParams({
                    item: e.target.value
                }).toString()
                , {
                    headers: {
                        Authorization: 'Bearer ' + token
                    }
                })
                .then(res => {
                    setResults([...res.data]);
                })
                .catch(err => console.log(err))
        }
    }

    useEffect(() => {
        if (search.length > 0) setShowSearch(true)
        else setShowSearch(false)
    }, [search])

    const SearchResultsMenu = () => {
        return (
            <div
                className={`absolute ${!showSearch && `hidden`} w-[350px] bg-primaryLight px-[10px]`}
                style={{
                    top: searchOffset.top + 40,
                    left: searchOffset.left
                }}>
                {results.length > 0 &&
                    results.map((result, idx) => {
                        return (
                            <div key={idx} className='flex flex-row justify-between items-center gap-[30px] border-t-2 py-2'>
                                <div className='flex flex-col'>
                                    <h2>{result.fname}</h2>
                                    <h4 className='text-[11px]'>{result.email}</h4>
                                </div>
                                <Link className='h-fit' href={`/dashboard/users/${result._id}`}>
                                    <button className='bg-btn py-1 px-2 rounded text-white hover:bg-btnHover cursor-pointer transition'>Visit Profile</button>
                                </Link>
                            </div>
                        )
                    })}
            </div>
        )
    }
    const Menu = () => {
        return (
            <div onClick={() => setOpen(false)} className={`absolute ${!open && `hidden`} w-[100vw] h-[100vh] top-0 right-0 z-[10000]`}>
                <div
                    className='absolute flex flex-col w-[100px] rounded z-[10001] bg-primaryLight overflow-hidden'
                    style={{
                        top: offset.top + 30,
                        left: offset.left - 95
                    }}>
                    <button className='text-[18px] py-2 font-medium text-[rgba(0,0,0,0.7)] transition hover:bg-primaryMedium hover:text-white' onClick={() => router.push('/dashboard/profile')}>Profile</button>
                    <hr />
                    <button className='text-[18px] py-2 font-medium text-[rgba(0,0,0,0.7)] transition hover:bg-primaryMedium hover:text-white' onClick={logout}>Logout</button>
                </div>
            </div>
        )
    }
    return (
        <>
            <div className='w-full h-[100vh]'>
                <Head>
                    <title>{title}</title>
                    <link rel="icon" href="/favicon.ico" />
                </Head>
                <div className='flex h-[90px] border-b-2 items-center justify-between bg-primaryDark'>
                    <div className='flex gap-[30px] ml-5 items-center'>
                        <Link href="/dashboard">
                            <h1 className='text-[40px] text-white'>Blogger</h1>
                        </Link>
                        <input
                            ref={searchRef}
                            onChange={searchOnChange}
                            placeholder='Search users by email'
                            className='w-[350px] h-[40px] px-2 bg-[rgba(0,0,0,0.1)] text-white rounded placeholder-white outline-none' />
                    </div>
                    <button className='mr-5' onClick={() => setOpen(true)} ref={profileBtnRef}>
                        <PermIdentityIcon style={{ color: 'rgba(0,0,0,0.5)' }} />
                    </button>
                </div>
                <div className={`w-1/2 border-2 h-[calc(100vh-90px)] mx-auto min-w-[800px] overflow-y-auto ${className ? className : ''}`}>
                    {children}
                </div>
            </div>
            <Menu />
            <SearchResultsMenu />
        </>
    )
}

export default Layout