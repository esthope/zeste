// main
import {ReactNode} from 'react';
import {FallbackProps} from 'react-error-boundary';
// util
import * as Msg from 'constant/Messages';
// component
import CaseButton from './CaseButton';
import ActionButton from './ActionButton';

const CaseError = ({error, resetErrorBoundary}:FallbackProps):ReactNode => {
	const errorFaces = [':(',"--'",'):']
	return (
		<div className="caseContainer flex">
		{
			errorFaces.map((face:string, index:number)=>
			<CaseButton
				key={`errButton-${index}`}
				className="grey-background unactiveButton"
				content={face}
				disabled
				/>
			)
		}
		</div>
	)
}

const ActionError = ({error, resetErrorBoundary}:FallbackProps):ReactNode => {
	const icons = ['cpy', 'pst', 'cut', 'rst', 'udo']
	const keys = ['C', 'V', 'X', 'Q', 'Z']
	return (
		<div className="actionContainer flex">
			{
				icons.map((icon, index)=>
				<div key={`errButton-${index}`} className="no-pointer">
					<ActionButton
						actionID={`${icon}_err`}
						label={icon}
						/>
					<label className='block text-center'>ctrl · {keys[index]}</label>
				</div>
				)
			}
		</div>
	)
}

const FieldError = ({error, resetErrorBoundary}:FallbackProps):ReactNode => {
	return (
		<i>Le champs de text pour le remplacement est indisponible.</i>
	)
}

const EditorError = ({error, resetErrorBoundary}:FallbackProps):ReactNode => {
	return (
   		<div id="editor-container">
   			<div className="editor quicksand-font green-background">
   				<span className="placeholder">{Msg.OOPS} {Msg.EDITOR}. {Msg.ALERT}.</span>
   			</div>
   		</div>
	)
}

export {CaseError, ActionError, FieldError, EditorError}