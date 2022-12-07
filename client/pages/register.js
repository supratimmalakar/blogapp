import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import axios from 'axios'

function Register() {
  const { register, handleSubmit } = useForm();
  const onSubmit = (data) => {
    axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/register`, {
      ...data
    })
    .then(res => console.log(res))
    .catch(err => console.log(err))
  }
  return (
    <div>
      <form className='flex flex-col w-1/3 mx-auto my-[100px] gap-[50px]' onSubmit={handleSubmit(onSubmit)}>
        <input className='h-[40px] px-3 border rounded-md' placeholder='first name' {...register('fname')} />
        <input className='h-[40px] px-3 border rounded-md' placeholder='last name' {...register('lname')} />
        <input className='h-[40px] px-3 border rounded-md' placeholder='email' {...register('email')} />
        <input className='h-[40px] px-3 border rounded-md' placeholder='password' {...register('password')} />
        <button type='submit'>Login</button>
      </form>
    </div>
  )
}

export default Register