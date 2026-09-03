import linkedinLogo from 'assets/linkedin.svg';
import githubLogo from 'assets/github.svg';
import kofiLogo from 'assets/kofi.svg';

const SITE_NAME = "Zeste";

const Links = [
	{
		text: "Les autres travaux du créateur",
		image: githubLogo,
		link: "https://github.com/esthope",
		title: "Github"
	},
	{
		text: "Contactez moi directement",
		image: linkedinLogo,
		link: "https://www.linkedin.com/in/luciledemongeot",
		title: "LinkedIn"
	},
	{
		text: "Soutenez en faisant un don",
		image: kofiLogo,
		link: "https://ko-fi.com/zeste_convert",
		title: "Ko-fi"
	}
]

const Email = {
	serviceID: 'service_ci8vcfm',
	templateID: 'template_5hpquz7',
	publicKey: 'SzgJIs_mogwx8X71E'
}

export {SITE_NAME, Links, Email}