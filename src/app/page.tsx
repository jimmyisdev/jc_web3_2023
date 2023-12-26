'use client'
import BasicInfo from "@/components/basicInfo/BasicInfo";
import CurrentPrice from "@/components/currentPrice/CurrentPrice";
import JverseAsset from "@/components/jverseAsset/JverseAsset";
import NoWallet from "@/components/shared/NoWallet/NoWallet";
import { useStateContext } from '@/contexts';
import BasicTransfer from "@/components/basicTransfer/BasicTransfer";
import SettingPanel from "@/components/settingPanel/SettingPanel";
import Image from "next/image";
import { relevantsLogo } from "@/constants/utils";
import Marquee from "react-fast-marquee";
import JverseFaucet from "@/components/jverseFaucet/JverseFaucet";
import { useEffect } from "react";

export default function Home() {
  const { connectErrorMsg, connectWalletHandler } = useStateContext();
  useEffect(() => {
    connectWalletHandler()
  }, [])

  return (
    <main className="flex min-h-screen flex-col items-start ">
      <div className="w-screen flex flex-wrap p-3 justify-around ">
        <CurrentPrice />
        {!!connectErrorMsg?.length ? <NoWallet errMsg={connectErrorMsg} /> : <SettingPanel />}
        {!!connectErrorMsg?.length ? <NoWallet errMsg={connectErrorMsg} /> : <BasicInfo />}
        {!!connectErrorMsg?.length ? <NoWallet errMsg={connectErrorMsg} /> : <JverseAsset />}
        {!!connectErrorMsg?.length ? <NoWallet errMsg={connectErrorMsg} /> : <BasicTransfer />}
        {!!connectErrorMsg?.length ? <NoWallet errMsg={connectErrorMsg} /> : <JverseFaucet />}
      </div>
      <div className="w-screen flex flex-row flex-wrap justify-around">
        <Marquee pauseOnHover={true}>
          {relevantsLogo.map(item => {
            return (
              <div key={item} className="flex flex-col items-center justify-center m-5">
                <Image src={`/${item}.png`} height={300} width={300} alt={item} className="z-5" />
              </div>
            )
          })}
        </Marquee>

      </div>
    </main>
  )
}

