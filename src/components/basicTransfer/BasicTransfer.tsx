
'use client'
import React, { useEffect, useState } from 'react';
import { useStateContext } from '@/contexts';
import Box from '../shared/Box/Box';
import BoxHeader from '../shared/Box/BoxHeader';
import { ERC20TOKEN } from '@/interfaces/contracts_interface';
import EtherscanLink from '../shared/EtherscanLink/EtherscanLink';
import Loading from '../shared/Loading/Loading';

export default function BasicTransfer() {
    const {
        userTokens,
        transferVal,
        setTransferVal, userBalance,
        sender, setSender,
        receiver, setReceiver,
        currentConnectedAccounts,
        transferAssetId,
        transferAssetError,
        isLoadingTransferAsset,
        setIsLoadingTransferAsset,
        setTransferAssetError,
        transferCoin, transferToken, connectWalletHandler,
        selectedAsset,
        setSelectedAsset,
        currentNetwork,
        setTransferAssetId,
        getUserBalance,
        getErc20TokenBalance
    } = useStateContext();

    function handleTransferBtn() {
        setTransferAssetError('')
        setTransferAssetId('')
        setIsLoadingTransferAsset(true)
        if (selectedAsset === '') {
            setTransferAssetError("Select token")
            return setIsLoadingTransferAsset(false)
        } else if (transferVal <= 0) {
            setTransferAssetError("Transfer value is invalid")
            return setIsLoadingTransferAsset(false)
        } else if (!receiver?.length) {
            setTransferAssetError("Please check your receiver field")
            return setIsLoadingTransferAsset(false)
        }
        if (selectedAsset === 'ETH') {
            if (transferVal > Number(userBalance)) {
                setTransferAssetError("Transfer value is invalid")
                return setIsLoadingTransferAsset(false)
            }
            return transferCoin()
        } else {
            let data: ERC20TOKEN | undefined = userTokens.find((item: ERC20TOKEN) => item.symbol === selectedAsset)
            if (!!data) {
                if (transferVal > data.tokenBalance) {
                    setTransferAssetError("Transfer value is invalid")
                    return setIsLoadingTransferAsset(false)
                }
                return transferToken(data.decimals, data.tokenAddress)
            }
        }
    }
    useEffect(() => {
        if (transferAssetId) {
            getUserBalance()
            getErc20TokenBalance()
        }
    }, [transferAssetId])

    useEffect(() => {
        setTransferAssetError('')
        setIsLoadingTransferAsset(false)
        setReceiver('')
        setTransferVal(0)
    }, [])

    return (
        <Box>
            <div className='flex flex-col min-h-full align-center'>
                <BoxHeader headerText={`Transfer ${selectedAsset}`} />
                {(currentConnectedAccounts.length === 0 || sender === undefined) ? <span>Please connect MetaMask</span> :
                    <div className='h-52 overflow-scroll '>
                        <div className='w-full mb-3 flex flex-col'>
                            <select
                                className='text-blue-900'
                                onChange={(e) => setSelectedAsset(e.target.value)}>
                                <option value=''>Select transfer asset</option>
                                <option value='ETH'>ETH</option>
                                {userTokens.filter((item: ERC20TOKEN) => item.tokenBalance > 0).map((item, index) => {
                                    return (
                                        <option key={item.tokenAddress}
                                            value={item.symbol}>{item.symbol}</option>
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
                        {!isLoadingTransferAsset && !!transferAssetError && <span className='text-red-700'>{transferAssetError}</span>}
                        {!isLoadingTransferAsset && !!transferAssetId &&
                            <EtherscanLink
                                id={transferAssetId}
                                network={currentNetwork}
                                type={"transaction"}
                            />
                        }
                        <div className='flex flex-col'>
                            <button onClick={handleTransferBtn} disabled={!!isLoadingTransferAsset}>
                                {isLoadingTransferAsset ? <Loading /> : "Confirm"}
                            </button>
                        </div>
                    </div>
                }
            </div>
        </Box>
    )
}
