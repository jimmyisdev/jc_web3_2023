
'use client'
import React, { useEffect, useState } from 'react';
import Box from '../shared/Box/Box';
import { ethers } from 'ethers';

import { useStateContext } from '@/contexts';

export default function BasicTransfer() {
    const apiKey = process.env.Alchemy_API_KEY;
    const network = "sepolia";
    const provider = new ethers.AlchemyProvider(network, apiKey);
    const { currentConnectedAddress, currentNetwork, setCurrentNetwork } = useStateContext();
    const [transferVal, setTransferVal] = useState("")
    const [sender, setSender] = useState(String(currentConnectedAddress));
    const [receiver, setReceiver] = useState('');

    async function handleSendMoney() {
        const send1Balance = await provider.getBalance(sender);
        const receive2Balance = await provider.getBalance(receiver);
        // const wallet = new ethers.Wallet(user1PrivateKey, provider);
        // const tx = await wallet.sendTransaction({
        //     to: receiver,
        //     value: ethers.parseEther(String(transferVal))
        // })
        // await tx.wait();
    }
    return (
        <Box>
            <div className='flex flex-col min-h-full justify-between align-center'>
                <h1 className='font-bold'>Transfer - {currentNetwork}</h1>
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
                    <input value={transferVal} type='number' onChange={e => setTransferVal(e.target.value)} />
                </div>

            </div>
        </Box>
    )
}
