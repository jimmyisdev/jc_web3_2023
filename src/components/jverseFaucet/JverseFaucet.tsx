
'use client'
import React, { useEffect } from 'react';
import BoxHeader from '../shared/Box/BoxHeader';
import Box from '../shared/Box/Box';
import { useStateContext } from '@/contexts';
import Loading from '../shared/Loading/Loading';
import EtherscanLink from '../shared/EtherscanLink/EtherscanLink';

export default function JverseFaucet() {
    const {
        currentConnectedAccounts,
        currentNetwork,
        faucetTransactionId,
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
        setFaucetRequestError('')
        setIsLoadingFaucet(false)
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
                        {!!isLoadingFaucet && <Loading />}
                        {!isLoadingFaucet && !!faucetRequestError && <span className='text-red-700'>{faucetRequestError}</span>}
                        {!isLoadingFaucet && !!faucetTransactionId &&
                            <EtherscanLink
                                id={faucetTransactionId}
                                network={currentNetwork}
                                type={"transaction"}
                            />
                        }
                        {!!currentConnectedAccounts?.length &&
                            <div className={`flex flex-col `}>
                                {!isLoadingFaucet && !faucetTransactionId?.length && !faucetRequestError?.length &&
                                    <button onClick={handleConfirmBtn} disabled={!!isLoadingFaucet}>
                                        Get Token
                                    </button>}
                            </div>}
                    </div>
                </div>}
        </Box >)
}
