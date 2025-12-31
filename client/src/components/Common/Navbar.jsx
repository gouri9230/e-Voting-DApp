import {Link} from 'react-router-dom';
import { useWallet } from '../../context/WalletContext';

const Navbar = () => {
    const { account, admin, connectWallet, disconnectWallet } = useWallet();
    const isAdmin = account && admin && account.toLowerCase() === admin.toLowerCase();
    return (
        <><nav id="navbar">
            <div className="logo">
                <h2>e-voting</h2>
                <h2>dApp</h2>
            </div>
            <ul id="nav-items">
                {account ? (<li><Link to="/">Home</Link></li>) : ""}
                {isAdmin && <li><Link to="/admin">Dashboard</Link></li>}
                {account && !isAdmin && <li><Link to="/user">Dashboard</Link></li>}
            </ul>
            {!account ? (<button className="btn btn-primary" onClick={connectWallet}>
              Connect Wallet
            </button>): (<button className="btn btn-primary" onClick={disconnectWallet}>
              Disconnect Wallet
            </button>)}
        </nav></>
    );
};

export default Navbar;