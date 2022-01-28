var express = require('express');
var app = express();
app.listen(3306, ()=>{
	console.log('running on port 3306');
});

app.get('/', (req, res)=>{
	res.send('<h1>Hello World</h1>');
});
