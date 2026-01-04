import './MemberCard.css';
import default_user from '../../assets/default_user.png'


export default function MemberCard({username,role,email,onClick,photo=default_user}){
    return (
    <>
    <div className="members-card" onClick={onClick}>
        <div className="member-photo">
            <img src={photo} alt={username}/>
        </div>
        <div className="member-info">
            <p className="member-role">{role}</p>
            <p className="member-email">{username}</p>
        </div>
    </div>
    </>);
}