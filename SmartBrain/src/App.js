import React,{Component} from 'react';
import Particles from 'react-particles-js';

import Navigation from './components/navigation/Navigation';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Logo from './components/logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/rank/Rank';

import './App.css';





const partcilesOptions = {
				particles: {
				number: {
					value:40,
					density:{
						enable:true,
						value_area:400
					}
				}
	}			
}
const initailState= {
			input:'',
			imageUrl:'',
			box: {},
			celeb: {},
			route:'signin',
			isSignedIn:false,
			user:{
				id: '',
		    name: '',
		    email: '',
		    entries: 0,
		    joined:''

			}
		}

class App extends Component{
	constructor(){
		super();
		this.state= initailState;
	}

	loadUser = (data) => {
		this.setState({user:{
				id: data.id,
		    name: data.name,
		    email: data.email,
		    entries: data.entries,
		    joined:data.joined

		}})
	}



	calculateFaceLocation = (data) =>{
		const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
		
		const image=document.getElementById('inputimage');
		const width=Number(image.width);
		const height=Number(image.height);
		return{
			leftCol:clarifaiFace.left_col*width,
			topRow:clarifaiFace.top_row*height,
			rightCol: width-(clarifaiFace.right_col * width),
			bottomRow: height-(clarifaiFace.bottom_row * height),
		}
	}


	CelebrityName=(cname)=>{
		const celebName = cname.outputs[0].data.regions[0].data.concepts[0].name;
		return{
			celebrity: celebName,
		}
	}

	displayName=(celeb)=>{
		console.log(celeb);
		this.setState({celeb:celeb})
	}

	displayFaceBox=(box)=>{
		console.log(box);
		this.setState({box:box});
	}

	onInputChange = (event) =>{
		this.setState({input:event.target.value});
	}

	onButtonSubmit = () => {
		this.setState({imageUrl: this.state.input});
		fetch('http://localhost:3001/imageurl',{
					method: 'post', 
					headers: {'Content-Type':'application/json'},
					body: JSON.stringify({
					input: this.state.input
				})
			})
		.then(response => response.json())
		.then(response => {
			if(response){
				fetch('http://localhost:3001/image',{
					method: 'put', 
					headers: {'Content-Type':'application/json'},
					body: JSON.stringify({
					id: this.state.user.id
				})
			})
				.then(response => response.json())
				.then(count => {
					this.setState(Object.assign(this.state.user, {entries: count}))
				})
				.catch(console.log)

			}
			this.displayName(this.CelebrityName(response))
		})
		.catch(err => console.log(err));
	}

	onRouteChange =(route)=>{
		if(route ==='signout'){
			this.setState(initailState)
		}else if (route==='home'){
			this.setState({isSignedIn:true})
		}
		this.setState({route:route});


	}

	render(){
  return (
    <div className="App">
    	<Particles className='particles'
              params={partcilesOptions}
            />
			<link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@600&display=swap" rel="stylesheet"/>
      <Navigation isSignedIn={this.state.isSignedIn} onRouteChange={this.onRouteChange}/>
      { this.state.route==='home' ?
      	<div>
				      <Logo />
				      <Rank 
				        name={this.state.user.name}
                entries={this.state.user.entries}
                />
				      <ImageLinkForm 
				      onInputChange={this.onInputChange}
				      onButtonSubmit={this.onButtonSubmit}/>
				      <FaceRecognition  celeb={this.state.celeb} box={this.state.box} imageUrl={this.state.imageUrl}/>
      			</div>
      			:
      			(
      				this.state.route==='signin'
      				? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
      				: <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
      			)
      }
    </div>
  );
}
}

export default App;
