
'use client'
import React, { useEffect } from 'react';
import BoxHeader from '../shared/Box/BoxHeader';
import Box from '../shared/Box/Box';
import { useStateContext } from '@/contexts';
import Loading from '../shared/Display/Loading/Loading';
import EtherscanLink from '../shared/Display/EtherscanLink/EtherscanLink';
import ErrorMsg from '../shared/Display/ErrorMsg/ErrorMsg';

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
            <div className='flex flex-col min-h-full align-center'>
                <BoxHeader headerText={`Jverse Token Faucet`} />
                {currentConnectedAccounts.length === 0 && <span>Please connect MetaMask</span>}
                {currentNetwork !== 'sepolia' && <div>Currently only support SEPOLIA network</div>}
                {currentNetwork === 'sepolia' && (
                    <div className='h-52 overflow-scroll '>
                        {!!currentConnectedAccounts?.length &&
                            <div className={`flex flex-col `}>
                                <div className='flex flex-col mb-2 text-center'>
                                    <h1 className='mb-1 font-bold'>Free JVT23 token</h1>
                                </div>
                                {!!isLoadingFaucet && <Loading />}
                                {!isLoadingFaucet && !!faucetRequestError && <ErrorMsg errMsg={faucetRequestError} />}
                                {!isLoadingFaucet && !!faucetTransactionId &&
                                    <EtherscanLink
                                        id={faucetTransactionId}
                                        network={currentNetwork}
                                        type={"transaction"}
                                    />
                                }
                                {!isLoadingFaucet && !faucetTransactionId?.length && !faucetRequestError?.length &&
                                    <button className='font-bold hover:font-black duration-300' onClick={handleConfirmBtn} disabled={!!isLoadingFaucet}>
                                        Get Token
                                    </button>}
                            </div>}
                    </div>
                )}
            </div>
        </Box >)
}
