import {createSlice} from '@reduxjs/toolkit'
import {getActiveHistory, getActiveIndex} from 'util/historyHandler'
import {create_internal_error, create_cause} from 'util/errorHandler';

const location = 'S-HISTORY'

type ReduceAction = {
	payload:string
}

const historySlice = createSlice({
	name: 'history',
	initialState: [{
		content_id: 0,
		content: '',
		active: true
	}],
	reducers: {
		addContent: (state:any, action:ReduceAction):any => {
			try
			{
				action.payload = (action.payload === '\n') ? '' : action.payload;

				const {content} = getActiveHistory(state),
					  {payload} = action

				// check if exists as last history
				if (content === payload) return

				// unactive the current active content 
				const current_index = getActiveIndex(state)
				state[current_index].active = false;

				// add the new active content
				state.push({
					content_id: state.length,
					content: payload,
					active: true
				})
			}
			catch(err)
			{
				// [DEV]
				console.log(err)
      			const cause = create_cause('HIST', location, err)
      			create_internal_error('[!] tech', cause) 
			}
		}
	}
})

export const {addContent} = historySlice.actions
export default historySlice.reducer