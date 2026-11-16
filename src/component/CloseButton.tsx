import {ReactElement, memo} from "react";

interface ButtonProp {
	onClick:any,
	text:string,
	logo:string,
	color?: string
}

const TextButton = ({onClick, text, logo, color}:ButtonProp):ReactElement => {
	return (
		<button
			className={`textButton no-border no-bg inline mr-2`}
			aria-label="Fermer le message"
			onClick={onClick}>
			{text} {color}
			<img src={logo} alt=""/>
	  </button>
	)
}

export default memo(TextButton);