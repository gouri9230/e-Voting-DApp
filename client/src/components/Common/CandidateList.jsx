import { useState, useEffect } from "react";
import { useWallet } from '../../context/WalletContext';

const CandidateList = () => {
    const [candidates, setCandidates] = useState([]);
    const { readOnlyContract } = useWallet();

    useEffect(() => {
        const getCandidates = async () => {
            console.log("readOnlyContract:", readOnlyContract);
            if (!readOnlyContract) return;

            const candidates = await readOnlyContract.getCandidates();
            setCandidates(candidates);
        };
        
        getCandidates();
    }, [readOnlyContract]);
    
    return (
        <>
        <h4>Candidates List</h4>
        {candidates.length === 0 ? (<p>No candidates registered yet!</p>) : 
            (<><table>
                <thead>
                    <tr>
                        <th>Candidate Name</th>
                        <th>Candidate Address</th>
                        <th>Candidate Votes</th>
                    </tr>
                </thead>
                <tbody>
                {candidates.map((candidate, idx) => (
                <tr key={idx}>
                    <td>{candidate.candidateAddress}</td>
                    <td>{candidate.name}</td>
                    <td>{candidate.voteCount}</td>
                </tr>
                ))}
                </tbody>
            </table></>)}
        </>
    )
};

export default CandidateList;