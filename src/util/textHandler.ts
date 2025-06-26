import {RefObject} from "react";
import {Editor, ContentState} from "draft-js";
import {Selection, Block, Cause} from 'constant/interfaces';
import {Case, Action} from 'constant/Interactions';
// util
import * as Msg from 'constant/Messages';
import {create_error, create_cause, create_warning, create_internal_error, is_message} from 'util/errorHandler';
import {getRaws, getSelection, createContent, clearContent} from 'util/editorHandler';
import {downgradeHistory, undoneContent} from 'util/historyHandler'

// error mail
let cause:Cause|undefined,
	location = 'C-TEXT',
	errorMsg:string

let currentBlock:any,
	whiteReg = new RegExp('^\\s+$', 'g'),
	workText:string,
	newText:string|undefined = '',
	initial = 0
	;

const addLastIteration = () => {
	newText += workText.slice(initial);
	currentBlock.text = newText;
}

const multi_mode_loop = (selections:Selection[], blocks:any[], value?:string, caseAction?:string):void =>
{
	let selectedText:string,
		focus = 0;

	selections.forEach((selection, index):void =>
	{
		const {offset, length, anchor_key} = selection;
		focus = offset + length;

		if (anchor_key)
		{
			// Add the rest of the block from last iteration
			if (newText !== '') 
			{
				addLastIteration();
			}

			// get the current block with its passed key
			currentBlock = blocks.find((block)=>block?.key === anchor_key);
			workText = currentBlock.text;

			// init
			newText = '';
			initial = 0;
		}

		// case mode
		if (caseAction)
		{
			selectedText = workText.slice(offset, focus);
			value = changeCase(caseAction, selectedText);
		}

		// get the section and add the replacing text
		newText += workText.slice(initial, offset) + value;
		// define the start position for next|last iteration
		initial = focus;

		// on last iteration, add the rest of the sentence, then update
		if (selections.length === (index+1))
		{
			addLastIteration();
		}
	})
}

const replace_mode_loop = (selections:Selection[], blocks:any[], value?:string):void =>
{
	const firstBlock = blocks.find((block)=>block?.key === selections[0].anchor_key);
	let focus = 0;

	selections.forEach((selection, index):void =>
	{
		const {offset, length, anchor_key} = selection;
		currentBlock = blocks.find((block)=>block?.key === anchor_key);
		workText = currentBlock.text;
		focus = offset + length;

		// get tje first characters and add the value
		if (index === 0) {
			newText += workText.slice(0, offset) + value;
			// only one selection : add the rest of its sentence
			if (selections.length === 1) {
				initial = focus;
				newText += workText.slice(initial);
			}
			return;
		}

		// get the last characters
		if (selections.length === (index+1)) {
			newText += workText.slice(focus);
		}

		// Delete the block after the first
		let currentIndex = blocks.indexOf(currentBlock)
		blocks.splice(currentIndex, 1)
	})
	firstBlock.text = newText;
}

/**
 * Split the selection, then concat with chosen text
 * @param  {array} 	selections 	All positions of the selection
 * @param  {array} 	blocks 		the text blocks from Draftjs
 * @param  {string} value 		A changed text for case update

 */
export const transformTexts = (selections:Selection[], blocks:any[], value?:string, caseAction?:string):void => {
	const is_multi_mode:boolean = selections.every((selection)=> selection?.style === 'HIGHLIGHT');

	//  transform
	if (caseAction || is_multi_mode) {
		multi_mode_loop(selections, blocks, value, caseAction)
	} else {
		replace_mode_loop(selections, blocks, value)
	}

	// refresh global var
	workText=''
	newText=''
	initial=0
}

/**
 * Change the case with more option
 * @param  {string} action 	constant from interactions
 * @param  {string} text 	text to change
 * @return {string} 		changedText changed text
 */
export const changeComplexCase = (action:string, text:string):string => {
	let changedText:string = '',
		caseRegex:RegExp = /./g,
		lowerRegex = new RegExp('\\p{Lower}', 'u');

	// camel case and capitalize
	if (action === Case.camel || action === Case.capital) {
		changedText = text.toLowerCase();
		caseRegex = (action === Case.camel) ? /\s\p{Letter}/gu : /(^|\s)\p{Letter}/gu;
	}

	// case inversion
	if (action === Case.inversion) {
		changedText = text;
		caseRegex = /\p{Letter}/gu;
	}

	// change text
	if (changedText) 
	{
		changedText = changedText.replaceAll(caseRegex, (letter:string):string => (lowerRegex.test(letter)) ? letter.toUpperCase() : letter.toLowerCase());
		// delete whitespaces for camel case
		if (action === Case.camel) changedText = changedText.replaceAll(/\s/g, '');
	}
	return changedText;
}

