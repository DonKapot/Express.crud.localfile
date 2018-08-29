var path = require('path');
var fs = require( 'fs' );

var data = fs.readFileSync(path.join(__dirname,'/users.json'),'UTF8');
var filePath = path.join(__dirname,'/users.json');
var dataObj = {
	data: data,
	path: filePath
}

module.exports = dataObj;
