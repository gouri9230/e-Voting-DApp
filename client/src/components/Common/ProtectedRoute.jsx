import { Navigate } from "react-router-dom";
import { useWallet } from "../../context/WalletContext";

const ProtectedRoute = ({children, role}) => {

    const {admin, account} = useWallet();

    if (!account) {
        return <Navigate to='/'/>;
    }
    // decides whether to show the children page 
    // (for role=admin, children = AdminDashboard, but account = user so child page is restricted & redirect to user page)
    if (role === "admin" && account.toLowerCase() !== admin.toLowerCase()) {
        return <Navigate to='/user'/>;
    }
    
    if (role === "user" && account.toLowerCase() === admin.toLowerCase()) {
        return <Navigate to='/admin'/>;
    }

    return children;
};

export default ProtectedRoute;