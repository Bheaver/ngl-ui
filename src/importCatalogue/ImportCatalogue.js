import React,{Component} from 'react'
import Heading from '../GeneralComponents/Heading'
import axios from 'axios'
import '../global'
import $ from 'jquery';

class ImportCatalogue extends Component {    
    constructor(props){
        super(props)        
        this.state = {
            rawMarcRecord: '',
            parsedRecords: [],
            currentTitle: '',
            currentRecord: ''
        }
    }
    marcRecordTextHandler = (event) => {
        this.setState({
            rawMarcRecord: event.target.value
        })
    }
    importClickHandler = () =>  {    
        const rawMarc = this.state.rawMarcRecord
        axios({
            url: global.cataloguingServer+'cataloguing/parseiso2709',
            method: 'post',
            data: rawMarc
        }).then(res => {
            this.setState({parsedRecords: res.data})
        })
    }
    viewButtonClickHandler = (event) => {        
        const recordNumber = event.target.id.slice(5)
        this.setState({
            currentTitle: this.loctitles[recordNumber],
            currentRecord: this.state.parsedRecords[recordNumber]
        })
        $('#ViewMarcRecordDialog').modal({
            show: true
        })
    }
    renderTableBody(){        
        
    }
    convertCurrentRecordToView() {
        const leader = this.state.currentRecord.leader        
        const controlFields = this.state.currentRecord.controlFields
        console.log(controlFields)
        console.log(typeof controlFieldsX)
        for(var index=0; index<this.state.currentRecord.controlFields.length; index++){
            controlFields+= "<b>"+this.state.currentRecord.controlFields[index].tag+"</b>"+this.state.currentRecord.controlFields[index].data
        }
        return <div>
                    <div className="shadow p-3 mb-5 bg-white rounded"><b>Leader: </b>{leader}</div>
                    <div className="shadow p-3 mb-5 bg-white rounded"><b>Control fields: </b>{leader}</div>
                    
               </div>
    }
    callBackFromImportCatalogue = (recordNumber, currentTitle) => {
        console.log("recordNumber....."+recordNumber)        
        this.setState({
            currentTitle: currentTitle,
            currentRecord: this.state.parsedRecords[recordNumber]
        })
        console.log("View before")        
        $('#ViewMarcRecordDialog').modal({
            show: true
        })
    }
    renderModalDialog(){        
        return <div className="modal fade" key="ViewMarcRecordDialog" tabindex="-1" role="dialog" aria-labelledby="exampleModalLongTitle" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" key="exampleModalLongTitle">{this.state.currentTitle}</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            {this.convertCurrentRecordToView}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary">Save changes</button>
                        </div>
                        </div>
                    </div>
                </div>
    }
    render() {        
        return <div> 
                    <ImportCatalogueViewRecordModal currentTitle={this.state.currentTitle} parsedRecord = {this.state.currentRecord}/>                 
                    <div className="row">
                        <Heading screenName="Import Catalogue Records" 
                                description="Import Catalogue Records in ISO 2709 format"
                                breadCrumb="Cataloguing/Import Catalogue Record"/>
                    </div>
                    <div className="row">
                        <div className="form-group col-12">
                            <label htmlFor="exampleFormControlTextarea1">Paste the MARC record here</label>
                            <textarea className="form-control" key="exampleFormControlTextarea1" rows="6" onChange={this.marcRecordTextHandler}></textarea>
                        </div>
                    </div>
                    <div className="row">
                        <div className="form-group col-12">
                        <button type="button" className="btn btn-primary  col-3" onClick={this.importClickHandler}>Import</button>
                        </div>
                    </div>
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Title</th>
                                <th scope="col">Actions</th>
                            </tr>
                        </thead>
                        <ImportCatalogueTable parsedRecords={this.state.parsedRecords} callBackFromParent={this.callBackFromImportCatalogue}/>
                    </table>
                </div>
    }
}

export default ImportCatalogue;

