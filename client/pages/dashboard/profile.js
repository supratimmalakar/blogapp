import axios from 'axios';
import React, { useState } from 'react'
import Layout from '../../components/Layout'
import { useAxios } from '../../utils/useAxios'


function Profile({ user, token }) {

    const [currUser, setCurrUser] = useState(null);
    console.log(user)
    const {data, error, loaded} = useAxios(`/${user.id}`, "get", token)
    console.log({data, loaded})

    return (
        <Layout>

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