export function html2element(html){
  let template = document.createElement('template'); 
  template.innerHTML = html.trim(); // Never return a text node of whitespace as the result
  return template.content.firstChild;
} // html2element

export function joinDataToElements(data, elements, idAccessor){
  
  // Find data that has no elements, find the elements that have data, and the leftover.
  let elementsArray = [...elements];
  let elementsDataIds = elementsArray.map(el=>idAccessor(el.__data__));
  
  
  let g = elementsArray.reduce((acc,el)=>{
	let d = data.filter(d_=>{
		return idAccessor(el.__data__) == idAccessor(d_)
	}) // filter
	if( d.length > 0 ){
	  el.__data__ = d[0]
	  acc.update.push(el)
	} else {
	  acc.exit.push(el)
	} // if
	return acc
  }, {update: [], exit: []}) // filter
  
  g.enter = data.filter(d=>{
	return !elementsDataIds.includes(idAccessor(d))
  }) // filter
  
  return g
} // joinDataToElements