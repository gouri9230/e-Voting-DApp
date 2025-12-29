import { useRef } from "react";
import { useWallet } from '../../context/WalletContext';

const RegisterCandidate = () => {
    const { contract } = useWallet();
    const nameRef = useRef(null);
    const addressRef = useRef(null);

    const register = async (e) => {
        e.preventDefault();
        
        if (!contract) {
            alert("Please connect your wallet first!");
            return;
        }
        const name = nameRef.current.value;
        const address = addressRef.current.value;
        const candidate = await contract.registerCandidate(address, name);
        await candidate.wait();
        alert("Candidate registered successfully!");
    }

    return (
        <><form onSubmit={register}>
            <h2>Candidate Registration</h2>
            <div className="form">
                <label htmlFor ="address">Candidate address: </label>
                <input type= "text" placeholder="wallet address" ref={addressRef}/>
                <br/><br/>
                <label htmlFor="name">Candidate name: </label>
                <input type= "text" placeholder="name" ref={nameRef}/>
            </div>
            <button type="submit" className="btn btn-primary">Register</button>
        </form>
        </>
    )
}

export default RegisterCandidate;