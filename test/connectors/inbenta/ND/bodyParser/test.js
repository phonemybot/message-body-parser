
//var parser = require("../src/utilities/tagCleaner.js");
var chai = require("chai");
var expect = chai.expect;
var fs = require('fs');
const bodyParser = require('../../../../../src/connectors/inbenta/ND/bodyParser');



describe("=====> testing Inbenta's (v1) body parser", async function() {

  let testFiles = [];
    try {
      testFiles = fs.readdirSync(__dirname + '/data');
    } catch (e) {
       //
    }
    for ( f of testFiles) {
      const test = require('./data/' + f);
      const {title,  message, session, reply } = test;
      it(`processing ${title}`, async function() {
        const newString = bodyParser({message, session}).reply;
        expect(bodyParser({message, session}).reply).equals(reply);
      });
    }

    it(`performance test parsing 100.000 typical bodies`, async function() {
      this.timeout(40000);
      const test = require('./data/simpleInstruction.json');
      const { message, session} = test;
      let countDown = 100000;
      while(countDown > 0) {
        bodyParser({ message, session});
        countDown--;
      }
    });

  });