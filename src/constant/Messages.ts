// Internal
const SHORTKEY_OK = 'Les raccourcis clavier sont encore disponibles',
		TECH = 'Une erreur technique empêche',
	  FONCTION = 'fonctionnement',
	  RIGHT_TECH = `${TECH} le`,
	  TRAITMENT = 'traitement',
	  MAY = 'Il se peut que',
	  BTN = 'des boutons',
	  PAGE = 'de la page',
	  PAST = 'le collage',
	  COPY = 'la copie';

// dev
export const EMPTY_DATA = 'Les données n\'ont pas pu être récupérées depuis le JSON.',
			PAST_FAILED = `Impossible de faire ${PAST} avec le raccourcie clavier`

// basic
export const TECH_ERR = `${RIGHT_TECH} ${TRAITMENT} ${PAGE}`,
	  TECH_BTN = `${RIGHT_TECH} ${FONCTION} ${BTN}`,
	  DEV = 'L\'équipe technique a été prévenue',
	  NOT_FOUND = 'Cette page n\'existe pas',
	  HTTP_NOT_FOUND = '404',
	  OOPS = 'Oups...';

// user
export const REFRESH = 'Veuillez rafraîchir',
	  ALERT = "Consultez le message d'erreur en bas de la fenêtre",
	  REF_IF_PERSIST = `${REFRESH} si cela persiste`,
	  HOME_PAGE = `Retourner à la page d'accueil`,
	  REFRESH_PAGE = 'Rafraichir la page',
	  LATTER = 'réessayez plus tard',
	  TO_PAST = 'coller',
	  TO_CUT = 'couper';

// component
export const PLEASE_FOCUS = 'Vous pouvez coller du texte seulement en ayant le focus dans le champs de l\'éditeur',
	  SHORTKEY = `${MAY} le raccourcie clavier n'ait pas fonctionné`,
		EDITOR = "L'éditeur est indisponible",
	  CASES = `${TECH_BTN} de la casse`,
	  // text
	  TEXT_UP = `Un soucis technique peut avoir empêché la mise à jour d'une partie du texte.`,
	  TEXT_UNCHANGED = `Le texte n'a pas pu être changé. ${REF_IF_PERSIST}.`,
	  // actions
	  EMPTY_FIELD = 'Saisissez du texte dans le champs de remplacement pour remplacer votre sélection',
	  ACTIONS = `${TECH_BTN} des actions copier • coller • couper • réinitialiser. ${SHORTKEY_OK}`,
	  ACTION_FAILED = `Votre action n'a pas pu aboutir à cause d'un soucis technique. ${DEV}.`,
	  CB_NOT_ALLOWED = 'Vous devez autoriser le site à accéder au presse-papier pour pouvoir',
	  PAST_ERR = `${TECH} ${PAST} du texte. ${DEV}.`,
	  COPY_ERR = `${TECH} ${COPY} du texte. ${DEV}.`,
	  NOTHING_PAST = `Il n'y a rien à coller.`;

// selection
export const MULTI_SELECT = 'Sélection multiple',
		SELECT_PLEASE = `Aucun texte à remplacer ne semble sélectionné.\nPour sélectionner à plusieurs endroit dans votre textes, appuyez sur le bouton ${MULTI_SELECT}`,
		SELECT_FAILED = `La sélection n'a pas pu être effectuée`,
	  REINIT_SELECT = 'Réinitialiser la sélection';

// labels
export const ERROR = 'erreur',
	WARNING = 'alerte';