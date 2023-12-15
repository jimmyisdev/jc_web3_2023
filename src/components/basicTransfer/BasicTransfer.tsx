
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

    async function handleSendMoney() {
        // const wallet = new ethers.Wallet(user1PrivateKey, provider);
        // const tx = await wallet.sendTransaction({
        //     to: receiver,
        //     value: ethers.parseEther(String(transferVal))
        // })
        // await tx.wait();
    }
    useEffect(() => {
        !!currentConnectedAddress?.length && setSender(currentConnectedAddress)
    }, [currentConnectedAddress])

    return (
        <Box>
            <div className='flex flex-col min-h-full justify-between align-center'>
                <BoxHeader headerText={`Transfer`} />
                <div className='flex flex-col'>
                    <span>FROM</span>
                    <input value={sender} onChange={e => setSender(e.target.value)} />
                </div>
                <div className='flex flex-col'>
                    <span>TO</span>
                    <input value={receiver} onChange={e => setReceiver(e.target.value)} />
                </div>
                <div className='flex flex-col'>
                    <span>VALUE</span>
                    <input className='border-transparent focus:border-transparent focus:ring-0' value={transferVal} onChange={e => setTransferVal(e.target.value)} />
                </div>
                <div className='flex flex-col'>
                    <button>Confirm</button>
                </div>

            </div>
        </Box>
    )
}
