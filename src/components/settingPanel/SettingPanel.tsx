'use client'
import Box from '../shared/Box/Box';
import { useStateContext } from '@/contexts';
import { NETWORKS } from '@/constants/network';
import BoxHeader from '../shared/Box/BoxHeader';

export default function SettingPanel() {
    const { setCurrentNetwork } = useStateContext();
    return (
        <Box>
            <div>
                <BoxHeader headerText="setting panel" />
                <div className='mb-3'>
                    <h1>Select Network</h1>
                    <select name="pets" id="pet-select" onChange={(e) => setCurrentNetwork(e.target.value)}>
                        <option value="sepolia">Choose Network</option>
                        {NETWORKS.map(item => {
                            return (
                                <option key={item.name} value={item.network}>{item.name}</option>
                            )
                        })}
                    </select>
                </div>
            </div>
        </Box>
    )
}
