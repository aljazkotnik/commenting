import { html2element, joinDataToElements } from "./helpers.js";

let template = `
<div style="margin-bottom: 5px;"></div>
`; // template

// Maybe make them grey with italis writing?
let css = `
border: none;
background-color: gainsboro;
margin-right: 2px;
`; // css
let tagtemplate = `
<button style="${ css }"><i></i></button>
`;

// A general tag should always be present. This tag should then show all comments without tags.
export default class DiscussionSelector{
  
  tags = []
  selected = [] 
  
  
  constructor(){
    let obj = this;
	obj.node = html2element(template);
	
	
  } // constructor
  
  update(newtags){
	let obj = this;

	if(newtags){
	  // Replace the tags if necessary.
	  obj.tags = newtags;
	  obj.selected = obj.selected.filter(d=>newtags.includes(d));
	  obj.externalAction();
	} // if

	let buttons = joinDataToElements(obj.tags, obj.node.querySelectorAll("button"), d=>d);
	
	buttons.enter.forEach(d=>{
		let el = html2element(tagtemplate);
		obj.node.appendChild( el );
		el.querySelector("i").innerText = d;
		el.__data__ = d;
		
		el.onclick = function(){
			obj.toggle(el);
		} // onclick
	}) // forEach
	
	buttons.exit.forEach(button=>button.remove())
	  
  } // update
  
  toggle(el){
	let obj = this;
	if(obj.selected.includes(el.__data__)){
		obj.selected.splice(obj.selected.indexOf(el.__data__),1);
		el.style.fontWeight = "";
	} else {
		obj.selected.push(el.__data__)
		el.style.fontWeight = "bold";
	} // if
	
	obj.externalAction();
  } // toggle
  
  // placeholder for actual action
  externalAction(){} // externalAction
} // DiscussionSelector