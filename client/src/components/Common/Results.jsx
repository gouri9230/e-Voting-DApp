import { useWallet } from "../../context/WalletContext";
import {useEffect, useState} from 'react';

const Results = () => {
    const {contract, currentPhase} = useWallet();
    const [winner, setWinner] = useState(null);

    useEffect(() => {
        const results = async () => {
            if (!contract) return;
            if (currentPhase == 2) {
                const result = await contract.declareWinner();
                setWinner(result);
            }
        }
        results();
    }, [currentPhase, contract])
    

    return (<> <div>
    <h4>Winner</h4>
    {!winner ? <p>Results will be declared once voting ends.</p> : winner}
    </div>
    </>)
}

export default Results;