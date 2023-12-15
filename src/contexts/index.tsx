"use client"
import React, { createContext, useState } from 'react';
import { MetaMaskInpageProvider } from '@metamask/providers';

interface stateContextValue {
    currentCoin: string;
    currentNetwork: string | null;
    currentConnectedAddress: string | null;
    connectErrorMsg: string | null;
    setCurrentNetwork: React.Dispatch<React.SetStateAction<string | null>>,
    setCurrentCoin: React.Dispatch<React.SetStateAction<string>>,
    setCurrentConnectedAddress: React.Dispatch<React.SetStateAction<string | null>>,
    setConnectErrorMsg: React.Dispatch<React.SetStateAction<string | null>>,
    connectWalletHandler: () => {}
}
const StateContext = createContext<stateContextValue | undefined>(undefined);

const StateContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [currentNetwork, setCurrentNetwork] = useState<string | null>(null);
    const [currentConnectedAddress, setCurrentConnectedAddress] = useState<string | null>(null);
    const [currentCoin, setCurrentCoin] = useState<string>('ETH');
    const [connectErrorMsg, setConnectErrorMsg] = useState<string | null>(null);

    async function connectWalletHandler() {
        if (window.ethereum) {
            setCurrentNetwork("sepolia")
            const ethereum = window.ethereum as MetaMaskInpageProvider;
            ethereum.request({ method: 'eth_requestAccounts' }).then(result => {
                if (Array.isArray(result) && result.length) {
                    setCurrentConnectedAddress(result[0])
                }
            }).catch((error) => {
                setConnectErrorMsg(error.message)
            })
        } else {
            setConnectErrorMsg("Need to install MetaMask before using our service")
        }
    }


    return (
        <StateContext.Provider
            value={{
                currentCoin,
                currentNetwork,
                currentConnectedAddress,
                connectErrorMsg,
                setCurrentCoin,
                setCurrentNetwork,
                setCurrentConnectedAddress,
                setConnectErrorMsg,
                connectWalletHandler,
            }}
        >
            {children}
        </StateContext.Provider>
    )
}
const useStateContext = () => {
    const stateContext = React.useContext(StateContext);
    if (stateContext === undefined) {
        throw new Error('useStateContext must be inside stateProvider');
    }
    return stateContext;
};

export { StateContextProvider, useStateContext };
