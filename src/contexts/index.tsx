"use client"
import { Alchemy, Network } from 'alchemy-sdk';
import React, { createContext, useState } from 'react';
import { ethers, parseUnits } from 'ethers';
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

    //get ether balance and token-----------------
    //-----balance
    getUserBalance: () => {},
    userBalance: string | undefined;
    setUserBalance: React.Dispatch<React.SetStateAction<string | undefined>>,
    isLoadingBalance: Boolean,
    getUserBalanceErrorMsg: string | null;
    //-----token
    getErc20TokenBalance: () => {},
    isLoadingToken: Boolean,
    userTokens: ERC20TOKEN[],
    setUserTokens: React.Dispatch<React.SetStateAction<ERC20TOKEN[]>>,
    getTokenErrorMsg: string | null;
    //-----------------get ether balance and token

    //accounts, sender, receiver, transfer-----------------
    currentConnectedAccounts: string[];
    setCurrentConnectedAccounts: React.Dispatch<React.SetStateAction<string[]>>,
    sender: string;
    setSender: React.Dispatch<React.SetStateAction<string>>,
    receiver: string;
    setReceiver: React.Dispatch<React.SetStateAction<string>>,
    transferVal: number;
    setTransferVal: React.Dispatch<React.SetStateAction<number>>,
    //-----trasnfer token/coin
    transferCoin: () => {},
    transferToken: (decimals: number, tokenAddress: string) => {},
    isLoadingTransferAsset: Boolean,
    setIsLoadingTransferAsset: React.Dispatch<React.SetStateAction<boolean>>,
    transferAssetError: string | null;
    setTransferAssetError: React.Dispatch<React.SetStateAction<string>>,
    transferAssetId: string | undefined,
    setTransferAssetId: React.Dispatch<React.SetStateAction<string | undefined>>,
    selectedAsset: string,
    setSelectedAsset: React.Dispatch<React.SetStateAction<string>>,
    //accounts, sender, receiver, transfer-----------------

    //faucet function-----------------
    requestFaucetForToken: () => {}
    isLoadingFaucet: Boolean,
    setIsLoadingFaucet: React.Dispatch<React.SetStateAction<boolean>>,
    faucetRequestError: string | null;
    setFaucetRequestError: React.Dispatch<React.SetStateAction<string>>,
    faucetTransactionId: string | undefined,
    setFaucetTransactionId: React.Dispatch<React.SetStateAction<string | undefined>>,
    //-----------------faucet function

    assignCurrentAddress: () => {}
}
const StateContext = createContext<stateContextValue | undefined>(undefined);

