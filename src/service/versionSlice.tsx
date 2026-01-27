import {createSlice} from '@reduxjs/toolkit'

type ReduceAction = {payload:number}
const versionSlice = createSlice({
	name: 'version',
	initialState: {current: 0},
	reducers: {
		decrementVersion: (state:any):void => {
			if (state.current > 0)
				state.current -= 1
		},
		incrementVersion: (state:any, action:ReduceAction):void => {
			// [UN] redo à configurer
			/* const {payload} = action
			state.current = payload ?? (state.current += 1)*/
			if (state.current > 0 && state.current )
				state.current -= 1
		}
	}
})
export const {decrementVersion, incrementVersion} = versionSlice.actions
export default versionSlice.reducer