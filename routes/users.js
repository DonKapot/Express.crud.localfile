
var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require( 'fs' );

const MongoClient = require('mongodb').MongoClient;

var dataObj = require('../data/data');
var data = JSON.parse(dataObj.data);

router.get('/', function(req, res, next) {
  res.render('users/users', {title: 'USERS CRUD'});
});
// -----------------------------------------------------------------------------------
router.get('/all', function(req, res, next) {
	let page = req.query.page;
	let minItem = (page-1)*5;
	let maxItem = page*5;
	let dataLen = data.length<5 ? 1 : 
				  data.length%5===0&&data.length>=5 ? data.length/5 : Math.round((data.length+2)/5);
	if(page===undefined) {
		let filterData = data.filter((el,i)=>i<5);
  		res.render('users/userRead', {
  			title:'All users:', 
  			data:filterData, 
  			pages:dataLen
  		});
  	}
	else {
		let filterData = data.filter((el,i)=>i>=minItem&&i<maxItem);
  		res.render('users/userRead', {
  			title:'All users Filtered:', 
  			data:filterData, 
  			pages:dataLen
  		});
  	}
});
// -----------------------------------------------------------------------------------
router.get('/new', function(req, res, next) {
  res.render('users/userCreate', {title: 'New user:'});
});
router.post('/new', function(req, res, next) {
	data.push({id: data.length+1, name: req.body.name, age: req.body.age, goodOne: req.body.goodi});
	fs.writeFileSync(dataObj.path,JSON.stringify(data));
	res.send("<h1><a href='/users'>Back to users</a></h1>");
});
// -----------------------------------------------------------------------------------
router.get('/up', function(req, res, next) {
  res.render('users/userUpdate', {title: 'User Update:', data: data});
});
router.post('/up', function(req, res, next) {
	let users = data;
	let updateUser = (_user,_newName,_newAge,_newGood)=>{
		_user.name = _newName!=='' ? _newName : _user.name;
		_user.age = _newAge!=='' ? _newAge : _user.age;
		_user.goodOne = _newGood==='' ? _user.goodOne : _newGood=='true' ? true : false;
		return _user;
	};
	let filterData = users.map(user=>{
		return user.name===req.body.name ? 
		updateUser(user, req.body.newName, req.body.newAge, req.body.newGood) : 
		user;
	});
	fs.writeFileSync(dataObj.path,JSON.stringify(filterData));
	res.send("<h1><a href='/users'>Back to users</a></h1>");
});
// -----------------------------------------------------------------------------------
router.get('/del', function(req, res, next) {
  res.render('users/userDelete', {title: 'User Remove:', data: data});
});
router.post('/del', function(req, res, next) {
	let users = data;
	let filterData = users
	.filter(user=>user.name!==req.body.name)
	.map((user,i,arr)=>Object.assign(user,{id: i+1}));
	fs.writeFileSync(dataObj.path,JSON.stringify(filterData));
	res.send("<h1><a href='/users'>Back to users</a></h1>");
});
// -----------------------------------------------------------------------------------
module.exports = router;
