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

    const onSubmit = (data) => {
        console.log(data)
        axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/login`,
            {
                email: data.email,
                password: data.password
            }, {withCredentials : true})
            .then(res => {
                dispatch(openToast({
                    message : "Logged in successfully",
                    severity : "success"
                }))
                router.push('/dashboard')
            })
            .catch(error => {
                dispatch(openToast({
                message: error.response.data,
                severity: "error"
            }))
        })
    }

    return (
        <div>
            <form className='flex flex-col w-1/3 mx-auto my-[100px] gap-[50px]' onSubmit={handleSubmit(onSubmit)}>
                <input className='h-[40px] px-3 border rounded-md' placeholder='email' {...register('email')} />
                <input className='h-[40px] px-3 border rounded-md' placeholder='password' {...register('password')} />
                <button type='submit'>Login</button>
            </form>
        </div>
    )
}

export default Login