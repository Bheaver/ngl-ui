import React, {Component} from 'react';
import axios from 'axios';

class LibrarySelect extends Component {
    constructor(){
        super()
        this.state = {
            libraries: [],
        };
        axios.get('http://localhost:8081/aa/listLibraries')
        .then(res => {
            this.setState({
                libraries: res.data.response    
            });
        })
    }
    render() {
        const allOptions = this.state.libraries.map((library) => {
            return <option key={library.libraryCode}>{library.libraryName}</option>
        })
        return {allOptions}
                
    }
}
export default LibrarySelect;