/**
 * [description]
 * @param  {[type]} string [description]
 * @return {[type]}        [description]
 */
export const changeCase = (caseID:string, text:string):string => {
	// verify text
	if (typeof text !== 'string' || text === '' || whiteReg.test(text)) return text;

	// change text
	let changedText = undefined;
	switch (caseID) {
		case Case.upper:
			changedText = text.toUpperCase();
			break;
		case Case.lower:
			changedText = text.toLowerCase();
			break;
		default:
			changedText = changeComplexCase(caseID, text);
	}

	if (!changedText) {
		errorMsg = Msg.TEXT_UP;
		return text
	}

	return changedText;
}

export const getContentLength = (currentContent:ContentState):number => {
	return currentContent.getPlainText().length
}

export const get_inner_text = (editorRef:RefObject<Editor>):string|void => {
	try
    {
    	// [!]
    	if (!(editorRef.current && editorRef.current.editor)) throw new Error('L\'éditeur n\'est pas référencé.')
    	return editorRef.current.editor.innerText
	}
    catch(err)
    {
		const cause = create_cause('TECH', location, err)
		create_internal_error('[!] tech', cause) 
    }
}

/**
 * Choose the case treatment depending of the selected action
 * Change case, then updtate states
 * @param  {string} action 	constant from interactions
 */
export const updateTextCase = (action:string, editorState:any, setAlertMessage:Function):any => {
	const currentRaws = getRaws(editorState),
		  {blocks} = currentRaws

	const selections = getSelection(blocks, editorState)

	try
	{
		if (selections.length > 0) 
		{
	  		transformTexts(selections, blocks, undefined, action);
		}
		else
		{
			// change text case
		  	blocks.forEach((block:Block):void => {
		  		block.text = changeCase(action, block.text)
		  	})
		}

		// if an error occured, do not stop treatment by throwing
		if (errorMsg) {
			setAlertMessage(create_warning(errorMsg))
		}

		return createContent(currentRaws);
  	}
	catch (err:any)
	{
		cause = create_cause('CASE', location, err)
		return create_error(Msg.TEXT_UNCHANGED, cause)
	}
}

/**
 * Excecute the user action
 * Update the editor content and/or use the clipboard
 * @param  {string} action code to decide the action to excecute
 */
export const clipboardAction = async (action:string, editorRef:any, dispatch?:Function):Promise<any> =>
{
	let newContent:any;
	const {clipboard} = navigator,
		  currEditor = editorRef.current?.editor;

	if (!currEditor) return;
	try
	{
		switch (action)
		{
			case Action.copy:
			case Action.cut:
				let currentContent = currEditor?.innerText;
				if (currentContent && !(currentContent === '\n'))
					newContent = await clipboard.writeText(currentContent)
					.catch ((err:any) =>{
						if (err.message.includes('denied')) {
							return create_warning(`${Msg.CB_NOT_ALLOWED} ${Msg.TO_CUT}.`)
						}

						cause = create_cause('ACTION', location, err)
						return create_error(Msg.COPY_ERR, cause)
					})
			break;
			case Action.past:
				newContent = await clipboard.readText()
				.then((text:any) => {
					let notString = typeof text !== 'string';
					if (text === '' || notString)
					{
						cause = (notString) ? create_cause('ACTION', location, `${Msg.PAST_FAILED} : le texte "${text}" est de type ${typeof text}.`) : undefined;
						return create_warning(Msg.NOTHING_PAST, cause)
					}
					else 
					{
						return createContent(text)
					}
				})
				.catch ((err:any) => {
					if (err.message.includes('denied')) {
						const message = `${Msg.CB_NOT_ALLOWED} ${Msg.TO_PAST}. ${Msg.PLEASE_FOCUS}.`;
						return create_warning(message)
					}

					cause = create_cause('ACTION', location, err)
					return create_error(Msg.PAST_ERR, cause)
				})
			break;
			case Action.undo:
				if (dispatch) {
					console.log('1 handle')
					downgradeHistory(dispatch)
				}

			break;
		}

		if (action === Action.reset || action === Action.cut)
			newContent = (is_message(newContent)) ? newContent : clearContent();
	}
	catch(err:any)
	{
		cause = create_cause('ACTION', location, err)
		return create_error(Msg.ACTION_FAILED, cause)
	}

	return newContent;
}