"use client"
import { Alchemy, Network, Wallet, Utils } from 'alchemy-sdk';
import React, { createContext, useState } from 'react';
import { ethers, formatUnits, parseUnits } from 'ethers';
import { MetaMaskInpageProvider } from '@metamask/providers';
import { NETWORKS } from '@/constants/network';
import { ERC20TOKEN } from '@/interfaces/contracts_interface';
import { ERC20_JVERSE_ADDRESSES } from '@/constants/jverseAddress';
import { ERC20ABI } from '@/constants/contractABI';

interface stateContextValue {
    //control network-----------------
    currentNetwork: string;
    setCurrentNetwork: React.Dispatch<React.SetStateAction<string>>,
    alchemyNetwork: Network,
    setAlchemyNetwork: React.Dispatch<React.SetStateAction<Network>>,
    connectErrorMsg: string | null;
    setConnectErrorMsg: React.Dispatch<React.SetStateAction<string | null>>,
    connectWalletHandler: () => {},
    getAlchemyNetwork: () => void,
    //-----------------control network

    //accounts, sender, receiver, transfer-----------------
    currentConnectedAccounts: string[];
    setCurrentConnectedAccounts: React.Dispatch<React.SetStateAction<string[]>>,
    sender: string | undefined;
    setSender: React.Dispatch<React.SetStateAction<string | undefined>>,
    receiver: string | undefined;
    setReceiver: React.Dispatch<React.SetStateAction<string | undefined>>,
    transferVal: number;
    setTransferVal: React.Dispatch<React.SetStateAction<number>>,
    transferCoin: () => {},
    //accounts, sender, receiver, transfer-----------------

    //get ether balance and token-----------------
    //-----balance
    getUserBalance: () => {},
    userBalance: string | undefined;
    setUserBalance: React.Dispatch<React.SetStateAction<string | undefined>>,
    isLoadingBalance: Boolean,
    getUserBalanceErrorMsg: string | null;
    //-----token
    getErc20TokenBalance: () => {},
    userTokens: ERC20TOKEN[],
    setUserTokens: React.Dispatch<React.SetStateAction<ERC20TOKEN[]>>,
    isLoadingToken: Boolean,
    getTokenErrorMsg: string | null;
    transferToken: () => {},
    //-----------------get ether balance and token
}
const StateContext = createContext<stateContextValue | undefined>(undefined);

