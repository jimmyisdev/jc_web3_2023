import { MdError } from "react-icons/md";

export default function ErrorMsg({ errMsg = "Error occured" }: { errMsg?: string }) {
    return (
        <div className='my-2 flex flex-row justify-center items-center text-red-700'>
            <MdError />
            <span className='text-red-700 ml-1'>
                {errMsg}
            </span>
        </div>
    )
}
