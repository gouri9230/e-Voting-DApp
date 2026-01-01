import { useWallet } from "../../context/WalletContext";
import {useEffect, useState} from 'react';

const Results = () => {
    const {contract, currentPhase, readOnlyContract} = useWallet();
    const [winner, setWinner] = useState(null);
    const contractToUse = contract ?? readOnlyContract;

    useEffect(() => {
        const results = async () => {
            if (!contractToUse) return;
            if (currentPhase === 2) {
                const result = await contractToUse.declareWinner();
                setWinner(result);
            }
        }
        results();
    }, [currentPhase, contract])
    

    return (<> <div>
    <h4>Winner</h4>
    {!winner ? null : winner}
    </div>
    </>)
}

export default Results;