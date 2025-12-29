import { useWallet } from "../../context/WalletContext";
import {useEffect, useState} from 'react';

const Results = () => {
    const {contract} = useWallet();
    const [winner, setWinner] = useState(null);

    useEffect(() => {
        const results = async () => {
            if (!contract) return;

            const result = await contract.declareWinner();
            setWinner(result);
        }
        results();
    }, [contract])
    

    return (<> <h4>Election Winner</h4>
    {!winner ? null : winner}
    </>)
}

export default Results;