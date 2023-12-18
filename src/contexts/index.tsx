"use client"
import React, { createContext, useState } from 'react';
import { ethers } from 'ethers';
import { MetaMaskInpageProvider } from '@metamask/providers';
import { ERC20_LINKTOKEN } from '@/constants/contractAddress';
import { erc20ABI } from '@/constants/contractABI';
const apiKey = process.env.Alchemy_API_KEY;

interface stateContextValue {
    currentCoin: string;
    currentNetwork: string;
    currentConnectedAccounts: string[];
    connectErrorMsg: string | null;
    sender: string | undefined;
    receiver: string | undefined;
    userBalance: string | undefined;
    transferVal: number;
    setCurrentNetwork: React.Dispatch<React.SetStateAction<string>>,
    setCurrentCoin: React.Dispatch<React.SetStateAction<string>>,
    setCurrentConnectedAccounts: React.Dispatch<React.SetStateAction<string[]>>,
    setConnectErrorMsg: React.Dispatch<React.SetStateAction<string | null>>,
    setSender: React.Dispatch<React.SetStateAction<string | undefined>>,
    setReceiver: React.Dispatch<React.SetStateAction<string | undefined>>,
    setTransferVal: React.Dispatch<React.SetStateAction<number>>,
    setUserBalance: React.Dispatch<React.SetStateAction<string | undefined>>,
    connectWalletHandler: () => {},
    transferCoin: () => {},
    getUserBalance: () => {},
    getErc20TokenBalance: () => {},
}
const StateContext = createContext<stateContextValue | undefined>(undefined);

const StateContextProvider = ({ children }: { children: React.ReactNode }) => {
    // const wallet = new ethers.Wallet(user1PrivateKey, provider);
    const [currentNetwork, setCurrentNetwork] = useState<string>("sepolia");
    const [currentConnectedAccounts, setCurrentConnectedAccounts] = useState<string[]>([]);
    const [currentCoin, setCurrentCoin] = useState<string>('ETH');
    const [connectErrorMsg, setConnectErrorMsg] = useState<string | null>(null);
    const [transferVal, setTransferVal] = useState<number>(0)
    const [sender, setSender] = useState<string | undefined>('');
    const [receiver, setReceiver] = useState<string | undefined>('');
    const [userBalance, setUserBalance] = useState<string | undefined>('');

    async function connectWalletHandler() {
        if (window.ethereum) {
            const ethereum = window.ethereum as MetaMaskInpageProvider;
            ethereum.request({ method: 'eth_requestAccounts' }).then(result => {
                if (Array.isArray(result) && result.length) {
                    console.log(result, 31)
                    setCurrentConnectedAccounts(result)
                }
            }).catch((error) => {
                setConnectErrorMsg(error.message)
            })
        } else {
            setConnectErrorMsg("Need to install MetaMask before using our service")
        }
    }

    async function transferCoin() {
        const provider = new ethers.AlchemyProvider(currentNetwork, apiKey);
        let user1PrivateKey = ''
        const wallet = new ethers.Wallet(user1PrivateKey, provider);
        const tx = await wallet.sendTransaction({
            to: receiver,
            value: ethers.parseEther(String(transferVal))
        })
        await tx.wait();
    }
    async function getUserBalance() {
        // const provider = new ethers.AlchemyProvider(currentNetwork, apiKey);
        const provider = new ethers.EtherscanProvider(currentNetwork);
        if (currentConnectedAccounts?.length && sender) {
            await provider.getBalance(sender).then((result) => {
                let balance = result;
                const formatedBalance = ethers.formatEther(balance);
                setUserBalance(formatedBalance)
            }).catch((error) => {
                setConnectErrorMsg("Error occured from the  Provider")
                console.log(error)
            });
        }
    }

    async function getErc20TokenBalance() {
        const provider = new ethers.AlchemyProvider(currentNetwork, apiKey);
        // const provider = new ethers.EtherscanProvider(currentNetwork);
        const TokenAddress = ERC20_LINKTOKEN[currentNetwork];
        const contractErc20 = new ethers.Contract(TokenAddress, erc20ABI, provider);
        await contractErc20.balanceOf(sender).then((result) => console.log(result)).catch((error) => console.log(error))
        // console.log(balance)
        console.log(contractErc20)
        // const balance = await ContractErc20.balanceOf((await provider.getSigner())[0].address);
    }

    return (
        <StateContext.Provider
            value={{
                currentCoin,
                setCurrentCoin,
                currentNetwork,
                setCurrentNetwork,
                currentConnectedAccounts,
                setCurrentConnectedAccounts,
                connectErrorMsg,
                setConnectErrorMsg,
                sender,
                setSender,
                receiver,
                setReceiver,
                transferVal,
                userBalance,
                setUserBalance,
                setTransferVal,
                connectWalletHandler,
                transferCoin,
                getUserBalance,
                getErc20TokenBalance
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
