import React, { useState } from 'react'
import Layout from '../../../components/Layout'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

function NewPost({ user, token }) {
    const [title, setTitle] = useState("");
    const [markdown, setMarkdown] = useState("");
    const [previewMode, setPreviewMode] = useState(false);
    const onSubmit = () => {
        console.log(data)
    }
    return (
        <Layout token={token} user={user}>
            {!previewMode ?
                <form className='flex flex-col flex-auto w-full h-full gap-[20px] p-[30px]' onSubmit={onSubmit}>
                    <h1>Create a new post</h1>
                    <div className='w-full h-full flex flex-col gap-[30px]'>
                        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder='title'  />
                        <textarea value={markdown} onChange={(e) => {
                            setMarkdown(e.target.value)
                        }} className='h-full' placeholder='enter markdown here'  />
                    </div>
                    <div className='flex flex-row gap-[100px]'>
                        <button onClick={() => setPreviewMode(true)}>Preview</button>
                        <button>Post</button>
                    </div>
                </form> 
                :
                <div className='flex flex-col flex-auto w-full h-full gap-[20px] p-[30px]'>
                    <ReactMarkdown className='w-full h-full' remarkPlugins={[remarkGfm]}>
                        {markdown}
                    </ReactMarkdown>
                    <div className='flex flex-row gap-[100px]'>
                        <button onClick={() => setPreviewMode(false)}>Edit</button>
                        <button>Post</button>
                    </div>
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