import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Grid, Message } from 'semantic-ui-react'
import './App.css'
import ColorPanel from './ColorPanel/ColorPanel'
import Messages from './Messages/Messages'
import MetaPanel from './MetaPanel/MetaPanel'
import SidePanel from './SidePanel/SidePanel'

const App = ({ currentUser, currentChannel }) => (
	<Grid columns='equal' className='app' style={{ background: '#eee' }}>
		<ColorPanel />
		<SidePanel key={currentUser && currentUser.uid} currentUser={currentUser} />
		<Grid.Column style={{ marginLeft: 320 }}>
			<Messages
				key={currentChannel && currentChannel.id}
				currentChannel={currentChannel}
				currentUser={currentUser}
			/>
		</Grid.Column>
		<Grid.Column width={4}>
			<MetaPanel />
		</Grid.Column>
	</Grid>
)

const mapStateToProps = (state) => ({
	currentUser: state.user.currentUser,
	currentChannel: state.channel.currentChannel,
})

export default connect(mapStateToProps)(App)
