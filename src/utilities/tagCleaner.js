
const pause = '<break time=\"1s\"/> '
// RegExp constants
const openAngleBracket         = /&lt;/g;                              // Open angle brackets in escaped format
const closeAngleBracket        = /&gt;/g;                              // Close angle brackets in escaped format
const firstTagRegExp           = /<[^>]*>/;                            // Find the first tag
const singleTagRegExp          = /<[\s\S]*\/>$/;                       // Single TAG
const tagTypeRegExp            = /^<\s*([\w|-]+)[\s\S]*>$/;                // Extract the tag type
const specialCharRegExp        = /(&#160;|&#xA0;)/g;                   // Special chars to be removed
const pauseAtTheEnd            =  new RegExp(`^.*${pause}$`,'i');      // Check if there is pause at the end of the string
const lineBreak                = /(\n\s+)+/g;                          // line brea
const multipleSpaces           = /\s\s+/g;                             // multiple spaces

// Known tags
const ssmlTags = ['audio', 'break', 'emphasis', 'p', 's', 'phoneme', 'prosody', 'say-as'];
const pmbTags = ['context','hungup','prompt','transfer'];
const breaks = ['li'];

function removeUnnecessaryTags(string) {
  let newString = string;
  // Find the first tag in the string
  const firstTag = newString.match(firstTagRegExp);
  // If there is not tag the work is over
  if(firstTag == null ) return string;
  // Define the first part of the string (before the tag)
  const firstPart = newString.slice(0, firstTag.index);
  // Extract the info to identify the tag type
  const tagType = firstTag[0].match(tagTypeRegExp);
  if(!tagType) throw { code : 'BIS001', details: `syntax error tag: ${firstTag[0]} - string: ${newString}` };
  // Tag name 
  const tagName = tagType[1];
  if(!tagName) throw { code : 'BIS002', details: `syntax error tag: ${firstTag[0]} - string: ${newString}` };
  // Is it a single tag?
  const singleTag = singleTagRegExp.test(tagType[0]);
  // find closingTag in case of pair tags
  const closingTag = !singleTag
  ?  newString.match(new RegExp(`<\/\\s*${tagName}\\s*>`))
  : null;
  // If it is a pair tag it should have a closing tagß
  if(!singleTag && !closingTag) throw { code : 'BIS003', details: `syntax error in bot string: ${newString}` };
  // define the string in beween pair tags
  const inBetween = !singleTag
  ? removeUnnecessaryTags(newString.slice(firstTag.index + firstTag[0].length, closingTag.index))
  : '';
  // find the last part of the string
  const lastPart = !singleTag
  ? removeUnnecessaryTags(newString.slice(closingTag.index + closingTag[0].length, newString.length))
  : removeUnnecessaryTags(newString.slice(firstTag.index + firstTag[0].length, newString.length))
  // Is the tag to be preserved ?
  const toBePreserved = ssmlTags.concat(pmbTags).includes(tagType[1]);
  // Does the tag requires a break?
  const requiresBreak = breaks.includes(tagType[1]);
  // Recompose the new string
  newString = firstPart                         // First part of the new string
  .concat( toBePreserved ? firstTag[0] : '')    // The tag if it should be preserved
  .concat ( inBetween )                         // The part of the string between pair tags
  .concat ( toBePreserved && !singleTag ? closingTag[0] : '') // The possible closing tag if it should be preserved
  .concat ( requiresBreak  ? pause : '')        // Adding a pause if there is a break
  .concat ( lastPart);

  // DONE!

  return newString;

}


function tagCleaner (string) {
  let newString = string
  .replace(openAngleBracket,'<')    // replacing escaped angle brackets with actual angle brackets
  .replace(closeAngleBracket,'>');  // ...
  try {
    newString = removeUnnecessaryTags(newString);                  // remove unnecessary tags
  } catch (e) {
    throw e;
  }
  //newString = newString.replace(specialCharRegExp, "");            // remove other spcial html chars
  newString = newString.replace(lineBreak, pause);                 // substitute line breaks with pauses
  newString = newString.replace(multipleSpaces, ' ');              // one space max
  newString = pauseAtTheEnd.test(newString) 
  ? newString.slice(0,- pause.length) : newString;                 // remove pause at the end if any
  newString = newString.trim();                                    // remove spaces before and after
  // Done(!)
  return newString;
}
  
module.exports = tagCleaner;
