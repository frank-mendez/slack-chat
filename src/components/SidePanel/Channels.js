import React, { Component } from 'react'
import { connect } from 'react-redux'
import { setCurrentChannel } from '../../actions'
import { Button, Form, Icon, Input, Menu, Modal } from 'semantic-ui-react'
import firebase from '../../firebase'

export class Channels extends Component {
	state = {
		channels: [],
		modal: false,
		channelName: '',
		channelDetails: '',
		channelsRef: firebase.database().ref('channels'),
		user: this.props.currentUser,
	}

	componentDidMount() {
		this.addListeners()
	}

	addListeners = () => {
		let loadedChannels = []
		this.state.channelsRef.on('child_added', (snap) => {
			loadedChannels.push(snap.val())
			this.setState({ channels: loadedChannels })
		})
	}

	addChannel = () => {
		const { channelsRef, channelName, channelDetails, user } = this.state

		const key = channelsRef.push().key

		const newChannel = {
			id: key,
			name: channelName,
			details: channelDetails,
			createdBy: {
				name: user.displayName,
				avatar: user.photoURL,
			},
		}

		channelsRef
			.child(key)
			.update(newChannel)
			.then(() => {
				this.setState({ channelDetails: '', channelName: '', modal: false })
			})
			.catch((err) => console.error(err))
	}

	handleSubmit = (e) => {
		e.preventDefault()
		if (this.isFormValid(this.state)) {
			this.addChannel()
		}
	}

	isFormValid = ({ channelName, channelDetails }) => channelName && channelDetails

	closeModal = () => this.setState({ modal: false })
	handleChange = (event) => {
		this.setState({ [event.target.name]: event.target.value })
	}

	changeChannel = (channel) => {
		this.props.setCurrentChannel(channel)
	}

	displayChannels = (channels) =>
		channels.length > 0 &&
		channels.map((channel) => (
			<Menu.Item
				key={channel.id}
				onClick={() => {
					this.changeChannel(channel)
				}}
				name={channel.name}
				style={{ opacity: 0.7 }}
			>
				# {channel.name}
			</Menu.Item>
		))

	openModal = () => this.setState({ modal: true })

	render() {
		const { channels, modal } = this.state

		return (
			<React.Fragment>
				<Menu.Menu style={{ paddingBottom: '2em' }}>
					<Menu.Item>
						<span>
							<Icon name='exchange' /> CHANNELS
						</span>{' '}
						({channels.length}) <Icon name='add' onClick={this.openModal} />
					</Menu.Item>
					{this.displayChannels(channels)}
				</Menu.Menu>

				<Modal basic open={modal} onClose={this.closeModal}>
					<Modal.Header>Add a Channel</Modal.Header>
					<Modal.Content>
						<Form onSubmit={this.handleSubmit}>
							<Form.Field>
								<Input
									fluid
									label='Name of Channel'
									name='channelName'
									onChange={(e) => this.handleChange(e)}
								/>
							</Form.Field>
							<Form.Field>
								<Input
									fluid
									label='About the Channel'
									name='channelDetails'
									onChange={(e) => this.handleChange(e)}
								/>
							</Form.Field>
						</Form>
					</Modal.Content>
					<Modal.Actions>
						<Button color='green' inverted onClick={this.handleSubmit}>
							<Icon name='checkmark' />
							Add
						</Button>
						<Button color='red' inverted onClick={this.closeModal}>
							<Icon name='remove' />
							Cancel
						</Button>
					</Modal.Actions>
				</Modal>
			</React.Fragment>
		)
	}
}

export default connect(null, { setCurrentChannel })(Channels)
