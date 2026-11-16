// main
import {ReactElement, useEffect, useState, useRef, useCallback, useMemo} from "react"
import {ErrorBoundary} from "react-error-boundary"
import {EditorState, Editor} from "draft-js"
// util
import {initialMessage, get_boundary_error, create_error, create_cause, is_message} from "util/errorHandler"
import {getContentLength, updateTextCase, clipboardAction} from 'util/textHandler'
import {handle_press, getInteractionsKeys} from 'util/dataHandler'
import {EditorContext, MessageContext} from 'service/context'
import {interactionsData, Case} from 'constant/Interactions'
import * as CustomMsg from 'constant/Messages'
import {Message} from 'constant/interfaces'
// element
import {CaseError, ActionError, FieldError, EditorError} from 'component/ErrorComponents'
import ActionContainer from 'component/ActionContainer'
import CaseContainer from 'component/CaseContainer'
import AlertMessage from 'component/AlertMessage'
import ReplaceField from 'component/ReplaceField'
import TextEditor from 'component/TextEditor'
import Header from 'component/Header'

const keys = getInteractionsKeys(interactionsData),
      cases = Object.values(Case);

const Home = ():ReactElement => {
  const [started, setStarted] = useState<boolean>(false),
        [contentLength, setContentLength] = useState<number>(0),
        [alertMessage, setAlertMessage] = useState<Message>(initialMessage),
        [editorState, setEditorState] = useState<EditorState>(EditorState.createEmpty());

  const editorRef = useRef<Editor>(null)

  const editorValues = useMemo(()=>([editorState, setEditorState, editorRef]), [editorState]),
        messageValues = useMemo(()=>([setAlertMessage, alertMessage]), [alertMessage])

  const key_listener = useCallback(async (event:KeyboardEvent):Promise<void> => {
    if (event.key === 'Control' || !event.ctrlKey || !editorRef?.current || document?.activeElement?.id === "replaceField") return;

    let newState:any = null;
    // ? editorHasFocus
    const hasFocus = editorRef.current.editor === document?.activeElement,
          interID = handle_press(event, keys, interactionsData, hasFocus),
          askedInter = (typeof interID === 'string') ? interID : '';

    try
    {
      // getting the interaction ID failed
      if (is_message(interID))
        throw interID

      // the interaction is a Case
      if (cases.includes(askedInter))
      {
        event.preventDefault();
        newState = updateTextCase(askedInter, editorState, setAlertMessage)
      }
      // the interaction is an Action
      else if (askedInter)
      {
        // no prevent default is needed for action
        newState = await clipboardAction(askedInter, editorRef)
      }

      // getting new state failed
      if (is_message(newState))
        throw newState

      if (newState instanceof EditorState)
        setEditorState(newState)
    }
    catch(err:any)
    {
      const cause = create_cause('INTERACTION', 'S-HOME', err),
            errorMsg = (is_message(err)) ? err : create_error(CustomMsg.TEXT_UP, cause)

      setAlertMessage(errorMsg)
    }
  }, [editorState])

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
    if (length > 0 && !started) {
      setStarted(true)
    }

    document.addEventListener('keydown', key_listener)
    return () => document.removeEventListener('keydown', key_listener)
  }, [editorState, started, key_listener])

  return (
    <>
      <Header started={started} />
      <MessageContext.Provider value={messageValues}>
        <main className="flex column">
          <EditorContext.Provider value={editorValues}>

            <section id="case-section" className="gap-5 flex-between align-start self-center">
              {/*CASES*/}
              <ErrorBoundary FallbackComponent={CaseError} onError={display_error} >
                <CaseContainer started={started} />
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
                <ActionContainer started={started} />
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