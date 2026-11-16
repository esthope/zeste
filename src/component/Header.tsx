import {ReactElement, useEffect, useState, useRef, memo} from "react";
import {isMobile} from 'react-device-detect';
import convert_logo from 'assets/zeste.svg';
import {SITE_NAME, LABEL, LABEL_SHORT} from "constant/Configuration"

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

	const DescriptionText = ({device, hidden}:{device:string, hidden:boolean}) =>( 
			<div className={`intro ${device}-content`} aria-hidden={hidden}>
				<p><b>Bienvenue sur {SITE_NAME}</b>, cet outil est un convertisseur de texte, de majuscule et de minuscule <b>– la casse –</b>, et permet de remplacer plusieurs lettres par d'autres en un seul coup.</p>
				<p>Remplacer en masse le texte souhaité grâce à la sélection multiple. La sélection sera bleue en <span className="normal">sélection normale</span> et ocre en <span className="multi">sélection multiple</span> !</p>
			</div>
	)

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
    		
    		<div className={`fade-element left gap-2 ${(displayed) ? 'fade-animation':''}`}>
					<div className="flex column">
						<span className="fake-title">{SITE_NAME}</span>
	    			<h1 className="capitalize">{LABEL_SHORT}</h1>
	    		</div>

      		<DescriptionText device="desktop" hidden={isMobile} />
      	</div>

      	<DescriptionText device="mobile" hidden={!isMobile} />
			</div>
		</header>
	)
}
const HeaderMemo = memo(Header);
export default HeaderMemo;