
'use client'
import React, { useEffect, useState } from 'react';
import Box from '../shared/Box/Box';
import { ethers } from 'ethers';

import { useStateContext } from '@/contexts';
import BoxHeader from '../shared/Box/BoxHeader';

export default function BasicTransfer() {
    const apiKey = process.env.Alchemy_API_KEY;
    const network = "sepolia";
    const provider = new ethers.AlchemyProvider(network, apiKey);
    const { currentConnectedAddress, setCurrentNetwork } = useStateContext();
    const [transferVal, setTransferVal] = useState("")
    const [sender, setSender] = useState<string>('');
    const [receiver, setReceiver] = useState<string>('');

    async function handleTransferBtn() {
        if (sender.length && receiver.length && transferVal.length) {
            // const wallet = new ethers.Wallet(user1PrivateKey, provider);
            // const tx = await wallet.sendTransaction({
            //     to: receiver,
            //     value: ethers.parseEther(String(transferVal))
            // })
            // await tx.wait();
        } else {
            return
        }
    }
    useEffect(() => {
        currentConnectedAddress?.length && setSender(currentConnectedAddress)
    }, [currentConnectedAddress])

    return (
        <Box>
            <div className='flex flex-col min-h-full align-center'>
                <BoxHeader headerText={`Transfer`} />
                <div className='h-52 overflow-scroll '>
                    <div className='flex flex-col mb-2'>
                        <span >FROM</span>
                        <input
                            value={sender}
                            className='p-1 bg-transparent border-b-2 border-blue-300  focus:border-blue-500'
                            onChange={e => setSender(e.target.value)} />
                    </div>
                    <div className='flex flex-col mb-2'>
                        <span>TO</span>
                        <input value={receiver} className='p-1 bg-transparent border-b-2 border-blue-300  focus:border-blue-500'
                            onChange={e => setReceiver(e.target.value)} />
                    </div>
                    <div className='flex flex-col mb-2'>
                        <span>VALUE</span>
                        <input
                            className='p-1 bg-transparent border-b-2 border-blue-300  focus:border-blue-500'
                            type='number'

                            value={transferVal}
                            onChange={e => setTransferVal(e.target.value)}
                        />
                    </div>
                    <div className='flex flex-col'>
                        <button
                            onClick={handleTransferBtn}
                        >Confirm</button>
                    </div>
                </div>

            </div>
        </Box>
    )
}
