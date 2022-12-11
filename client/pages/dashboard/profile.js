import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import { useFetch } from '../../utils/useFetch'


function Profile({ user, token }) {

    const { data, error, loaded } = useFetch(`/${user.id}`, "get", token)
    console.log(data)

    return (
        <Layout token={token} user={user}>
            <div className='flex flex-row justify-center gap-[50px]'>
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
                        <Link href='/dashboard/posts/new-post'>
                            <button>Create new Post</button>
                        </Link>
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

export default Profile