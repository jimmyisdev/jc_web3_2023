'use client'
import { useEffect, useState } from "react";
import { MetaMaskInpageProvider } from '@metamask/providers';
import BasicInfo from "@/components/basicInfo/BasicInfo";
import CurrentPrice from "@/components/currentPrice/CurrentPrice";
import JverseAsset from "@/components/jverseAsset/JverseAsset";
import NoWallet from "@/components/shared/NoWallet/NoWallet";
import { useStateContext } from '@/contexts';
import BasicTransfer from "@/components/basicTransfer/BasicTransfer";

export default function Home() {
  const [errorMsg, setErrorMsg] = useState<string>('')
  const { setCurrentConnectedAddress } = useStateContext();
  async function connectWalletHandler() {
    if (window.ethereum) {
      const ethereum = window.ethereum as MetaMaskInpageProvider;
      ethereum.request({ method: 'eth_requestAccounts' }).then(result => {
        if (Array.isArray(result) && result.length) {
          setCurrentConnectedAddress(result[0])
        }
      }).catch((error) => {
        setErrorMsg(error)
        console.log(error)
      })
    } else {
      setErrorMsg("Need to install MetaMask")
    }
  }
  useEffect(() => {
    connectWalletHandler()
  }, [])
  return (
    <main className="flex min-h-screen flex-col items-start justify-between  ">
      <div className="w-screen flex flex-wrap p-3">
        <CurrentPrice />
        {!!errorMsg.length ? <NoWallet /> : <BasicInfo />}
        {!!errorMsg.length ? <NoWallet /> : <BasicTransfer />}
        {!!errorMsg.length ? <NoWallet /> : <JverseAsset />}
      </div>
    </main>
  )
}
