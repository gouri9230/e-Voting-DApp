import './App.css';
import Home from './components/pages/Home';
import AdminDashboard from './components/pages/AdminDashboard';
import VoterDashboard from './components/pages/VoterDashboard';
import WalletProvider from './context/WalletContext';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProtectedRoute from './components/Common/ProtectedRoute';
import Header from './components/Common/Header';

const router = createBrowserRouter([
  {path:'/', element: <Header/>, children: [
    {index:true, element: <Home/>},
    {path:'/admin', element: (
    <ProtectedRoute role="admin">
      <AdminDashboard/>
    </ProtectedRoute>)
  },

  {path:'/user', element: (
    <ProtectedRoute role="user">
      <VoterDashboard/>
    </ProtectedRoute>)
  }
  ]},
  ]);

function App() {
  
  return (<>
    <WalletProvider>
      <RouterProvider router={router}/>
    </WalletProvider>
  </>);
}

export default App;
