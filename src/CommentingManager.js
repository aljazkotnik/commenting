import { html2element } from "./helpers.js";
import AddCommentForm from "./AddCommentForm.js";
import GeneralComment from "./GeneralComment.js"; 
  
  
let template = `
<div class="commenting" style="width:300px;">
  <div class="comment-form"></div>
  <hr>
  <div class="comments" style="overflow-y: auto; max-height: 200px;"></div>
</div>
`; // template


export default class CommentingManager{
  constructor(){
    let obj = this;
	obj.node = html2element( template );
	obj.comments = [];
	
	// Make the form;
    obj.form = new AddCommentForm();
    obj.node
	  .querySelector("div.comment-form")
	  .appendChild(obj.form.node);
  
    // Make both replies and general comments to use a single form.
    obj.form.submitbutton.onclick = function(){
	  if(obj.form.config){
		
	    // This should be moved out when the CommentManager is made.
	    let c = obj.add(obj.form.config);
	    obj.form.clear();
	    
	    // Add the functionality to add secondary comments:
	    c.node.querySelector("button.reply").onclick = function(){
		  if(obj.form.config){
		    c.reply(obj.form.config);
		    obj.form.clear();
		  } // if
	    } // onclick
	  } // if
    } // onclick
  } // constructor
  
  add(config){
	let obj = this;
	let c = new GeneralComment(config);
	obj.comments.push(c);
	
	// Insert the new comment at teh very top.
	let container = obj.node.querySelector("div.comments");
	container.insertBefore(c.node, container.firstChild);
	return c;
  } // add
  
  set user(name){
	let obj = this;
	
	// The form has a change of author.
	obj.form.user = name;
	
	// The comment appearance and functionality changes depends on who is checking them.
	obj.comments.forEach(comment=>{
	  comment.user = name;
	  comment.update();
	}) // forEach
  } // set user
} // CommentingManager