import React, { useEffect } from 'react'
import axios from 'axios'
import Layout from '../../components/Layout'
import { useFetch } from '../../utils/useFetch'
import PostBox from '../../components/PostBox'

function Dashboard({ token, user }) {
  const { data: feedPosts, error: feedError, loaded: feedLoaded } = useFetch(`/feed?userId=${user.id}`, "get", token)


  return (
    <Layout token={token} user={user} className='p-[20px]'>
      <div className='flex flex-col gap-[20px]'>
        <h1>Your feed</h1>
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
  return {
    props: {
      token: token.token,
      user: token.user
    }
  }
}

export default Dashboard