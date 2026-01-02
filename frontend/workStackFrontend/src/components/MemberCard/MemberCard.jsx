import './MemberCard.css'



export default function MemberCard({member,onClick}){
    return (
    <>
    <div className="members-card" onClick={onClick}>
        <div className="member-photo">
            <img src={ member.photo} alt={member.user.username}/>
        </div>
        <div className="member-info">
            <p className="member-role">{member.role}</p>
            <p className="member-email">{member.user.email}</p>
        </div>
    </div>
    </>);
}