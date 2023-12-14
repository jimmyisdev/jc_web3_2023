"use client"
import React, { createContext, useState } from 'react';
interface stateContextValue {
    currentCoin: string;
    currentNetwork: string | null;
    currentConnectedAddress: string | null;
    setCurrentNetwork: React.Dispatch<React.SetStateAction<string | null>>,
    setCurrentCoin: React.Dispatch<React.SetStateAction<string>>,
    setCurrentConnectedAddress: React.Dispatch<React.SetStateAction<string | null>>,
}
const StateContext = createContext<stateContextValue | undefined>(undefined);

const StateContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [currentNetwork, setCurrentNetwork] = useState<string | null>(null);
    const [currentConnectedAddress, setCurrentConnectedAddress] = useState<string | null>(null);
    const [currentCoin, setCurrentCoin] = useState<string>('ETH');
    return (
        <StateContext.Provider
            value={{
                currentCoin,
                currentNetwork,
                currentConnectedAddress,
                setCurrentConnectedAddress,
                setCurrentNetwork,
                setCurrentCoin
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
