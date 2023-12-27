'use client'
import { useState } from 'react';
import { VscTriangleDown, VscTriangleUp } from "react-icons/vsc";
import { useStateContext } from '@/contexts';
import { ERC20TOKEN } from '@/interfaces/contracts_interface'
import EtherscanLink from '../EtherscanLink/EtherscanLink';

export default function TokenItem({ data }: { data: ERC20TOKEN }) {
    let { decimals, logo, name, symbol, tokenBalance, tokenAddress } = data;
    const {
        currentNetwork
    } = useStateContext();
    const [showDetails, setShowDetails] = useState(false);
    return (
        <div className='flex flex-col p-1 border-b-2 border-blue-300'>
            <div className='flex flex-row justify-between'>
                <span className='p-1'>{`${symbol}: ${tokenBalance}`}</span>
                <button className={`text-center ${showDetails ? "text-red-700" : "text-slate-50"}`} onClick={() => setShowDetails(!showDetails)}>
                    {showDetails ? <VscTriangleDown /> : <VscTriangleUp />}
                </button>
            </div>
            {showDetails &&
                <div className='flex flex-col'>
                    <span className='mb-2'>Name: {name} </span>
                    <EtherscanLink
                        id={tokenAddress}
                        network={currentNetwork}
                        type={"address"}
                    />
                </div>
            }
        </div>
    )
}
