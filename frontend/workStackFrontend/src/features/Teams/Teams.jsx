import NavigationBar from "../../components/navbar/Navbar";
import { useEffect, useState } from "react";
import "./Teams.css";
import apiClient from "../../services/apiClient";
import MemberCard from "../../components/MemberCard/MemberCard";
import MemberModal from "./MemberModal/MemberModal";

export default function Teams() {
  const [teams, setTeams] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [editing, setEditing] = useState(false);
  const [members,setMembers]=useState([]);

  //modal view for editing and adding members
  const [isMemberModalOpen,setIsMemberModalOpen]=useState(false);
  const [modalMode,setModalMode]=useState("add");
  const [selectedMember,setSelectedMember]=useState(null);

 
  useEffect(() => {
    const fetchTeams=async()=>{

      const response=await apiClient.get("teams/org/");
      setTeams(response.data);
    }
    fetchTeams();
  }, []);
  useEffect(()=>{
    const fetchMembers=async()=>{
      if(selectedTeam){
        if(selectedTeam.id){
        const response=await apiClient.get("teams/"+String(selectedTeam.id)+"/members/");
        setMembers(response.data);
      }}
    }
     fetchMembers();
  },[selectedTeam])

  const filteredTeams = teams.filter(t =>
    t.team_name.toLowerCase().includes(search.toLowerCase())
  );
  const handleSelectTeam = (team) => {
    setSelectedTeam(team);
    setEditing(false);
  };

  const handleAddTeam = () => {
    setSelectedTeam({
      id: null,
      name: "",
    });
    setEditing(true);
  };

  const handleChange = (e) => {
    setSelectedTeam({
      ...selectedTeam,
      [e.target.name]: e.target.value
    });
  };
  const CreateTeam=async()=>{
    console.log(selectedTeam.team_name);
    const response=await apiClient.post("teams/",{team_name:selectedTeam.team_name});
  }

  const handleSave = () => {
    if (selectedTeam.id) {
      // UPDATE
      setTeams(teams.map(t => t.id === selectedTeam.id ? selectedTeam : t));
    } else {
      // CREATE
      CreateTeam();

    }
    setEditing(false);


  };
  const openAddMembermodal=()=>{
    setModalMode("add");
    setSelectedMember(null);
    setIsMemberModalOpen(true);
  }
  const openEditMemberModal = (member) => {
  setModalMode("edit");
  setSelectedMember(member);
  setIsMemberModalOpen(true);
};


  return (
    <>
    <NavigationBar/>
    <MemberModal
    isOpen={isMemberModalOpen}
    mode={modalMode}
    teamId={selectedTeam}
    member={selectedMember}
    onClose={()=>setIsMemberModalOpen(false)}
    />
    <div className="teams-page">

      {/* LEFT COLUMN */}
      <div className="teams-sidebar">
        <div className="teams-header">
          <h3>Teams</h3>
          <button className="add-btn" onClick={handleAddTeam}>
            + Add Team
          </button>
        </div>

        <input
          type="text"
          placeholder="Search teams..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />

        <ul className="teams-list">
          {filteredTeams.map(team => (
            <li
              key={team.id}
              className={selectedTeam?.id === team.id ? "active" : ""}
              onClick={() => handleSelectTeam(team)}
            >
              {team.team_name}
            </li>
          ))}
        </ul>
      </div>

      {/* RIGHT COLUMN */}
      <div className="teams-content">
        {!selectedTeam ? (
          <div className="empty-state">
            <p>Select a team to view details</p>
          </div>
        ) : (
          <>
            <div className="team-details-header">
              <h3>{editing ? "Edit Team" : "Team Details"}</h3>

              {!editing && (
                <button className="edit-btn" onClick={() => setEditing(true)}>
                  Edit
                </button>
              )}
            </div>

            <div className="team-form">
              <label>Name</label>
              <input
                type="text"
                name="team_name"
                value={selectedTeam.team_name}
                onChange={handleChange}
                disabled={!editing}
              />
            </div>

            {/* MEMBERS SECTION  */}
            <div className="team-members">
              <div className="members-header">
              <h4 className="member-label">Members</h4>
              <button className="add-member-btn" onClick={()=>openAddMembermodal()}>Add Member</button>
              </div>
              <div className="members-list">
                {members.map((member)=>(
                  <MemberCard
                  key={member.id}
                  member={member}
                  onClick={
                    ()=>openEditMemberModal(member)
                  }/>
                ))}
              </div>
              
            </div>

            {editing && (
              <div className="actions">
                <button className="save-btn" onClick={handleSave}>
                  Save
                </button>
                <button
                  className="cancel-btn"
                  onClick={() => setEditing(false)}
                >
                  Cancel
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div></>
  );
}
