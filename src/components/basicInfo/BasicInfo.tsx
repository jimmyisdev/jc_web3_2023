'use client'
import { useEffect } from 'react'
import Box from '../shared/Box/Box'
import { useStateContext } from '@/contexts';
import BoxHeader from '../shared/Box/BoxHeader';
import { SiChainlink, SiEthereum } from "react-icons/si";
import Loading from '../shared/Loading/Loading';

export default function BasicInfo() {
    const {
        getUserBalance, isLoadingBalance, userBalance, getUserBalanceErrorMsg,
        getErc20TokenBalance, isLoadingToken, userTokens, getTokenErrorMsg,
        getAlchemyNetwork, alchemyNetwork, currentNetwork, currentConnectedAccounts,
        sender,
    } = useStateContext();
    useEffect(() => {
        if (sender) {
            getUserBalance()
            getErc20TokenBalance()
        }
    }, [sender])

    useEffect(() => {
        sender && alchemyNetwork && getErc20TokenBalance()
    }, [alchemyNetwork])

    useEffect(() => {
        sender && getAlchemyNetwork()
        getUserBalance()
    }, [currentNetwork])

    return (
        <Box>
            <div >
                <BoxHeader headerText={`Asset Info`} />
                {(currentConnectedAccounts.length === 0 || sender === undefined) ? <span>Please connect MetaMask</span> :
                    <div className='h-52 overflow-scroll '>
                        <div className='p-1 mb-2 '>
                            <h1 className='mb-1 font-bold'>Current Address </h1>
                            <span>{`${sender.slice(0, 25)}......`}</span>
                        </div>
                        <div className='p-1 mb-2 '>
                            <h1 className='mb-1 font-bold'>Coin - ETHER </h1>
                            {isLoadingBalance ? <Loading /> :
                                <span className='flex flex-row items-center'>
                                    <span className='ml-2 flex flex-row items-center'>{userBalance}<SiEthereum /></span>

                                </span>
                            }
                            {!isLoadingBalance && !!getUserBalanceErrorMsg?.length && (
                                <span>{getUserBalanceErrorMsg}</span>
                            )}
                        </div>
                        <div className='p-1 mb-2 '>
                            <h1 className='mb-1 font-bold'>Token - ERC20</h1>
                            {isLoadingToken ? <Loading /> : (
                                userTokens.map(item => {
                                    return (
                                        <div className='flex flex-col mb-2 border-b-2 border-blue-100' key={item.tokenAddress}>
                                            <span>{`${item.symbol}: ${item.tokenBalance}`}</span>
                                        </div>
                                    )
                                }))}
                            {!isLoadingToken && !!getTokenErrorMsg?.length && (
                                <span>{getTokenErrorMsg}</span>
                            )}
                        </div>
                        <div className='p-1 mb-2 '>
                            <h1 className='mb-1 font-bold'>NFT - ERC721 </h1>
                        </div>
                    </div>
                }
            </div >
        </Box >

    )
}
