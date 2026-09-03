import {StringIndex, Interaction} from 'constant/interfaces';
import interactionData from 'service/data_interaction.json';
// alert
import * as Msg from 'constant/Messages';
import {create_error, create_internal_error, create_cause} from 'util/errorHandler';
import {Message, Cause} from 'constant/interfaces';

let cause:Cause,
	errorMsg:Message,
	location = 'U-DATA';

export const fetchData = (slice?:string):Interaction|any => {
	try
	{
		let interaction:Interaction|undefined;
		const data:StringIndex = interactionData,
			  {cases, actions} = data;

		// get one interaction
		if (slice)
		{
			const selection = data[slice];
			interaction = selection ?? [];
		}

		// return all if slice is empty
		return interaction ?? {cases, actions};
	}
	catch(err:any)
	{
		cause = create_cause('DATA', location, err)
		create_internal_error(Msg.EMPTY_DATA, cause)
		return [];
	}
}

export const createKeyEntries = (slice:string):StringIndex => {
	const selection = fetchData(slice);

	let interactions:StringIndex = {};

	selection.forEach((item:any) => {
		interactions[item.entry] = item.data_id;
	})

	return interactions;
}

export const getInteractionsKeys = (interactions:Interaction[]|string):any => {

	let keys:string[] = [],
		filteredData:Interaction[];

	const data = (typeof interactions === 'object') ? interactions : fetchData(interactions);

	// the interaction must be active
	filteredData = data.filter((item:Interaction)=>(!item.unactive));
	keys = filteredData.map((item:any) => item.key.toLowerCase());

	return keys;
}

export const handle_press = (event:any, keys:string[], interactions:Interaction[], hasFocus:boolean):Message|string => {

	let interID:string = '';

	try
	{
		// get the needed properties
		const {key, shiftKey} = event;
		let interKey:string,
			checkedFocus:boolean,
			pressedKey = key.toLowerCase()

		// check shorcut
		// case : focus ou non, si présent faut &&, sinon annule le case en étant focus
		// action de l'appli : focus doit être à false
		if (hasFocus && !keys.includes(pressedKey))
		{
			return interID;
		}

		// select action
		const interaction_id = interactions.filter((inter) => {
			interKey = inter.key.toLowerCase();
			checkedFocus = (typeof inter.focus === 'boolean') ? (inter.focus === hasFocus) : true;

			return ( checkedFocus
				  && !!inter.shift === shiftKey
				  && interKey === pressedKey)
		})

		interID = interaction_id[0]?.data_id ?? ''; 
		return interID;
	}
	catch(err:any)
	{
		cause = create_cause('KEYSHORT', location, err)
		errorMsg = create_error(`${Msg.OOPS} ${Msg.SHORTKEY}. ${Msg.DEV}.\n${Msg.REF_IF_PERSIST}`, cause)
		return errorMsg;
	}
}