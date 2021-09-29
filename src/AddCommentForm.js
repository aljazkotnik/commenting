import { html2element } from "./helpers.js";

/*
Maybe this one should be remade into a manager so it can keep add comments to itself. Otherwise they have to be routed outside.
*/

let template = `
<div>
  <input class="comment" type="text" placeholder="What do you think?">
  <button class="submit"><b>Submit</b></button>
</div>
`; // template


export default class AddCommentForm{
  user = ""

  constructor(){
    let obj = this;
	
	obj.node = html2element(template);
	
	// Author input got omitted because the author also needs to be known when voting on a comment, and I didn't want to implement an input there. That's why now there will be an overall login box that will control everything.
	obj.commentinput = obj.node.querySelector("input.comment");
	obj.submitbutton = obj.node.querySelector("button.submit");
	
	
	obj.commentinput.style.display = "block";
	obj.submitbutton.style.display = "none";
	
	
	obj.commentinput.oninput = function(){
	  obj.update();
	} // oninput
	
	obj.submitbutton.onclick = function(){
	  if( obj.isCommentConfigured ){
	    obj.addNewComment({author: obj.user, text: obj.commentinput.value})
		obj.clear();
	  } // if
	} // 
	
  } // constructor
  
  
  update(){
	let obj = this;
	obj.submitbutton.style.display = obj.isCommentConfigured ? "block" : "none";
  } // update
  
  
  clear(){
	let obj = this;  
	obj.commentinput.value = "";
    obj.update()
  } // clear
  
  get isCommentConfigured(){
	let obj = this;
	return obj.commentinput.value && obj.user;
  } // isCommentConfigured
  
  // This is a method that is a placeholder here, but will be overwritten when the module is plugged into its place. This allows the required check to be done within this class and doesn't need to be reimplemented later.
  addNewComment(config){
	console.log(`${config.author} thinks that: ${config.text}`);
  } // addNewComment
  
} // AddCommentForm