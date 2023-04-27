import React, {useState} from 'react'
import * as BsIcon from "react-icons/bs";
import {Link} from 'react-router-dom'
import { SidebarData } from './SidebarData';
import './NavBar.css'

function NavBar() {
    const [sidebar,setSidebar] = useState(false)

    const showSidebar = () => setSidebar(!sidebar)

  return (
    <>
        <div className="navbar1">
            <Link to="#" className='menu-bars mt-1'>
                <BsIcon.BsFillChatDotsFill onClick={showSidebar}/>
            </Link>
        </div>
        <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
            <ul className="nav-menu-items">
                <li className="navbar-toggle">
                    <Link to='#' className='menu-bars mt-5'>
                        <BsIcon.BsArrowsAngleContract onClick={showSidebar}/>
                    </Link>
                </li>
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
            </ul>
        </nav>
    </>
  )
}

export default NavBar