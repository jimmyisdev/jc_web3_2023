'use client'
import { useEffect, useState } from "react"
import { CoinTransaction } from "@/interfaces/scokets_interface"
import { VscTriangleDown, VscTriangleUp } from "react-icons/vsc";

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
                    <span>Loading...</span> :
                    <div className="p-1 border-b-2 border-blue-300">
                        <div className="relative w-full">
                            <h2>{`${data?.currentTradeSymbol} - ${data?.currentPrice}`} </h2>
                            <button className="absolute  top-1 right-1  text-center text-blue-400" onClick={() => setShowMore(!showMore)}>
                                {showMore ? <VscTriangleDown /> : <VscTriangleUp />}
                            </button>
                        </div>
                        {showMore &&
                            <div className='flex flex-col '>
                                <span>Time : {data?.currentTradeTime}</span>
                                <span>Quantity :  {data?.currentQty}</span>
                            </div>
                        }
                    </div>
            }
        </div>
    )
}
