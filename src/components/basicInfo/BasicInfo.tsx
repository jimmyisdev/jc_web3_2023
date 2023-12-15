'use client'

import React, { useEffect, useState } from 'react'
import Box from '../shared/Box/Box'
import { ethers, Signer, Provider } from 'ethers';
import { ERC20_LINKTOKEN } from '@/constants/contractAddress';
import { erc20ABI } from '@/constants/contractABI';
import { useStateContext } from '@/contexts';
import BoxHeader from '../shared/Box/BoxHeader';

export default function BasicInfo() {
    const apiKey = process.env.Alchemy_API_KEY;
    const { currentConnectedAddress, setCurrentNetwork } = useStateContext();
    const [userBalance, setUserBalance] = useState<string | null>(null);
    const provider = new ethers.AlchemyProvider('sepolia', apiKey);
    // const provider = new ethers.JsonRpcProvider('sepolia', apiKey);
    // const erc20 = new ethers.Contract(ERC20_LINKTOKEN.sepolia, erc20ABI, provider);
    const erc20 = new ethers.Contract(ERC20_LINKTOKEN.sepolia, erc20ABI, provider);
    async function getUserBalance() {
        if (currentConnectedAddress?.length) {
            // const balance = await provider.getBalance(currentConnectedAddress);
            await provider.getBalance(currentConnectedAddress).then((result) => {
                let balance = result;
                const formatedBalance = ethers.formatEther(balance);
                setUserBalance(formatedBalance)
            }).catch((error) => {
                console.log(error)
            });
        }
    }
    useEffect(() => {
        getUserBalance();
    }, [currentConnectedAddress?.length])
    return (
        <Box>
            <div >
                <BoxHeader headerText={`Info`} />
                <ul>
                    <li>Address : {!!currentConnectedAddress && `${currentConnectedAddress.slice(0, 15)}......`}</li>
                    <li>ETHER : {!!currentConnectedAddress && userBalance} </li>
                    <li>LINK : { }</li>
                </ul>
            </div>
        </Box>

    )
}
