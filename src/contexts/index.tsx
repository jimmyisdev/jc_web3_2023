"use client"
import { Network, Alchemy } from 'alchemy-sdk';
import React, { createContext, useState } from 'react';
import { ethers } from 'ethers';
import { MetaMaskInpageProvider } from '@metamask/providers';
import { ERC20_LINKTOKEN } from '@/constants/contractAddress';
import { erc20ABI } from '@/constants/contractABI';

interface ERC20TOKEN {
    decimals: number,
    logo: string,
    name: string,
    symbol: string,
    tokenBalance: number,
    tokenAddress: string
}

interface stateContextValue {
    currentNetwork: string;
    setCurrentNetwork: React.Dispatch<React.SetStateAction<string>>,
    currentConnectedAccounts: string[];
    setCurrentConnectedAccounts: React.Dispatch<React.SetStateAction<string[]>>,
    connectErrorMsg: string | null;
    setConnectErrorMsg: React.Dispatch<React.SetStateAction<string | null>>,
    sender: string | undefined;
    setSender: React.Dispatch<React.SetStateAction<string | undefined>>,
    receiver: string | undefined;
    setReceiver: React.Dispatch<React.SetStateAction<string | undefined>>,
    transferVal: number;
    setTransferVal: React.Dispatch<React.SetStateAction<number>>,
    userBalance: string | undefined;
    setUserBalance: React.Dispatch<React.SetStateAction<string | undefined>>,
    userTokens: ERC20TOKEN[],
    setUserTokens: React.Dispatch<React.SetStateAction<ERC20TOKEN[]>>,

    connectWalletHandler: () => {},
    transferCoin: () => {},
    getUserBalance: () => {},
    getErc20TokenBalance: () => {},
}
const StateContext = createContext<stateContextValue | undefined>(undefined);

const StateContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [currentNetwork, setCurrentNetwork] = useState<string>("sepolia");
    const [currentConnectedAccounts, setCurrentConnectedAccounts] = useState<string[]>([]);
    const [connectErrorMsg, setConnectErrorMsg] = useState<string | null>(null);
    const [transferVal, setTransferVal] = useState<number>(0)
    const [sender, setSender] = useState<string | undefined>('');
    const [receiver, setReceiver] = useState<string | undefined>('');
    const [userBalance, setUserBalance] = useState<string | undefined>('0');
    const [userTokens, setUserTokens] = useState<ERC20TOKEN[]>([]);
    const ALCHEMY_SETTING = {
        apiKey: process.env.NEXT_PUBLIC_Alchemy_API_KEY,
        network: Network.ETH_SEPOLIA
    };
    async function connectWalletHandler() {
        if (window.ethereum) {
            const ethereum = window.ethereum as MetaMaskInpageProvider;
            ethereum.request({ method: 'eth_requestAccounts' }).then(result => {
                if (Array.isArray(result) && result.length) {
                    setCurrentConnectedAccounts(result)
                }
            }).catch((error) => {
                setConnectErrorMsg(error.message)
            })
        } else {
            setConnectErrorMsg("Need to install MetaMask before using our service")
        }
    }

    async function getUserBalance() {
        const provider = new ethers.EtherscanProvider(currentNetwork);
        if (currentConnectedAccounts?.length && sender) {
            await provider.getBalance(sender)
                .then((result) => {
                    let balance = result;
                    const formatedBalance = ethers.formatEther(balance);
                    setUserBalance(formatedBalance)
                }).catch((error) => {
                    setConnectErrorMsg("Error occured from the  Provider")
                    console.log(error)
                });
        }
    }
    // async function getSingleContract(contract: string) {
    //     const provider = new ethers.EtherscanProvider(currentNetwork);

    //     await provider.getContract(contract).symbol
    //         .then((result) => {
    //             console.log(result)

    //         }).catch((error) => {
    //             console.log(error)
    //         });
    // }


    async function transferCoin() {
        const alchemy = new Alchemy(ALCHEMY_SETTING);
        await alchemy.core.call({
            to: "0x3d60179980f4288ebaAB489229EC62CB0BB2de52",
            from: sender,
            value: ethers.parseEther(String(0.000002))
        }).then((result) => { console.log(result, 108) }).catch((error) => console.log(error))
    }
    async function getErc20TokenBalance() {
        const alchemy = new Alchemy(ALCHEMY_SETTING);
        if (sender) {
            await alchemy.core.getTokenBalances(sender)
                .then(async (result) => {
                    let allTokens = result?.tokenBalances;
                    if (allTokens.length) {
                        for (let i = 0; i <= allTokens.length; i++) {
                            let tokenAddress = allTokens[i].contractAddress
                            let rawBalance = (allTokens[i].tokenBalance);
                            let tokenBalance = rawBalance ? ethers.formatEther(rawBalance) : 0;
                            let tokenData = {
                                decimals: 0,
                                logo: '',
                                name: '',
                                symbol: '',
                                tokenBalance: Number(tokenBalance),
                                tokenAddress: tokenAddress
                            }
                            await alchemy.core.getTokenMetadata(tokenAddress)
                                .then(metadata => {
                                    tokenData.decimals = metadata.decimals ? metadata.decimals : 0;
                                    tokenData.logo = metadata.logo ? metadata.logo : '';
                                    tokenData.name = metadata.name ? metadata.name : '';
                                    tokenData.symbol = metadata.symbol ? metadata.symbol : '';
                                }).then(() => {
                                    setUserTokens(prevArray => [...prevArray, tokenData])
                                })
                                .catch(error => console.log(error))
                        }
                    }
                })
                .catch(error => console.log(error, 154))

        }
    }

    return (
        <StateContext.Provider
            value={{
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
                setTransferVal,
                userBalance,
                setUserBalance,
                userTokens,
                setUserTokens,

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
