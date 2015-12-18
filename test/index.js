'use strict';

// To simplify debugging:
try {
	// require('superstack');
	// require('clarify');
} catch (e) { }

var bebop = require('node-bebop');
var R = require('ramda');
var flyd = require('flyd');

var _ = require('../src/utils.js');



var drone = bebop.createClient();
var droneFlying = flyd.stream(false);

drone.connect(function () {
	console.log("Connected to drone.");

	require('../src/controller').init(drone);

	var start = flyd.stream();
	var stop  = flyd.stream();
	flyd.on(droneFlying, flyd.merge(start, stop));

	drone.on('flying',    R.pipe(R.T, start));
	drone.on('hovering',  R.pipe(R.T, start));
	drone.on('landing',   R.pipe(R.F, stop));
	drone.on('landed',    R.pipe(R.F, stop));
	drone.on('emergency', R.pipe(R.F, stop));

	// Call drone.stop() on landing, landed, emergency, and takingOff events,
	// to prevent sudden instability when taking off again.
	var stopDrone = drone.stop.bind(drone);
	flyd.on(stopDrone, stop);
	drone.on('takingOff', stopDrone);
});

