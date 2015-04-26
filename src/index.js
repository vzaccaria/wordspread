var {
  docopt
} = require('docopt')
var fs = require('fs')
var Promise = require('bluebird')
var Logdown = require('logdown')
var logger = new Logdown({
  prefix: 'wordspread'
})
var path = require('path')

var form = require('form-urlencoded');

var {
  link, msg
} = require('./lib/print')


var getOptions = doc => {
  "use strict"
  var o = docopt(doc)
  var subreddit = o['--subreddit'] || 'javascript'
  var title = o.TITLE
  var url = o.LINK
  var noshow = o['--no-show-hn'] || false
  return {
    subreddit, title, url, noshow
  }
}

var doc = fs.readFileSync(__dirname + "/docs/usage.md", 'utf8')

// https: //news.ycombinator.com/submitlink?u=https%3A%2F%2Fgithub.com%2Fvzaccaria%2Fdom-restyle&t=vzaccaria%2Fdom-restyle

function postReddit(title, url, opts) {
  var submiturl = "http://www.reddit.com/submit"

  var data = {
      url: url,
      title: title,
      sr: opts.subreddit
    }
    // body...
  return `${submiturl}?${form.encode(data)}`
}

function postHn(title, url, opts) {
  "use strict"
  var htitle
  if (!opts.noshow) {
    htitle = `Show HN: ${title}`
  } else {
    htitle = title
  }
  url = url

  var data = {
    u: url,
    t: htitle
  }
  return `https://news.ycombinator.com/submitlink?${form.encode(data)}`
}

function postEcho(title, url) {
  "use strict"

  var data = {
    u: url,
    t: title
  }
  return `http://www.echojs.com/submit?${form.encode(data)}`
}

function postTwitter(title, url) {
  "use strict"

  var data = {
    url: url,
    text: `${title} — `
  }
  return `http://twitter.com/share?${form.encode(data)}`
}

// javascript:(function(){f='http://twitter.com/share?url='+encodeURIComponent(window.location.href)+'&text='+encodeURIComponent(document.title);a=function(){if(!window.open(f))location.href=f};if(/Firefox/.test(navigator.userAgent)){setTimeout(a,0)}else{a()}})()
var main = () => {
  "use strict"
  var opts = (getOptions(doc))
  var {
    title, url
  } = opts

  msg()
  logger.log("**HN**: ", link(postHn(title, url, opts)))
  logger.log(`**Reddit /r/${opts.subreddit}**: `, link(postReddit(title, url, opts)))
  logger.log(`**Echo JS**: `, link(postEcho(title, url)))
  logger.log(`**Twitter**: `, link(postTwitter(title, url)))
}

main()