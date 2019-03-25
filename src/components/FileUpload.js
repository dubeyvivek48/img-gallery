import React, { Component } from 'react'
import Camera from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
function getBase64 (file,callback) {
  const  reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(file);
}


export class FileUpload extends Component {
      constructor(props) {
          super(props);
          this.state = {
             images:[{}] ,
             modele:false,
             url:"",
             cameraOn:false,
             time: new Date().toLocaleString()
            };
          this.handleChange = this.handleChange.bind(this);
          this.openModel=this.openModel.bind(this);
          this.closeModel=this.closeModel.bind(this);
          this.openCamera=this.openCamera.bind(this);
        }
        openModel=(data)=>{
          console.log(data);
          this.setState({modele:!this.state.modele,url:data})
          console.log(this.state);
        }
        closeModel=()=>{
          this.setState({modele:!this.state.modele})
        }
      handleChange = (event) => {
        getBase64(event.target.files[0], (obj) => {
          this.setState(({ images }) => [...images, obj]);
          fetch('http://localhost:3001/images', {
            method: 'POST',
            headers: {
              "Accept":'application/json, text/plain, */*',
              'Content-Type':'application/json'
            },
            body: JSON.stringify({
              url: obj
            })
         }).then(response => response.json()).then( response => {
            this.setState(({ images }) => ({ images: [...images, response] }));
          });
        });
      }
      onTakePhoto (dataUri) {
        console.log('takePhoto');
        console.log(dataUri);
        console.log(this.state.images)
        fetch('http://localhost:3001/images', {
            method: 'POST',
            headers: {
              "Accept":'application/json, text/plain, */*',
              'Content-Type':'application/json'
            },
            body: JSON.stringify({
              url: dataUri
            })
         }).then(response => response.json()).then( response => {
            this.setState(({ images }) => ({ images: [...images, response] }));
          });

        this.setState({images:[...this.state.images ,dataUri]});
      }
      openCamera(){
        this.setState({cameraOn:!this.state.cameraOn})
      }
      tick() {
        this.setState({
          time: new Date().toLocaleString()
        });
      }
      componentWillUnmount() {
        clearInterval(this.intervalID);
      }
      componentDidMount(){
        this.intervalID = setInterval(
          () => this.tick(),
          1000
        );
        let url="http://localhost:3001/images";
        fetch(url)
          .then(res=>res.json())
          .then(data=>{         
             this.setState({
               images:data,
             })
            })
        }
  render() {
    
    return (
              <div>
                 {this.state.modele&&(
                      <div className="model" >               
                        <img src={this.state.url} alt=""/>
                        <i class="far fa-times-circle" onClick={this.closeModel}/>
                        <div className="bgDiv"></div>
                      </div>
                    )}
                  
                 
                <div className="container pt-3">
                  <div className="row">
                    <div className="col-12">
                    <h1> {this.state.time}.</h1>
                 
                  {this.state.cameraOn&&
                 <Camera onTakePhoto = { (dataUri) => { this.onTakePhoto(dataUri); } } />}
                      <div className= {this.state.cameraOn?"btn btn-danger  btn-block mb-3":"btn  btn-primary btn-block mb-3"} onClick={this.openCamera}>{this.state.cameraOn?'Close Camera':'Capture'} </div>
                      <div className="custom-file">
                          <input type="file" name="image" accept="image/x-png,image/gif,image/jpeg" onChange={(e)=>this.handleChange(e)}/>    
                          <label className="custom-file-label" >{this.state.file}</label>
                      </div> 
                      
                      <div className=" imgContainer mt-4">
                          {this.state.images.map((data)=><img src={data.url} alt=""key={data.id} onClick={(e)=>this.openModel(data.url)}/>)}
                      </div>
                    </div>                      
                  </div>                                                   
                </div>  
            </div>
           
    )
  }
}

export default FileUpload
