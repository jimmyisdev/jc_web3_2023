'use client'
import { useStateContext } from '@/contexts';
import Image from 'next/image';
import { FaWallet } from "react-icons/fa6";
export default function Header() {
    const { currentNetwork, connectWalletHandler } = useStateContext();
    return (
        <div className='relative text-center  flex flex-wrap justify-between p-3 align-middle'>
            <div className=' flex flex-row items-center'>
                <Image src={`/jverse_icon.png`} height={60} width={60} alt="jverse" className='mr-5' />
                <div className='flex flex-col'>
                    <span>Current Network</span>
                    <span className='font-bold'>{!!currentNetwork?.length && `[${currentNetwork.toUpperCase()}]`}</span>
                </div>
            </div>
            <button title="Connect MetaMask" className="absolute right-6 top-6" onClick={connectWalletHandler}>
                <FaWallet size={30} />
            </button>
        </div>
    )
}
