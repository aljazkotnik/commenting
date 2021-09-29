import { html2element } from "./helpers.js";

/*
Maybe this one should be remade into a manager so it can keep add comments to itself. Otherwise they have to be routed outside.
*/
let css = `
width: 100%;
border: none;
resize: none;
overflow: hidden;
max-height: 100px;
`


let template = `
<div>
  <textarea class="comment" type="text" rows="1" placeholder="What do you think?" style="${css}"></textarea>
  <button class="submit"><b>Submit</b></button>
</div>
`; // template


export default class AddCommentForm{
  user = ""

  constructor(){
    let obj = this;
	
	obj.node = html2element(template);
	
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
  
  get config(){
	let obj = this;
	return obj.commentinput.value && obj.user ? {author: obj.user, text: obj.commentinput.value} : false;
  } // config
  
  
  
} // AddCommentForm