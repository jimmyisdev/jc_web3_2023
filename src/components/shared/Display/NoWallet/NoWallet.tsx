import React from 'react'
import Box from '../../Box/Box'

export default function NoWallet({ errMsg = "Error occured" }: { errMsg: string }) {
    return (
        <Box>
            <div className='flex flex-col  w-full h-full  justify-center content-center text-center'>
                <h1>{errMsg}</h1>
            </div>
        </Box>
    )
}
