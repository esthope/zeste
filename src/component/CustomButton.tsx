import {ReactElement, memo} from "react";
import CircleIcon from 'component/icons/CircleIcon';

interface ButtonProp {
	onClick:any,
	color?:string,
	className?:string,
	disabled?:boolean
}

const CustomButton = ({onClick, color, className, disabled}:ButtonProp):ReactElement => {
	return (
		<button
			type="button"
			className={`customButton flex-center no-border no-bg p-0 ${className}`}
			onClick={onClick} >
			<CircleIcon color={color} />
	  </button>
	)
}

export default memo(CustomButton);