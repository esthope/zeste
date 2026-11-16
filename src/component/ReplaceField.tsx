// main
import {ReactElement, useState, useContext, memo} from "react";
// util
import {EditorContext, MessageContext} from 'service/context';
import {getRaws, getSelection, createContent} from 'util/editorHandler';
import {transformTexts} from 'util/textHandler';
import {create_warning} from 'util/errorHandler';
// element
import CustomButton from 'component/CustomButton';
import {SELECT_PLEASE, EMPTY_FIELD} from 'constant/Messages';

const ReplaceField = (): ReactElement => {
	const [choice, setChoice] = useState<string>(''),
			[editorState, setEditorState] = useContext(EditorContext),
      [setAlertMessage] = useContext(MessageContext);

	/**
	 * Replace the text from selected string
	 * 1. get the selection from blocks
	 * 2. split the block text
	 * 3. update states
	 */
	const replaceSelection = ():void => {
		const currentRaws = getRaws(editorState),
			{blocks} = currentRaws,
			selections = getSelection(blocks, editorState);

		if (selections.length === 0) {
			let errorMsg = create_warning(SELECT_PLEASE)
      		setAlertMessage(errorMsg)
			return;
		}

		if (choice.hasOwnProperty('length') && choice.length === 0) {
			let errorMsg = create_warning(EMPTY_FIELD)
      		setAlertMessage(errorMsg)
			return;
		}

		transformTexts(selections, blocks, choice)
		setEditorState(createContent(currentRaws))
	}

	return (
		<div id="replacing-field">
			<div className="flex gap-1">
	      <input
	      id="replaceField"
				type="text" 
				value={choice}
				className="green-background quicksand-font block"
				placeholder="Saisir le caratère"
				onChange={({target})=>{setChoice(target.value)}} />

				<CustomButton onClick={replaceSelection} />
			</div>

			<span className="infos">Remplacement de la sélection</span>
    </div>
	)
}

export default memo(ReplaceField);