'use client'
import React, { useEffect, useState } from 'react'
import Box from '../shared/Box/Box'
import BoxHeader from '../shared/Box/BoxHeader';
import { useSocketsContext } from '@/contexts/sockets';

export default function CurrentPrice() {
    const { connectSocket, processSocketData, ethSingleTransaction, setEthSingleTransaction, btcSingleTransaction, setBtcSingleTransaction } = useSocketsContext();
    const [currentEthPrice, setCurrentEthPrice] = useState()
    const [currentBtcPrice, setCurrentBtcPrice] = useState()
    useEffect(() => {
        try {
            let btcusdcSocket = connectSocket("btcusdc")
            let ethusdcSocket = connectSocket("ethusdc")
            btcusdcSocket.on("message", (event: any) => {
                let data = JSON.parse(event.data);
                processSocketData(data, setBtcSingleTransaction)

            })
            ethusdcSocket.on("message", (event: any) => {
                let data = JSON.parse(event.data);
                processSocketData(data, setEthSingleTransaction)
            })
        } catch (error) {
            console.log(error)
        }
    }, []);

    return (
        <Box>
            <div className='flex flex-col min-h-full justify-between align-center'>
                <BoxHeader headerText="Current Price - Mainnet" />
                <h1>Trading Record</h1>
                <ul className='w-full flex flex-col'>
                    <li>USDC / ETH {ethSingleTransaction?.currentPrice} </li>
                    <li>USDC / BTC {btcSingleTransaction?.currentPrice} </li>
                </ul>
                <span className='text-center font-bold text-yellow-300'>Powered by Binance API</span>
            </div>
        </Box>
    )
}
