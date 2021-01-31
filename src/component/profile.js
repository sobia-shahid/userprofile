import React from 'react';
import '../App.css';
import img from '../img.png';
import EditIcon from '@material-ui/icons/Edit';
import AddPhotoAlternateIcon from '@material-ui/icons/AddPhotoAlternate';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import axios from '../custom-axios';
 
class profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      profileimg: img,
      username: '',
      iseditview: false
    };
    this.imageHandler = this.imageHandler.bind(this);
    this.changeiseditview = this.changeiseditview.bind(this);
    this.rendereditview = this.rendereditview.bind(this);
    this.saveedit = this.saveedit.bind(this);
    this.editnickapi = this.editnickapi.bind(this);
    this.logout=this.logout.bind(this)
  }
  componentDidMount = () => {
    const id = localStorage.getItem('id');
    const token = localStorage.getItem('token');
    axios({
      url: `/api/users/${id}/`,
      method: 'PUT',
      headers: {
        Authorization: `Basic ${token}`
      }
    }).then((response) => {
      this.setState({
        username: response.data.nick_name,
        profileimg: { imgURL: response.data.profile_pic }
      });
    });
  };

  editnickapi = () => {
    const id = localStorage.getItem('id');
    const token = localStorage.getItem('token');

    axios({
      url: `/api/users/${id}/`,
      method: 'PUT',
      headers: {
        Authorization: `Basic ${token}`
      },
      data: { nick_name: this.refs.textinput.value }
    }).then(function(response) {});
  };

  imageHandler = (e) => {
    //   const reader = new FileReader()
    let file = e.target.files[0];
    //   reader.onloadend=()=>{
    this.setState({
      profileimg: Object.assign(file, {
        imgURL: URL.createObjectURL(file)
      })
    });

    //   }
    //   reader.readAsDataURL(file)

    let formdata = new FormData();
    formdata.append('file', file);
    const token = localStorage.getItem('token');
    axios({
      url: '/api/upload/',
      method: 'POST',
      headers: {
        Authorization: `Basic ${token}`,
        'Content-Type': 'multipart/form-data',
        Accept: 'application/json'
      },
      data: formdata
    }).then(function(response) {
      console.log(response.data.profile_pic);
    });
  };

  changeiseditview = () => {
    this.setState({
      iseditview: !this.state.iseditview
    });
  };

  saveedit = () => {
    this.setState({
      iseditview: false,
      username: this.refs.textinput.value
    });
    this.editnickapi();
  };

  rendereditview = () => {
    return (
      <div>
        <input type="text" defaultValue={this.state.username} ref="textinput" />
        <button onClick={this.saveedit}>save</button>
        <button onClick={this.changeiseditview}>X</button>
      </div>
    );
  };

  logout = () => {
    this.props.history.replace("/login")
  }

  render() {
    return (
       <div  > 
         <button    className="btn btn-primary  float-right " onClick={this.logout}><ExitToAppIcon/>Logout  </button>
        <div className="page">
          <div className="container">
            <div>
              <p className="name">
                {' '}
                Nickname : {this.state.username}
                <EditIcon onClick={this.changeiseditview} />
              </p>
              {this.state.iseditview ? this.rendereditview() : null}
            </div>
            <h4>profile picture</h4>
            <div className="img-holder">
              <img src={this.state.profileimg.imgURL} alt="" id="img" className="image" />
            </div>
            <input type="file" name="imgupload" id="image" accept="images/*" onChange={this.imageHandler} />
            <div className="label">
              <label htmlFor="image" className="image-upload">  
                <i className="material-icon">
                  <AddPhotoAlternateIcon />  
                </i>
              </label>
            </div>
          </div>
        </div>
        </div>
       
    );
  }
}
export default profile;
