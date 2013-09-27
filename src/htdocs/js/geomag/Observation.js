/* global define */
define([
	'mvc/Model',
	'util/Util'
], function (
	Model,
	Util
) {
	'use strict';

	var DEFAULTS = {
		'id': null,
		'begin': null,
		'end': null,
		'reviewer_user_id': null,
		'mark_id': null,
		'electronics_id': null,
		'theodolite_id': null,
		'pier_temperature': null,
		'elect_temperature': null,
		'flux_temperature': null,
		'proton_temperature': null,
		'annotation': null,
		'readings': null
	};

	var Observation = function (attributes) {
		Model.call(this, Util.extend({}, DEFAULTS, attributes));
	};
	Observation.prototype = Object.create(Model.prototype);

	Observation.prototype.getObservationTimes = function() {
		var readings = this.get('readings');
		var readingsData = readings.data();
		var begin = this.get('begin');
		var end = this.get('end');

		for(var i = 0; i < readingsData.length; i++ ) {
			var readingstartend = readingsData[i].getReadingTimes();
			if (begin === null) {
				begin = readingstartend.start;
			} else if (begin > readingstartend.start) {
				begin = readingstartend.start;
			}
			if (end === null) {
				end = readingstartend.end;
			} else if (end < readingstartend.end) {
				end = readingstartend.end;
			}
		}
		this.set({'begin':begin});
		this.set({'end':end});
		return({'start':begin, 'end':end});
	};

	return Observation;
});
