// main
import {RichUtils, Editor, EditorState, Modifier, SelectionState, getDefaultKeyBinding} from 'draft-js';
import * as reactTypes from 'react'
import {useState, useEffect, useContext} from "react";
import {addContentHistory, addVersion} from 'util/historyHandler'
import {getRaws} from 'util/editorHandler'
import {useSelector, useDispatch} from 'react-redux'
import "draft-js/dist/Draft.css";
// util
import {EditorContext, MessageContext} from 'service/context';
// element
import TextButton from 'component/TextButton';
import MultiIcon from 'component/icons/MultiIcon'
import ResetSelectIcon from 'component/icons/ResetSelectIcon'
import style from "constant/base.scss";
// alert
import {SELECT_FAILED, MULTI_SELECT, REINIT_SELECT} from 'constant/Messages';
import {create_error, create_cause} from 'util/errorHandler';
import {Message, Cause} from 'constant/interfaces';
let errorMsg:Message,
    cause:Cause;

const colors:any = style,
      wordReg = new RegExp('(?:(?! ).)+ $') //'/(?:(?! ).)+ $/'

const TextEditor = ({contentLength}:{contentLength:number}): reactTypes.ReactElement => {

  const [selectionClass, setSelectionClass] = useState<string>(''),
        [selectCount, setSelectCount] = useState<number>(0),
        [selectMode, setSelectMode] = useState<boolean>(false)

  const [editorState, setEditorState, editorRef] = useContext(EditorContext),
        [setAlertMessage] = useContext(MessageContext)

  const dispatch = useDispatch(),
        stateHistory2 = useSelector((state:any)=>state.history2),
        version = useSelector((state:any)=>state.version)

  const customKeyBinding = (event:reactTypes.KeyboardEvent):string|null => {
    const commandEvent = getDefaultKeyBinding(event);
    if (commandEvent === 'undo') {
      return 'handled';
    }
    return commandEvent
  }

  /**
   * Listen the delete command of DraftJS to cancel it 
   * It uses the shortcut ctrl•D and ctrl•maj•D. We need those for the selection handler
   * @param  {string}       command     The command name 
   * @param  {EditorState}  editorState The current state of the editor content
   */
  const onPreventCommand = (command:string, editorState:EditorState):any => {
    console.log('command', command)
    const event = window.event;

    // add sentence to history
    if (command === 'split-block')
    {
      // OLD
      // addVersion ici ?
      addContentHistory(dispatch, editorRef)
    }

    if ((command === 'delete') &&
        (event instanceof KeyboardEvent
        && event?.ctrlKey
      )) {
      return 'handled'
    }
  }

  const handleHistory = (editorState:EditorState, force:boolean=false):void => {
    const currentText = editorState.getCurrentContent().getPlainText()

    if (force || wordReg.test(currentText)) {
      const newRaw = getRaws(editorState)
      addVersion(dispatch, newRaw, stateHistory2, version.current)
    }
  }
  /**
   * Switch the multi selection mode
   * Save the current selection as highlight text into the editor state
   * @param  {any}          event       Current event : mouseup or keyup type event
   * @param  {EditorState}  editorState The current state of the editor content
   */
  const handleSelection = (event:any, editorState:EditorState) => {
    try
    {
      // get the needed properties
      const {code, type, ctrlKey} = event;

      // switch selection mode
      if (ctrlKey && code === 'KeyD') setSelectMode(!selectMode)

      // highlight selection 
      if (selectMode && (type === 'mouseup' || code.includes('Shift')))
      {
        setEditorState(RichUtils.toggleInlineStyle(editorState, 'HIGHLIGHT'));
      }

      // count selection
      setSelectCount(window?.getSelection()?.toString()?.length ?? 0)
    }
    catch(err:any)
    {
      cause = create_cause('SELECTION', 'C-EDITOR', err)
      errorMsg = create_error(SELECT_FAILED, cause)
      setAlertMessage(errorMsg)
    }
  }

  /**
   * Remove current highlight
   */
  const resetSelection = ():void => {
    // reset if some text has been highlighed
    if (editorState.getCurrentInlineStyle().count() < 0) return;

    // get data
    const contentState = editorState.getCurrentContent(),
          lastBlock = contentState.getLastBlock(),
          selection = new SelectionState({
            anchorKey: contentState.getFirstBlock().getKey(),
            focusKey: lastBlock.getKey(),
            focusOffset: lastBlock.getLength()
          })

    // update current states
    const newContent = Modifier.removeInlineStyle(contentState, selection, 'HIGHLIGHT');
    const removed = EditorState.push(editorState, newContent, 'change-inline-style');
    setEditorState(removed)
    setSelectCount(0)
  }

  /**
   * Save the current state of the content
   * Handle the multi selection when mouseup is listened
   * @param  {EditorState}  editorState The current state of the editor content
   */
  const onChange = (editorState:EditorState):any => {

    // add each word to history
    handleHistory(editorState)

    // update text state
    setEditorState(editorState)

    // handle multi selection
    let event:any;
    event = window.event;
    let instance = event?.constructor?.name;
    if (instance === 'MouseEvent') handleSelection(event, editorState);
  }

  useEffect(()=>{
    let className = selectMode ? 'selectMode' : '';
    setSelectionClass(className);
  }, [selectMode])

  return (
    <>
      <div className="flex-between align-end">
        <div>
          <TextButton text={MULTI_SELECT} onClick={()=>setSelectMode(!selectMode)} color={(selectMode) ? 'multi-color' : ''} >
            <MultiIcon />
          </TextButton>

          <TextButton text={REINIT_SELECT} onClick={()=>resetSelection()}>
            <ResetSelectIcon  />
          </TextButton>
        </div>
  
        <span className="infos">
          {contentLength} caractères
          {(selectCount > 0) ?
            <>
              <span> – </span>
              <span>{selectCount} sélectionnés</span>
            </>
          : null}
        </span>
      </div>

      <div
        className={`editor quicksand-font green-background ${selectionClass}`} 
        onKeyUp={(event:any):void => {handleSelection(event, editorState)}}
      >

        <Editor
        ref={editorRef}
        placeholder="Inscrire le texte"
        editorState={editorState}
        handleKeyCommand={onPreventCommand}
        keyBindingFn={customKeyBinding}
        customStyleMap={{ HIGHLIGHT: { backgroundColor: colors.ocher } }}
        onBlur={()=>handleHistory(editorState, true)}
        onChange={onChange} />
      </div>
    </>
  )
}

export default TextEditor;