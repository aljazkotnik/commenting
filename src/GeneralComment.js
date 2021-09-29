import { html2element } from "./helpers.js";
import Comment from "./Comment.js";
import ReplyComment from "./ReplyComment.js";

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
	
	obj.config.replies = config.replies ? config.replies : [];
	
	obj.update();
  } // constructor
  
  reply(replyconfig){
	let obj = this;
	
	// Make a comment node, and append it to this comment.
	let r = new ReplyComment(replyconfig);
	obj.config.replies.push(r);
	obj.replynode.querySelector("div.replies").appendChild(r.node);
	
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
	if(obj.config.replies){
	  let n = obj.config.replies.length;
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