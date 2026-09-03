import {configureStore} from '@reduxjs/toolkit'
import historyReducer from 'service/historySlice'
import historyReducer2 from 'service/historySlice2'
import versionReducer from 'service/versionSlice'
import buttonReducer from 'service/buttonSlice'

const store = configureStore({
	reducer: {
		history: historyReducer,
		history2: historyReducer2,
		version: versionReducer,
		button: buttonReducer
	}
})

export default store