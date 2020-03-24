const http = require('http')
const https = require('https')
const httpProxy = require('http-proxy')
const url = require('url')
const connect = require('connect')
const harmon = require('harmon')

selects = []
simpleselect = {}
simpleselect1 = {}
simpleselect2 = {}


simpleselect.query = '[src*="jquery.min"]'
simpleselect1.query = '[src*="jquery-ui.min"]'
simpleselect2.query = '[name*="google_esf"]'


simpleselect.func = function(node) {
	node.setAttribute('src', 'http://libs.baidu.com/jquery/1.5.1/jquery.min.js')
}
simpleselect1.func = function(node) {
	node.setAttribute('src', 'http://libs.baidu.com/jqueryui/1.8.10/jquery-ui.min.js')
}
simpleselect2.func = function(node) {
	node.removeAttribute('src')
}

selects.push(simpleselect)
selects.push(simpleselect1)
selects.push(simpleselect2)


finalUrl = 'https://evemaps.dotlan.net/'
parsedUrl = url.parse(finalUrl)

proxy = httpProxy.createProxyServer({
	target: finalUrl,
	agent: https.globalAgent,
	headers: {
		host: parsedUrl.hostname
	},
	prependPath: false,
	hostRewrite: finalUrl.host,
	protocolRewrite: parsedUrl.protocol,
	xfwd: true
})

const app = connect()

app.use(harmon([],selects))
app.use(function(req,res){
	proxy.web(req,res)
})

http.createServer(app).listen(8000)
