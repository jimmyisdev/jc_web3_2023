import { ETHERSCAN_URL } from "@/constants/utils";
import { TbHandFinger } from "react-icons/tb";

function EtherscanLink({ id, type, network }: { id: string, type: string, network: string }) {
    const link = ETHERSCAN_URL(network, type) + id;
    return (
        <a href={link} target="_blank">
            <span className={`flex flex-rol justify-center items-center`}>
                <span>{type.toUpperCase()}: {id.slice(0, 15)}...</span>
                <TbHandFinger />
            </span>
        </a>
    )
}
export default EtherscanLink