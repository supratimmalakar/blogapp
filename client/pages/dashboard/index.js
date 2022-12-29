import React, { useEffect } from 'react'
import axios from 'axios'
import Layout from '../../components/Layout'
import { useFetch } from '../../utils/useFetch'
import PostBox from '../../components/PostBox'
import Link from 'next/link'

function Dashboard({ token, user, feedPosts }) {
  // const { data: feedPosts, error: feedError, loaded: feedLoaded } = useFetch(`/feed?userId=${user.id}`, "get", token)


  return (
    <Layout token={token} user={user} className='p-[20px]'>
      <div className='flex justify-between items-center mt-5 mb-2'>
        <h1 className='text-[30px] font-bold text-[rgba(0,0,0,0.7)]'>Your feed</h1>
        <Link href='/dashboard/posts/new-post'>
          <button className='bg-btn px-2 py-1 rounded text-white font-bold hover:bg-btnHover transition'>Create new Post</button>
        </Link>
      </div>
      <div className='flex flex-col gap-[20px]'>
        {feedPosts && feedPosts.map((post, index) => {
          return (
            <PostBox post={post} token={token} user={user} key={index} />
          )
        })}
      </div>
    </Layout>
  )
}

export async function getServerSideProps(context) {
  const token = JSON.parse(context.req.cookies.blogToken);
  console.log("1",context.req.cookies.blogToken)
  console.log("2",token.token)
  var posts = [];
  await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/feed?userId=${token?.user.id}`, {
    headers: {
      Authorization: "Bearer " + token?.token
    }
  })
    .then(res => {
      posts = res.data
    })
    .catch(err => console.log(err))
  return {
    props: {
      token: token?.token,
      user: token?.user,
      feedPosts : posts
    }
  }
}

export default Dashboard