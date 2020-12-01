import { combineReducers } from 'redux'
import * as actionTypes from '../actions/types'

const initiaUserState = {
	currentUser: null,
	isLoading: true,
}

const userReducer = (state = initiaUserState, action) => {
	switch (action.type) {
		case actionTypes.SET_USER:
			return {
				currentUser: action.payload.currentUser,
				isLoading: false,
			}
		default:
			return state
	}
}

const rootReducer = combineReducers({
	user: userReducer,
})

export default rootReducer
