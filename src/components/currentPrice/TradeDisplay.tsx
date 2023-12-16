'use client'
import { useEffect, useState } from "react"
import { CoinTransaction } from "@/interfaces/scokets_interface"

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
                    <>
                        <div>
                            <h2>{`${data?.currentTradeSymbol} - ${data?.currentPrice}`} </h2>
                            <button className="w-full text-center text-blue-200" onClick={() => setShowMore(!showMore)}>
                                {showMore ? "Hide" : "Show"}
                            </button>
                        </div>
                        {showMore &&
                            <div className='flex flex-col '>
                                <span>Time : {data?.currentTradeTime}</span>
                                <span>Quantity :  {data?.currentQty}</span>
                            </div>
                        }
                    </>
            }
        </div>
    )
}
