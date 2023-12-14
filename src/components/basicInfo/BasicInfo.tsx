'use client'

import React, { useEffect, useState } from 'react'
import Box from '../shared/Box/Box'
import { ethers, Signer } from 'ethers';
import { ERC20_LINKTOKEN } from '@/constants/contractAddress';
import { erc20ABI } from '@/constants/contractABI';
import { useStateContext } from '@/contexts';
import { NETWORKS } from '@/constants/network';

export default function BasicInfo() {
    const apiKey = process.env.Alchemy_API_KEY;
    const { currentConnectedAddress, currentNetwork, setCurrentNetwork } = useStateContext();
    const [userBalance, setUserBalance] = useState('0')
    const provider = new ethers.AlchemyProvider('sepolia', apiKey);
    const erc20 = new ethers.Contract(ERC20_LINKTOKEN.sepolia, erc20ABI, provider);
    async function getUserBalance() {
        if (currentConnectedAddress?.length) {
            const balance = await provider.getBalance(currentConnectedAddress);
            const formatedBalance = ethers.formatEther(balance);
            setUserBalance(formatedBalance)
        }
    }
    useEffect(() => {
        setCurrentNetwork("sepolia")
        getUserBalance();
    }, [])
    return (
        <Box>
            <div >
                <h1 className='font-bold'>{currentNetwork?.toUpperCase()}</h1>
                <div className='mb-3'>
                    <select name="pets" id="pet-select" onChange={(e) => setCurrentNetwork(e.target.value)}>
                        <option value="sepolia">Choose Network</option>
                        {NETWORKS.map(item => {
                            return (
                                <option key={item.name} value={item.network}>{item.name}</option>
                            )
                        })}
                    </select>
                </div>
                <ul>
                    <li>Address : {!!currentConnectedAddress && `${currentConnectedAddress.slice(0, 15)}......`}</li>
                    <li>Balance : {userBalance}</li>
                    <li></li>
                </ul>
            </div>
        </Box>

    )
}
