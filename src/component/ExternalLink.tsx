import {ReactElement, memo} from "react";
import {Link} from "constant/interfaces"

const ExternalLink = ({text, image, link, title}:Link):ReactElement => {
	return (
		<div className="link flex-center column gap-05">
			<p>{text}</p> 
			<img src={image} alt={title}/>
			<a href={link} target="_blank" rel="noreferrer" className="rozhaone-font" aria-label={`${title} - ${text}`}>{title}</a>
		</div>
	)
}

export default memo(ExternalLink);