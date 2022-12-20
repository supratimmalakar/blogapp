import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import { useFetch } from '../../utils/useFetch'
import PostBox from '../../components/PostBox'


function Profile({ user, token, posts }) {
    

    const { data, error, loaded } = useFetch(`/user/${user.id}`, "get", token);
    console.log({id: user.id})


    return (
        <Layout token={token} user={user} className='p-[20px]'>
            <div className='flex flex-row justify-start gap-[50px]'>
                {loaded && !error &&
                    (<>
                        <div className='bg-[rgba(0,0,0,0.4)] w-[120px] h-[120px] rounded-full flex justify-center items-center'>
                            <h1 className='text-white text-[48px]'>{data.fname[0] + data.lname[0]}</h1>
                        </div>
                        <div className='flex flex-col max-w-[350px]'>
                            <div className='flex flex-row gap-[15px]'>
                                <p><span className='font-bold'>{data.followers.length}</span> followers</p>
                                <p><span className='font-bold'>{data.following.length}</span> following</p>
                            </div>
                            <h3 className='font-[500]'>{data.fname + ' ' + data.lname} </h3>
                            <h4 className='font-[400]'>{data.bio}</h4>
                        </div>
                    </>)}
            </div>
            <Link href='/dashboard/posts/new-post'>
                <button className='background'>Create new Post</button>
            </Link>
            <div className='flex flex-col gap-[20px] mt-[30px]'>
                <h1>Your posts</h1>
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