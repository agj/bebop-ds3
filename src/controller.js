
// Config.

var mapping = {
	axis: {
		0: [ 'left', 'right' ],                 // left stick x
		1: [ 'forward', 'backward' ],           // left stick y
		2: [ 'counterClockwise', 'clockwise' ], // right stick x
		3: [ 'up', 'down' ],                    // right stick y
	},
	button: {
		12: 'takeOff',             // triangle
		14: 'land',                // cross
		15: 'stop',                // square
		10: 'emergency',           // L
	},
};

var padName = 'PLAYSTATION(R)3 Controller';
var deadZone = 0.2;


module.exports.init = function init(drone) {

	var R = require('ramda');
	var gamepad = require('gamepad');
	var keypress = require('keypress');

	gamepad.init();

	var pads = [];
	for (var i = 0, l = gamepad.numDevices(); i < l; i++) {
		pads.push(gamepad.deviceAtIndex(i));
	}
	console.log(pads.map(R.prop('description')));
	var padID = R.find(R.pipe(R.prop('description'), R.equals(padName)), pads).deviceID;

	setInterval(gamepad.processEvents, 16);
	setInterval(gamepad.detectDevices, 500);

	gamepad.on('move', function (id, axis, value) {
		if (id !== padID) return;
		if (Math.abs(value) < deadZone) return;
		if (!mapping.axis[axis]) return;

		var aValue = (value > 0 ? value - deadZone : value + deadZone) / (1 - deadZone);
		// console.log('move', axis, aValue);
		var action = mapping.axis[axis][aValue > 0 ? 1 : 0];
		// console.log(action, Math.abs(aValue));
		drone[action](Math.abs(aValue) * 70);
	});

	gamepad.on('down', function (id, num) {
		if (id !== padID) return;
		if (!mapping.button[num]) {
			// console.log(num);
			return;
		};

		var action = mapping.button[num];
		console.log(action);
		drone[action]();
	});

	keypress(process.stdin);
	process.stdin.on('keypress', function (ch, key) {
		if (key && key.ctrl && key.name == 'c') process.exit();
		if (ch > 0 && ch <= 9) {
			console.log("Changing to controller number " + ch);
			padID = ch - 1;
		}
	});
	process.stdin.setRawMode(true);
	process.stdin.resume();

}
