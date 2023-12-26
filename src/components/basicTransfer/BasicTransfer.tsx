
'use client'
import React, { useEffect, useState } from 'react';
import { TbHandFinger } from "react-icons/tb";
import { useStateContext } from '@/contexts';
import Box from '../shared/Box/Box';
import BoxHeader from '../shared/Box/BoxHeader';
import { SEPOLIA_ETHERSCAN } from '@/constants/utils';
import { ERC20TOKEN } from '@/interfaces/contracts_interface';

export default function BasicTransfer() {
    const {
        userTokens,
        transferVal,
        setTransferVal,
        sender, setSender,
        receiver, setReceiver,
        currentConnectedAccounts,
        transferTokenId,
        transferTokenError,
        isLoadingTransferToken,
        setIsLoadingTransferToken,
        setTransferTokenError,
        transferCoin, transferToken, connectWalletHandler,
        selectedToken, setSelectedToken
    } = useStateContext();

    function handleTransferBtn() {
        let data: ERC20TOKEN | undefined = userTokens.find((item: ERC20TOKEN) => item.name === selectedToken)
        if (!!data) {
            if (transferVal > data.tokenBalance || transferVal <= 0) {
                return setTransferTokenError("Transfer value is invalid")
            } else if (!receiver?.length) {
                return setTransferTokenError("Please check your receiver field")
            }
            // connectWalletHandler()
            setIsLoadingTransferToken(true)
            transferToken(data.decimals, data.tokenAddress)
        }
    }
    useEffect(() => {
        setTransferTokenError('')
        setIsLoadingTransferToken(false)
        setReceiver('')
        setTransferVal(0)
    }, [])
    useEffect(() => {
        if (!!transferTokenId) {
            setTransferTokenError('')
            setReceiver('')
            setTransferVal(0)
        }
    }, [transferTokenId])


    return (
        <Box>
            <div className='flex flex-col min-h-full align-center'>
                <BoxHeader headerText={`Transfer Token`} />
                {(currentConnectedAccounts.length === 0 || sender === undefined) ? <span>Please connect MetaMask</span> :
                    <div className='h-52 overflow-scroll '>
                        {/* <div className='flex flex-col mb-2'>
                            <span >FROM</span>
                            <span>{`${sender.slice(0, 25)}.....`}</span>
                        </div> */}
                        <div className='w-full mb-3 flex flex-col'>
                            <label className='font-bold mb-1'>Select Token</label>
                            <select
                                className='text-blue-900'
                                onChange={(e) => setSelectedToken(e.target.value)}>
                                {userTokens.filter((item: ERC20TOKEN) => item.tokenBalance > 0).map(item => {
                                    return (
                                        <option key={item.tokenAddress} value={item.name}>{item.symbol}</option>
                                    )
                                })}
                            </select>
                        </div>
                        <div className='flex flex-col mb-2'>
                            <span>TO</span>
                            <input
                                value={receiver}
                                className={`p-1 bg-transparent border-b-2 border-blue-300   focus:border-blue-500 `}
                                onChange={e => setReceiver(e.target.value)} />
                        </div>
                        <div className='flex flex-col mb-2'>
                            <span>VALUE</span>
                            <input
                                className={`p-1 bg-transparent border-b-2 border-blue-300   focus:border-blue-500 `}
                                type='number'
                                value={transferVal}
                                onChange={e => setTransferVal(Number(e.target.value))}
                            />
                        </div>
                        <div className='flex flex-col'>
                            {!isLoadingTransferToken && !!transferTokenError && <span className='text-red-700'>{transferTokenError}</span>}
                            {!isLoadingTransferToken && !!transferTokenId && <a href={`${SEPOLIA_ETHERSCAN}${transferTokenId}`} target="_blank">
                                <span className={`flex flex-rol justify-center items-center`}>
                                    <span>TX: {transferTokenId.slice(0, 15)}...</span>
                                    <TbHandFinger />
                                </span>
                            </a>}
                            <button onClick={handleTransferBtn} disabled={!!isLoadingTransferToken}>
                                Confirm
                            </button>
                        </div>
                    </div>
                }
            </div>
        </Box>
    )
}
