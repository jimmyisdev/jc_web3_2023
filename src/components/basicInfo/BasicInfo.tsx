'use client'
import { useEffect } from 'react'
import Box from '../shared/Box/Box'
import { ERC20_LINKTOKEN } from '@/constants/contractAddress';
import { erc20ABI } from '@/constants/contractABI';
import { useStateContext } from '@/contexts';
import BoxHeader from '../shared/Box/BoxHeader';
import { SiChainlink, SiEthereum } from "react-icons/si";

export default function BasicInfo() {
    const { currentNetwork, sender, currentConnectedAccounts, getErc20TokenBalance, getUserBalance, userBalance } = useStateContext();
    useEffect(() => {
        getErc20TokenBalance()
        sender && getUserBalance();
    }, [sender, currentNetwork])
    return (
        <Box>
            <div >
                <BoxHeader headerText={`Info`} />
                {!!currentConnectedAccounts.length && !!sender &&
                    <div className='h-52 overflow-scroll '>
                        <div className='p-1 mb-2 border-b-2 border-blue-300'>
                            <span>Address : </span>
                            <span>{`${sender.slice(0, 15)}......`}</span>
                        </div>
                        <div className='p-1 mb-2 border-b-2 border-blue-300'>
                            <span className='flex flex-row items-center'><SiEthereum /><span className='ml-2'>ETHER : {userBalance}</span></span>
                        </div>
                        <div className='p-1 mb-2 border-b-2 border-blue-300'>
                            <span className='flex flex-row items-center'><SiChainlink /><span className='ml-2'>LINK :  </span></span>
                        </div>
                    </div>
                }
            </div>
        </Box>

    )
}
