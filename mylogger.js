module.exports = (function(verbosity){

	var ts = require('tsk').ToolStack,
		util = ts.Utility,
		out = function(msg,err){
			if(err) return process.stderr.write(msg);
			return process.stdout.write(msg);
		};

	//enable coloring
	ts.ASColors();

	var app = {};
	app.cache = [];
	app.verbosity = verbosity || function(){ return true; };
	app.crisis = 0;
	// app.saveware = [];

	app.printer = function(msg,useErr){
		if(!util.isString(msg)) msg = JSON.stringify(msg);
		if(!app.verbosity() && !app.crisis) return;
		return out(msg,useErr);
	};

	app.ready = function(arg){
		var args = util.arranize(arg),
		src = args.shift(),
		msg = util.templateIt(src,args);

		console.log('what:',src,args);
		msg += '\n';
		return msg;
	};

	app.log = function(){
		if(arguments.length <= 0) return;
		
		var msg = this.ready(arguments);
		app.cache.push([1,msg]);
		app.printer(msg);
	};

	app.warn = function(){
		if(arguments.length <= 0) return;
		var msg = this.ready(arguments).yellow;
		app.cache.push([1,msg]);
		app.printer(msg);
	};

	app.error = function(){
		if(arguments.length <= 0) return;
		var msg = this.ready(arguments).red;
		app.cache.push([2,msg]);
		app.printer(msg,true);
	};

	// app.save = function(fn){
	// 	if(this.saveware.indexOf(fn) !== -1) return;
	// 	 this.saveware.push(fn);
	// };

	app.tell = function(){
		util.each(this.cache,function(e,i,o){
			if(e[0] === 1) return out(e[1]);
			return out(e[1],true);
		},this);
	};

	return app;
});