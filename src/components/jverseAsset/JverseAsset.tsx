'use client'
import React, { useEffect, useState } from 'react'
import Box from '../shared/Box/Box'
import BoxHeader from '../shared/Box/BoxHeader'
export default function JverseAsset() {
    return (
        <Box>
            <div >
                <BoxHeader headerText={`JVERSE Asset`} />
                <div className='h-52 overflow-scroll '>
                    <div className='p-1 mb-2 border-b-2 border-blue-300'>
                        <h1 className='mb-1 font-bold'>Token - ERC20 </h1>
                        <span>Release soon!</span>
                    </div>
                    <div className='p-1 mb-2 border-b-2 border-blue-300'>
                        <h1 className='mb-1 font-bold'>NFT - ERC721 </h1>
                        <span>Release soon!</span>
                    </div>
                </div>
            </div>
        </Box>
    )
}
