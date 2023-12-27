'use client'
import { useEffect } from 'react'
import Box from '../shared/Box/Box'
import { useStateContext } from '@/contexts';
import BoxHeader from '../shared/Box/BoxHeader';
import { SiEthereum } from "react-icons/si";
import Loading from '../shared/Loading/Loading';
import TokenItem from '../shared/Display/Token/TokenItem';

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
                            {isLoadingToken && <Loading />}
                            {!isLoadingToken && userTokens.length && (
                                userTokens.filter(item => !item.isJverseAsset).map(item => {
                                    return (
                                        <TokenItem key={item.tokenAddress} data={item} />
                                    )
                                }))}
                            {!isLoadingToken && !!getTokenErrorMsg?.length && (
                                <span>{getTokenErrorMsg}</span>
                            )}
                        </div>
                    </div>
                }
            </div >
        </Box >

    )
}
