// main
import {ReactElement, useState, useEffect, useContext, useCallback, useRef} from 'react';
import {isMobile} from 'react-device-detect';
// util
import {MessageContext} from 'service/context';
import {reset_alert, label_status, send_mail} from 'util/errorHandler';
import error_icon from 'assets/error.svg';
import warn_icon from 'assets/warn.svg';
import close_icon from 'assets/close.svg';
// element
import {REFRESH_PAGE} from 'constant/Messages';
import {Message} from 'constant/interfaces';

const AlertMessage = ():ReactElement => {

	const 
		[setAlertMessage, alertMessage] = useContext(MessageContext),
		[messageIcon, setMessageIcon] = useState<string>(error_icon),
		[hidingDelay, setHidingDelay] = useState<number>(0),
		[keep, setKeap] = useState<boolean>(false)
		;

	const {level, message, displayed, reset, cause} = alertMessage;
	const intervaRef = useRef<any>(null);

	/**
	 * [CALL]
	 * control the display of the message
	 * @param  {isDisplayed} current diplay statut
	 */
	const change_displayed_state = useCallback((isDisplayed:boolean):void => {
		setAlertMessage((current:any):Message => {
	        return {
	          level: current.level,
	          message: current.message,
	          displayed: isDisplayed,
	          reset: current.reset
	        }
	    })
	}, [setAlertMessage])

	/**
	 * close completely the alert by reseting it 
	 */
	const close_alert = ():void => {
		setKeap(false)
		setHidingDelay(0)
		reset_alert(setAlertMessage)
	}

	/**
	 * trigger alert masking by increasing the delay
	 */
	const trigger_hiding_alert = ():void => {
		intervaRef.current = (setInterval(():void => { 
			setHidingDelay((current:any):number => {
		        return current+1
		    })
		}, 1000))
	}

	/**
	 * re.start automaticaly the alert hiding
	 * @dependences {displayed} change the displayed status if it's active
	 * @dependences {keep} 		hide if the component are not overed anymore
	 */
	useEffect(() => {
		if (!keep && displayed === true) {
			trigger_hiding_alert()
		}

		return () => {
			clearInterval(intervaRef.current)
			intervaRef.current = 0;
		}
	// eslint-disable-next-line
	}, [keep, displayed])

	/**
	 * manage alert hiding
	 * @dependences {hidingDelay} when the delay is updated by the intervaRef.current or when it's reset
	 * @dependences {intervaRef.current} 	  when the intervaRef.current is changed
	 */
	useEffect(()=>{
		// when 10s as passed, hide
		if (hidingDelay === 10 && !keep) 
		{
			clearInterval(intervaRef.current)
			change_displayed_state(false)
			setHidingDelay(0)
		}

		// if the commponent are overed, keep them displayed
		if (hidingDelay > 0 && keep) 
		{
			clearInterval(intervaRef.current)
		}
	// eslint-disable-next-line
	}, [hidingDelay, keep])

	/**
	 * reset hiding delay of the alert when a new message is set
	 * @dependences {message} a new message appeared
	 */
	useEffect(() => {
	    setHidingDelay(0)

	    if (level === 'warning')
		{
			setMessageIcon(warn_icon)
		}

		if (cause) {
			send_mail(alertMessage)
		}
	// eslint-disable-next-line
	}, [message, level, cause])

	return (
		<section id="message-container"
		className={`flex self-end no-wrap ${(!displayed) ? 'no-overflow' : ''}`}
		{...( !isMobile
			? {
				onMouseEnter: ()=>{if (typeof displayed === 'boolean') setKeap(true)},
				onMouseLeave: ()=>{setKeap(false)}
			}
			: {}
		)}>
			<div className={`gap-07 flex row fade-element right ${(displayed) ? 'fade-animation':''}`}>
				<span className={`alert-level rozhaone-font ${level}-color`}>{label_status[level]}</span>

			    <p>
			    	{message}
					{!!reset && <a href="/" className="block mt-08">{REFRESH_PAGE}</a>}
			    </p>
			</div>

			<div 
			className={`flex no-wrap self-center fade-element right ${(typeof displayed === 'boolean') ? 'fade-animation':'no-pointer'}`}
			{...( !isMobile
				? { onMouseOver: ()=> {if (displayed === false) change_displayed_state(true) }}
				: {}
			)}>
		      	<img id="level-icon" src={messageIcon}
		      	alt={`Logo ${level}. Montrer le message.`}
		      	className={`grow-element ${(displayed) ? 'grow-animation' : ''}`}

		      	{...( isMobile
					? { onClick: ()=> {if (displayed === false) change_displayed_state(true) }}
					: {}
				)}/>

	          	<button
				className={`no-border no-bg p-0 m-05 index-1 customButton flex-center`}
				onClick={close_alert} >
		      		<img src={close_icon} alt="Fermer le message" />
			    </button>
			</div>
		</section>
	)
}

export default AlertMessage;