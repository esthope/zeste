import {ReactElement, memo} from "react";
import {SvgType} from 'constant/interfaces';

const CopyIcon = (props:SvgType):ReactElement  => {
	return (
		<svg {...props} height="20px" strokeWidth="0" viewBox="0 0 512 512" width="20px" xmlns="http://www.w3.org/2000/svg">
			<path d="M408 480H184a72 72 0 0 1-72-72V184a72 72 0 0 1 72-72h224a72 72 0 0 1 72 72v224a72 72 0 0 1-72 72z"/>
			<path d="M160 80h235.88A72.12 72.12 0 0 0 328 32H104a72 72 0 0 0-72 72v224a72.12 72.12 0 0 0 48 67.88V160a80 80 0 0 1 80-80z"/>
		</svg>
	)
}

const CopyIconMemo = memo(CopyIcon);
export default CopyIconMemo;