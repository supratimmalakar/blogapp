import React, { useState } from 'react'
import Layout from '../../../components/Layout'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import axios from 'axios';
import styles from '../../../styles/Markdown.module.css';
import { openToast, errorToast } from '../../../redux/toastReducer';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router'

function NewPost({ user, token }) {
    const router = useRouter()
    const dispatch = useDispatch();
    const [title, setTitle] = useState("");
    const [markdown, setMarkdown] = useState("");
    const [previewMode, setPreviewMode] = useState(false);
    const [loading, setLoading] = useState(false)
    const onSubmit = (e) => {
        e.preventDefault();
        setLoading(true)
        if (title.length > 0 && markdown.length > 0) {
            axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/posts/create-post`, {
                title,
                content: markdown,
                userId: user.id
            }, {
                headers: {
                    Authorization: 'Bearer ' + token
                }
            })
                .then(res => {
                    setLoading(false)
                    dispatch(openToast({
                        message: "Post uploaded",
                        severity: "success"
                    }))
                    router.push('/dashboard/profile')
                })
                .catch(err => {
                    setLoading(false)
                    dispatch(errorToast())
                })
        }
    }
    return (
        <Layout token={token} user={user} className='bg-primaryLight' title='New Post'>
            {!previewMode ?
                <form className='flex flex-col flex-auto w-full h-full gap-[20px] p-[30px]' onSubmit={onSubmit}>
                    <h1 className='text-[30px] font-bold text-[rgba(0,0,0,0.7)]'>Create a new post</h1>
                    <div className='w-full h-full flex flex-col gap-[30px]'>
                        <input className='p-2 border-2 rounded' value={title} onChange={(e) => setTitle(e.target.value)} placeholder='Title' />
                        <textarea
                            value={markdown} onChange={(e) => {
                                setMarkdown(e.target.value)
                            }}
                            className='h-full border-2 p-2 rounded'
                            placeholder='Enter markdown here' />
                    </div>
                    <div className='flex flex-row gap-[30px]'>
                        <button className='bg-btn px-2 py-1 rounded text-white font-bold hover:bg-btnHover transition' onClick={() => setPreviewMode(true)}>Preview</button>
                        <button className='bg-btn px-2 py-1 rounded text-white font-bold hover:bg-btnHover transition' type="submit">{loading ? <div class="spinner-border animate-spin inline-block w-4 h-4 border-4 rounded-full" role="status" /> : 'Post'}</button>
                    </div>
                </form>
                :
                <div className='flex flex-col flex-auto w-full h-full gap-[20px] p-[30px]'>
                    <h1 className='text-[20px] font-bold'>{title}</h1>
                    <ReactMarkdown className={`w-full h-full ${styles.markdown}`} >
                        {markdown}
                    </ReactMarkdown>
                    <button className='bg-btn px-2 py-1 rounded text-white font-bold hover:bg-btnHover transition' onClick={() => setPreviewMode(false)}>Edit</button>
                </div>}
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

export default NewPost