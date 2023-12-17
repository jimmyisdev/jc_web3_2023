'use client'
import BasicInfo from "@/components/basicInfo/BasicInfo";
import CurrentPrice from "@/components/currentPrice/CurrentPrice";
import JverseAsset from "@/components/jverseAsset/JverseAsset";
import NoWallet from "@/components/shared/NoWallet/NoWallet";
import { useStateContext } from '@/contexts';
import BasicTransfer from "@/components/basicTransfer/BasicTransfer";
import SettingPanel from "@/components/settingPanel/SettingPanel";
import Image from "next/image";
import { relevantsLogo } from "@/constants/relevantsLogo";

export default function Home() {
  const { connectErrorMsg } = useStateContext();
  return (
    <main className="flex min-h-screen flex-col items-start ">
      <div className="w-screen flex flex-wrap p-3 justify-around ">
        <CurrentPrice />
        {!!connectErrorMsg?.length ? <NoWallet errMsg={connectErrorMsg} /> : <SettingPanel />}
        {!!connectErrorMsg?.length ? <NoWallet errMsg={connectErrorMsg} /> : <BasicInfo />}
        {!!connectErrorMsg?.length ? <NoWallet errMsg={connectErrorMsg} /> : <BasicTransfer />}
        {!!connectErrorMsg?.length ? <NoWallet errMsg={connectErrorMsg} /> : <JverseAsset />}
      </div>
      <div className="w-screen flex flex-row flex-wrap justify-around p-3">
        {relevantsLogo.map(item => {
          return (
            <div key={item} className="flex flex-col items-center justify-center my-3">
              <Image src={`/${item}.png`} height={300} width={300} alt={item} className="z-5" />
            </div>
          )
        })}
      </div>
    </main>
  )
}
