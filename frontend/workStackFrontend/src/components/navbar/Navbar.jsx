import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { logout } from '../../services/authService';
import {useNavigate} from 'react-router-dom';
import './Navbar.css'
function NavigationBar(){
    const navigate=useNavigate()
    const handleLogout=()=>{
        logout();
        navigate("/login",{replace:true});
    }
    return(
        <>
        <Navbar bg="primary" fixed="top" variant="dark">
        <Container fluid>
            <Navbar.Brand href="/Dashboard">WorkStack</Navbar.Brand>

            <Nav className="me-auto">
            <Nav.Link href="/Dashboard">Dashboard</Nav.Link>
            <Nav.Link href="/teams">Teams</Nav.Link>
            <Nav.Link href="/Account">Account</Nav.Link>
            <Nav.Link href="/myOrg">My Org</Nav.Link>
            </Nav>
            <Nav className="ms-auto align-items-right">
                <button className='logout-btn' onClick={handleLogout}>Logout</button>
            </Nav>
        </Container>
        </Navbar>
        </>
    );
}

export default NavigationBar;