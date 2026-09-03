// main
import {ReactElement} from "react";
import {useState, useEffect} from 'react';
import {Action} from 'constant/Interactions'
import {useSelector} from 'react-redux'

// element
import CpyIcon from 'component/icons/CpyIcon';
import CircleIcon from 'component/icons/CircleIcon';
import CutIcon from 'component/icons/CutIcon';
import PstIcon from 'component/icons/PstIcon';
import RstIcon from 'component/icons/RstIcon';
import UdoIcon from 'component/icons/UdoIcon';

interface ActionProp {
	actionID:string,
	label?:string,
	onMouseEnter?:Function,
	onClick?:Function
}

const ActionButton = ({actionID, label, onMouseEnter, onClick}:ActionProp):ReactElement => {
	const [IconPath, setIconPath] = useState<any>(CircleIcon),
		  stateColor = useSelector((state:any)=>state.button)

	let buttonProp:object = {},
		imageProp:object = {};

	if (onClick) buttonProp = {onClick: onClick};
	if (onMouseEnter) imageProp = {onMouseEnter: onMouseEnter};

	// get the button icon
	useEffect(()=>{
		switch (actionID) {
			case Action.copy:
				setIconPath(CpyIcon)
			break;
			case Action.cut:
				setIconPath(CutIcon)
			break;
			case Action.past:
				setIconPath(PstIcon)
			break;
			case Action.reset:
				setIconPath(RstIcon)
			break;
			case Action.undo:
				setIconPath(UdoIcon)
			break;
			default:
				setIconPath(CircleIcon)
		}
	}, [actionID])

	return (
		<button
			id={`${actionID}-btn`}
			type="button"
			className={`${stateColor?.includes(actionID) ? stateColor.split(' ').pop() : ''} actionButton mbe-06 flex-center column no-bg no-border`}
			{...buttonProp}
		>
			<IconPath
				stroke='currentColor'
				fill={(actionID === Action.reset || actionID === Action.copy || actionID === Action.undo) ? 'currentColor' : 'transparent'}
				{...imageProp}
				/>
	    </button>
	)
}

// const ActionButtonMemo = memo(ActionButton);
export default ActionButton;