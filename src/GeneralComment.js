import { html2element } from "./helpers.js";
import Comment from "./Comment.js";
import ReplyComment from "./ReplyComment.js";

// If a general comment owns its replies, then keeping the replies in control is easy. What happens when someone else make a reply on a separate client though, and the data is just pushed to this client? How should the reply be added to the right parent? Maybe the reply should have an identifier that can be constructed from the comment (e.g. view id + author name + time), and that can be used to merge the comments. Then everytime a comment is pushed to the storage an update can be fired? Also, how will the changes be communicated back to the server? Let the backend handle the updates - just find the comment with the proper id, and resolve the differences, and then push any comments that had differences. Maybe it's simpler to just adjust everything when the connection closes?

// Sort the comments before passing them to the comments below. How will replies be updated? Ultimately everything should be coming from the server??


// This is just a template for the controls which allow the replies to be expanded or collapsed. These are invisible at first.
let template = `
<div style="display: none;">
  <div class="expand-controls" style="color: blue; cursor: pointer;">
    <i class="fa fa-caret-down"></i>
	<i class="control-text">View replies</i>
  </div>
  <div class="replies" style="display: none;"></div>
</div>
`

// Maybe the general comments can be added on top, but the replies should follow in chronological order.
export default class GeneralComment extends Comment{
  
  replies = [];
  
  constructor(config){
    super(config)
	let obj = this;
	
	// The general comment can have replies associated with it. Handle these here. Furthermore an additional control for expanding, reducing hte comments is required.
	obj.replynode = html2element(template);
	obj.node.appendChild( obj.replynode );
	
	// Add the functionality to the caret.
	obj.repliesExpanded = false;
	obj.replynode.querySelector("div.expand-controls").onclick = function(){
	    obj.repliesExpanded = !obj.repliesExpanded;
		obj.update();
	} // onclick
	
	// Replies on the config need to be initialised. But actually, they should be stored as separate entries for ease of updating...
	
	obj.update();
  } // constructor
  
  reply(replyconfig){
	let obj = this;
	
	// Make a comment node, and append it to this comment.
	replyconfig.parentid = obj.id;
	let r = new ReplyComment(replyconfig);
	obj.replynode.querySelector("div.replies").appendChild(r.node);
	
	// Store both the object needed for interactivity and the config needed for saving.
	obj.replies.push(r);
	
	// Update the view.
	obj.update();
  } // reply
  
  update(){
	// Only the time is allowed to be updated (if it will be calculated back), and the up and down votes.
	let obj = this;
	
	// From superclass
	obj.updateTimestamp();
	obj.updateVoteCounter("upvote");
	obj.updateVoteCounter("downvote");
	
	// GeneralComment specific.
	obj.updateReplies();
  } // update
  
  updateReplies(){
	let obj = this;
	
	// First update is called when the superclass constructor is called.
	if(obj.replies){
	  let n = obj.replies.length;
	  obj.replynode.style.display = n > 0 ? "" : "none";
	
	  // View replies or hide replies
	  let s = n == 1 ? "y" : `ies (${n})`
	  obj.replynode
	    .querySelector("div.expand-controls")
	    .querySelector("i.control-text")
	    .innerText = obj.repliesExpanded ? `Hide repl${s}` : `View repl${s}`;
		
	  obj.replynode
	    .querySelector("div.expand-controls")
	    .querySelector("i.fa")
	    .classList.value = obj.repliesExpanded ? "fa fa-caret-up" : "fa fa-caret-down";
	
	  obj.replynode.querySelector("div.replies").style.display = obj.repliesExpanded ? "" : "none";
	} // if
  } // updateReplies
  
} // GeneralComment