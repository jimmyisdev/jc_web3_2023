export const relevantsLogo = ['binance', 'metamask', 'ethereum', 'alchemy', "nextjs", "ethersjs"]

//URL etherscan
export const SEPOLIA_ETHERSCAN = "https://sepolia.etherscan.io/"
export const GOERLI_ETHERSCAN = "https://goerli.etherscan.io/"
export const MAINNET_ETHERSCAN = "https://etherscan.io/"

export const ETHERSCAN_URL = (network: string, type: string) => {
    switch (network) {
        case "sepolia":
            return ETHERSCAN_TYPE(type, SEPOLIA_ETHERSCAN);
        case "goerli":
            return ETHERSCAN_TYPE(type, GOERLI_ETHERSCAN);
        case "homestead":
            return ETHERSCAN_TYPE(type, MAINNET_ETHERSCAN);
        default:
            return ETHERSCAN_TYPE(type, SEPOLIA_ETHERSCAN);
    }
}
export const ETHERSCAN_TYPE = (type: string, url: string) => {
    if (type === "address") {
        return SEPOLIA_ETHERSCAN + "address/";
    } else if (type === 'transaction') {
        return SEPOLIA_ETHERSCAN + "tx/";
    } else {
        return
    }
}