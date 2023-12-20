'use client'
import React, { useEffect, useState } from 'react'
import Box from '../shared/Box/Box'
import BoxHeader from '../shared/Box/BoxHeader'
import { useStateContext } from '@/contexts';
import Loading from '../shared/Loading/Loading';
export default function JverseAsset() {
    const {
        getUserBalance, isLoadingBalance, userBalance, getUserBalanceErrorMsg,
        getErc20TokenBalance, isLoadingToken, userTokens, getTokenErrorMsg,
        getAlchemyNetwork, alchemyNetwork, currentNetwork, currentConnectedAccounts,
        sender,
    } = useStateContext();
    return (
        <Box>
            <div >
                <BoxHeader headerText={`JVERSE Asset`} />
                <div className='h-52 overflow-scroll '>
                    <div className='p-1 mb-2 '>
                        <h1 className='mb-1 font-bold'>Token - ERC20 </h1>
                        {isLoadingToken ? <Loading /> : (
                            userTokens.filter(item => item.isJverseAsset).map(item => {
                                return (
                                    <div className='flex flex-col mb-2 border-b-2 border-blue-100' key={item.tokenAddress}>
                                        <span>{`${item.symbol}: ${item.tokenBalance}`}</span>
                                    </div>
                                )
                            }))}
                        {!isLoadingToken && !!getTokenErrorMsg?.length && (
                            <span>{getTokenErrorMsg}</span>
                        )}
                    </div>
                    <div className='p-1 mb-2 '>
                        <h1 className='mb-1 font-bold'>NFT - ERC721 </h1>
                        <span>Release soon!</span>
                    </div>
                </div>
            </div>
        </Box>
    )
}
