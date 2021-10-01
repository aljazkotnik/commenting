/*
   DONE - Make a dataset of some test comments that get pushed from the server?
   DONE - Second level comments.
   DONE - Arranging the comments in hte right order.
       General comments are arranged with the most recent on top. Replies are in chronological order from top to bottom.
	   Needs to be implemented mainly for comments that come from the server!
   DONE - Textarea should be the whole width available
       It now is full width, but it should have an area.. Now its an area that even scales correctly. But the very long comments actually resize the whole item....
	   The width of the commenting should be kept at the width of the view element.
   DONE - Tags to differentiate discussions!
   DONE - Scrollable comments.
   DONE - make dataset comments more informative.
*/

import CommentingManager from "./src/CommentingManager.js";


// Make the comment managers needed for this session.
let allCommentingManagers = [];

let m0 = new CommentingManager("0");
document.querySelector("div.item0").appendChild(m0.node);
allCommentingManagers.push(m0);


let m1 = new CommentingManager("1");
document.querySelector("div.item1").appendChild(m1.node);
allCommentingManagers.push(m1);  

  
// Add the login info.
let login = document.querySelector("div.login").querySelector("input");
login.oninput = function(){
  allCommentingManagers.forEach(m=>{
	m.user = login.value;  
  }) // forEach
} // oninput
  

 
// There should be an owner id also. This will help differentiate comments among the views. The id could simply be the view metadata filename. This one will have to be unique anyway. Comments should also have tags, at least the primary ones. The tags to filter by should be prescribed by the chapters of the video.
let testComments = [
{author: "Aljaz", viewid: "0", time: "Thu Sep 30 2021 17:00:00 GMT+0100 (British Summer Time)", text: "Hi! This is an introduction to the comment system. These introductory comments are loaded from an external database that emulates the server response. Note that different items have different comments. To submit comments use the comment form, which can be seen above the horizontal line. To make a comment login in the top right corner of the screen by typing in an alias, and enter some text into the form. A submit button will appear."},

{author: "Aljaz", viewid: "0", time: "Thu Sep 30 2021 16:00:00 GMT+0100 (British Summer Time)", text: "Two types of comments are supported: general comments, and replies. This is a general comment. The newest general comment will always appear at the top of the comment window. To open a reply click the blue 'View reply/ies' control."},

{author: "Aljaz", viewid: "0", time: "Thu Sep 30 2021 16:00:01 GMT+0100 (British Summer Time)", text: "Contrary to general comments, the replies appear in chronological order, with the oldest at the top, and the newest at the bottom.", parentid: "0 Aljaz Thu Sep 30 2021 16:00:00 GMT+0100 (British Summer Time)"},

{author: "Aljaz", viewid: "0", time: "Thu Sep 30 2021 16:00:02 GMT+0100 (British Summer Time)", text: "To submit a reply, fill in the comment form, but instead of clicking the 'submit' button, click the 'reply' button next to the general comment you wish to reply to.", parentid: "0 Aljaz Thu Sep 30 2021 16:00:00 GMT+0100 (British Summer Time)"},

{author: "Aljaz", viewid: "0", time: "Thu Sep 30 2021 14:00:00 GMT+0100 (British Summer Time)", text: "Comments support voting, which depends on the login information in the top right corner. After voting the up or downvote buttons will reflect the selection. Each alias gets a single vote per comment. If you log in with a different alias the highlight will disappear. If you then change back to the original alias the selected vote will be highlighted again. You can event reduce the number of upvotes of this comment if you can guess the aliases used to make them.", upvotes: ["u0", "u1", "u2", "u3"]},

{author: "Aljaz", viewid: "0", time: "Thu Sep 30 2021 13:00:00 GMT+0100 (British Summer Time)", text: "The commenting system supports 'tagged discussions': tags that are added to the video can be discussed in isolation by clicking on the gray tag buttons just below the horizontal line. Clicking on a button will filter out all comments without the appropriate tag. This comment has a '#shock' tag, and will only appear if the shock discussion tag was selected, or if no tags are selected, in which case all comments are shown. Tags are added to comments automatically - all currently selected tags get added to the comment when it is submitted. This comment also has a reply. Replies don't have tags and appear and disappear with the comment they are replying to.", tags: ["#shock"]},

{author: "Aljaz", viewid: "0", time: "Thu Sep 30 2021 12:00:00 GMT+0100 (British Summer Time)", text: "The tags that are up for discussion are the tags the user has added as chapters to the video. Therefore, tags aim to promote discussion of specific features identified in the data.", tags: []},

{author: "Aljaz", viewid: "1", time: "Thu Sep 30 2021 11:00:00 GMT+0100 (British Summer Time)", text: "Note that different small multiples have different comments. There is currently no way yet to submit a comment that refers to more than 1 small multiple at a time, but once the comments are pushed directly to the server this will be possible."}

]; // testComments



// Some comments came back from the server side, add them to the views.
function sortCommentsBeforePushing(a,b){
	// The primary comments must be added first so that the replies can be added to them. The comments can just be sorted by time of creation. Replies can only be created after the primary comment.
	return Date.parse(a.time)-Date.parse(b.time)
} // sortCommentsBeforePushing

testComments.sort(sortCommentsBeforePushing).forEach(comment=>{
  allCommentingManagers.forEach(m=>{
	if(m.viewid == comment.viewid){
	  m.add(comment);
	  m.hideNonDiscussionComments();
	} // if  
  }) // forEach
}) // forEach




// These are the comments that the server would push after another client changed the comment. This could also be a brand new comment, so it should be processed through the add API.
let updateComments = [
{author: "Aljaz", viewid: "0", time: "Thu Sep 30 2021 17:00:00 GMT+0100 (British Summer Time)", text: "Hi! This is an introduction to the comment system. These introductory comments are loaded from an external database that emulates the server response. Note that different items have different comments. To submit comments use the comment form, which can be seen above the horizontal line. To make a comment login in the top right corner of the screen by typing in an alias, and enter some text into the form. A submit button will appear.", upvotes: ["u0", "u1", "u2", "u3", "u4"]},

{author: "Aljaz", viewid: "0", time: "Thu Sep 30 2021 16:00:01 GMT+0100 (British Summer Time)", text: "Contrary to general comments, the replies appear in chronological order, with the oldest at the top, and the newest at the bottom.", parentid: "0 Aljaz Thu Sep 30 2021 16:00:00 GMT+0100 (British Summer Time)", upvotes: ["u0", "u1", "u2", "u3", "u4"]}
]


// If a whole comment is sent over, how will the server resolve the differences? For example, two users upvote closely together, such that the server has not managed to push changes in between. Now change number 2 doesn't include change number 1, and thus change number 1 will be eliminated. Maybe just send the deltas over when updating? Still keep the local update though, so that frequent pushing from the server is unnecessary. Then the server CAN pass the whole comment back.

console.log(allCommentingManagers, updateComments)









