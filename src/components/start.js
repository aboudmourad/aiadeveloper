import React, { Component } from 'react';
import axios from "axios";
import Nav from "./Nav";


class Start extends Component {
    constructor(props){
        super(props);
        this.state = {
          couponErrors: "",
          coupon: "",
          
        }
        this.updateInputField = this.updateInputField.bind(this);
        this.sendFrom = this.sendFrom.bind(this);
      }
      sendFrom(event){
          console.log("hahahha");
        event.preventDefault();
        axios.post('/api/loginCoupon', {
            coupon_student : this.state.coupon,
            
        }).then((response) => {
            console.log(response);
            window.location.href="/homePage";
        }).catch((error)=>{
            
            this.setState({couponErrors :  error.response.data.errors});
            console.log(error.response.data.errors);
        
        });
        
      }
    
      updateInputField(event){
        this.setState({[event.target.name] : event.target.value})
      }
    render() {
        return (
            <div>
              {/* <Nav /> */}
                <div className= 'container1'>
                    <div className= 'main_title'>
                    
                    <img src="https://restart.network/assets/partials/particles_partial/assets/images/restart.png" alt="Restart Logo" height="100px" width="300px"/>
                        <h1 className="display-3">Welcome to OneMarket</h1>
                    </div>
                    <div className="lead">
                        <h2>Please enter your coupon code :</h2>
                    </div>
                    <div className= 'textBox'>
                        <input type="text" name="coupon" className="form-control-mainpage" placeholder="Enter Your Coupon Code" aria-describedby="basic-addon1" value={this.state.coupon} onChange={this.updateInputField}/>
                        <h1><button type="submit" className='btn btn-danger'  onClick={this.sendFrom}>Enter</button></h1>
                        <h3 style={{color:"red"}}>{this.state.couponErrors && this.state.couponErrors.coupon_student && <p>{this.state.couponErrors.coupon_student.msg} </p> }</h3>

                    </div>
                </div>

                    <footer className="footer">
                        <div className="container text-center text-md-left">
                            <div className="row">
                                 <div className="col-md-4 mx-auto">
                                    <h5 className="font-weight-bold text-uppercase mt-3 mb-4">Restart Network</h5>
                                      <p>Stichting Restart Network is a non-profit organization.</p>
                                 </div> 
                                      <div className="col-md-2 mx-auto">
                                        Restart Network
                                        <ul className="list-unstyled">
                                            <li>
                                                <a href="https://restart.network/about/"> About</a>
                                            </li>
                                            <li>
                                                <a href="#!">Press</a>
                                            </li>
                                            <li>
                                                <a href="https://restart.network/#">Contact</a>
                                            </li>
                                        
                                        </ul>
                                      </div>
                                      <div className="col-md-2 mx-auto">
                                        
                                        <div className="social-networks">
                                          <a href="https://twitter.com/Restart_Network"  className="fa fa-twitter"></a> Twitter
                                        <br/>
                                        <a href="https://www.facebook.com/restartnetwork"  className="fa fa-facebook"></a> Facebook
                                        <br/>
                                        <a href="https://instagram.com/restartnetwork/"  className="fa fa-instagram"></a>Instagram

                                        </div>
                                      </div>
                                    

                            </div>  
                           
                        </div>        
                    </footer>
                            
                                                

            </div>
        );
    }
}

export default Start;
