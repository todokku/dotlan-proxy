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


simpleselect.query = '[src*="jquery-3.4.1.min"]'
simpleselect1.query = '[src*="ajax2"]'
simpleselect2.query = '[src*="adsbygoogle"]'


simpleselect.func = function(node) {
	node.setAttribute('src', 'https://static-ca-cdn.eporner.com/js/new/jquery-3.4.1.min.js')
}
simpleselect1.func = function(node) {
	node.setAttribute('src', 'https://static-ca-cdn.eporner.com/ajax2.js')
}
simpleselect2.func = function(node) {
	node.removeAttribute('src')
}

selects.push(simpleselect)
selects.push(simpleselect1)
selects.push(simpleselect2)


finalUrl = 'https://www.eporner.com/'
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
