import React from 'react'

export default function Box({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <div className='w-72 h-60 min-h-60 rounded-md	border-blue-800 border-4  p-3 m-3'>{children}</div>
    )
}
