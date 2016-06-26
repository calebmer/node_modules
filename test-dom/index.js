var jsdom = require('jsdom').jsdom
var window = jsdom('<body></body>').defaultView
global.window = window
global.document = window.document
global.navigator = window.navigator
