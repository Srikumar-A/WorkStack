import NavigationBar from "../../components/navbar/Navbar";
import { useNavigate, useParams } from "react-router-dom";
import {use,useEffect,useState} from 'react';
import apiClient from "../../services/apiClient";
import './Projects.css'
import GanttChart from "../../components/navbar/GanttChart/GanttChart";
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

    useEffect(()=>{
        const fetchProjects=async ()=>{
            const response=await apiClient.get("projects/list/");
            setProjects(response.data);
            setFormData(response.data);
        }
        const fetchQuests=async ()=>{
            if(id){
              const response=await apiClient.get("quests/project-quests/"+String(id)+"/");
              setQuests(response.data);}
        }
        const fetchUserTeam=async()=>{
            const response1=await apiClient.get("teams/org/");
            setTeams(response1.data);
        }
        fetchProjects();
        fetchQuests();
        fetchUserTeam();
    },[])
    const selectedProject = projects.find(
        (p) => String(p.id) === String(id)
        );

    const ganttTasks=quests.map(mapQuestToGanttTask).filter(Boolean);
    const pendingQuests=quests.filter(quest=>quest.status==="pending").length;
    const completedQuests=quests.filter(quest=>quest.status==="completed").length;

    // functions for the buttons
    // save the project details in the backend
    const saveFunction=async()=>{
        const response=await apiClient.patch("/projects/"+String(selectedProject.id)+"/",formData);
        console.log(response.data);
    }
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData(prev => ({
                            ...prev,
                            [name]: value
                    }));
        };

    
    
    
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
            <h2>{selectedProject.name}   {selectedProject.status}</h2>

            <section className="gantt-wrapper">
                <GanttChart tasks={ganttTasks}/>
                {console.log(teams)}
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
                        value={formData.description}
                        onChange={handleChange}
                        />
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Start date</label>
                            <input
                            type="date"
                            defaultValue={selectedProject.start_date}
                            value={formData.start_date}
                            onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>End date</label>
                            <input
                            type="date"
                            defaultValue={selectedProject.end_date}
                            value={formData.end_date}
                            onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>
                            Team
                        </label>
                        <select 
                        defaultValue={selectedProject.team}
                        >
                            {teams.map(team=>(<option value={team.id} key={team.id}>{team.team_name}</option>))}
                        </select>
                    </div>
                    
              </div>
              <footer className="project-actions">
                <button className="btn-primary" onClick={saveFunction}>Save</button>
                <button className="btn-secondary">Cancel</button>
              </footer>
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
          <span className="metric-value">{quests.length===0?0:(completedQuests/quests.length)}%</span>
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
                (<li key={quest.id}>{quest.title}</li>)
            )}
          </ul>
        </section>
      </aside>
    </div>
</>);

}

export default Projects;