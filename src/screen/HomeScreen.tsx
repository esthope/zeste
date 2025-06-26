// main
import {ReactElement, useEffect, useState, useRef, useCallback, useMemo} from "react"
import {useSelector, useDispatch} from 'react-redux'
import {ErrorBoundary} from "react-error-boundary"
import {EditorState, Editor} from "draft-js"
// util
import * as CustomMsg from 'constant/Messages'
import {EditorContext, MessageContext} from 'service/context'
import {getContentLength, updateTextCase, clipboardAction} from 'util/textHandler'
import {initialMessage, get_boundary_error, create_error, create_cause, is_message} from "util/errorHandler"
import {handle_press, getInteractionsKeys} from 'util/dataHandler'
import {interactionsData, Case} from 'constant/Interactions'
import {addContentHistory} from 'util/historyHandler'
import {changeColor} from 'service/buttonSlice'
import {Message} from 'constant/interfaces'
// element
import {CaseError, ActionError, FieldError, EditorError} from 'component/ErrorComponents'
import Header from 'component/Header'
import CaseContainer from 'component/CaseContainer'
import ReplaceField from 'component/ReplaceField'
import TextEditor from 'component/TextEditor'
import ActionContainer from 'component/ActionContainer'
import AlertMessage from 'component/AlertMessage'

import {downgradeHistory, undoneContent} from 'util/historyHandler'

const keys = getInteractionsKeys(interactionsData),
      cases = Object.values(Case);

const Home = ():ReactElement => {
  const // states
        [contentLength, setContentLength] = useState<number>(0),
        [alertMessage, setAlertMessage] = useState<Message>(initialMessage), // [!] adapter avec redux
        [editorState, setEditorState] = useState<EditorState>(EditorState.createEmpty()),
        // refs
        editorRef = useRef<Editor>(null),
        started = useRef<boolean>(false), // [!] adapter avec redux
        undo = useRef<boolean>(false),
        // memo
        editorValues = useMemo(()=>([editorState, setEditorState, editorRef]), [editorState]),
        messageValues = useMemo(()=>([setAlertMessage, alertMessage]), [alertMessage]),
        // redux
        stateHistory = useSelector((state:any)=>state.history),
        dispatch = useDispatch()

  /**
   * Listen the key shortcut for the editor functionalities
   * Filter the keys and determination of the action or new case requested
   * Update the editor and the history with the new content
   * @param  {KeyboardEvent} event the current key event
   */
  const key_listener = useCallback(async (event:KeyboardEvent):Promise<void> =>
  {
    if (event.key === 'Control' || !event.ctrlKey || !editorRef?.current) return;
    let newText:string|undefined = undefined,
        newState:any = null

    // ? editorHasFocus
    const hasFocus = editorRef.current.editor === document.activeElement,
          interID = handle_press(event, keys, interactionsData, hasFocus),
          askedInter = (typeof interID === 'string') ? interID : '',
          caseInteraction = cases.includes(askedInter);

    try
    {
      // failure during getting the interaction ID
      if (is_message(interID))
        throw interID

      // the interaction is a Case
      if (caseInteraction)
      {
        event.preventDefault();
        newState = updateTextCase(askedInter, editorState, setAlertMessage)
      }
      // the interaction is an Action
      else if (askedInter)
      {
        // no prevent default is needed for action
        event.preventDefault();
        newState = await clipboardAction(askedInter, editorRef, dispatch)
      }

      // getting new state failed
      if (is_message(newState))
        throw newState

      // set new content
      if (newState instanceof EditorState) {
        setEditorState(newState)
        // [!] ne prend pas le style
        newText = newState.getCurrentContent().getPlainText()
        // console.log(editorRef.current.editor.innerText, newText)
      }

      // addContentHistory(dispatch, editorRef, newText)

      // [!] button color
      dispatch(changeColor(`${askedInter} success-color-btn`))
    }
    catch(err:any)
    {
      const cause = create_cause('INTERACTION', 'S-HOME', err),
            errorMsg = (is_message(err)) ? err : create_error(CustomMsg.TEXT_UP, cause)

      // [!] button color
      setAlertMessage(errorMsg)
      dispatch(changeColor(`${askedInter} ${err?.level ?? 'error'}-color-btn`))
    }
  }, [editorState, dispatch])

  const display_error = (error:Error):void => {
    const errorMsg = get_boundary_error(error);
    setAlertMessage(errorMsg);
  }

  useEffect(()=>{
    // update the content length
    const currentContent = editorState.getCurrentContent();
    let length = getContentLength(currentContent);
    setContentLength(length);

    // the edition has started
    if (length > 0 && !started.current) {
      started.current = true
    }

    document.addEventListener('keydown', key_listener)
    return () => document.removeEventListener('keydown', key_listener)
  }, [editorState, key_listener])

  useEffect(()=>{
    // console.log(undo.current)
    if (!undo.current) return
      console.log('3 home')
      console.log(stateHistory)
      // const newState = undoneContent(stateHistory)
      // checkNewState(newState, Action.undo)
    undo.current = false
  }, [stateHistory])

  return (
    <>
      <Header started={started.current} />
      <MessageContext.Provider value={messageValues}>
        <main className="flex column">
          <EditorContext.Provider value={editorValues}>

            <section id="case-section" className="gap-5 flex-between align-start self-center">
              {/*CASES*/}
              <ErrorBoundary FallbackComponent={CaseError} onError={display_error} >
                <CaseContainer started={started.current} />
              </ErrorBoundary>

              {/*REPLACE*/}
              <ErrorBoundary FallbackComponent={FieldError} onError={display_error} >
                <ReplaceField />
              </ErrorBoundary>
            </section>

            <section id="editor-container" className="flex column gap-05">
              {/*EDITOR*/}
              <ErrorBoundary FallbackComponent={EditorError} onError={display_error} >
                <TextEditor contentLength={contentLength} />
              </ErrorBoundary>

              {/*ACTIONS*/}
              <ErrorBoundary FallbackComponent={ActionError} onError={display_error} >
                <ActionContainer started={started.current} undo={undo} />
              </ErrorBoundary>
            </section>

          </EditorContext.Provider>

          <AlertMessage />
        </main>
      </MessageContext.Provider>
    </>
  )
}

export default Home;