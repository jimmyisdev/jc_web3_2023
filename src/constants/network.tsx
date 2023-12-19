import { Network, Alchemy } from 'alchemy-sdk';

export const NETWORKS = [
    {
        CURRENT_NETWORK: "homestead",
        ALCHEMY_NETWORK: Network.ETH_MAINNET
    },
    {
        CURRENT_NETWORK: "goerli",
        ALCHEMY_NETWORK: Network.ETH_GOERLI
    },
    {
        CURRENT_NETWORK: "sepolia",
        ALCHEMY_NETWORK: Network.ETH_SEPOLIA
    },
]
