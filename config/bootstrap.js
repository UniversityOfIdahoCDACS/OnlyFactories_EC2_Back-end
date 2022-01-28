
// create http server and redirect all requests to https
// :
module.exports.bootstrap = function(cb) {
	var express = require('express'),
		app = express();

	app.get('*', function(req, res){
		if (req.isSocket)
			return res.redirect('wss://' + req.headers.host + req.url)
		
		return res.redirect('https://' + req.headers.host + req.url)
	}).listen(80);
	cb();
};
