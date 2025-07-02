// main
import {ReactElement, useEffect, useState, useRef, useCallback, useMemo} from "react"
import {useSelector, useDispatch} from 'react-redux'
import {ErrorBoundary} from "react-error-boundary"
import {EditorState, Editor} from "draft-js"
// util
import * as Msg from 'constant/Messages'
import {EditorContext, MessageContext} from 'service/context'
import {getContentLength, updateTextCase, clipboardAction} from 'util/textHandler'
import {getRaws, createContent} from 'util/editorHandler'
import {initialMessage, get_boundary_error, create_error, create_cause, is_message} from "util/errorHandler"
import {handle_press, getInteractionsKeys} from 'util/dataHandler'
import {interactionsData, Case, Action} from 'constant/Interactions'
import {addVersion} from 'util/historyHandler'
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

const location = 'S-HOME'

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
        editorValues = useMemo(()=>([editorState, setEditorState, editorRef]), [editorState]), // [!] adapter avec redux
        messageValues = useMemo(()=>([setAlertMessage, alertMessage]), [alertMessage]),
        // redux
        stateHistory2 = useSelector((state:any)=>state.history2),
        version = useSelector((state:any)=>state.version),
        dispatch = useDispatch()

  const checkNewState = (newState:any, action:string) => {
    try
    {

      // getting new state failed
      if (is_message(newState))
        throw newState

      // set new content
      if (newState instanceof EditorState) {
        setEditorState(newState)
        // [!] ne prend pas le style
      }

      // [!] addVersion(dispatch, editorRef, newText)

      // [!] button color
      dispatch(changeColor(`${action} success-color-btn`))
    }
    catch(err:any)
    {
      console.log('check')
      const cause = create_cause('CHECK', location, err),
            errorMsg = (is_message(err)) ? err : create_error(Msg.ACTION_FAILED, cause)

      dispatch(changeColor(action + ` ${err?.level ?? 'error'}-color-btn`))
      setAlertMessage(errorMsg)
    }
  }

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
        if (askedInter === Action.undo) {
          undo.current = true
        }
        newState = await clipboardAction(askedInter, editorRef, dispatch)
      }

      checkNewState(newState, askedInter)
    }
    catch(err:any)
    {
      console.log('listner')
      const cause = create_cause('INTERACTION', location, err),
            errorMsg = (is_message(err)) ? err : create_error(Msg.TEXT_UP, cause)

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
    if (!undo.current) return

    console.log(stateHistory2)
    console.log(version.current)
    const newRaw = stateHistory2[version.current]
    console.log(newRaw)
    setEditorState(createContent(newRaw))

    // checkNewState(newState, Action.undo)

    undo.current = false
  }, [version])

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