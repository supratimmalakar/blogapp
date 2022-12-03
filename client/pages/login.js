import React, {useState, useEffect} from 'react'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import {useRouter} from 'next/router'

function Login() {
    const [token, setToken] = useState(null);
    const { register, handleSubmit } = useForm();
    const router = useRouter();

    const onSubmit = (data) => {
        console.log(data)
        axios.post('http://localhost:4000/api/users/login',
            {
                email: data.email,
                password: data.password
            }, {withCredentials : true})
            .then(res => {
                location.reload()
            })
            .catch(error => console.log(error))
    }

    // useEffect(() => {
    //     if (token) {
    //         localStorage.setItem('token', token)
    //         router.push('/dashboard')
    //     }
    // }, [token])

    // useEffect(() => {
    //     setToken(localStorage.getItem('token'))
    // }, [])

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