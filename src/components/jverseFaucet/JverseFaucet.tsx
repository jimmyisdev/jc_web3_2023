
'use client'
import React, { useEffect, useState } from 'react'; import BoxHeader from '../shared/Box/BoxHeader'
import Box from '../shared/Box/Box'
import { useStateContext } from '@/contexts';

export default function JverseFaucet() {
    const { sender, receiver, setReceiver, userTokens, transferToken } = useStateContext();

    function handleConfirmBtn() {
        transferToken()
    }

    return (
        <Box>
            <div className='flex flex-col min-h-full align-center'>
                <BoxHeader headerText={`Get Jverse Token`} />
                <div className='h-52 overflow-scroll '>
                    <div className='flex flex-col mb-2'>
                        <span>Send</span>
                        <span>1 JTT token</span>
                    </div>
                    <div className='flex flex-col mb-2'>
                        <span>TO</span>
                        <span>{sender?.length ? `${sender.slice(0, 25)}.....` : "Please select account in setting panel"}</span>
                    </div>
                    <div className='flex flex-col'>
                        {/* {!!transferError.length && <span className='text-red-700'>{transferError}</span>} */}
                        <button onClick={handleConfirmBtn}>
                            Confirm
                        </button>
                    </div>
                </div>
            </div>
        </Box>
    )

}
