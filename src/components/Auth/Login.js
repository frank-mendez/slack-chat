import React, { Component } from 'react'
import firebase from '../../firebase'
import { Grid, Form, Segment, Button, Header, Message, Icon } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

export default class Login extends Component {
	state = {
		username: '',
		email: '',
		password: '',
		passwordConfirmation: '',
		errors: [],
		loading: false,
	}

	displayErrors = (errors) => errors.map((error, i) => <p key={i}>{error.message}</p>)

	handleChange = (event) => {
		this.setState({
			[event.target.name]: event.target.value,
		})
	}

	handleSubmit = (e) => {
		e.preventDefault()
		if (this.isFormValid(this.state)) {
			this.setState({ errors: [], loading: true })
			firebase
				.auth()
				.signInWithEmailAndPassword(this.state.email, this.state.password)
				.then((signedInUser) => {
					console.log(signedInUser)
				})
				.catch((err) => {
					this.setState({
						errors: this.state.errors.concat(err),
						loading: false,
					})
				})
		}
	}

	isFormValid = ({ email, password }) => email && password

	handleInputError = (errors, input) => {
		return errors.some((error) => error.message.toLowerCase().includes(input)) ? 'error' : ''
	}

	render() {
		const { email, password, errors, loading } = this.state

		return (
			<Grid textAlign='center' verticalAlign='middle' className='app'>
				<Grid.Column style={{ maxWidth: '450px' }}>
					<Header as='h1' icon color='violet' textAlign='center'>
						<Icon name='puzzle piece' color='violet' />
						Login to DevChat
					</Header>
					<Form onSubmit={this.handleSubmit} size='large'>
						<Segment stacked>
							<Form.Input
								fluid
								name='email'
								icon='mail'
								iconPosition='left'
								placeholder='Email Address'
								onChange={this.handleChange}
								type='email'
								value={email}
								className={this.handleInputError(errors, 'email')}
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
								className={this.handleInputError(errors, 'password')}
							/>

							<Button
								disabled={loading}
								color='violet'
								fluid
								size='large'
								className={loading ? 'loading' : ''}
							>
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
						Don't have an account? <Link to='/register'>Register</Link>
					</Message>
				</Grid.Column>
			</Grid>
		)
	}
}
