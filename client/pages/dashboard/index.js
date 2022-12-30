import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Layout from '../../components/Layout'
import { useFetch } from '../../utils/useFetch'
import PostBox from '../../components/PostBox'
import Link from 'next/link'

const pageMax = 10

function Dashboard({ token, user, posts }) {
  // const { data: feedPosts, error: feedError, loaded: feedLoaded } = useFetch(`/feed?userId=${user.id}`, "get", token)
  const [currPage, setCurrPage] = useState(1)
  const [feedPosts, setFeedPosts] = useState(posts)
  const [loading, setLoading] = useState(false)

  const loadNewPostsHandler = async () => {
    setLoading(true)
    await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/feed?` + new URLSearchParams({
      userId: user.id,
      pageMax,
      pageNo: currPage + 1
    }), {
      headers: {
        Authorization: "Bearer " + token
      }
    })
      .then(res => {
        setFeedPosts(res.data)
        setCurrPage(currPage + 1)
        setLoading(false)
      })
      .catch(err => {
        setLoading(false)
        console.log(err)})
  }

  return (
    <Layout token={token} user={user} className='p-[20px]' title='Feed'>
      <div className='flex justify-between items-center mt-5 mb-2'>
        <h1 className='text-[30px] font-bold text-[rgba(0,0,0,0.7)]'>Your feed</h1>
        <Link href='/dashboard/posts/new-post'>
          <button className='bg-btn px-2 py-1 rounded text-white font-bold hover:bg-btnHover transition'>Create new Post</button>
        </Link>
      </div>
      <div className='flex flex-col gap-[20px]'>
        {feedPosts.posts.map((post, index) => {
          return (
            <PostBox post={post} token={token} user={user} key={index} />
          )
        })}
        {!feedPosts.exhausted && <button className='bg-btn px-2 py-1 rounded text-white font-bold hover:bg-btnHover transition' onClick={loadNewPostsHandler}>Load more posts</button>}
      </div>
    </Layout>
  )
}

export async function getServerSideProps(context) {
  const token = JSON.parse(context.req.cookies.blogToken);
  var feedPosts = [];
  await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/feed?` + new URLSearchParams({
    userId : token.user.id,
    pageMax,
    pageNo:1
  }), {
    headers: {
      Authorization: "Bearer " + token?.token
    }
  })
    .then(res => {
      feedPosts = res.data
    })
    .catch(err => console.log(err))
  return {
    props: {
      token: token?.token,
      user: token?.user,
      posts : feedPosts
    }
  }
}

export default Dashboard