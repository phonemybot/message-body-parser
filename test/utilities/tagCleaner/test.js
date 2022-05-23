
//var parser = require("../src/utilities/tagCleaner.js");
var chai = require("chai");
var expect = chai.expect;
var fs = require('fs');
const tagCleaner = require('../../../src/utilities/tagCleaner');

describe("=====> testing tagCleaner", async function() {

  let testFiles = [];
    try {
      testFiles = fs.readdirSync(__dirname + '/data');
    } catch (e) {
    }
    for ( f of testFiles) {
      const test = require('./data/' + f);
      it(`processing ${test.title}`, async function() {
        expect(tagCleaner(test.input)).equals(test.expectedOutput);
      });
    }

    it(`performance test with 100.000 basic checks`, async function() {
      this.timeout(40000);
      const test = require('./data/mixedTags.json');
      let countDown = 100000;
      while(countDown > 0) {
        tagCleaner(test.input);
        countDown--;
      }
    });

  });