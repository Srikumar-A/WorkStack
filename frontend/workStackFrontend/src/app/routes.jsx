import {Routes,Route} from 'react-router-dom';
import Login from '../features/auth/Login.jsx';
import Register from '../features/auth/Register.jsx';
import Dashboard from '../features/Dashboard/Dashboard.jsx';
import AccountPage from '../features/account/accountPage.jsx';
import Projects from '../features/Projects/Projects.jsx';
import Quests from '../features/Quests/Quests.jsx';
import Teams from '../features/Teams/Teams.jsx';
import OrganizationPage from '../features/Organization/Organization.jsx';
import Home from '../pages/Home/Home.jsx';

function AppRoutes(){
    return(
        <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='/register' element={<Register/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/Dashboard" element={<Dashboard/>}/>
            <Route path="/Account" element={<AccountPage/>}/>
            <Route path="/projects/:id?" element={<Projects/>}/>
            <Route path="/quests/:id?" element={<Quests/>}/>
            <Route path="/teams/:id?" element={<Teams/>}/>
            <Route path="/myOrg" element={<OrganizationPage/>}/>
        </Routes>
    );
}
export default AppRoutes;