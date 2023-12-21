'use client'
import Box from '../shared/Box/Box';
import { useStateContext } from '@/contexts';
import { NETWORKS } from '@/constants/network';
import BoxHeader from '../shared/Box/BoxHeader';

export default function SettingPanel() {
    const { sender, currentNetwork, setCurrentNetwork, currentConnectedAccounts, setSender } = useStateContext();
    return (
        <Box>
            <div>
                <BoxHeader headerText="setting panel" />
                <div className='mb-3'>
                    <div className='w-full mb-3 flex flex-col'>
                        <label className='font-bold mb-1'>Select Network</label>
                        <select
                            className='text-blue-900'
                            value={currentNetwork}
                            onChange={(e) =>
                                setCurrentNetwork(e.target.value)
                            }>
                            {NETWORKS.map(item => {
                                return (
                                    <option key={item.CURRENT_NETWORK} value={item.CURRENT_NETWORK}>{item.CURRENT_NETWORK.toUpperCase()}</option>
                                )
                            })}
                        </select>
                    </div>
                    <div className='w-full mb-3 flex flex-col'>
                        <label className='font-bold mb-1'>Select Account</label>
                        <select
                            className='text-blue-900'
                            value={sender}
                            onChange={(e) => setSender(e.target.value)}>
                            {currentConnectedAccounts.map(item => {
                                return (
                                    <option key={item} value={item}>{`${item.slice(0, 15)}`}</option>
                                )
                            })}
                        </select>
                    </div>
                </div>
            </div>
        </Box>
    )
}
