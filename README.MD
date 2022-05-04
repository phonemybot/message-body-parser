# PhoneMyBot bodyParser

## Introduction

The present `bodyparser` is a software module integrated with [PhoneMyBot](https://www.phonemybot.com).

**PhoneMyBot** is a Platform as a Service that includes all you need to interact with your chatbot by voice, using the telephone or recorded messages, with ready-made integrations with the telephone network, speech services and contact centers. You may learn more about it visiting our [wiki](https://wiki.phonemybot.com)

**PhoneMyBot** comes with a **chatbot adaptor** and few ready made connectors that anable you to integrate different chatbots without any development or integration effort.

The `bodyParser` is a light weight script code, at the the core of the connectors, and its scope is to convert the body of the messages sent by the chatbots as a valid message for the **chatbot adaptor**  which means plain text + [ssml tags](https://wiki.phonemybot.com/en/direct-api/SSML-support) + [call control tags](https://wiki.phonemybot.com/en/direct-api/callcontrol-ML) + [context tags](https://wiki.phonemybot.com/en/).


## Code organization

The organization of the code is pretty straightforward. 

In `src` folder you  find the `connectors` folder, and inside it you find different folders for different chatbot version. The code of the `bodyParser`, for each chatbot version, is available in the file named `bodyParser.js`.


## Test and validation

Test data, for each parser, is provided in `test/parsers/{chatbot}/{version}/data`. Each json file in this folder corresponds to a single test.
The json structure of the tests include the following elements:
- `title`: title of the test
- `description`: some context related with the scope of the test
- `body`: sample message body to be parsed
- `vocalMessage`: expected output of the `bodyParser`.

All the tests can be run esecuting:

```
> npm test
```

The test for a specific chatbot version can be executetd with the following command:

```
> mocha test/connectors/{chatbot}/{version}/test.js
```
