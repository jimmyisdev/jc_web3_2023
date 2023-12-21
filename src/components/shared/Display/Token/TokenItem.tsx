'use client'
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { VscTriangleDown, VscTriangleUp } from "react-icons/vsc";
import { useStateContext } from '@/contexts';
import { ERC20TOKEN } from '@/interfaces/contracts_interface'

export default function TokenItem({ data }: { data: ERC20TOKEN }) {
    let { decimals, logo, name, symbol, tokenBalance, tokenAddress } = data;
    const {
        currentNetwork
    } = useStateContext();
    const [showDetails, setShowDetails] = useState(false);
    const [currentUrl, setCurrentUrl] = useState('')
    function etherscanURL() {
        if (currentNetwork === "homestead") {
            return `https://etherscan.io/address/`;
        } else {
            return `https://${currentNetwork}.etherscan.io/address/`
        }
    }
    useEffect(() => {
        let url = etherscanURL()
        setCurrentUrl(url)
    }, [currentNetwork])

    return (
        <div className='flex flex-col p-1 border-b-2 border-blue-300'>
            <div className='flex flex-row justify-between'>
                <span className='p-1'>{`${symbol}: ${tokenBalance}`}</span>
                <button className='text-center text-blue-400' onClick={() => setShowDetails(!showDetails)}>
                    {showDetails ? <VscTriangleDown /> : <VscTriangleUp />}
                </button>
            </div>
            {showDetails &&
                <div className='flex flex-col'>
                    <span className='mb-2'> {name} - [{symbol}]</span>
                    <a href={`${currentUrl}${tokenAddress}`} target="_blank">
                        <span className='font-bold flex flex-row justify-center'>Check on <Image src="/etherscan.svg" alt="etherscan" width="64" height="64" className='ml-2' /></span>
                    </a>
                </div>
            }
        </div>
    )
}
