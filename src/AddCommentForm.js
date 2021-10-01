import { html2element } from "./helpers.js";

/*
Maybe this one should be remade into a manager so it can keep add comments to itself. Otherwise they have to be routed outside.
*/
let css = {
  textarea: `
    width: 100%;
    border: none;
    resize: none;
    overflow: hidden;
    max-height: 100px;
  `,

  submitbutton: `
    color: white;
	background-color: black;
	border-radius: 4px;
  `
}; // css



let template = `
<div>
  <textarea class="comment" type="text" rows="1" placeholder="What do you think?" style="${css.textarea}"></textarea>
  <button class="submit" style="${css.submitbutton}"><b>Submit</b></button>
</div>
`; // template


export default class AddCommentForm{
  _user = ""

  constructor(id){
    let obj = this;
	
	obj.node = html2element(template);
	obj.viewid = id;
	
	// Author input got omitted because the author also needs to be known when voting on a comment, and I didn't want to implement an input there. That's why now there will be an overall login box that will control everything.
	obj.commentinput = obj.node.querySelector("textarea.comment");
	obj.submitbutton = obj.node.querySelector("button.submit");
	
	
	obj.commentinput.style.display = "block";
	obj.submitbutton.style.display = "none";
	
	
	obj.commentinput.oninput = function(){
	  obj.update();
	} // oninput
	
  } // constructor
  
  
  update(){
	let obj = this;
	
	// Change the height
	obj.commentinput.style.height = "1px";
    obj.commentinput.style.height = (obj.commentinput.scrollHeight)+"px";
	
	// Show or hide button.
	obj.submitbutton.style.display = obj.config ? "block" : "none";
  } // update
  
  
  clear(){
	let obj = this;  
	obj.commentinput.value = "";
    obj.update()
  } // clear
  
  set user(name){
	this._user = name;
	this.update()
  } // set user
  
  get user(){
	return this._user;
  } // get user
  
  get config(){
	let obj = this;
	return obj.commentinput.value && obj.user ? {author: obj.user, viewid: obj.viewid,text: obj.commentinput.value} : false;
  } // config
  
  
  
} // AddCommentForm