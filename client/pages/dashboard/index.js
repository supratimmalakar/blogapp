import React, { useEffect } from 'react'
import axios from 'axios'
import Layout from '../../components/Layout'


function Dashboard({ token, user }) {


  return (
    <Layout token={token} user={user}>

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

export default Dashboard