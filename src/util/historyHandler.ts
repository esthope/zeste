// main
import {RefObject} from "react";
// util
import {addContent, activePrecedent} from 'service/historySlice'
import {createContent} from 'util/editorHandler'
import {create_error, create_internal_error, create_cause, is_message} from 'util/errorHandler';
import {get_inner_text} from 'util/textHandler';
// constant
import {ACTION_FAILED} from 'constant/Messages';
import {Editor, EditorState} from 'draft-js';
import {Message, History} from 'constant/interfaces';

const location = 'U-HISTORY'

export const addContentHistory = (dispatch:Function, editorRef:RefObject<Editor>, text?:string):void => {
  try
  {
    // [!] que le texte : ne prend pas le style si le texte en a un déjà
    const newContent = text ?? get_inner_text(editorRef)

    if (typeof newContent === 'string')
      dispatch(addContent(newContent))
  }
  catch(err)
  {
    console.log('ADD HIST', err)
    const cause = create_cause('UNDO', location, err)
    create_internal_error('[!] tech', cause) 
  }
}

export const downgradeHistory = (dispatch:Function):void=>{
  console.log('2 down')
  dispatch(activePrecedent())
}

export const undoneContent = (stateHistory:Array<any>):EditorState|Message=>{
  let newContent:any;

  try
  {
  	const activeHistory:any = getActiveHistory(stateHistory)
    console.log('3 undone : ', activeHistory)

    if (activeHistory.hasOwnProperty('content')) {
      newContent = createContent(activeHistory.content)
    } else {
      // [!]
      const cause = create_cause('UNDO', location, 'L\'éditeur n\'a pas de contenu actif à afficher en tant que nouveau contenu')
      newContent = create_error(ACTION_FAILED, cause)
    }

    return newContent;
  }
  catch(err)
  {
    // [!]
    console.log('UNDO', err)
    const cause = create_cause('UNDO', location, err)
    return create_error(ACTION_FAILED, cause)
  }
}

export const addLastContent = (dispatch:Function, editorRef:RefObject<Editor>, stateHistory:Array<any>):void => {
   try
   {
    const currentContent = get_inner_text(editorRef),
          {content} = getActiveHistory(stateHistory)

    // getting text failed
    if (is_message(currentContent)) return

    // add last history state if it's absent from array
    if (content !== currentContent)
      addContentHistory(dispatch, editorRef)
   }
   catch(err)
   {
      console.log('ADD HIST', err)
      const cause = create_cause('UNDO', location, err)
      create_internal_error('[!] tech', cause) 
   }
}

export const getActiveHistory = (stateHistory:Array<any>):History => {
  return stateHistory.find((history:History)=>history.active)
}

export const getActiveIndex = (stateHistory:Array<any>):number|any => {
  if (!Array.isArray(stateHistory)) {console.log(stateHistory); return} //[!]
  const currentIndex = stateHistory.findIndex((content:any)=>content.active)
  return currentIndex ?? stateHistory.length 
}

// delete history from new active element