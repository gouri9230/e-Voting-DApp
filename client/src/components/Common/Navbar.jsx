import {Link} from 'react-router-dom';
import { useWallet } from '../../context/WalletContext';

const Navbar = () => {
    const { account, admin } = useWallet();
    const isAdmin = account && admin && account.toLowerCase() === admin.toLowerCase();
    return (
        <>
            <Link to="/">Home</Link><br/>
            {isAdmin && <Link to="/admin">Admin</Link>}<br/>
            {account && !isAdmin && <Link to="/user">Voter</Link>}
        </>
    );
};

export default Navbar;