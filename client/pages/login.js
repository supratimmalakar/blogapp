import React from 'react'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { openToast, errorToast } from '../redux/toastReducer';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';

function Login() {
    const dispatch = useDispatch()
    const router = useRouter();
    const { register, handleSubmit } = useForm();

    const onSubmit = async (data) => {
        axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/login`,
            {
                email: data.email,
                password: data.password
            }, { withCredentials: true })
            .then(res => {
                dispatch(openToast({
                    message: "Logged in successfully",
                    severity: "success"
                }))
                router.push('/dashboard')
            })
            .catch(error => {
                dispatch(openToast({
                    message: error.response.data,
                    severity: "error"
                }))
            })
        // const body = JSON.stringify({
        //     email: data.email,
        //     password: data.password
        // })
        // console.log({body})
        // await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/login`, {
        //     method: 'POST',
        //     credentials: 'include',
        //     headers : {
        //         'Content-Type': 'application/json',
        //         'Accept': 'application/json'
        //     },
        //     body : body
        // })
        //     .then(res => {
        //         dispatch(openToast({
        //             message: "Logged in successfully",
        //             severity: "success"
        //         }))
        //         router.push('/dashboard')
        //     })
        //     .catch(error => {
        //         dispatch(openToast({
        //             message: error.response.data,
        //             severity: "error"
        //         }))
        //     })
    }

    return (
        <div>
            <form className='flex flex-col w-1/3 mx-auto my-[100px] gap-[50px] bg-primaryLight rounded shadow-xl p-10' onSubmit={handleSubmit(onSubmit)}>
                <div className='flex flex-col'>
                    <h1 className='font-bold text-[46px] mb-0 text-[rgba(0,0,0,0.6)]'>Blogger</h1>
                    <p className='text-[16px] text-[rgba(0,0,0,0.6)]'>Markdown powered blogs and much more</p>
                </div>
                <input className=' outline-none h-[40px] px-3 border rounded-md' placeholder='Email' {...register('email')} />
                <input className=' outline-none h-[40px] px-3 border rounded-md' placeholder='Password' {...register('password')} />
                <button className='bg-btn px-2 py-2 rounded text-white font-bold hover:bg-btnHover transition' type='submit'>Login</button>
                <div className='flex flex-col'>
                    <hr />
                    <p className='text-[16px] my-3  text-[rgba(0,0,0,0.6)]'>Not registered?</p>
                    <p onClick={() => router.push('/register')} className='bg-btn px-2 py-2 rounded text-white font-bold text-center cursor-pointer hover:bg-btnHover transition'>Register here</p>
                </div>
            </form>
        </div>
    )
}

export default Login