import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function Loading({ loadingMsg = "Loading..." }: { loadingMsg?: string }) {
    return (
        <div className='my-2 flex flex-row justify-center items-center '>
            <AiOutlineLoading3Quarters className="animate-spin" />
            <span className=' ml-1'>
                {loadingMsg}
            </span>
        </div>
    )
}
