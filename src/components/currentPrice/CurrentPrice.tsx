'use client'
import React, { useEffect } from 'react'
import Box from '../shared/Box/Box'
import { useStateContext } from '@/contexts';
import BoxHeader from '../shared/Box/BoxHeader';

export default function CurrentPrice() {
    const { currentCoin, setCurrentCoin } = useStateContext();
    return (
        <Box>
            <div className='flex flex-col min-h-full justify-between align-center'>
                <BoxHeader headerText="Current Price - Mainnet" />
                <select name="coin"
                    defaultValue={"ETH"}
                    value={currentCoin}
                    onChange={e => setCurrentCoin(e.target.value)}>
                    <option value="ETH">ETH</option>
                    <option value="BTC">BTC</option>
                </select>
                <ul className='w-full flex flex-col  justify-between'>
                    <li>USDT - {currentCoin} </li>
                    <li>USDC - {currentCoin} </li>
                    <li>BUSD - {currentCoin} </li>
                    <li>DAI -  {currentCoin}</li>
                </ul>
                <span className='text-center font-bold text-yellow-300'>Powered by Binance API</span>
            </div>
        </Box>
    )
}
