import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'
import ReactDOM from 'react-dom'
import { Link } from 'react-router-dom'
import MainFrame from '../mainFrame/MainFrame'

const SideMenu = (
        <nav className="nav flex-column">
          <Link to='/login'>Login</Link>
          <Link to='/importCatalogue'>Import Catalogue</Link>
      </nav>
    
)
//ReactDOM.render(routing, document.getElementById('MainFrameRoot'))
export default SideMenu;