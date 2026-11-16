import {ReactElement} from "react";

interface CaseProp {
	content?:string|Function,
	onClick?:Function,
	onMouseEnter?:Function,
	disabled?:boolean,
	className?:string
}

const CaseButton = ({content, onClick, label, onMouseEnter, disabled, className}:CaseProp): ReactElement => {

	let additionalStyle = className ?? 'green-background flex-center';

	const properties:any = {};

	if (onClick) properties.onClick = onClick;
	if (onMouseEnter) properties.onMouseEnter = onMouseEnter;
	if (disabled) properties.disabled = !!disabled;

	return (
		<button
			type="button"
			className={`caseButtonBase caseButton mbe-06 ${additionalStyle}`}
			aria-label={`Changer la casse en ${label}`}
      onMouseDown={(event) => event.preventDefault()}
			{...properties} >

			{(typeof content === 'function')
				? content()
				: <span>{content}</span>
			}
		</button>
	)
}

export default CaseButton;