import firebase from 'firebase'

var firebaseConfig = {
	apiKey: 'AIzaSyAMdF8MprsNSy4KMKDCbPPooyHTClu-gZ4',
	authDomain: 'react-slack-chat-33eb9.firebaseapp.com',
	databaseURL: 'https://react-slack-chat-33eb9.firebaseio.com',
	projectId: 'react-slack-chat-33eb9',
	storageBucket: 'react-slack-chat-33eb9.appspot.com',
	messagingSenderId: '809570698791',
	appId: '1:809570698791:web:ff8beb7b838f4602dcf002',
	measurementId: 'G-JPY3C3RNFQ',
}
// Initialize Firebase
firebase.initializeApp(firebaseConfig)

export default firebase
