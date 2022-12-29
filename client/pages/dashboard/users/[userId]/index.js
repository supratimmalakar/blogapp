import React, { useState, useEffect, useRef } from 'react'
import Layout from '../../../../components/Layout'
import { useRouter } from 'next/router'
import { useFetch } from '../../../../utils/useFetch'
import axios from 'axios'
import PostBox from '../../../../components/PostBox'
import List from '../../../../components/List'
import { openToast, errorToast } from '../../../../redux/toastReducer';
import { useDispatch } from 'react-redux';

function UserProfile({ user, token, data }) {
    const dispatch = useDispatch()
    const router = useRouter();
    const [userFollowers, setUserFollowers] = useState([])
    const { userId } = router.query;
    const followerRef = useRef();
    const followingRef = useRef();
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
    const { data: posts, error: postsError, loaded: postsLoaded } = useFetch(`/posts/${userId}`, "get", token);
    // const { data, error, loaded } = useFetch(`/user/${userId}`, "get", token);
    useEffect(() => {
        

            setList1Offset({
                top: followerRef.current.offsetTop,
                left: followerRef.current.offsetLeft
            })
            setList2Offset({
                top: followingRef.current.offsetTop,
                left: followingRef.current.offsetLeft
            })
        

    }, [])

    useEffect(() => {
        if (user.id === userId)
            router.push('/dashboard/profile')
    }, [])

    useEffect(() => {
        
            setUserFollowers([...data.followers])
        
    }, []);

    const unfollowUser = async () => {
        await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/user/unfollow`, {
            unfollower: user.id,
            unfollowed: userId
        }, {
            headers: {
                Authorization: 'Bearer ' + token
            }
        })
            .then(() => {
                axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/user/${userId}`, {
                    headers: {
                        Authorization: 'Bearer ' + token
                    }
                })
                    .then(res => setUserFollowers([...res.data.followers]))
                    .catch(err => console.log(err))
            })
            .catch(err => dispatch(errorToast()))
    }

    const followUser = async () => {
        await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/user/follow`, {
            follower: user.id,
            followed: userId
        }, {
            headers: {
                Authorization: 'Bearer ' + token
            }
        })
            .then(() => {
                axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/user/${userId}`, {
                    headers: {
                        Authorization: 'Bearer ' + token
                    }
                })
                    .then(res => setUserFollowers([...res.data.followers]))
                    .catch(err => console.log(err))
            })
            .catch(err => dispatch(errorToast()))
    }
    return (
        <Layout token={token} user={user} className='p-[20px]' title={data.fname + ' ' + data.lname}>
            <div className='flex flex-row justify-start gap-[50px] mb-5'>
                <>
                        <List title="Followers" open={open1} setOpen={setOpen1} token={token} listOffset={list1Offset} items={data.followers} />
                        <List title="Following" open={open2} setOpen={setOpen2} token={token} listOffset={list2Offset} items={data.following} />
                        <div className='bg-dpColor w-[120px] h-[120px] rounded-full flex justify-center items-center'>
                            <h1 className='text-white text-[48px]'>{data.fname[0] + data.lname[0]}</h1>
                        </div>
                        <div className='flex flex-col max-w-[350px] justify-between gap-2'>
                            <div>
                                <div className='flex flex-row gap-[15px]'>
                                    <p className='cursor-pointer' onClick={() => setOpen1(true)} ref={followerRef}><span className='font-bold'>{userFollowers.length}</span> followers</p>
                                    <p className='cursor-pointer' onClick={() => setOpen2(true)} ref={followingRef}><span className='font-bold'>{data.following.length}</span> following</p>
                                </div>
                                <h3 className='font-[500]'>{data.fname + ' ' + data.lname} </h3>
                                <h4 className='font-[400]'>{data.bio}</h4>
                            </div>
                            {userFollowers.indexOf(user.id) >= 0 ?
                                <button onClick={unfollowUser} className='bg-btn px-2 py-1 rounded text-white font-bold hover:bg-btnHover transition'>Unfollow</button>
                                :
                                <button onClick={followUser} className='bg-btn px-2 py-1 rounded text-white font-bold hover:bg-btnHover transition'>Follow</button>
                            }
                        </div>
                    </>
            </div>
            <hr />
            <h1 className='text-[30px] font-bold text-[rgba(0,0,0,0.7)] mt-5'>{data.fname}&apos;s posts</h1>
            <div className='flex flex-col gap-[20px] mt-[30px]'>

                {postsLoaded && !postsError && posts.map((post, index) => {
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
    var reqUser = null;
    await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/user/${context.params.userId}`, {
        headers: {
            Authorization: "Bearer " + token.token
        }
    })
        .then(res => {
            reqUser = res.data
        })
        .catch(err => console.log(err))
    return {
        props: {
            token: token.token,
            user: token.user,
            data: reqUser
        }
    }
}

export default UserProfile