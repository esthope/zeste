// main
import {RefObject} from "react"
// util
import {create_internal_error, create_cause, is_message} from 'util/errorHandler'
import {decrementVersion, incrementVersion} from 'service/versionSlice'
import {addContent} from 'service/historySlice'
import {get_inner_text} from 'util/textHandler'
import * as hist from 'service/historySlice2'
// constant
import {History, Raw} from 'constant/interfaces'
import {Editor} from 'draft-js'
import {Action} from 'constant/Interactions'

const location = 'U-HISTORY'

export const addVersion = (dispatch:Function, newRaw:Raw, history:Array<any>, versionID:number):void => {
  try
  {
    const currentRaw = getCurrentRaw(history, versionID),
          currentObj = JSON.stringify(currentRaw.blocks),
          newObj = JSON.stringify(newRaw.blocks)

    if (currentObj === newObj) return
    console.log(newObj)

    dispatch(hist.addContent(newRaw))
    // n'incrémente pas la longueur pour l'utiliser comme index 
    // permet de définir automatiquement le dernier index
    dispatch(incrementVersion(history.length))
  }
  catch(err)
  {
    console.log('ADD HIST', err)
    const cause = create_cause('UNDO', location, err)
    create_internal_error('[!] tech', cause) 
  }
}

export const changeVersion = (dispatch:Function, mode:string): void => {
  if (mode === Action.undo)
    dispatch(decrementVersion())
}

// [OLD]
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

// OLD ?
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

// OLD
export const getActiveHistory = (stateHistory:Array<any>):History => {
  return stateHistory.find((history:History)=>history.active)
}

export const getCurrentRaw = (stateHistory2:Array<any>, versionID:number):Raw => {
  const currentRaw = stateHistory2[versionID]
  return currentRaw
}

export const getActiveIndex = (stateHistory:Array<any>):number|any => {
  if (!Array.isArray(stateHistory)) {console.log(stateHistory); return} //[!]
  const currentIndex = stateHistory.findIndex((content:any)=>content.active)
  return currentIndex ?? stateHistory.length 
}

export const changeRaws = (): void => {}

// delete history from new active element