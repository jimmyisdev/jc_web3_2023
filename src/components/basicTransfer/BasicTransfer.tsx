
'use client'
import React, { useEffect, useState } from 'react';
import { useStateContext } from '@/contexts';
import Box from '../shared/Box/Box';
import BoxHeader from '../shared/Box/BoxHeader';

export default function BasicTransfer() {
    const { userBalance, transferVal, setTransferVal, sender, setSender, receiver, setReceiver, currentConnectedAccounts, transferCoin } = useStateContext();
    const [transferError, setTransferError] = useState('');
    async function handleTransferBtn() {
        if (transferVal > Number(userBalance) || transferVal <= 0) {
            return setTransferError("Transfer value is invalid")
        } else if (receiver?.length && !!transferVal) {
            return setTransferError("Please check your receive field or transfer value again")
        }
        await transferCoin()
    }

    return (
        <Box>
            <div className='flex flex-col min-h-full align-center'>
                <BoxHeader headerText={`Transfer`} />
                {(currentConnectedAccounts.length === 0 || sender === undefined) ? <span>Please connect MetaMask</span> :
                    <div className='h-52 overflow-scroll '>
                        <div className='flex flex-col mb-2'>
                            <span >FROM</span>
                            <span>{`${sender.slice(0, 25)}.....`}</span>
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
                            {/* {transferError.length && <span className='text-red-700'>{transferError}</span>} */}
                            <button onClick={handleTransferBtn}>
                                Confirm
                            </button>
                        </div>
                    </div>
                }


            </div>
        </Box>
    )
}
