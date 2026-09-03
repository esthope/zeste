import {createSlice} from '@reduxjs/toolkit'
import {create_internal_error, create_cause} from 'util/errorHandler';

const location = 'S-BUTTON'

type ReduceAction = {
	payload:string
}

const buttonSlice = createSlice({
	name: 'button',
	initialState: '',
	reducers: {
		changeColor: (state:any, action:ReduceAction):any => {
			try
			{
				state = action.payload
				return state
			}
			catch(err)
			{
				// [DEV]
				console.log(err)
      			const cause = create_cause('COLOR', location, err)
      			create_internal_error('[!] tech', cause) 
			}
		}
	}
})

export const {changeColor} = buttonSlice.actions
export default buttonSlice.reducer