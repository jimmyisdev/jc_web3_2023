'use client'
import { useEffect } from 'react'
import Box from '../shared/Box/Box'
import { useStateContext } from '@/contexts';
import BoxHeader from '../shared/Box/BoxHeader';
import { SiChainlink, SiEthereum } from "react-icons/si";

export default function BasicInfo() {
    const { userTokens, currentNetwork, sender, currentConnectedAccounts, getErc20TokenBalance, getUserBalance, userBalance, userLinkToken } = useStateContext();



    useEffect(() => {
        getErc20TokenBalance()
        sender && getUserBalance();
    }, [sender])
    useEffect(() => {
        console.log(userTokens, 18)
    }, [userTokens.length])

    return (
        <Box>
            <div >
                {/* <button onClick={getErc20TokenBalance}>Get Balance</button> */}
                <BoxHeader headerText={`Info`} />
                {(currentConnectedAccounts.length === 0 || sender === undefined) ? <span>Please connect MetaMask</span> :
                    <div className='h-52 overflow-scroll '>
                        <div className='p-1 mb-2 border-b-2 border-blue-300'>
                            <h1 className='mb-1 font-bold'>Current Address </h1>
                            <span>{`${sender.slice(0, 25)}......`}</span>
                        </div>
                        <div className='p-1 mb-2 border-b-2 border-blue-300'>
                            <h1 className='mb-1 font-bold'>Coin</h1>
                            <span className='flex flex-row items-center'><SiEthereum /><span className='ml-2'>ETHER : {userBalance}</span></span>
                        </div>
                        <div className='p-1 mb-2 border-b-2 border-blue-300'>
                            <h1 className='mb-1 font-bold'>Token - ERC20</h1>
                            <div className='flex flex-col'>
                                {userTokens.map(item => {
                                    return (
                                        <span className='flex flex-row items-center' key={item.tokenAddress}>
                                            {`<${item.symbol}>: ${item.tokenBalance}>`}
                                        </span>

                                        // <span key={item.tokenAddress}>{item.name}</span>
                                    )
                                })}
                            </div>
                        </div>
                        <div className='p-1 mb-2 border-b-2 border-blue-300'>
                            <h1 className='mb-1 font-bold'>NFT - ERC721 </h1>
                        </div>
                    </div>
                }
            </div >
        </Box >

    )
}
