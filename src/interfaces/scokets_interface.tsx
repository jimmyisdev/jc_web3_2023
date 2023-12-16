import { Socket } from "@/utils/socket/Socket";

interface CoinTransaction {
    currentPrice: number | string | null,
    currentQty: number | string | null,
    currentTradeTime: number | string | null,
    currentTradeSymbol: number | string | null,
}
interface BinanceSocketData {
    E?: number | string | null,
    M?: number | string | null,
    T?: number | string | Date,
    a?: number | string | null,
    e?: number | string | null,
    f?: number | string | null,
    l?: number | string | null,
    m?: number | string | null,
    p?: number | string | null,
    q?: number | string | null,
    s?: number | string | null,
}
interface socketsContextValue {
    ethSingleTransaction: CoinTransaction | null,
    btcSingleTransaction: CoinTransaction | null,
    setEthSingleTransaction: React.Dispatch<React.SetStateAction<CoinTransaction | null>>,
    setBtcSingleTransaction: React.Dispatch<React.SetStateAction<CoinTransaction | null>>,
    connectSocket: (pairs: string) => Socket,
    processSocketData: (data: BinanceSocketData, updateFunc: Function) => void
}
export type { CoinTransaction, BinanceSocketData, socketsContextValue }