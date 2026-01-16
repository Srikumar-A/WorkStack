import NavigationBar from "../../components/navbar/Navbar";
import { useNavigate, useParams } from "react-router-dom";
import {use,useEffect,useState} from 'react';
import apiClient from "../../services/apiClient";
import './Projects.css'
import GanttChart from "../../components/GanttChart/GanttChart";
import { mapQuestToGanttTask } from "./mapQuestToGanttTask";
import CreateProjectModal from "./CreateProjectModal/CreateProjectModal";
function Projects(){
    const {id}=useParams();
    const [projects,setProjects]=useState([]);
    const navigate=useNavigate();
    const [quests,setQuests]=useState([]);
    const [formData,setFormData]=useState({
        name:"",
        description:"",
        start_date:"",
        end_date:"",
        team:""
    });
    const [teams,setTeams]=useState([]);
    const [showCreateModal,setShowCreateModal]=useState(false);
    const [editable,setEditable]=useState(false);
    const [access, setAccess]=useState(false);

    // retrieve project list
    useEffect(()=>{
        const fetchProjects=async ()=>{
            const response=await apiClient.get("projects/list/");
            setProjects(response.data);
        }
      fetchProjects();
      },[])
    
    //get query for the selected project  
    useEffect(()=>{
        const fetchQuests=async ()=>{
            if(id){
              const response=await apiClient.get("quests/project-quests/"+String(id)+"/");
              setQuests(response.data);}
        }
      fetchQuests();
      },[id])
    useEffect(()=>{
      const fetchUserPerms=async()=>{
        if(id){
          const response=await apiClient.get("projects/permissions/"+String(id)+"/");
          setAccess(response.data["access"]);
          console.log(response.data);
        }
      }
      fetchUserPerms();
    },[id])  


    //get the teams available in the organization  
    useEffect(()=>{
        const fetchUserTeam=async()=>{
            const response1=await apiClient.get("teams/org/");
            setTeams(response1.data);
        }
        fetchUserTeam();
    },[])
    


    const selectedProject = projects.find(
        (p) => String(p.id) === String(id)
        );
    //setting the state of the selected project and form to display the selected project.    
    useEffect(()=>{
      const func=()=>{
        if(selectedProject && !editable){
          setFormData(selectedProject);
        }
      }
      func();
    
    },[editable,selectedProject])

    const ganttTasks=quests.map(mapQuestToGanttTask).filter(Boolean);
    const pendingQuests=quests.filter(quest=>quest.status==="pending").length;
    const completedQuests=quests.filter(quest=>quest.status==="completed").length;

    // functions for the buttons
    // save the project details in the backend
    const saveFunction=async()=>{
        const response=await apiClient.patch("/projects/"+String(selectedProject.id)+"/",formData);
        setEditable(!editable);
    }
    const delFunction=async()=>{
      const response=await apiClient.delete("/projects/"+String(selectedProject.id)+"/");
      setFormData();
    }
    const handleChange = (e) => {
    setFormData({
      ...selectedProject,
      [e.target.name]: e.target.value
    });
  };
    const toggleEdit=(e)=>{
      setEditable(!editable);
    }

    
    
    
    return(<>
    <NavigationBar/>
    <CreateProjectModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        />

    <div className="projects-page">
      {/* LEFT: Project List */}
      <aside className="projects-sidebar">
        <div className="project-list-top">
        <h3>Projects</h3>
        <ul>
          {projects.map((p) => (
            <li
              key={p.id}
              className={selectedProject?.id === p.id ? "active" : ""}
              onClick={() => navigate(`/projects/${p.id}`)}
            >
              <span className="project-name">{p.name}</span>
              <span className="project-status">{p.status}</span>
            </li>
          ))}
        </ul>
        </div>
        <footer className="create-project">
        <button className="btn-primary" onClick={()=>setShowCreateModal(true)}>+ Create Project</button>
        </footer>
      </aside>

      {/* CENTER: Project Details */}
      <main className="projects-main">
        {!selectedProject ? (
          <div className="empty-state">
            <h2>Select a project</h2>
            <p>Choose a project from the left to view details</p>
          </div>
        ) : (
          <>
            <div className="project-header">
                <div className="project-header-left">
                    <h2 className="project-title">{selectedProject.name}</h2>
                    <span className={`project-status ${selectedProject.status}`}>
                        {selectedProject.status}
                    </span>
                 </div>

                <div className="project-header-actions">
                <button className="btn-danger" onClick={delFunction}>
                    Delete
                </button>
                </div>
              </div>


            <section className="gantt-wrapper">
                <GanttChart tasks={ganttTasks}/>
            </section>
            <section className="project-section">
                {/* Meta data immutable kind*/ }
              <div className="project-meta">
                    <div className="meta-item">
                        <span className="label">Owner</span>
                        <span className="value">{selectedProject.created_by}</span>
                    </div>
                    <div className="meta-item">
                        <span className="label">Created on</span>
                        <span className="value">{selectedProject.created_at}</span>
                    </div>
              </div>
              {/* data mutable kind*/ }
              <div className="project-form">
                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                        rows="2"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        disabled={!editable}
                        />
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Start date</label>
                            <input
                            name="start_date"
                            type="date"
                            value={formData.start_date}
                            onChange={handleChange}
                            disabled={!editable}
                            />
                        </div>
                        <div className="form-group">
                            <label>End date</label>
                            <input
                            name="end_date"
                            type="date"
                            value={formData.end_date}
                            onChange={handleChange}
                            disabled={!editable}
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>
                            Team
                        </label>
                        <select 
                        name="team"
                        value={formData.team}
                        disabled={!editable}
                        onChange={handleChange}
                        ><option value={0} key={0}>NA</option>
                            {teams.map(team=>(<option value={team.id} key={team.id}>{team.team_name}</option>))}
                        </select>
                    </div>
                    
              </div>
              {access?
                <footer className="project-actions">
                  {editable?<>
                    <button className="btn-primary" onClick={saveFunction}>Save</button>
                    <button className="btn-secondary" onClick={toggleEdit}>Cancel</button></>
                    :
                    <><button className="btn-primary" onClick={toggleEdit}>Edit</button></>}
                
                    </footer>
                    :
                    <></>
              }
            </section>
          </>
        )}
      </main>

      {/* RIGHT: Metrics & Tasks */}
      <aside className="projects-metrics">
        <h3>Metrics</h3>

        <div className="metric-card">
          <span className="metric-value">{quests.length-(completedQuests+pendingQuests)}</span>
          <span className="metric-label">Open Quests</span>
        </div>

        <div className="metric-card">
          <span className="metric-value">{quests.length===0?0:(completedQuests/quests.length)*100}%</span>
          <span className="metric-label">Progress</span>
        </div>
        <div className="metric-card">
          <span className="metric-value">{pendingQuests}</span>
          <span className="metric-label">Pending Quests</span>
        </div>
    

        <section className="tasks-preview">
          <h4>Recent Quests</h4>
          <ul>
            {quests.map(quest=>
                (<li key={quest.id} onClick={()=>navigate(`/quests/${selectedProject.id}`)} style={{cursor:"pointer"}}>{quest.title}</li>)
            )}
          </ul>
        </section>
      </aside>
    </div>
</>);

}

export default Projects;