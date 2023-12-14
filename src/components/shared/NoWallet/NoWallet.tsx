import React from 'react'
import Box from '../Box/Box'

export default function NoWallet() {
    return (
        <Box>
            <div className='flex flex-col  w-full h-full  justify-center content-center text-center'>
                <h1>Please install Metawallet to use our service</h1>
                <p><a href='https://www.youtube.com/watch?v=GNPz-Dv5BjM&ab_channel=MetaMask'>Check Tutorial</a></p>
            </div>
        </Box>
    )
}
