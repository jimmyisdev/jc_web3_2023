
'use client'
import React, { useState } from 'react';
import BoxHeader from '../shared/Box/BoxHeader';
import Box from '../shared/Box/Box';
import { useStateContext } from '@/contexts';
import Image from 'next/image';

export default function JverseFaucet() {
    const sepolia_etherscan = "https://sepolia.etherscan.io/tx/"
    const { sender, getErc20TokenBalance, transferToken, currentNetwork, transactionId } = useStateContext();
    const [gotFaucet, setGotFaucet] = useState(false)

    async function handleConfirmBtn() {
        setGotFaucet(true)
        transferToken()
        setTimeout(() => {
            getErc20TokenBalance()
        }, 7000);
    }

    return (
        <Box>
            {currentNetwork === 'sepolia' ?
                <div className='flex flex-col min-h-full align-center'>
                    <BoxHeader headerText={`Jverse Token Faucet`} />
                    <div className='h-52 overflow-scroll '>
                        <div className='flex flex-col mb-2'>
                            <h1 className='mb-1 font-bold'>Send</h1>
                            <span>1 JTT token</span>
                        </div>
                        <div className='flex flex-col mb-2'>
                            <h1 className='mb-1 font-bold'>TO</h1>
                            <span>{sender?.length ? `${sender.slice(0, 25)}.....` : "Please select account in setting panel"}</span>
                        </div>
                        {
                            !!sender?.length &&
                            <div className={`flex flex-col `}>
                                {/* {!!transferError.length && <span className='text-red-700'>{transferError}</span>} */}
                                {
                                    gotFaucet ?
                                        <a href={`${sepolia_etherscan}${transactionId}`} target="_blank">
                                            <span className='font-bold flex flex-row justify-center'>Check on <Image src="/etherscan.svg" alt="etherscan" width="64" height="64" className='ml-2' /></span>
                                        </a>
                                        : <button onClick={handleConfirmBtn}>
                                            Confirm
                                        </button>
                                }
                            </div>
                        }
                    </div>
                </div> : <div>Currently only support SEPOLIA network</div>
            }
        </Box >
    )

}