const StateContextProvider = ({ children }: { children: React.ReactNode }) => {
    const PRIVATE_KEY = process.env.NEXT_PUBLIC_PRIVATE_KEY || "";
    const Alchemy_API_KEY = process.env.NEXT_PUBLIC_Alchemy_API_KEY || "";
    //control network-----------------
    const [currentNetwork, setCurrentNetwork] = useState<string>("sepolia");
    const [alchemyNetwork, setAlchemyNetwork] = useState<Network>(Network.ETH_SEPOLIA);
    const [connectErrorMsg, setConnectErrorMsg] = useState<string | null>(null);

    //accounts, sender, receiver, transfer-----------------
    const [currentConnectedAccounts, setCurrentConnectedAccounts] = useState<string[]>([]);
    const [sender, setSender] = useState<string | undefined>('');
    const [receiver, setReceiver] = useState<string | undefined>('');
    const [transferVal, setTransferVal] = useState<number>(0)

    //get ether balance and token-----------------
    const [userBalance, setUserBalance] = useState<string | undefined>('0');
    const [isLoadingBalance, setIsLoadingBalance] = useState(false)
    const [getUserBalanceErrorMsg, setGetUserBalanceErrorMsg] = useState<string | null>(null);
    const [userTokens, setUserTokens] = useState<ERC20TOKEN[]>([]);
    const [isLoadingToken, setIsLoadingToken] = useState(false)
    const [getTokenErrorMsg, setGetTokenErrorMsg] = useState<string | null>(null);

    function getAlchemyNetwork() {
        for (let i = 0; i < NETWORKS.length; i++) {
            if (NETWORKS[i].CURRENT_NETWORK === currentNetwork) {
                return setAlchemyNetwork(NETWORKS[i].ALCHEMY_NETWORK)
            }
        }
    }
    async function connectWalletHandler() {
        if (window.ethereum) {
            const ethereum = window.ethereum as MetaMaskInpageProvider;
            ethereum.request({ method: 'eth_requestAccounts' }).then(result => {
                if (Array.isArray(result) && result.length) {
                    setCurrentConnectedAccounts(result)
                    setSender(result[0])
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
        setUserBalance("0")
        if (currentConnectedAccounts?.length && sender) {
            setIsLoadingBalance(true)
            await provider.getBalance(sender)
                .then((result) => {
                    let balance = result;
                    const formatedBalance = ethers.formatEther(balance);
                    setUserBalance(formatedBalance)
                    setIsLoadingBalance(false)
                }).catch((error) => {
                    setGetUserBalanceErrorMsg("Failed to get balance")
                    setIsLoadingBalance(false)
                    console.log(error)
                });
        }
    }

    async function getErc20TokenBalance() {
        console.log(118)
        if (sender) {
            const ALCHEMY_SETTING = {
                apiKey: Alchemy_API_KEY,
                network: alchemyNetwork
            }
            const alchemy = new Alchemy(ALCHEMY_SETTING);
            setUserTokens([])
            setIsLoadingToken(true)
            await alchemy.core.getTokenBalances(sender)
                .then(async (result) => {
                    let allTokens = result?.tokenBalances;
                    if (allTokens.length) {
                        for (let i = 0; i < allTokens.length; i++) {
                            let tokenAddress = allTokens[i].contractAddress
                            let rawBalance = (allTokens[i].tokenBalance);
                            let tokenBalance = rawBalance ? ethers.formatEther(rawBalance) : 0;
                            let tokenData = {
                                decimals: 0,
                                logo: '',
                                name: '',
                                symbol: '',
                                tokenBalance: Number(tokenBalance),
                                tokenAddress: tokenAddress,
                                isJverseAsset: ERC20_JVERSE_ADDRESSES[currentNetwork].includes(tokenAddress.toLowerCase())
                            }
                            await alchemy.core.getTokenMetadata(tokenAddress)
                                .then(metadata => {
                                    tokenData.decimals = metadata.decimals ? metadata.decimals : 0;
                                    tokenData.logo = metadata.logo ? metadata.logo : '';
                                    tokenData.name = metadata.name ? metadata.name : '';
                                    tokenData.symbol = metadata.symbol ? metadata.symbol : '';
                                }).then(() => {
                                    setUserTokens(prevArray => [...prevArray, tokenData])
                                    setIsLoadingToken(false)
                                })
                                .catch(error => {
                                    setGetTokenErrorMsg("Failed to get token")
                                    setIsLoadingToken(false)
                                    console.log(error)
                                })
                        }
                    }
                })
                .catch(error => {
                    setGetTokenErrorMsg("Failed to get token")
                    setIsLoadingToken(false)
                    console.log(error)
                })
        }
    }
    async function transferCoin() {
        // let wallet = new Signer()
        const provider = ethers.getDefaultProvider(currentNetwork, {
            alchemy: Alchemy_API_KEY
        })
        const limit: bigint = await provider.estimateGas({
            from: sender,
            to: receiver,
            value: ethers.parseEther(String(transferVal)),
        });
    }
    async function transferToken() {
        const provider = new ethers.AlchemyProvider(currentNetwork, Alchemy_API_KEY)
        const wallet = new ethers.Wallet(PRIVATE_KEY, provider)
        let address = ERC20_JVERSE_ADDRESSES[currentNetwork][0] ? ERC20_JVERSE_ADDRESSES[currentNetwork][0] : ''
        const token_contract = new ethers.Contract(address, ERC20ABI, wallet);
        await token_contract.transfer(sender, "1000000000000000000")
            .then(result => {

            }).catch((error) => console.log(error))
    }

    return (
        <StateContext.Provider
            value={{
                //control network
                currentNetwork,
                setCurrentNetwork,
                connectWalletHandler,
                alchemyNetwork,
                setAlchemyNetwork,
                getAlchemyNetwork,
                connectErrorMsg,
                setConnectErrorMsg,

                //accounts, sender, receiver, transfer
                currentConnectedAccounts,
                setCurrentConnectedAccounts,
                sender,
                setSender,
                receiver,
                setReceiver,
                transferVal,
                setTransferVal,
                transferCoin,
                transferToken,

                //get ether balance and token
                getUserBalance,
                isLoadingBalance,
                userBalance,
                setUserBalance,
                getUserBalanceErrorMsg,

                getErc20TokenBalance,
                isLoadingToken,
                userTokens,
                setUserTokens,
                getTokenErrorMsg,
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
