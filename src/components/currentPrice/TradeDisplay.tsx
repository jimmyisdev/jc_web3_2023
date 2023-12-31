'use client'
import { useEffect, useState } from "react"
import { type CoinTransaction } from "@/interfaces/scokets_interface"
import { VscTriangleDown, VscTriangleUp } from "react-icons/vsc";
import Loading from "../shared/Display/Loading/Loading";

export default function TradeDisplay({ data }: { data: CoinTransaction | null }) {
    const [showMore, setShowMore] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        data?.currentPrice ? setIsLoading(false) : setIsLoading(true)
    }, [data?.currentPrice])
    return (
        <div className="mb-2">
            {
                isLoading ?
                    <Loading /> :
                    <div className="p-1 border-b-2 border-blue-300">
                        <div className="relative w-full">
                            <h2 className="font-bold">{`${data?.currentTradeSymbol} - ${data?.currentPrice}`} </h2>
                            <button className={`absolute  top-1 right-0  text-center ${showMore ? "text-red-700" : "text-slate-50"}`} onClick={() => setShowMore(!showMore)}>
                                {showMore ? <VscTriangleDown /> : <VscTriangleUp />}
                            </button>
                        </div>
                        {showMore &&
                            <div className='flex flex-col '>
                                <span>Time : {data?.currentTradeTime}</span>
                                <span>Quantity :  {data?.currentQty}</span>
                            </div>}
                    </div>
            }
        </div>
    )
}
