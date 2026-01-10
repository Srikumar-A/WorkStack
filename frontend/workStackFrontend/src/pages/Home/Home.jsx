import './Home.css';
import { useNavigate } from 'react-router-dom';
function Home(){
    const navigate=useNavigate();

    const handleBtn=(e)=>{
        navigate('/login');
    }
    return (
        <>
         <div class="container">
            <h1>WorkStack</h1>
            <p>
                A simple and structured way to track work, assign tasks, and keep teams aligned — 
                without unnecessary complexity.
            </p>

            <div class="actions">
                <button class="btn btn-primary" onClick={handleBtn}>Get Started</button>
                
            </div>

            <footer>
                 WorkStack. Built for focused teams.
            </footer>
        </div>
        </>
    );
}

export default Home;