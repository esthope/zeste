import {fetchData, createKeyEntries} from 'util/dataHandler';
import {create_internal_error, create_cause} from 'util/errorHandler';
import {EMPTY_DATA} from 'constant/Messages';

let casesData:any[] = [],
	actionsData:any[] = [],
	interactionsData:any[] = [];

let Action:any,
	Case:any,
	Mode:any;

try
{
	casesData = fetchData('cases')
	actionsData = fetchData('actions')

	if (casesData && actionsData)
		interactionsData = [...casesData, ...actionsData]

	Action = createKeyEntries('actions')
	Case = createKeyEntries('cases')
	Mode = createKeyEntries('modes')
}
catch(err:any)
{
	const cause = create_cause('DATA', 'CS-INTERACTION', err)
	create_internal_error(EMPTY_DATA, cause)
}

export {casesData, actionsData, interactionsData, Action, Case, Mode}