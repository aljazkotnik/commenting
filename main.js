import CommentingManager from "./src/CommentingManager.js";

let m = new CommentingManager();
document.querySelector("div.item").appendChild(m.node);
  
  
// There should be a reply form as well. Should the comments in general be in reverse order? At some point the sorting of comments will be needed also. Should secondary comments be visible straight away, or should they be added only after expanding replies? Eventually the comment owner should have the ability to edit their comment, like on stackexchange?
  
// Maybe the single comment form should be kept, but instead allow different buttons to collect the content? So the user fills in the comment, and then if they hit submit it is a general comment, and a reply otherwise. Would make sense, as the secondary for should be appended to the general comment anyway.
  
  
// Add the login info.
let login = document.querySelector("div.login").querySelector("input");
login.oninput = function(){
  m.user = login.value;
} // oninput
  
/*
   - Make a dataset of some test comments that get pushed from the server?
   DONE - Second level comments.
   DONE - Arranging the comments in hte right order.
       General comments are arranged with the most recent on top. Replies are in chronological order from top to bottom.
	   Needs to be implemented mainly for comments that come from the server!
   DONE - Textarea should be the whole width available
       It now is full width, but it should have an area.. Now its an area that even scales correctly. But the very long comments actually resize the whole item....
	   The width of the commenting should be kept at the width of the view element.
   - Tags to differentiate discussions!
   DONE - Scrollable comments.
*/
 
 
 
let sampleComments = [
  {author: "Aljaz", text: "This is a test comment to allow work on styling etc.", upvotes: ["Hanna", "Bram", "George"], downvotes: ["Pawel"]},
  {author: "Graham", text: "Good work.", upvotes: ["Hanna", "Bram", "George", "Pawel"]}
]
  
// How to append these comments when they arrive? Maybe that is for the general comment manager class to implement? And the comment itself should take care of its replies. So there should be a primary comment class, and a secondary comment reply. And the comment should append or remove the secondary ones as needed. Then the primary comments can just be sorted in the time order, or if needed some can be fitlered out.

// Sort the comments before passing them to the comments below. How will replies be updated? Ultimately everything should be coming from the server??