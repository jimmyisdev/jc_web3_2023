'use client'
import Box from '../shared/Box/Box'
import BoxHeader from '../shared/Box/BoxHeader'
import { useStateContext } from '@/contexts';
import Loading from '../shared/Loading/Loading';
import TokenItem from '../shared/Display/Token/TokenItem';
export default function JverseAsset() {
    const {
        isLoadingToken, userTokens, getTokenErrorMsg,
    } = useStateContext();
    return (
        <Box>
            <div >
                <BoxHeader headerText={`JVERSE Asset`} />
                <div className='h-52 overflow-scroll '>
                    <div className='p-1 mb-2 '>
                        <h1 className='font-bold'>Token - ERC20 </h1>
                        {isLoadingToken ? <Loading /> : (
                            userTokens.filter(item => item.isJverseAsset).map(item => {
                                return (
                                    <TokenItem key={item.tokenAddress} data={item} />
                                )
                            }))}
                        {!isLoadingToken && !!getTokenErrorMsg?.length && (
                            <span>{getTokenErrorMsg}</span>
                        )}
                    </div>
                    <div className='p-1 mb-2 '>
                        <h1 className='font-bold'>NFT - ERC721 </h1>
                        <span>Release soon!</span>
                    </div>
                </div>
            </div>
        </Box>
    )
}
