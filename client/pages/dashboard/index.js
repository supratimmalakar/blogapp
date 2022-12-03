import React from 'react'
import cookies from 'js-cookie'
import axios from 'axios'


function Dashboard({token}) {
  const getData = () => {
    
  } 
  console.log(token)
  return (
    <div>
        <button>logout</button>
        <button onClick={getData}>get data</button>
    </div>
  )
}

export async function getServerSideProps(context) {
  const token = context.req.cookies.blogToken
  return {props : {
     token
  }}
}

export default Dashboard