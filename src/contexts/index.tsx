"use client"
import { Alchemy, Network, Wallet, Utils } from 'alchemy-sdk';
import React, { createContext, useState } from 'react';
import { ethers, formatUnits, parseUnits } from 'ethers';
import { MetaMaskInpageProvider } from '@metamask/providers';
import { NETWORKS } from '@/constants/network';
import { ERC20TOKEN } from '@/interfaces/contracts_interface';
import { ERC20_JVERSE_ADDRESSES, TOKEN_FAUCET_ADDRESS } from '@/constants/address/jverseAddress';
import { ERC20ABI } from '@/constants/abi/contractABI';
import { FAUCET_ABI } from '@/constants/abi/tokenFaucetABI';

interface ProviderRpcError extends Error {
    message: string;
    code: number;
    data?: unknown;
}

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
    transactionId: string | undefined,
    setTransactionId: React.Dispatch<React.SetStateAction<string | undefined>>,
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

    //faucet function-----------------
    requestFaucetForToken: () => {}
    isLoadingFaucet: Boolean,
    setIsLoadingFaucet: React.Dispatch<React.SetStateAction<boolean>>,
    faucetRequestError: string | null;
    setFaucetRequestError: React.Dispatch<React.SetStateAction<string>>,
    //-----------------faucet function
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
    const [transactionId, setTransactionId] = useState<string | undefined>('');

    //get ether balance and token-----------------
    const [userBalance, setUserBalance] = useState<string | undefined>('0');
    const [isLoadingBalance, setIsLoadingBalance] = useState(false)
    const [getUserBalanceErrorMsg, setGetUserBalanceErrorMsg] = useState<string | null>(null);
    const [userTokens, setUserTokens] = useState<ERC20TOKEN[]>([]);
    const [isLoadingToken, setIsLoadingToken] = useState(false)
    const [getTokenErrorMsg, setGetTokenErrorMsg] = useState<string | null>(null);

    //faucet function-----------------
    const [isLoadingFaucet, setIsLoadingFaucet] = useState(false);
    const [faucetRequestError, setFaucetRequestError] = useState<string>('');


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
            try {
                ethereum.request({ method: 'eth_requestAccounts' }).then(result => {
                    if (Array.isArray(result) && result.length) {
                        setCurrentConnectedAccounts(result)
                        setSender(result[0])
                    }
                })
            } catch (error) {
                setConnectErrorMsg("Failed to connect wallet")
                console.log(error)
            }
        } else {
            setConnectErrorMsg("Need to install MetaMask before using our service")
        }
    }

    async function getUserBalance() {
        const provider = new ethers.EtherscanProvider(currentNetwork);
        setUserBalance("0")
        if (currentConnectedAccounts?.length && sender) {
            setIsLoadingBalance(true)
            try {
                await provider.getBalance(sender)
                    .then((result) => {
                        let balance = result;
                        const formatedBalance = ethers.formatEther(balance);
                        setUserBalance(formatedBalance)
                        setIsLoadingBalance(false)
                    })
            } catch (error) {
                setGetUserBalanceErrorMsg("Failed to get balance")
                setIsLoadingBalance(false)
                console.log(error)
            }
        }
    }

    async function getErc20TokenBalance() {
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
                                .catch(e => {
                                    let error: ProviderRpcError = e;
                                    setGetTokenErrorMsg(error.message)
                                    setIsLoadingToken(false)
                                })
                        }
                    }
                })
                .catch(e => {
                    let error: ProviderRpcError = e;
                    setGetTokenErrorMsg(error.message)
                    setIsLoadingToken(false)
                    console.log(error)
                })
        }
    }
    async function requestFaucetForToken() {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const faucetContract = new ethers.Contract(TOKEN_FAUCET_ADDRESS[0].faucet_address, FAUCET_ABI, await provider.getSigner())
        setIsLoadingFaucet(true)
        setFaucetRequestError('')
        try {
            const tx = await faucetContract.requestTokens()
            setTransactionId(tx.hash)
            await tx.wait();
        } catch (error) {
            setFaucetRequestError("Failed to request tokens")
            console.log(error)
        }
        setIsLoadingFaucet(false)
    }
    async function transferCoin() {
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
        let address = ERC20_JVERSE_ADDRESSES[currentNetwork][0] ? ERC20_JVERSE_ADDRESSES[currentNetwork][0] : ''
        const token_contract = new ethers.Contract(address, ERC20ABI);
        await token_contract.transfer(sender, "1000000000000000000")
            .then(result => setTransactionId(result.hash)
            ).catch((error) => console.log(error))
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
                transactionId,
                setTransactionId,

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

                //faucet function
                requestFaucetForToken,
                isLoadingFaucet,
                setIsLoadingFaucet,
                faucetRequestError,
                setFaucetRequestError
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
