import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import { Button, Container, Card, Row } from 'react-bootstrap'

class App extends Component {

	constructor(props) {
		super(props);
		this.state = {
			username: '',
			email: '',
			fetchData: {}
		}
	}

	handleChange = (event) => {
		let nam = event.target.name;
		let val = event.target.value
		this.setState({
			[nam]: val
		})
	}

	handleChange2 = (event) => {
		this.setState({
			username: event.target.value
		})
	}

	componentDidMount() {
		axios.get("http://backend:4000")
			.then((response) => {
				this.setState({
					fetchData: response.data,
				})
			})
	}

	submit = () => {
		axios.post("http://backend:4000/users/create", this.state)
			.then(() => { alert('success post') })
		console.log(this.state)
		document.location.reload();
	}

	render() {
		let card = this.fetchData.map((val, key) => {
			return (
				<React.Fragment>
					<Card style={{ width: '18rem' }} className='m-2'>
						<Card.Body>
							<Card.Title>{val.username}</Card.Title>
							<Card.Text>{val.email}</Card.Text>
						</Card.Body>
					</Card>
				</React.Fragment>
			)
		})

		return (
			<div className='App'>
				<h1>Dockerized Fullstack React Application</h1>
				<div className='form'>
					<input name='username' placeholder='username' onChange={this.handleChange} />
					<input name='email' placeholder='email' onChange={this.handleChange} />
				</div>
				<Button className='my-2' variant="primary" onClick={this.submit}>Submit</Button> <br /><br />
				<Container>
					<Row>
						{card}
					</Row>
				</Container>
			</div>
		);
}
}
export default App;
