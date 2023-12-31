export default function TextBtn({ handleBtn, disabledStatus, btnText = "Confirm" }: { handleBtn: () => void, disabledStatus: boolean, btnText: string }) {
    return (
        <button className='font-bold hover:font-black duration-300' onClick={handleBtn} disabled={disabledStatus}>
            {btnText}
        </button>)
}
