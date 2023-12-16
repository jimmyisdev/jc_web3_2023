"use client"
import { Socket } from '@/utils/socket/Socket';
import React, { createContext, useState } from 'react';

interface CoinTransaction {
    currentPrice: number | string | null,
    currentQty: number | string | null,
    currentTradeTime: number | string | null,
    currentTradeSymbol: number | string | null,
}
interface BinanceSocketData {
    E?: number | string | null,
    M?: number | string | null,
    T?: number | string | Date,
    a?: number | string | null,
    e?: number | string | null,
    f?: number | string | null,
    l?: number | string | null,
    m?: number | string | null,
    p?: number | string | null,
    q?: number | string | null,
    s?: number | string | null,
}
interface socketsContextValue {
    ethSingleTransaction: CoinTransaction | null,
    btcSingleTransaction: CoinTransaction | null,
    setEthSingleTransaction: React.Dispatch<React.SetStateAction<CoinTransaction | null>>,
    setBtcSingleTransaction: React.Dispatch<React.SetStateAction<CoinTransaction | null>>,
    connectSocket: (pairs: string) => Socket
    processSocketData: (data: BinanceSocketData, updateFunc: Function) => void
}
const SocketsContext = createContext<socketsContextValue | undefined>(undefined);

const SocketsContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [ethSingleTransaction, setEthSingleTransaction] = useState<CoinTransaction | null>(null)
    const [btcSingleTransaction, setBtcSingleTransaction] = useState<CoinTransaction | null>(null)
    function connectSocket(pairs: string) {
        const socketInstance = new Socket();
        const baseEndpoint = `wss://stream.binance.com:9443/ws/${pairs.toLowerCase()}`;
        socketInstance.connect(`${baseEndpoint}@aggTrade`);
        return socketInstance
    }
    function disconnectSocket(socketInstance: Socket) {
        socketInstance.disconnect();
    }
    function processSocketData(data: BinanceSocketData, updateFunc: Function) {
        let tradeTime = data.T && new Date(data.T).toLocaleTimeString();
        let tradePrice = data.p;
        let tradeQuantity = data.q;
        let tradeSymbol = data.s;
        let singleTradeInfo = {
            currentPrice: tradePrice,
            currentQty: tradeQuantity,
            currentTradeTime: tradeTime,
            currentTradeSymbol: tradeSymbol,
        };
        updateFunc(singleTradeInfo)
    }


    return (
        <SocketsContext.Provider
            value={{
                ethSingleTransaction,
                btcSingleTransaction,
                setEthSingleTransaction,
                setBtcSingleTransaction,
                connectSocket,
                processSocketData
            }}
        >
            {children}
        </SocketsContext.Provider>
    )
}
const useSocketsContext = () => {
    const socketsContext = React.useContext(SocketsContext);
    if (socketsContext === undefined) {
        throw new Error('useSocketsContext must be inside socketsProvider');
    }
    return socketsContext;
};

export { SocketsContextProvider, useSocketsContext };