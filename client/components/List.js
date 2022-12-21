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
            className={`${open ? 'flex' : 'hidden'} absolute flex-col max-h-[300px]  bg-[white] border-2 rounded p-[20px]`}
        >
            <div className='flex justify-between'>
            <h1 className='text-[20px] font-bold'>{title}</h1>
            <button onClick={() => setOpen(false)}>Close</button>
            </div>
            {loaded && !error &&
                data.map((user, index) =>
                (<div key={index} className='flex flex-row justify-between items-center gap-[30px] border-t-2'>
                    <div className='flex flex-col'>
                        <h2>{user.fname}</h2>
                        <h4 className='text-[11px]'>{user.email}</h4>
                    </div>
                    <Link className='h-fit' href={`/dashboard/users/${user._id}`}>
                        <button>Visit Profile</button>
                    </Link>
                </div>))}
        </div>
    )
}

export default List