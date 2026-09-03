import {Message, Cause} from 'constant/interfaces';
import * as CustomMsg from 'constant/Messages';
import {Email} from 'constant/Configuration';
import emailjs from '@emailjs/browser';

export const initialMessage:Message = {
	level: 'none',
	message: null,
	displayed: null,
	reset: false
}

export const label_status:any = {
	error: CustomMsg.ERROR,
	warning: CustomMsg.WARNING
}

const create_message = (level:string, message:string, reset?:boolean, cause?:Cause):Message => {
	return {
		level: level,
		message: message,
		displayed: true,
		reset,
		cause
	}
}

export const create_cause = (fonite:string, location:string, err:any):Cause => {
	let error = err?.stack ?? err.toString();
	return {fonite, location, error}	
}

export const create_warning = (message:string, cause?:Cause):Message => {
	return create_message('warning', message, false, cause)
}

export const create_error = (message:string, cause?:Cause, reset?:boolean):Message => {
	let displayReset = (typeof reset !== 'boolean') ? false : reset;
	return create_message('error', message, displayReset, cause)
}

export const create_internal_error = (message:string, cause?:Cause):Message => {
	return {
		level: 'error',
		message: message,
		displayed: false,
		reset: false,
		cause
	}
}

export const reset_alert = (setAlertMessage:Function):void => {
	setAlertMessage(initialMessage)
}

export const get_boundary_error = (error:Error):Message => {
	const message = (error?.cause?.hasOwnProperty('fonite')) ? `${error.message}. ${CustomMsg.REF_IF_PERSIST}.` : `${CustomMsg.TECH_ERR}. ${CustomMsg.REFRESH}.`,
		  	cause:any = error?.cause;

  return create_error(message, cause, true);
}

export const is_message = (result:Message|any):boolean => {
	return !!(typeof result === 'object' && result?.level?.length > 0);
}

export const send_mail = (message:Message) => {
    const options = {
      publicKey: Email.publicKey
    }

    const template = {
    	level: message.level,
			message: message.message,
			displayed: (!!message.displayed) ? 'Utilisateur averti' : 'Message caché',
			fonite: 'Fonité inconnue',
			location: 'Fichier inconnu',
			error: 'Aucun détail transmis'
    }

    if (message?.cause)
    {
    	template.fonite = message.cause.fonite
			template.location = message.cause.location
			template.error = message.cause.error
    }

    emailjs.send(Email.serviceID, Email.templateID, template, options).then(
      (data) => {
        console.log('SUCCESS', data);
      },
      (error) => {
        console.log('FAILED', error.text);
      },
    )
}