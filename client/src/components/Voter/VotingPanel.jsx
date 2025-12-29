import { useWallet } from "../../context/WalletContext";
import { useState, useEffect, useRef } from "react";

const VotingPanel = () => {
    const {account, contract, currentPhase} = useWallet();
    const candidateRef = useRef(null);
    const [candidates, setCandidates] = useState([]);
    const [hasVoted, setHasVoted] = useState(false);

    const Vote = async (e) => {
        e.preventDefault();
        if (!contract) return;
        try {
            const candidate = candidateRef.current.value;
            const candidates = await contract.getCandidates();
            const candidateId = candidates.findIndex((c) => c.name.toLowerCase() === candidate.toLowerCase());
            if (candidateId === -1) {
                alert("Candidate not found!");
                return;
            }
            const vote = await contract.vote(candidateId);
            await vote.wait();
            setHasVoted(true);
            alert("Vote cast successfully!");
            const updatedCandidates = await contract.getCandidates();
            setCandidates(updatedCandidates);
        } catch(error) {
            alert(error.reason || "Failed to vote!")
        }
    }

    useEffect(()=>{
        const fetchData = async() => {
            if (!contract || !account) return;
            const candidatesList = await contract.getCandidates();
            setCandidates(candidatesList);
            const voted = await contract.hasVoted(account);
            setHasVoted(voted);
        };
        fetchData();
    }, [contract, account]);

    return (<><h3>Give your Vote here</h3>
    <form onSubmit={Vote}> 
        <label>Enter Candidate name:</label><br></br>
        <input type="text" placeholder="candidate name" ref={candidateRef}></input><br></br>
        <input type="submit" value={hasVoted ? "Already Voted" : "Vote"} disabled={currentPhase!==1 || hasVoted}></input> 
    </form>
    </>)
}

export default VotingPanel;