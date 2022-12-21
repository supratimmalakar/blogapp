import axios from 'axios';
import Link from 'next/link';
import React, { useRef, useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import styles from '../styles/Markdown.module.css'
import { openToast, errorToast } from '../redux/toastReducer';
import { useDispatch } from 'react-redux';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

function PostBox(props) {
    const dispatch = useDispatch()
    const { user, token } = props;
    const markdownRef = useRef()
    const [post, setPost] = useState(props.post)
    const [isOverflow, setIsOverflow] = useState(false);
    const [extend, setExtend] = useState(false)
    useEffect(() => {
        if (markdownRef.current) {
            if (markdownRef.current.scrollHeight > markdownRef.current.clientHeight) setIsOverflow(true)
            else setIsOverflow(false)
        }
    }, [markdownRef.current])


    const like = async () => {
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/feed/like`, {
                userId: user.id,
                postId: post._id
            }, {
                headers: {
                    Authorization: 'Bearer ' + token
                }
            })
            const postUpdate = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/feed/${post._id}`, {
                headers: {
                    Authorization: 'Bearer ' + token
                }
            })
            setPost(postUpdate.data)
        }
        catch (err) {
            dispatch(errorToast())
        }
    }

    const unlike = async () => {
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/feed/unlike`, {
                userId: user.id,
                postId: post._id
            }, {
                headers: {
                    Authorization: 'Bearer ' + token
                }
            })
            const postUpdate = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/feed/${post._id}`, {
                headers: {
                    Authorization: 'Bearer ' + token
                }
            })
            setPost(postUpdate.data)
        }
        catch (err) {
            dispatch(errorToast())
        }
    }
    return (
        <div className={`flex flex-col flex-auto w-full ${!extend && 'max-h-[300px]'} rounded p-[15px] bg-primaryLight shadow-lg`}>
            <div className='flex gap-2 items-center'>
                <div className='bg-dpColor w-[30px] h-[30px] rounded-full flex justify-center items-center'>
                    <h1 className='text-white text-[10px] font-bold'>{user.name[0] + user.name.split(" ")[1][0]}</h1>
                </div>
            <Link href={`/dashboard/users/${post.createdBy.id}`}>
                <p className='text-[16px] font-600 hover:underline'>{post.createdBy.email}</p>
            </Link>
            </div>
            <p className='text-[28px] font-600'>{post.title}</p>
            <div ref={markdownRef} className={`h-full overflow-hidden ${styles.markdown}`}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {post.content}
                </ReactMarkdown>
            </div>
            {isOverflow && !extend && <p className='text-[blue] underline cursor-pointer' onClick={() => setExtend(true)}>See more</p>}
            {extend && <p className='text-[blue] underline cursor-pointer' onClick={() => setExtend(false)}>See less</p>}
            <div className='flex gap-[10px]'>
                {post && post.likes.length > 0 && post.likes.indexOf(user.id) >= 0
                    ?
                    <FavoriteIcon style={{color : 'red'}} className='cursor-pointer' onClick={unlike}/>
                    :
                    <FavoriteBorderIcon className='cursor-pointer' onClick={like}/>}

                <p>{post.likes.length} likes</p>
                <p>{new Date(post.createdAt).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' })}</p>
            </div>
        </div>
    )
}

export default PostBox