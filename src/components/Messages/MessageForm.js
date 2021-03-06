import React, { Component } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Button, Input, Segment } from 'semantic-ui-react'
import firebase from '../../firebase'
import FileModal from './FileModal'
import ProgressBar from './ProgressBar'

export class MessageForm extends Component {
	state = {
		uploadState: '',
		uploadTask: null,
		percentUploaded: 0,
		storageRef: firebase.storage().ref(),
		message: '',
		loading: false,
		channel: this.props.currentChannel,
		user: this.props.currentUser,
		errors: [],
		modal: false,
	}

	openModal = () => this.setState({ modal: true })
	closeModal = () => this.setState({ modal: false })

	handleChange = (e) => {
		this.setState({ [e.target.name]: e.target.value })
	}

	createMessage = (fileUrl = null) => {
		const message = {
			content: this.state.message,
			timestamp: firebase.database.ServerValue.TIMESTAMP,
			user: {
				id: this.state.user.uid,
				name: this.state.user.displayName,
				avatar: this.state.user.photoURL,
			},
		}

		if (fileUrl !== null) {
			message['image'] = fileUrl
		} else {
			message['content'] = this.state.message
		}

		return message
	}

	sendMessage = () => {
		const { messagesRef } = this.props
		const { message, channel } = this.state
		if (message) {
			this.setState({ loading: true })
			messagesRef
				.child(channel.id)
				.push()
				.set(this.createMessage())
				.then(() => {
					this.setState({ loading: false, message: '', errors: [] })
				})
				.catch((err) => {
					console.error(err)
					this.setState({ loading: false, errors: this.state.errors.concat(err) })
				})
		} else {
			this.setState({
				errors: this.state.errors.concat({ message: 'Add a message' }),
			})
		}
	}

	uploadFile = (file, metadata) => {
		console.log('file', file)
		console.log('metadata', metadata)
		const { messagesRef } = this.props

		const pathToUpload = this.state.channel.id
		const ref = messagesRef
		const filePath = `chat/public/${uuidv4()}.jpg`

		this.setState(
			{
				uploadState: 'uploading',
				uploadTask: this.state.storageRef.child(filePath).put(file, metadata),
			},
			() => {
				this.state.uploadTask.on(
					'state_change',
					(snap) => {
						const percentUploaded = Math.round((snap.bytesTransferred / snap.totalBytes) * 100)
						console.log('percentUploaded', percentUploaded)
						this.setState({ percentUploaded })
					},
					(err) => {
						console.log(err)
						this.setState({
							errors: this.state.errors.concat(err),
							uploadState: 'error',
							uploadTask: null,
						})
					},
					() => {
						this.state.uploadTask.snapshot.ref
							.getDownloadURL()
							.then((downloadUrl) => {
								this.sendFileMessage(downloadUrl, ref, pathToUpload)
							})
							.catch((err) => {
								console.log(err)
								this.setState({
									errors: this.state.errors.concat(err),
									uploadState: 'error',
									uploadTask: null,
								})
							})
					}
				)
			}
		)
	}

	sendFileMessage = (fileUrl, ref, pathToUpload) => {
		ref
			.child(pathToUpload)
			.push()
			.set(this.createMessage(fileUrl))
			.then(() => {
				this.setState({
					uploadState: 'done',
				})
			})
			.catch((err) => {
				console.log(err)
				this.setState({
					errors: this.state.errors.concat(err),
				})
			})
	}

	render() {
		const { errors, message, loading, modal, uploadState, percentUploaded } = this.state

		return (
			<Segment className='message__form'>
				<Input
					fluid
					name='message'
					style={{ marginBottom: '0.7em' }}
					label={<Button icon={'add'} />}
					labelPosition='left'
					placeholder='Write your message'
					value={message}
					onChange={this.handleChange}
					className={errors.some((error) => error.message.includes('message')) && 'error'}
				/>
				<Button.Group icon widths='2'>
					<Button
						onClick={this.sendMessage}
						color='orange'
						content='Add Reply'
						labelPosition='left'
						icon='edit'
						disabled={loading}
					/>
					<Button
						color='teal'
						onClick={this.openModal}
						content='Upload Media'
						labelPosition='right'
						icon='cloud upload'
					/>
				</Button.Group>
				<FileModal uploadFile={this.uploadFile} modal={modal} closeModal={this.closeModal} />
				<ProgressBar uploadState={uploadState} percentUploaded={percentUploaded} />
			</Segment>
		)
	}
}

export default MessageForm
