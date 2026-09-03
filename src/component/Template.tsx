// main
import {ErrorBoundary} from "react-error-boundary";
import {Outlet} from 'react-router-dom';
import {ReactElement} from "react";
// element
import {Link} from "constant/interfaces"
import UnavailableScreen from 'screen/UnavailableScreen';
import ExternalLink from 'component/ExternalLink';
import {create_internal_error, create_cause, send_mail} from 'util/errorHandler';

import {Links} from 'constant/Configuration'

const Template = ():ReactElement => {

	const onError = (err:any) => {
		const cause = create_cause('GENERAL', 'C-TEMPLATE', err),
			  errorMsg = create_internal_error('Alerte au crash !', cause)
		send_mail(errorMsg)
	}

	const year = new Date().getFullYear()

	return (
	<>
    	<ErrorBoundary onError={onError} FallbackComponent={UnavailableScreen}>
			<Outlet />
    	</ErrorBoundary>

        <footer className="self-end flex-end column index-1 gap-3">
        	<div className="flex">
        		{Links.map((link:Link):any => (
	        		<ExternalLink
	        		key={link.title}
	        		text={link.text}
	        		image={link.image}
	        		link={link.link}
	        		title={link.title}
	        		/>
        		))}
        	</div>
        	<span className="rozhaone-font">Copyright © {year} • Tous droits réservés</span>
        </footer>
	</>
	)
}

export default Template;