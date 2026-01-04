import NavigationBar from "../../components/navbar/Navbar";
import "./Dashboard.css";
import { useState,useEffect,use } from "react";
import apiClient from "../../services/apiClient";
import { useNavigate } from "react-router-dom";

function Dashboard(){
    const navigate=useNavigate();
    const [projects,setProjects]=useState([]);
    const [quests,setQuests]=useState([]);
    const [questAssigned,setQuestAssigned]=useState([]);

    useEffect(()=>{
    const fetchProject=async()=>{
        try{
            const response = await apiClient.get("projects/list/");
            setProjects(response.data);
        }catch(err){
            console.log(err);
        }
    }

    const fetchQuests=async()=>{
        try{
            const response=await apiClient.get("quests/");
            setQuests(response.data)
        }catch(err){
            console.log(err);
        }
    }

    const fetchQuestAssigned=async()=>{
        try{
            const response=await apiClient.get("quests/quest-assignee/");
            setQuestAssigned(response.data)
        }catch(err){
            console.log(err);
        }
    }
  
    fetchProject();
    fetchQuests();
    fetchQuestAssigned();
    },[])
    
    return(
     <>   
    <NavigationBar />
    <br/>
  <div className="dashboard">

    <div className="dashboard-top">

      <div className="panel">
        <h3 onClick={
            ()=>navigate("/projects")}
            style={{cursor:"pointer"}}>
                Projects</h3>
        <ul>
          {projects.length==0?"Patience you will get a project soon.":
            projects.map(
                project=>(
                    <li key={project.id} 
                    onClick={()=>navigate(`/projects/${project.id}`)}>
                        {project.name}
                    </li>
                )
            )
          }
        </ul>
      </div>

      <div className="panel">
        <h3>My Quests</h3>
        <ul>
          {quests.length==0? "No Quests Pending" :
            quests.map(
                quest=>(
                    <li key={quest.id} onClick={()=>
                        navigate(`quests/${quest.id}`)
                    }>{quest.title}</li>
                )
            )
          }
        </ul>
      </div>

      <div className="panel">
        <h3>Delegated Quests</h3>
        <ul>
          {questAssigned.length==0? "No Delegated Quests Pending.":
            questAssigned.map(
                quest=>(
                    <li key={quest.id}
                    onClick={()=>navigate(`/quests/${quest.project}`)}>
                        {quest.title}</li>
                )
            ) 
          }
        </ul>
      </div>

    </div>

    
    <div className="activity-section">
      <h3>Activity Monitor</h3>

      <div className="activity-grid">
        <div className="day level-0"></div>
        <div className="day level-1"></div>
        <div className="day level-2"></div>
        <div className="day level-3"></div>
        <div className="day level-4"></div>
        <div className="day level-1"></div>
        <div className="day level-3"></div>
        <div className="day level-2"></div>
        <div className="day level-0"></div>
        <div className="day level-4"></div>
        <div className="day level-2"></div>
        <div className="day level-1"></div>
      </div>
    </div>

  </div>



    </>);
}
export default Dashboard;