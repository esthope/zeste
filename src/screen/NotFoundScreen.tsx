// main
import {ReactElement} from 'react';
import * as CustomMsg from 'constant/Messages';
import * as ConfigText from "constant/Configuration"
// elements
import errorIcon from "assets/error.svg"
import warnIcon from "assets/warn.svg"
import orangeIcon from "assets/orange.svg"
import convertIcon from "assets/zeste.svg"

const NotFound = ():ReactElement => {
	return (
		<>
		<header id="header-content" className="ml-3 index-1 flex"> 
    	<img src={orangeIcon} alt="" />

    	<div className="bg-transparent">
    		<span className="fake-title block">{ConfigText.SITE_NAME}</span>
    		<h1 className="capitalize">{ConfigText.TITLE}</h1>
    	</div>
		</header>

    <main id="error-page" className="m-0 flex no-overflow">
    	<img src={convertIcon} alt="" />
    	<img src={warnIcon} alt="" />

    	<div className="error-message flex no-wrap">
				<img src={errorIcon} alt="" />

				<div className="bg-transparent self-center index-1">
					<div className="rozhaone-font flex align-center justify-end reverse p-0 mb-1">
						<span className="notfound-title">{CustomMsg.HTTP_NOT_FOUND}</span>
						<span className="rozhaone-font warning-color">Erreur</span>
					</div>

					<p>{CustomMsg.NOT_FOUND}.</p>
					<a href="/" className="block mt-08">{CustomMsg.HOME_PAGE}</a>
				</div>
    	</div>
    </main>
		</>
	)
}

export default NotFound;