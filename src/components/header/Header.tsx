'use client'
import { useStateContext } from '@/contexts';
export default function Header() {
    const { currentNetwork, connectWalletHandler } = useStateContext();
    return (
        <div className='text-center  flex flex-wrap justify-between	 p-3 align-middle'>
            <h1 className='text-4xl'>JVERSE  {!!currentNetwork?.length && `[${currentNetwork.toUpperCase()} NETWORK]`}</h1>
            <div>
                <button onClick={connectWalletHandler}>Connect Wallet</button>
            </div>
        </div>
    )
}