const StateContextProvider = ({ children }: { children: React.ReactNode }) => {
    const Alchemy_API_KEY = process.env.NEXT_PUBLIC_Alchemy_API_KEY || "";
    //control network-----------------
    const [currentNetwork, setCurrentNetwork] = useState<string>("sepolia");
    const [alchemyNetwork, setAlchemyNetwork] = useState<Network>(Network.ETH_SEPOLIA);
    const [connectErrorMsg, setConnectErrorMsg] = useState<string | null>(null);

    //accounts, sender, receiver, transfer-----------------
    const [currentConnectedAccounts, setCurrentConnectedAccounts] = useState<string[]>([]);
    const [sender, setSender] = useState<string>('');
    const [receiver, setReceiver] = useState<string>('');
    const [transferVal, setTransferVal] = useState<number>(0);
    const [isLoadingTransferAsset, setIsLoadingTransferAsset] = useState(false);
    const [transferAssetError, setTransferAssetError] = useState<string>('');
    const [transferAssetId, setTransferAssetId] = useState<string | undefined>('');
    const [selectedAsset, setSelectedAsset] = useState('');

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
    const [faucetTransactionId, setFaucetTransactionId] = useState<string | undefined>('');


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
                    })
            } catch (error) {
                setGetUserBalanceErrorMsg("Failed to get balance")
                console.log(error)
            } finally {
                setIsLoadingBalance(false)
            }
        }
    }
    async function assignCurrentAddress() {
        const ethereum = window.ethereum as MetaMaskInpageProvider;
        const provider = new ethers.BrowserProvider(window.ethereum);
        let signer = await provider.getSigner()
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
                                isJverseAsset: ERC20_JVERSE_ADDRESSES[currentNetwork].includes(tokenAddress.toLowerCase()),
                            }
                            await alchemy.core.getTokenMetadata(tokenAddress)
                                .then(metadata => {
                                    tokenData.decimals = metadata.decimals ? metadata.decimals : 0;
                                    tokenData.logo = metadata.logo ? metadata.logo : '';
                                    tokenData.name = metadata.name ? metadata.name : '';
                                    tokenData.symbol = metadata.symbol ? metadata.symbol : '';
                                })
                                .then(() => {
                                    setUserTokens(prevArray => [...prevArray, tokenData])
                                })
                                .catch(e => {
                                    let error: ProviderRpcError = e;
                                    setGetTokenErrorMsg(error.message)
                                })
                                .finally(() => {
                                    setIsLoadingToken(false)
                                })
                        }
                    }
                })
                .catch(e => {
                    let error: ProviderRpcError = e;
                    setGetTokenErrorMsg(error.message)
                    console.log(error)
                })
                .finally(() => {
                    setIsLoadingToken(false)
                })
        }
    }
    async function requestFaucetForToken() {
        const provider = new ethers.BrowserProvider(window.ethereum);
        try {
            const faucetContract = new ethers.Contract(TOKEN_FAUCET_ADDRESS[0].faucet_address, FAUCET_ABI, await provider.getSigner())
            const tx = await faucetContract.requestTokens()
            setFaucetTransactionId(tx.hash)
            await tx.wait()
                .then(() => {
                    getUserBalance()
                    getErc20TokenBalance()
                })
        } catch (error) {
            setFaucetRequestError("Failed to request tokens")
            console.log(error)
        } finally {
            setIsLoadingFaucet(false)
        }
    }
    async function transferCoin() {
        const provider = new ethers.BrowserProvider(window.ethereum);
        try {
            const signer = await provider.getSigner()
            const fromAddress = await signer.getAddress()
            const processedVal = parseUnits(String(transferVal), 'ether')
            const limit: bigint = await provider.estimateGas({
                from: fromAddress,
                to: receiver,
                value: processedVal
            });
            const tx = await signer.sendTransaction({
                from: fromAddress,
                to: receiver,
                value: processedVal,
                gasLimit: limit,
                nonce: await signer.getNonce(),
                maxPriorityFeePerGas: parseUnits("1", "gwei"),
            });
            setTransferAssetId(tx.hash)
            await tx.wait().then(() => getUserBalance())
        } catch (error) {
            console.log(error)
            setTransferAssetError("Transfer ETH failed")
        } finally {
            setIsLoadingTransferAsset(false)
        }
    }

    async function transferToken(decimals: number, tokenAddress: string) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        try {
            const val = Number(`${transferVal}e${decimals}`)
            const tokenContract = new ethers.Contract(tokenAddress, ERC20ABI, await provider.getSigner())
            const tx = await tokenContract.transfer(receiver, BigInt(val))
            setTransferAssetId(tx.hash)
            await tx.wait()
                .then(() => {
                    getUserBalance()
                    getErc20TokenBalance()
                })
        } catch (error) {
            console.log(error)
            setTransferAssetError("Transfer failed")
        } finally {
            setIsLoadingTransferAsset(false)
        }
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

                //accounts, sender, receiver, transfer
                currentConnectedAccounts,
                setCurrentConnectedAccounts,
                sender,
                setSender,
                receiver,
                setReceiver,
                transferVal,
                setTransferVal,

                //transfer token/ coin
                transferCoin,
                transferToken,
                selectedAsset,
                setSelectedAsset,
                transferAssetId,
                setTransferAssetId,
                transferAssetError,
                setTransferAssetError,
                isLoadingTransferAsset,
                setIsLoadingTransferAsset,

                //faucet function
                requestFaucetForToken,
                isLoadingFaucet,
                setIsLoadingFaucet,
                faucetRequestError,
                setFaucetRequestError,
                faucetTransactionId,
                setFaucetTransactionId,

                assignCurrentAddress
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
