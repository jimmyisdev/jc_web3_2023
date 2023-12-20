'use client'
import { useStateContext } from '@/contexts';
import Image from 'next/image';
import { FaWallet } from "react-icons/fa6";
export default function Header() {
    const { currentNetwork, connectWalletHandler } = useStateContext();
    return (
        <div className='relative text-center  flex flex-wrap justify-between p-3 align-middle'>
            <div className=' flex flex-row items-center'>
                <div className='relative w-20 h-20 mr-2 bg-white rounded-full  bg-opacity-50'>
                    <Image src={`/jverse_icon.png`} height={80} width={80} alt="jverse" className='relative z-10' />
                </div>
                <span>{!!currentNetwork?.length && `[${currentNetwork.toUpperCase()}]`}</span>
            </div>
            <button title="Connect MetaMask" className="absolute right-6 top-6" onClick={connectWalletHandler}>
                <FaWallet size={30} />
            </button>
        </div>
    )
}
