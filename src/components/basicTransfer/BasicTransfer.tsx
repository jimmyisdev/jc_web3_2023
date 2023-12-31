
'use client'
import React, { useEffect } from 'react';
import { useStateContext } from '@/contexts';
import Box from '../shared/Box/Box';
import BoxHeader from '../shared/Box/BoxHeader';
import { type ERC20TOKEN } from '@/interfaces/contracts_interface';
import EtherscanLink from '../shared/Display/EtherscanLink/EtherscanLink';
import Loading from '../shared/Display/Loading/Loading';
import ErrorMsg from '../shared/Display/ErrorMsg/ErrorMsg';
import TextBtn from '../shared/Button/TextBtn';

export default function BasicTransfer() {
    const {
        userTokens, userBalance,
        currentNetwork, currentConnectedAccounts,
        transferVal, setTransferVal,
        receiver, setReceiver,
        transferAssetId, setTransferAssetId,
        transferAssetError, setTransferAssetError,
        isLoadingTransferAsset, setIsLoadingTransferAsset,
        selectedAsset, setSelectedAsset,
        transferCoin, transferToken,
    } = useStateContext();

    function handleTransferBtn() {
        setTransferAssetError('')
        setTransferAssetId('')
        setIsLoadingTransferAsset(true)
        if (selectedAsset === '') {
            setTransferAssetError("Select transfer asset!")
            setIsLoadingTransferAsset(false)
            return
        } else if (transferVal <= 0) {
            setTransferAssetError("Transfer value is invalid!")
            setIsLoadingTransferAsset(false)
            return
        } else if (!receiver?.length) {
            setTransferAssetError("Please check your receiver field!")
            setIsLoadingTransferAsset(false)
            return
        }
        if (selectedAsset === 'ETH') {
            if (transferVal > Number(userBalance)) {
                setTransferAssetError("Transfer value is invalid")
                setIsLoadingTransferAsset(false)
            }
            transferCoin()
            return
        } else {
            let data: ERC20TOKEN | undefined = userTokens.find((item: ERC20TOKEN) => item.symbol === selectedAsset)
            if (!!data) {
                if (transferVal > data.tokenBalance) {
                    setTransferAssetError("Transfer value is invalid")
                    setIsLoadingTransferAsset(false)
                    return
                }
                transferToken(data.decimals, data.tokenAddress)
                return
            }
        }
    }

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
                {!!isLoadingTransferAsset && <Loading />}
                {!isLoadingTransferAsset && currentConnectedAccounts.length === 0 && <span>Please connect MetaMask</span>}
                {!isLoadingTransferAsset && currentConnectedAccounts.length !== 0 && <div className='h-52 overflow-scroll '>
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
                        <span className='font-bold'>TO</span>
                        <input
                            value={receiver}
                            className={`p-1 bg-transparent border-b-2 border-blue-300   focus:border-blue-500 `}
                            onChange={e => setReceiver(e.target.value)} />
                    </div>
                    <div className='flex flex-col mb-2'>
                        <span className='font-bold'>VALUE</span>
                        <input
                            className={`p-1 bg-transparent border-b-2 border-blue-300   focus:border-blue-500 `}
                            type='number'

                            value={transferVal}
                            onChange={e => setTransferVal(Number(e.target.value))}
                        />
                    </div>
                    {!isLoadingTransferAsset && !!transferAssetError &&
                        <ErrorMsg errMsg={transferAssetError} />}
                    {!!transferAssetId &&
                        <EtherscanLink
                            id={transferAssetId}
                            network={currentNetwork}
                            type={"transaction"}
                        />}
                    <div className='flex flex-col'>
                        <TextBtn handleBtn={handleTransferBtn} disabledStatus={isLoadingTransferAsset} btnText="Transfer" />
                    </div>
                </div>
                }
            </div>
        </Box>
    )
}
