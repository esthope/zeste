import {ReactElement, useEffect, useState, useRef, memo} from "react";
import {isMobile} from 'react-device-detect';
import convert_logo from 'assets/zeste.svg';
import {SITE_NAME, LABEL} from "constant/Configuration"

const Header = ({started}:{started:boolean}):ReactElement => {

	const [displayed, setDisplayed] = useState<boolean>(true),
		  keepRef = useRef<any>(false),
		  delayRef = useRef<any>(0);

	/**
	 * Hide the introductionafter 15 seconds
	 */
	const trigger_hiding_intro = ():void => {
		keepRef.current = false;

		delayRef.current = setTimeout(():void=>{
		clearInterval(delayRef.current)
			if (!keepRef.current) {setDisplayed(false)}
		}, 15000)
	}

	/**
	 * Hide the introductionafter when the user started writing
	 */
	useEffect(()=>{
		if (!isMobile && started)
		{
			setDisplayed(false)
		}
	}, [started])

	return (
		<header className="mb-5">
			<div id="header-content" className="flex fit-content"
			{...( !isMobile && started && displayed
				? {onMouseEnter: ()=>{keepRef.current = true},
					 onMouseLeave: ()=>{trigger_hiding_intro()}} 
				: {}
			)}>
	      <img src={convert_logo} className="ml-3 pointer" alt={SITE_NAME} aria-label={`${SITE_NAME} - ${LABEL}`}
	      {...( !isMobile && started
					? {onMouseEnter: ()=>{setDisplayed(true)}} 
					: {}
				)}/>
    		
    		<span className="fake-title mobile-title">{SITE_NAME}</span>
    		<div className={`intro fade-element left ${(displayed) ? 'fade-animation':''}`}>
    			<span className="fake-title desktop-title mb-1">{SITE_NAME}</span>
      		<p><b>Bienvenue sur {SITE_NAME}</b>, cet outil est un <h1>convertisseur de texte, de majuscule et de minuscule</h1> <b>– la casse –</b>, et permet de remplacer plusieurs lettres par d'autres en un seul coup.</p>
      		<p>Remplacer en masse le texte souhaité grâce à la sélection multiple. La sélection sera bleue en <span className="normal">sélection normale</span> et ocre en <span className="multi">sélection multiple</span> !</p>
      	</div>
			</div>
		</header>
	)
}
const HeaderMemo = memo(Header);
export default HeaderMemo;