'use client'
import { useStateContext } from '@/contexts';
import { FaWallet } from "react-icons/fa6";
export default function Header() {
    const { currentNetwork, connectWalletHandler } = useStateContext();
    return (
        <div className='relative text-center  flex flex-wrap justify-between p-3 align-middle'>
            <div className='flex flex-row items-center'>
                <h1 className='text-4xl mr-5'>JVERSE  </h1>
                <span>{!!currentNetwork?.length && `[${currentNetwork.toUpperCase()} NETWORK]`}</span>
            </div>
            <button title="Connect MetaMask" className="absolute right-6 top-6" onClick={connectWalletHandler}>
                <FaWallet size={30} />
            </button>
        </div>
    )
}
