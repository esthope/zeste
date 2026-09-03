import {RawDraftContentBlock, RawDraftContentState} from "draft-js";

export type Block = RawDraftContentBlock; //
export type Raw = RawDraftContentState;

export type Cause = {
	fonite:string,
	location:string,
	error:string
}

export type Selection = {
	anchor_key: string
	offset: number,
	length: number,
	focus?: number,
	style?: string
}

export type EditorSelection = {
	anchorKey: string,
	anchorOffset: number,
	focusKey: string,
	focusOffset: number,
	hasFocus: boolean,
	isBackward: boolean
}

export interface StringIndex {
    [index: string]: any
}

export interface Interaction {
	data_id:string,
	entry:string,
	unactive?:boolean,
	label?:string,
	title?:string,
	shift:boolean,
	focus:boolean|null,
	key:string
}

export interface Message {
	level:string,
	message?:string|null,
	displayed:boolean|null,
	reset?:boolean,
	cause?:Cause
}

export interface SvgType {
	fill:string,
	stroke:string
}

export interface Link {
	text: string,
	image: string,
	link: string,
	title: string
}

export interface History {
	content_id:number,
	content:string,
	active: boolean
}