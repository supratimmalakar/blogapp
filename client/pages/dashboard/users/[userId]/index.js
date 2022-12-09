import React, { useState, useEffect } from 'react'
import Layout from '../../../../components/Layout'
import { useRouter } from 'next/router'
import { useFetch } from '../../../../utils/useFetch'
import axios from 'axios';

function UserProfile({ user, token }) {
    const router = useRouter();
    const [userFollowers, setUserFollowers] = useState([])
    const { userId } = router.query;
    const { data, error, loaded } = useFetch(`/${userId}`, "get", token)
    useEffect(() => {
        if (loaded) {
            setUserFollowers([...data.followers])
            console.log(userFollowers.indexOf(user.id))
        }
    }, [loaded]);

    const unfollowUser = async () => {
        await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/unfollow`, {
            unfollower: user.id,
            unfollowed: userId
        }, {
            headers: {
                Authorization: 'Bearer ' + token
            }
        })
            .then(() => {
                axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/${userId}`, {
                    headers: {
                        Authorization: 'Bearer ' + token
                    }
                })
                    .then(res => setUserFollowers([...res.data.followers]))
                    .catch(err => console.log(err))
            })
            .catch(err => console.log(err))
    }

    const followUser = async () => {
        await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/follow`, {
            follower: user.id,
            followed: userId
        }, {
            headers: {
                Authorization: 'Bearer ' + token
            }
        })
            .then(() => {
                axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/${userId}`, {
                    headers: {
                        Authorization: 'Bearer ' + token
                    }
                })
                    .then(res => setUserFollowers([...res.data.followers]))
                    .catch(err => console.log(err))
            })
            .catch(err => console.log(err))
    }
    return (
        <Layout token={token}>
            <div className='flex flex-row justify-center gap-[50px]'>
                {loaded && !error &&
                    (<>
                        <div className='bg-[rgba(0,0,0,0.4)] w-[120px] h-[120px] rounded-full flex justify-center items-center'>
                            <h1 className='text-white text-[48px]'>{data.fname[0] + data.lname[0]}</h1>
                        </div>
                        <div className='flex flex-col max-w-[350px]'>
                            <div className='flex flex-row gap-[15px]'>
                                <p><span className='font-bold'>{userFollowers.length}</span> followers</p>
                                <p><span className='font-bold'>{data.following.length}</span> following</p>
                            </div>
                            <h3 className='font-[500]'>{data.fname + ' ' + data.lname} </h3>
                            <h4 className='font-[400]'>{data.bio}</h4>
                            {userFollowers.indexOf(user.id) >= 0 ?
                                <button onClick={unfollowUser} className='w-fit border-2 rounded px-2 py-1'>Unfollow</button>
                                :
                                <button onClick={followUser} className='w-fit border-2 rounded px-2 py-1'>Follow</button>
                            }
                        </div>
                    </>)}
            </div>
        </Layout>
    )
}

export async function getServerSideProps(context) {
    const token = JSON.parse(context.req.cookies.blogToken)
    return {
        props: {
            token: token.token,
            user: token.user
        }
    }
}

export default UserProfile