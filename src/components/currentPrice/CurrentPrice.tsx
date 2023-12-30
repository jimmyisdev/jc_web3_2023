'use client'
import React, { useEffect, useState, useTransition } from 'react'
import { SiBinance } from "react-icons/si";
import Box from '../shared/Box/Box'
import BoxHeader from '../shared/Box/BoxHeader';
import { useSocketsContext } from '@/contexts/sockets';
import TradeDisplay from './TradeDisplay';

export default function CurrentPrice() {
    const { connectSocket, processSocketData, ethSingleTransaction, setEthSingleTransaction, btcSingleTransaction, setBtcSingleTransaction } = useSocketsContext();
    function connectSocketMsg() {
        try {
            let btcusdcSocket = connectSocket("btcusdc")
            let ethusdcSocket = connectSocket("ethusdc")
            btcusdcSocket.on("message", (event: MessageEvent) => {
                let data = JSON.parse(event.data);
                processSocketData(data, setBtcSingleTransaction)

            })
            ethusdcSocket.on("message", (event: MessageEvent) => {
                let data = JSON.parse(event.data);
                processSocketData(data, setEthSingleTransaction)
            })
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        connectSocketMsg()
    }, []);
    return (
        <Box>
            <div className='relative flex flex-col min-h-full  align-center '>
                <BoxHeader headerText="Trading Record - Mainnet" />
                <div className='h-44 overflow-scroll'>
                    <TradeDisplay data={ethSingleTransaction} />
                    <TradeDisplay data={btcSingleTransaction} />
                </div>
                <div className='absolute bottom-1 flex flex-row items-center justify-center w-full text-center font-bold text-yellow-300'>
                    <span className='mr-3'>Powered by Binance API</span>
                    <SiBinance />
                </div>
            </div>
        </Box>
    )
}
