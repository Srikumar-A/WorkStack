import {Routes,Route} from 'react-router-dom';
import Login from '../features/auth/Login.jsx';
import Register from '../features/auth/Register.jsx';
import Dashboard from '../features/Dashboard/Dashboard.jsx';
import AccountPage from '../features/account/accountPage.jsx';

function AppRoutes(){
    return(
        <Routes>
            <Route path='/register' element={<Register/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/Dashboard" element={<Dashboard/>}/>
            <Route path="/Account" element={<AccountPage/>}/>
        </Routes>
    );
}
export default AppRoutes;