import React, {Component} from 'react';
import MainFrame from './mainFrame/MainFrame'
import SideMenu from './SideMenu/SideMenu'
import { Link } from 'react-router-dom'
class App extends Component{  
  render(){
    return <div className="container-fluid">
            <div className="row">                                                
                <div className="col-3">                    
                <nav className="nav flex-column">
                  <Link to='/login'>Login</Link>
                  <Link to='/importCatalogue'>Import Catalogue</Link>
                </nav>
                </div>
                <div className="col-9">
                <MainFrame/>
                </div>
            </div>
        </div>
    
  }
}

export default App;