class ImportCatalogueTable extends Component{
    loctitles = new Array();
    constructor(props){
        super(props)
    }
    viewButtonClickHandler = (event) => {                
        const recordNumber = event.target.id.slice(5)        
        const currentTitle = this.loctitles[recordNumber]
        this.props.callBackFromParent(recordNumber,currentTitle)
    }
    render() {
        const tableRows = this.props.parsedRecords.map((record,indexRec) => {            
            var title="",reminderoftitle="",sor="";
            for(var index = 0 ; index<record.dataFields.length ; index++){
                const datafield = record.dataFields[index]                
                if(datafield.tag === "245"){
                    for(var subindex = 0; subindex<datafield.subfields.length; subindex++){
                           const subfield = datafield.subfields[subindex]           
                           if(subfield.identifier === "a"){
                               title = subfield.data
                           }
                           if(subfield.identifier === "b"){
                                reminderoftitle = subfield.data                           
                            }
                            if(subfield.identifier === "c"){
                                sor = subfield.data                           
                            }
                    }
                }
            }
            const fulltitle = title+reminderoftitle+sor
            this.loctitles.push(fulltitle)
            const recordId = "REC_" + indexRec;
            const saveId = "SAVE_" + indexRec;
            const viewId = "VIEW_" + indexRec;
            return <tr key={recordId}>
                <th scope="row">{indexRec+1}</th>
                <td>{fulltitle}</td>
                <td>
                    <button id={saveId} type="button" className="btn btn-outline-primary" data-toggle="tooltip" data-placement="top" title="Save record to catalogue">Save</button>
                    <button id={viewId} type="button" className="btn btn-outline-secondary" data-toggle="tooltip" data-placement="top" title="View the record" onClick={this.viewButtonClickHandler}>View</button>
                </td>
            </tr>
        })        
        return  <tbody>
                    {tableRows}
                 </tbody>
    }
}

class ImportCatalogueViewRecordModal extends Component{
    constructor(props){
        super(props)
    }
    render(){
        const currentTitle = this.props.currentTitle
        const leader = this.props.parsedRecord.leader
        const controlFields = []
        const dataFields = []
        const localDataFields = []
        if(this.props.parsedRecord.controlFields != undefined){
            for (var i = 0; i<this.props.parsedRecord.controlFields.length; i++){
                controlFields.push(
                    <span><b>{this.props.parsedRecord.controlFields[i].tag}: </b>{this.props.parsedRecord.controlFields[i].data} <br/></span>
                )                
            }
        }
        if(this.props.parsedRecord.dataFields != undefined){
            for (var i = 0; i<this.props.parsedRecord.dataFields.length; i++){
                const tag = this.props.parsedRecord.dataFields[i].tag    
                if(tag.startsWith('9')){
                    localDataFields.push(
                        <span><b>{tag} {this.props.parsedRecord.dataFields[i].indicator1} {this.props.parsedRecord.dataFields[i].indicator2} </b> <br/></span>
                    )
                }else{
                    dataFields.push(
                        <span><b>{tag} {this.props.parsedRecord.dataFields[i].indicator1} {this.props.parsedRecord.dataFields[i].indicator2} </b> <br/></span>
                    )
                }
                                
                if(this.props.parsedRecord.dataFields[i].subfields != undefined){
                    const subFields = this.props.parsedRecord.dataFields[i].subfields
                    for(var j=0; j<subFields.length; j++){
                        if(tag.startsWith('9')){
                            localDataFields.push(
                                <span className="ml-5"><b>{subFields[j].identifier}: </b>{subFields[j].data} <br/></span>
                            )
                        }else{
                            dataFields.push(
                                <span className="ml-5"><b>{subFields[j].identifier}: </b>{subFields[j].data} <br/></span>
                            )
                        }                        
                    }
                }
            }
        }
        return <div className="modal fade" id="ViewMarcRecordDialog" tabindex="-1" role="dialog" aria-labelledby="exampleModalLongTitle" aria-hidden="true">
                <div className="modal-dialog modal-lg" role="document">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" key="exampleModalLongTitle">{currentTitle}</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <div class="shadow p-3 mb-5 bg-white rounded"><b>Leader: </b><br/>{leader}</div>
                        <div class="shadow p-3 mb-5 bg-white rounded"><b>Control fields: </b><br/>{controlFields}</div>
                        <div class="shadow p-3 mb-5 bg-white rounded"><b>Data fields: </b><br/>{dataFields}</div>
                        <div class="shadow p-3 mb-5 bg-white rounded"><b>Catalogue source's local fields: </b><br/>{localDataFields}</div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                        <button type="button" className="btn btn-primary">Save catalogue record</button>
                    </div>
                    </div>
                </div>
            </div>
    }    
}
