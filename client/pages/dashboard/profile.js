import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useState, useRef } from 'react'
import Layout from '../../components/Layout'
import { useFetch } from '../../utils/useFetch'
import PostBox from '../../components/PostBox'
import List from '../../components/List';
import { openToast, errorToast } from '../../redux/toastReducer';
import { useDispatch } from 'react-redux';


function Profile({ user, token, posts }) {
    const dispatch = useDispatch();
    const followerRef = useRef();
    const followingRef = useRef();
    const [edit, setEdit] = useState(false);
    const [bio, setBio] = useState(false)
    const [list1Offset, setList1Offset] = useState({
        top: null,
        left: null
    })
    const [list2Offset, setList2Offset] = useState({
        top: null,
        left: null
    })
    const [open1, setOpen1] = useState(false)
    const [open2, setOpen2] = useState(false)
    const { data, error, loaded } = useFetch(`/user/${user.id}`, "get", token);
    useEffect(() => {
        if (loaded && !error) {

            setList1Offset({
                top: followerRef.current.offsetTop,
                left: followerRef.current.offsetLeft
            })
            setList2Offset({
                top: followingRef.current.offsetTop,
                left: followingRef.current.offsetLeft
            })
            setBio(data.bio)
        }

    }, [loaded])

    const updateBioHandler = async () => {
        if (bio.length <= 100) {
            try {
                await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/update-bio`, {
                    userId: user.id,
                    bio
                }, {
                    headers: {
                        Authorization: 'Bearer ' + token
                    }
                })
                setEdit(false)
                dispatch(openToast({
                    message: "Bio updated!",
                    severity: "success"
                }))
                location.reload()
            }
            catch (err) {

                dispatch(errorToast())
            }
        }
        else {
            dispatch(openToast({
                message: "Bio must be shorter than 100 characters",
                severity: "error"
            }))
        }
    }


    return (
        <Layout token={token} user={user} className='p-[20px]' title="Profile">
            <div className='flex flex-row justify-start gap-[50px] mb-5'>
                {loaded && !error &&
                    (<>
                        <List title="Followers" open={open1} setOpen={setOpen1} token={token} listOffset={list1Offset} items={data.followers} />
                        <List title="Following" open={open2} setOpen={setOpen2} token={token} listOffset={list2Offset} items={data.following} />
                        <div className='bg-dpColor w-[120px] h-[120px] rounded-full flex justify-center items-center'>
                            <h1 className='text-white text-[48px]'>{data.fname[0] + data.lname[0]}</h1>
                        </div>
                        <div className='flex flex-col max-w-[350px]'>
                            <div className='flex flex-row gap-[15px]'>
                                <p
                                    className='cursor-pointer text-[rgba(0,0,0,0.8)] hover:text-black'
                                    onClick={() => {
                                        setOpen2(false)
                                        setOpen1(true)
                                    }}
                                    ref={followerRef}>
                                    <span className='font-bold'>{data.followers.length}</span> followers
                                </p>
                                <p
                                    className='cursor-pointer text-[rgba(0,0,0,0.8)] hover:text-black'
                                    onClick={() => {
                                        setOpen1(false)
                                        setOpen2(true)
                                    }}
                                    ref={followingRef}>
                                    <span className='font-bold'>{data.following.length}</span> following
                                </p>
                            </div>
                            <h3 className='font-[500]'>{data.fname + ' ' + data.lname} </h3>
                            {edit ?
                                <div className='flex flex-col items-start margin'>
                                    <textarea className='w-[300px] border-b-2 outline-none border-0 rounded' value={bio} onChange={(e) => setBio(e.target.value)} />
                                    <button className='bg-btn px-2 py-1 rounded text-white font-bold hover:bg-btnHover transition' onClick={updateBioHandler}>Save</button>
                                </div>
                                :
                                <div className='flex flex-col items-start gap-[20px] margin'>
                                    <h4 className='font-[400] w-[300px]'>{data.bio}</h4>
                                    <button className='bg-btn px-2 py-1 rounded text-white font-bold hover:bg-btnHover transition' onClick={() => setEdit(true)}>{data.bio ? "Edit bio" : "Add bio"}</button>
                                </div>
                            }

                        </div>
                    </>)}
            </div>
            <hr />
            <div className='flex justify-between items-center mt-5'>
                <h1 className='text-[30px] font-bold text-[rgba(0,0,0,0.7)]'>Your posts</h1>
                <Link href='/dashboard/posts/new-post'>
                    <button className='bg-btn px-2 py-1 rounded text-white font-bold hover:bg-btnHover transition'>Create new Post</button>
                </Link>
            </div>
            <div className='flex flex-col gap-[20px] mt-[10px]'>
                {posts && posts.map((post, index) => {
                    return (
                        <PostBox post={post} token={token} user={user} key={index} />
                    )
                })}
            </div>
        </Layout>
    )
}

export async function getServerSideProps(context) {
    const token = JSON.parse(context.req.cookies.blogToken)
    var posts = [];
    await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/posts/${token.user.id}`, {
        headers: {
            Authorization: "Bearer " + token.token
        }
    })
        .then(res => {
            posts = res.data
        })
        .catch(err => console.log(err))
    return {
        props: {
            token: token.token,
            user: token.user,
            posts
        }
    }
}

export default Profile