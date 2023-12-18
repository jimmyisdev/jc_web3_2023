import React from 'react'

export default function BoxHeader({ headerText }: { headerText: string | null }) {
    return (
        <h1 className='font-bold mb-3 text-lime-100'>{headerText?.toUpperCase()}</h1>
    )
}
