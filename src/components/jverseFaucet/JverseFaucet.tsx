
'use client'
import React, { useEffect } from 'react';
import { TbHandFinger } from "react-icons/tb";
import BoxHeader from '../shared/Box/BoxHeader';
import Box from '../shared/Box/Box';
import { useStateContext } from '@/contexts';
import { SEPOLIA_ETHERSCAN } from '@/constants/utils';
import Loading from '../shared/Loading/Loading';

export default function JverseFaucet() {
    const {
        currentConnectedAccounts,
        getErc20TokenBalance,
        currentNetwork,
        transactionId,
        requestFaucetForToken,
        isLoadingFaucet,
        setIsLoadingFaucet,
        setFaucetRequestError,
        faucetRequestError } = useStateContext();

    async function handleConfirmBtn() {
        setIsLoadingFaucet(true)
        requestFaucetForToken()
    }

    useEffect(() => {
        !!transactionId && getErc20TokenBalance()
    }, [isLoadingFaucet])

    useEffect(() => {
        setFaucetRequestError('')
    }, [])

    return (
        <Box>
            {currentNetwork !== 'sepolia' && <div>Currently only support SEPOLIA network</div>}
            {currentNetwork === 'sepolia' &&
                <div className='flex flex-col min-h-full align-center'>
                    <BoxHeader headerText={`Jverse Token Faucet`} />
                    <div className='h-52 overflow-scroll '>
                        <div className='flex flex-col mb-2 text-center'>
                            <h1 className='mb-1 font-bold'>Free JVT23 token</h1>
                        </div>
                        {!!currentConnectedAccounts?.length &&
                            <div className={`flex flex-col `}>
                                {!!isLoadingFaucet && <Loading />}
                                {!isLoadingFaucet && !!faucetRequestError && <span className='text-red-700'>{faucetRequestError}</span>}
                                {!isLoadingFaucet && !!transactionId &&
                                    <a href={`${SEPOLIA_ETHERSCAN}${transactionId}`} target="_blank">
                                        <span className={`flex flex-rol justify-center items-center`}>
                                            <span>TX: {transactionId.slice(0, 15)}...</span>
                                            <TbHandFinger />
                                        </span>
                                    </a>}
                                {!isLoadingFaucet && !transactionId?.length && !faucetRequestError?.length &&
                                    <button onClick={handleConfirmBtn} disabled={!!isLoadingFaucet}>
                                        Get Token
                                    </button>}
                            </div>}
                    </div>
                </div>}
        </Box >)
}
