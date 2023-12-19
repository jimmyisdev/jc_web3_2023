'use client'
import { useEffect } from 'react'
import Box from '../shared/Box/Box'
import { useStateContext } from '@/contexts';
import BoxHeader from '../shared/Box/BoxHeader';
import { SiChainlink, SiEthereum } from "react-icons/si";

export default function BasicInfo() {
    const { userTokens, alchemyNetwork, currentNetwork, sender, currentConnectedAccounts, getErc20TokenBalance, getUserBalance, userBalance, getAlchemyNetwork } = useStateContext();

    useEffect(() => {
        if (sender) {
            getUserBalance()
            getErc20TokenBalance()
        }
    }, [sender])

    useEffect(() => {
        console.log(12, "bi")
        sender && alchemyNetwork && getErc20TokenBalance()
    }, [alchemyNetwork])

    useEffect(() => {
        console.log(17, "bi")
        sender && getAlchemyNetwork()
        getUserBalance()
    }, [currentNetwork])

    return (
        <Box>
            <div >
                {/* <button onClick={getErc20TokenBalance}>Get Balance</button> */}
                <BoxHeader headerText={`Asset Info`} />
                {(currentConnectedAccounts.length === 0 || sender === undefined) ? <span>Please connect MetaMask</span> :
                    <div className='h-52 overflow-scroll '>
                        <div className='p-1 mb-2 '>
                            <h1 className='mb-1 font-bold'>Current Address </h1>
                            <span>{`${sender.slice(0, 25)}......`}</span>
                        </div>
                        <div className='p-1 mb-2 '>
                            <h1 className='mb-1 font-bold'>Coin - ETHER </h1>
                            <span className='flex flex-row items-center'>
                                <span className='ml-2 flex flex-row items-center'>{userBalance}<SiEthereum /></span>
                            </span>
                        </div>
                        <div className='p-1 mb-2 '>
                            <h1 className='mb-1 font-bold'>Token - ERC20</h1>
                            {userTokens.map(item => {
                                return (
                                    <div className='flex flex-col mb-2 border-b-2 border-blue-100' key={item.tokenAddress}>
                                        <span>{`${item.symbol}: ${item.tokenBalance}`}</span>
                                    </div>
                                )
                            })}
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
