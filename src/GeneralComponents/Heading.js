import React,{Component} from 'react'

const Heading = (props) => 
    <div>
        <h3 className="h3">
            {props.screenName}
            <small className="text-muted">{props.description}</small>        
        </h3>
        <div className="alert alert-light" role="alert">
                {props.breadCrumb}
        </div>
    </div>

export default Heading;