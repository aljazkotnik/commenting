import { html2element } from "./helpers.js";

let template = `
<div class="comment">
  <div class="header"><b class="author"></b><span class="timestamp"></span></div>
  <div class="body"></div>
  <div class="footer">
    <button class="upvote">
	  <i class="fa fa-thumbs-up"></i>
	  <i class="vote-number"></i>
	</button>
	<button class="downvote">
	  <i class="fa fa-thumbs-down"></i>
	  <i class="vote-number"></i>
	</button>
	<button class="reply"><b>REPLY</b></button>
  </div>
</div>
`; // template



export default class Comment{
  user = "Aljaz"
	
  constructor(config){
	let obj = this;
	
	// Make a new node.
	obj.node = html2element(template);
	
	// Fill the template with the options from the config. There must be a comment, and there must be an author.
	obj.config = config;
	
	
	// Fill some options that may not be defined in config.
	obj.config.time      = config.time ? config.time : Date();
	obj.config.upvotes   = config.upvotes ? config.upvotes : [];
	obj.config.downvotes = config.downvotes ? config.downvotes : [];
	
	
	// Modify the node to reflect the config.
	let header = obj.node.querySelector("div.header");
	header.querySelector("b.author").innerText = config.author;
	
	let body = obj.node.querySelector("div.body");
	body.innerText = config.text;
	
	obj.update();
	
	
	// Add the upvoting and downvoting. Where will the author name come from?? The upvote/downvote buttons should also be colored depending on whether the current user has upvoted or downvoted the comment already. Maybe the top app should just push the current user to the elements, and then they can figure out how to handle everything. That means that the functionality can be implemented here.
	
	let footer = obj.node.querySelector("div.footer")
	footer.querySelector("button.upvote").onclick = function(){
		obj.upvote(obj.user);
	} // onclick
	
	footer.querySelector("button.downvote").onclick = function(){
		obj.downvote(obj.user);
	} // onclick
	
  } // constructor
  
  update(){
	// Only the time is allowed to be updated (if it will be calculated back), and the up and down votes.
	let obj = this;
	
	updateTimestamp();
	
	updateVoteCounter("upvote");
	updateVoteCounter("downvote");
	
	
	
	function updateTimestamp(){
		
		let timestamp = obj.node
		  .querySelector("div.header")
		  .querySelector("span.timestamp");
		
		// Dates are saved as strings for ease of comprehension. For formatting they are first translated into miliseconds passed since 1970.
		let t = obj.config.time;
		let now = Date.now();
		let stamp = Date.parse(t);
		
		let dayInMiliseconds = 1000*60*60*24;
		let todayInMiliseconds = getDayInMiliseconds(now);
		
		// Format the time so that it shows everything from today as n minutes/hours ago, everything from yesterday as yesterday at :... and everything else as the date. 
		if( stamp > now - todayInMiliseconds ){
			// This was today, just report how long ago.
			timestamp.innerText = getAgoFormattedString(now - stamp);
		} else if (stamp > now - todayInMiliseconds - dayInMiliseconds){
			// Yesterday at HH:MM
			timestamp.innerText = `Yesterday at ${t.split(" ").splice(4,1)[0]}`;
		} else {
			// Just keep the first 4 parts which should be day name, month name, day number, year number
			timestamp.innerText = t.split(" ").splice(0,4).join(" ")
		} // if
		
	} // updateTimestamp
	
	
	function updateVoteCounter(buttonClassName){
		
		let button = obj.node
		  .querySelector("div.footer")
	      .querySelector(`button.${ buttonClassName }`)
		
		
		let icon = button.querySelector("i.fa");
		let counter = button
		  .querySelector("i.vote-number");
		
		let n = 0;
		switch( buttonClassName ){
		  case "upvote":
		    n = obj.config.upvotes.length;
			counter.innerText = n > 0 ? n : "";
			icon.style.color = obj.config.upvotes.includes(obj.user) ? "green" : "black";
		    break;
		  case "downvote":
		    n = obj.config.downvotes.length;
			counter.innerText = n > 0 ? -n : "";
			icon.style.color = obj.config.downvotes.includes(obj.user) ? "tomato" : "black";
			break;
		} // swithc
	
	} // updateVoteCounter
	
  } // update
  
  upvote(author){
	let obj = this;
	pushValueToAWhichCompetesWithB(author, obj.config.upvotes, obj.config.downvotes);
	obj.update();
  } // upvote
	
  downvote(author){
	let obj = this;
	pushValueToAWhichCompetesWithB(author, obj.config.downvotes, obj.config.upvotes);
	obj.update();
  } // upvote
  
} // Comment


function pushValueToAWhichCompetesWithB(value, A, B){
    if(!A.includes(value)){
	  A.push(value)
	  if(B.includes(value)){
		B.splice(B.indexOf(value), 1)
	  } // if
	} // if
  } // pushValueToAWhichCompetesWithB
  
  
  
function getDayInMiliseconds(msdate){
	// 'msdate' is a date in miliseconds from 1970. Calculate how many miliseconds have already passed on the day that msdate represents.
	var d = new Date(msdate);
	return ( ( d.getHours()*60 + d.getMinutes() )*60 + d.getSeconds() )*1000 + d.getMilliseconds();
} // getDayInMiliseconds


function getAgoFormattedString(delta){
	// delta is the number of miliseconds ago for which this should return a human readable string. If delta is more than a day, then the result is returned as days.
	
	
	let seconds = Math.floor( delta/1000 );
	let minutes = Math.floor( seconds/60 );
	let hours   = Math.floor( minutes/60 );
	let days    = Math.floor( hours/24 );
	
	if(days > 0){
		return `${days} days ago`;
	} // if
	
	if(hours > 0){
		return `${hours} hours ago`;
	} // if
	
	if(minutes > 0){
		return `${minutes} minutes ago`;
	} // if
	
	return `${seconds} seconds ago`
	
} // getAgoFormattedString





















