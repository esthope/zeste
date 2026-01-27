import {createSlice} from '@reduxjs/toolkit'
import {create_internal_error, create_cause} from 'util/errorHandler';
import {clearContent, getRaws} from 'util/editorHandler';
import {Raw} from 'constant/interfaces';

const location = 'S-HISTORY'

type ReduceAction = {
	payload:Raw
}

const historySlice = createSlice({
	name: 'history2',
	initialState: [getRaws(clearContent())],
	reducers: {
		addContent: (state:any, action:ReduceAction):any => {
			try
			{
				const {payload} = action
				// [UN] comparer les états entiers pour ne pas faire de doublon de suite
				console.log(state[state.lentgh -1] !== payload)
				state.push(payload)
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