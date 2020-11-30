import React, { Component } from 'react'
import firebase from '../../firebase'
import { Grid, Form, Segment, Button, Header, Message, Icon } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

export default class Register extends Component {
	state = {
		username: '',
		email: '',
		password: '',
		passwordConfirmation: '',
		errors: [],
	}

	displayErrors = (errors) => errors.map((error, i) => <p key={i}>{error.message}</p>)

	handleChange = (event) => {
		this.setState({
			[event.target.name]: event.target.value,
		})
	}

	isFormValid = () => {
		let errors = []
		let error
		if (this.isFormEmpty(this.state)) {
			error = { message: 'Fill in all fields' }
			this.setState({ errors: errors.concat(error) })
			return false
		} else if (!this.isPasswordValid(this.state)) {
			error = { message: 'Password is invalid' }
			this.setState({ errors: errors.concat(error) })
			return false
		} else {
			return true
		}
	}

	isFormEmpty = ({ username, email, password, passwordConfirmation }) => {
		return !username.length || !email.length || !password.length || !passwordConfirmation.length
	}

	isPasswordValid = ({ password, passwordConfirmation }) => {
		console.log(password, passwordConfirmation)
		if (password.length < 6 || passwordConfirmation.length < 6) {
			console.log('password invalid')
			return false
		} else if (password !== passwordConfirmation) {
			console.log('password invalid')
			return false
		} else {
			console.log('password valid')
			return true
		}
	}

	handleSubmit = (e) => {
		if (this.isFormValid()) {
			console.log('success')
			e.preventDefault()
			firebase
				.auth()
				.createUserWithEmailAndPassword(this.state.email, this.state.password)
				.then((createdUser) => {
					console.log(createdUser)
				})
				.catch((err) => {
					console.error(err)
				})
		}
	}

	render() {
		const { username, email, password, passwordConfirmation, errors } = this.state

		return (
			<Grid textAlign='center' verticalAlign='middle' className='app'>
				<Grid.Column style={{ maxWidth: '450px' }}>
					<Header as='h2' icon color='orange' textAlign='center'>
						<Icon name='puzzle piece' color='orange' />
						Register for DevChat
					</Header>
					<Form onSubmit={this.handleSubmit} size='large'>
						<Segment stacked>
							<Form.Input
								fluid
								name='username'
								icon='user'
								iconPosition='left'
								placeholder='Username'
								onChange={this.handleChange}
								type='text'
								value={username}
							/>
							<Form.Input
								fluid
								name='email'
								icon='mail'
								iconPosition='left'
								placeholder='Email Address'
								onChange={this.handleChange}
								type='email'
								value={email}
							/>
							<Form.Input
								fluid
								name='password'
								icon='lock'
								iconPosition='left'
								placeholder='Password'
								onChange={this.handleChange}
								type='password'
								value={password}
							/>
							<Form.Input
								fluid
								name='passwordConfirmation'
								icon='repeat'
								iconPosition='left'
								placeholder='Password Confirmation'
								onChange={this.handleChange}
								type='password'
								value={passwordConfirmation}
							/>
							<Button color='orange' fluid size='large'>
								Submit
							</Button>
						</Segment>
					</Form>
					{errors.length > 0 && (
						<Message error>
							<h3>Error</h3>
							{this.displayErrors(errors)}
						</Message>
					)}
					<Message>
						Already a user? <Link to='/login'>Login</Link>
					</Message>
				</Grid.Column>
			</Grid>
		)
	}
}
