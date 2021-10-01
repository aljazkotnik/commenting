import { html2element } from "./helpers.js";
import AddCommentForm from "./AddCommentForm.js";
import GeneralComment from "./GeneralComment.js"; 
import DiscussionSelector from "./DiscussionSelector.js";

// Needs a way to minimise the commenting completely.
let template = `
<div class="commenting" style="width:300px;">
  <div class="hideShowText" style="cursor: pointer; margin-bottom: 5px; color: gray;">
    <b class="text">Show comments</b>
	<b class="counter"></b>
	<i class="fa fa-caret-down"></i>
  </div>
  <div class="commentingWrapper" style="display: none;">
    <div class="comment-form"></div>
    <hr>
    <div class="comment-tags"></div>
    <div class="comments" style="overflow-y: auto; max-height: 200px;"></div>
  </div>
</div>
`; // template


export default class CommentingManager{
  constructor(id){
    let obj = this;
	obj.node = html2element( template );
	obj.viewid = id;
	obj.comments = [];
	
	// Make the form;
    obj.form = new AddCommentForm(id);
    obj.node
	  .querySelector("div.comment-form")
	  .appendChild(obj.form.node);
  
    // Make both replies and general comments to use a single form.
    obj.form.submitbutton.onclick = function(){
	  let config = obj.form.config;
	  if(config){
	    // The form should only be cleared if a comment was successfully added.
	    config.tags = obj.discussion.selected.map(d=>d);
		obj.add(config);
	    obj.form.clear();
	  } // if
    } // onclick
	
	
	// Add the comment tags, which serve as selectors of the discussion topics. This should be another module. At the saem time this one will have to update when the module is updated. Maybe the placeholder reactions function should just be defined here??
	obj.discussion = new DiscussionSelector();
    obj.node
	  .querySelector("div.comment-tags")
	  .appendChild(obj.discussion.node);
    obj.discussion.update(["#vortex", "#shock"])
	obj.discussion.externalAction = function(){
		obj.hideNonDiscussionComments();
	} // externalAction
	
	
	// At the beginning show only general comments? Better yet, show no comments.
	obj.hideNonDiscussionComments();
	
	
	// Finally add teh controls that completely hide comments.
	let hsdiv = obj.node.querySelector("div.hideShowText");
	let cdiv = obj.node.querySelector("div.commentingWrapper");
	hsdiv.onclick = function(){
	  let hidden = cdiv.style.display == "none";
	  cdiv.style.display = hidden ? "" : "none";
	  
	  // It changed from hidden to show, but hidden is past state.
	  hsdiv.querySelector("b.text").innerText = hidden ? "Hide comments" : "Show comments";
	  hsdiv.querySelector("i").classList.value = hidden ? "fa fa-caret-up" : "fa fa-caret-down";
	} // onclick
	
  } // constructor
  
  hideNonDiscussionComments(){
	let obj = this;
	obj.comments.forEach(comment=>{
      // This should really be select any!
	  let pertinent = (obj.discussion.selected.length == 0) 
	               || (obj.discussion.selected.some(d=>comment.config.tags.includes(d)));
	  comment.node.style.display = pertinent ? "" : "none";
	}) // forEach
  } // hideNonDiscussionComments
  
  
  updateCommentCounter(){
	let obj = this;
	
	let n = obj.comments.reduce((acc,c)=>{
		acc += 1
		acc += c.replies.length;
		return acc
	},0)
	let counterNode = obj.node
	  .querySelector("div.hideShowText")
	  .querySelector("b.counter");
	counterNode.innerText = n ? `(${n})` : "";
	
  } // updateCommentCounter
  
  
  add(config){
	// When the comments are loaded from the server they will be added through this interface. Therefore it must handle both the primary and secondary comments.
	let obj = this;
	
	if(config.parentid){
	  // Comments that have a parent id are replies. Find the right parent comment.
	  obj.addReplyComment(config);
	} else {
	  // It's a general comment. 
	  obj.addGeneralComment(config);
	} // if
	
	// Update the comments count.
	obj.updateCommentCounter();
  } // add
  
  addReplyComment(config){
	let obj = this;
	
	let parent = findArrayItemById(obj.comments, config.parentid);
	if(parent){
	  parent.reply(config);
	} // if
  } // addReplyComment
  
  addGeneralComment(config){
	let obj = this;
	  
	// If there is an existing one, that one should be updated. Whatever is coming from the server is the truth. Maybe it'll be simpler just to replace the comment in that case?? The comment config does not contain hte comment id, which is computed....
	
	
	// Generally new comments should be attached at teh top. Here the attachment point is variable to reuse this method as a way to replace an existing comment with the same id.
	
	
	let c = new GeneralComment(config);
	
	// Remove the existing one, and replace it with the current one.
	let existing = findArrayItemById(obj.comments, c.id)
	if(existing){
	  obj.replaceGeneralComment(existing, c);
	} else {
		
	  obj.comments.push(c);
	  
	  // Add the functionality to add secondary comments:
	  c.node.querySelector("button.reply").onclick = function(){
	    if(obj.form.config){
		  c.reply(obj.form.config);
		  obj.form.clear();
	    } // if
	  } // onclick
	
	  // Insert the new comment at teh very top.
	  let container = obj.node.querySelector("div.comments");
	  container.insertBefore(c.node, container.firstChild);
	} // if
  } // addGeneralComment
  
  
  replaceGeneralComment(existing, replacement){
	// For simplicity handle the replacing of hte comment here.
	let obj = this;
	
	// Update the internal comments store.
	obj.comments.splice(obj.comments.indexOf(existing), 1, replacement);
	
	// Update teh DOM.
	let container = obj.node.querySelector("div.comments");
	container.insertBefore(replacement.node, existing.node);
  } // replaceGeneralComment
  
  
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
  
  getCommentsForSaving(){
	// The obj.comments is an array of GeneralComment instances, and just the configs have to be collected before being passed on. Collect them here.
	let obj = this;
	// Note that the general comments hold the reply comments. Extract the secondary comments here and store them in a single layer array for ease of updating the changes on the server.
	return obj.comments.reduce((acc,comment)=>{
		acc.push(comment.config)
		acc.push(...comment.replies.map(reply=>reply.config))
		return acc
	},[])
  } // getCommentsForSaving
  
} // CommentingManager


function findArrayItemById(A, id){
  let candidates = A.filter(a=>{
	return a.id == id;
  }) // filter
  
  return candidates.length > 0 ? candidates[0] : false;
} // findArrayItemById

function arrayIncludesAll(A,B){
  // 'arrayIncludesAll' checks if array A includes all elements of array B. The elements of the arrays are expected to be strings.
	
  // Return element of B if it is not contained in A. If the response array has length 0 then A includes all elements of B, and 'true' is returned.
  var f = B.filter(function(b){
	return !A.includes(b)
  })
	
  return f.length == 0? true : false
} // arrayIncludesAll



























