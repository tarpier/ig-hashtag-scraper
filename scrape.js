
const fs = require('fs')
const util = require('util')
const argv = require('minimist')(process.argv.slice(2));

const findTags = require('./findTags')
const findUsers = require('./findUsers')

const scrape = require('./app/initScrape')

if (typeof argv._ == undefined || argv._.length < 0) {
    console.log('Please provide one or more username(s)')
    process.exit()
}

scrape(argv._)