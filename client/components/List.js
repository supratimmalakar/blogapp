import React from 'react'
import { useFetch } from '../utils/useFetch'
import Link from 'next/link';

function List({ open, setOpen, listOffset, items, token, title }) {
    var idString = ''
    items.forEach(item => {
        idString += item + ','
    });
    const { data, error, loaded } = useFetch(`/get-users?` + new URLSearchParams({
        items: idString
    }), "get", token)
    return (
        <div
            style={{
                top: listOffset.top + 20,
                left: listOffset.left
            }}
            className={`${open ? 'flex' : 'hidden'} absolute flex-col max-h-[300px] min-w-[300px]  bg-primaryLight rounded p-[20px] shadow-md`}
        >
            <div className='flex justify-between'>
            <h1 className='text-[20px] font-bold'>{title}</h1>
                <button className='bg-[red] hover:bg-[#9d0000] px-2 rounded my-2 text-white font-bold' onClick={() => setOpen(false)}>Close</button>
            </div>
            {loaded && !error &&
                data.map((user, index) =>
                (<div key={index} className='flex flex-row justify-between items-center gap-[30px] border-t-2 py-2'>
                    <div className='flex flex-col'>
                        <h2>{user.fname}</h2>
                        <h4 className='text-[11px]'>{user.email}</h4>
                    </div>
                    <Link className='h-fit' href={`/dashboard/users/${user._id}`}>
                        <button className='bg-btn py-1 px-2 rounded text-white hover:bg-btnHover cursor-pointer transition'>Visit Profile</button>
                    </Link>
                </div>))}
        </div>
    )
}

export default List