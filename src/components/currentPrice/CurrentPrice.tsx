'use client'
import React, { useEffect, useState } from 'react'
import Box from '../shared/Box/Box'
import BoxHeader from '../shared/Box/BoxHeader';
import { useSocketsContext } from '@/contexts/sockets';
import TradeDisplay from './TradeDisplay';

export default function CurrentPrice() {
    const { connectSocket, processSocketData, ethSingleTransaction, setEthSingleTransaction, btcSingleTransaction, setBtcSingleTransaction } = useSocketsContext();
    const [isLoading, setIsLoading] = useState(true)
    useEffect(() => {
        setIsLoading(true)
        try {
            let btcusdcSocket = connectSocket("btcusdc")
            let ethusdcSocket = connectSocket("ethusdc")
            btcusdcSocket.on("message", (event: any) => {
                setIsLoading(false)
                let data = JSON.parse(event.data);
                processSocketData(data, setBtcSingleTransaction)

            })
            ethusdcSocket.on("message", (event: any) => {
                setIsLoading(false)
                let data = JSON.parse(event.data);
                processSocketData(data, setEthSingleTransaction)
            })
        } catch (error) {
            console.log(error)
        }
    }, []);
    return (
        <Box>
            <div className='relative flex flex-col min-h-full  align-center '>
                <BoxHeader headerText="Trading Record - Mainnet" />
                {isLoading ?
                    <h1>Loading...</h1> :
                    <div className='h-36 overflow-scroll'>
                        <TradeDisplay data={ethSingleTransaction} />
                        <TradeDisplay data={btcSingleTransaction} />
                    </div>
                }
                <span className='absolute bottom-1 w-full text-center font-bold text-yellow-300'>Powered by Binance API</span>
            </div>
        </Box>
    )
}
