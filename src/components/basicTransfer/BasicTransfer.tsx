
'use client'
import React, { useEffect, useState } from 'react';
import { useStateContext } from '@/contexts';
import Box from '../shared/Box/Box';
import BoxHeader from '../shared/Box/BoxHeader';
import { ERC20TOKEN } from '@/interfaces/contracts_interface';
import EtherscanLink from '../shared/EtherscanLink/EtherscanLink';

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
        selectedToken, setSelectedToken,
        currentNetwork
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
                            {!isLoadingTransferToken && !!transferTokenId &&
                                <EtherscanLink
                                    id={transferTokenId}
                                    network={currentNetwork}
                                    type={"transaction"}
                                />
                            }
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
