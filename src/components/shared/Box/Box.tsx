import React from 'react'

export default function Box({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <div className='w-72 h-64 min-h-64 rounded-md	border-indigo-50 border-4  p-3 m-3'>{children}</div>
    )
}
