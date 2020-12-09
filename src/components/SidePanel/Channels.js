import React, { Component } from 'react'
import { Button, Form, Icon, Input, Menu, Modal } from 'semantic-ui-react'

export class Channels extends Component {
	state = {
		channels: [],
		modal: false,
		channelName: '',
		channelDetails: '',
	}

	closeModal = () => this.setState({ modal: false })
	handleChange = (event) => {
		this.setState({ [event.target.name]: event.target.value })
	}
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
				</Menu.Menu>

				<Modal basic open={modal} onClose={this.closeModal}>
					<Modal.Header>Add a Channel</Modal.Header>
					<Modal.Content>
						<Form>
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
						<Button color='green' inverted>
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

export default Channels
