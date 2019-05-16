import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'
import Login from '../login/Login'
import ImportCatalogue from '../importCatalogue/ImportCatalogue'
import { Switch, Route } from 'react-router-dom'

class MainFrame extends Component {
    render(){
        return               <div>
        <Route exact
                        path='/login'
                        render={(props) => <Login {...props} libraryId={"lib1"} />}
                        />
                    <Route exact path="/importCatalogue" component={ImportCatalogue} />                    
                    </div>
               
    }
}
export default MainFrame;