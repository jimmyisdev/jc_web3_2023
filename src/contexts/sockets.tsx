"use client"
import { type BinanceSocketData, CoinTransaction, socketsContextValue } from '@/interfaces/scokets_interface';
import { Socket } from '@/utils/socket/Socket';
import React, { createContext, useState } from 'react';
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