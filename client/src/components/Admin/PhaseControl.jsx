import { useWallet } from '../../context/WalletContext';
import { useRef } from 'react';

const PhaseControl = () => {
    const {contract} = useWallet();
    const valueRef = useRef(null);

    const ChangePhase = async (e) => {
        e.preventDefault();
        if(!contract) return;

        const value = valueRef.current.value;
        console.log(value);
        const phase = await contract.changePhase(value);
        await phase.wait();
        alert("Election phase changed!");
    }

    return (<>
        <form onSubmit={ChangePhase}>
        <div className='phase-control'>
            <h4 className='header-text'>Change Election Phase</h4>
            <label>Choose phase:</label>
            <select ref={valueRef}>
                <option value="0">Registration</option>
                <option value="1">Voting</option>
                <option value="2">Ended</option>
            </select>
            <input type="submit" className="btn btn-primary"></input>
        </div>
        </form>
    </>)

}

export default PhaseControl;