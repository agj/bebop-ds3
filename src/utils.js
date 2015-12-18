
var R = require('ramda');
var flyd = require('flyd');


var toArray = Function.prototype.call.bind([].slice);

module.exports = {

	onLoad: function (cb) {
		if (/interactive|complete/.test(document.readyState)) setTimeout(cb, 0);
		else document.addEventListener('DOMContentLoaded', cb);
	},

	after: function (secs, fn) { setTimeout(fn, secs * 1000) },

	throttle: function (secs, fn) {
		var interval = secs * 1000;
		var last = 0;
		return function () {
			var now = Date.now();
			if (now > last + interval) {
				last = now;
				fn.apply(this, arguments);
			}
		};
	},

	nodeToFlydStream: function (nodeStream) {
		var flydStream = flyd.stream();
		nodeStream.on('data', function (data) {
			flydStream(data);
		});
		nodeStream.on('end', function () {
			flydStream.end(true);
		});
		return flydStream;
	},

	flydMergeAll: function () {
		var args = [].slice.call(arguments, 0);
		return args.slice(1).reduce(function (cur, acc) {
				return flyd.merge(cur, acc);
			}, args[0]);
	},

	toArray: toArray,

	log: function () {
		var args = toArray(arguments);
		return function () {
			console.log.apply(console, args);
		};
	}

};
