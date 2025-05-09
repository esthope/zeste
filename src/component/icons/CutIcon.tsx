import {ReactElement, memo} from "react";
import {SvgType} from 'constant/interfaces';

const CutIcon = (props:SvgType):ReactElement  => {
	return (
		<svg {...props} height="20px" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="20px" xmlns="http://www.w3.org/2000/svg">
			<path d="M0 0h24v24H0z" stroke="none"/>
			<path d="M7 9.667a2.667 2.667 0 0 1 2.667 -2.667h8.666a2.667 2.667 0 0 1 2.667 2.667v8.666a2.667 2.667 0 0 1 -2.667 2.667h-8.666a2.667 2.667 0 0 1 -2.667 -2.667z"/>
			<path d="M4.012 16.737a2 2 0 0 1 -1.012 -1.737v-10c0 -1.1 .9 -2 2 -2h10c.75 0 1.158 .385 1.5 1"/>
			<path d="M11.5 11.5l4.9 5"/>
			<path d="M16.5 11.5l-5.1 5"/>
		</svg>
	)
}

const CutIconMemo = memo(CutIcon);
export default CutIconMemo;