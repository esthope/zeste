// main
import {ErrorBoundary} from "react-error-boundary"
import {ReactElement, useState} from "react"
import {Outlet} from 'react-router-dom'
// element
import {create_internal_error, create_cause, send_mail} from 'util/errorHandler'
import UnavailableScreen from 'screen/UnavailableScreen'
import backgroundImage from "assets/footer_bg.svg"
import ExternalLink from 'component/ExternalLink'
import {Link} from "constant/interfaces"

import {Links} from 'constant/Configuration'

const Template = ():ReactElement => {

	const [isError, setIsError] = useState(false)

	const onError = (err:any) => {
		const cause = create_cause('GENERAL', 'C-TEMPLATE', err),
			  	errorMsg = create_internal_error('Alerte au crash !', cause)
		send_mail(errorMsg)
		setIsError(true)
	}

	const year = new Date().getFullYear()

	return (
	<>
    	<ErrorBoundary onError={onError} FallbackComponent={UnavailableScreen}>
				<Outlet />
    	</ErrorBoundary>

      <footer className="self-end flex-end column gap-3">
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
	    	{!isError && <img id="footer-bg" src={backgroundImage} alt="Arrière plan du site" />}
      </footer>
	</>
	)
}

export default Template