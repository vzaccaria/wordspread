var S = require('string')
var c = require('chalk')

var _module = () => {

  var msg = () => {
    console.log("Use (⌘ +double click) to open links on OSX");
  }

  var link = _ => {
    return `${c.blue.underline(_)}`
  }

  return {
    msg, link
  }
}

module.exports = _module()