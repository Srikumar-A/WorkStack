import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';


function NavigationBar(){
    return(
        <>
        <Navbar bg="primary" fixed="top" variant="dark">
        <Container>
            <Navbar.Brand href="/Dashboard">WorkStack</Navbar.Brand>
            <Nav className="me-auto">
            <Nav.Link href="/Dashboard">Dashboard</Nav.Link>
            <Nav.Link href="/teams">Teams</Nav.Link>
            <Nav.Link href="/Account">Account</Nav.Link>
            <Nav.Link href="/logout">Logout</Nav.Link>
            </Nav>
        </Container>
        </Navbar>
        </>
    );
}

export default NavigationBar;