//*****************************************************************************
// INBENTA BODY PARSER
// 
// parsing the body of messages received by Inbenta's chatbots

const pause = '<break time=\"1s\"/> ';
const tagCleaner = require('../../../utilities/tagCleaner');

const appendNewText =function(currentText, addedText) {
    if (addedText && typeof addedText === 'string' && addedText.length > 0) {
      let newText = addedText;
      // add a pause before the new text if required
      if(currentText.length > 0) newText = pause.concat(newText);
      newText = currentText.concat(newText);
      return newText;
    } else return currentText;
  };

module.exports = function(input) {
  const { session, message} = input;
  let vocalMessage = ''
  let answers = message.answers;
  let configuration = session.chatbot.configuration;
    
  answers.forEach( answer => {
    switch (answer.type) {
      case 'answer' :
        if (!answer.flags.includes('no-subset-match')) {  
          var newText = tagCleaner(answer.message);
          vocalMessage = appendNewText(vocalMessage, newText);
        };
        break;
      case 'polarQuestion' :
        var newText = tagCleaner(answer.message);
        vocalMessage = appendNewText(vocalMessage, newText);
        if(typeof configuration.addPolarQuestion === 'boolean' && configuration.addPolarQuestion === true) {
           const polarQuestion = configuration.polarQuestion ? configuration.polarQuestion : '';
           vocalMessage = appendNewText(vocalMessage, polarQuestion);
        }
        break;
      case 'extendedContentsAnswer' :
        var newText = configuration.referToWebsite ? configuration.referToWebsite : 'configuration error';
        vocalMessage= appendNewText(vocalMessage, newText);
        break;
      case 'multipleChoiceQuestion' :
        var newText = tagCleaner(answer.message);
        vocalMessage = appendNewText(vocalMessage, newText);
        if (answer.options && answer.options.length > 0) answer.options.forEach( option => {
          vocalMessage = appendNewText(vocalMessage, option.label);
        });
        break;
      default: 
        throw `unknown message type ${answer.type}`;
    }
  });
 return { reply: vocalMessage, context: {} };
};

