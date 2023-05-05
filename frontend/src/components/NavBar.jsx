import React, {useState,useEffect} from 'react'
import * as BsIcon from "react-icons/bs";
import {Link} from 'react-router-dom'
import { SidebarData } from './SidebarData';
import './NavBar.css'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom';

function NavBar() {
    const [sidebar,setSidebar] = useState(false)

    const showSidebar = () => setSidebar(!sidebar)

    const navigate = useNavigate();

    const [convos, setConvo] = useState([]);

    useEffect(()=>{
        getConvos();
    },[]);
    
    const getConvos = async()=>{
        const response = await axios.get('http://localhost:5000/api/histories/');
        setConvo(response.data);
    };

  return (
    <>
        <div className="navbar1">
            <Link to="#" className='menu-bars mt-1' >
                <BsIcon.BsFillChatDotsFill onClick={showSidebar}/>
            </Link>
        </div>
        <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
            <ul className="nav-menu-items">
                <li className="navbar-toggle">
                    <Link to='#' className='menu-bars mt-1'>
                        <BsIcon.BsArrowsAngleContract onClick={showSidebar}/>
                    </Link>
                </li>
                <Link to="/" className="nav-menu-items" onClick={() => {window.location.href="/"}}>
                    <span className="nav-text">
                    New conversation
                    </span>
                </Link>
                {SidebarData.map((item,index) => {
                    return(
                        <li key={index} className={item.cName}>
                            <Link to={item.path}>
                                <span>
                                    {item.title}
                                </span>
                            </Link>
                        </li>
                    )
                })}
                {convos.map((chat,index) => {
                    return(
                        <li key={index+10} className='nav-text'>
                            <Link to={'convo/' + chat.ChatId}>
                                <span>
                                    {chat.Text}
                                </span>
                            </Link>
                        </li>
                    )
                })}
            </ul>
        </nav>
    </>
  )
}

export default NavBar