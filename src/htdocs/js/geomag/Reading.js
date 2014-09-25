/*global define*/
define([
	'mvc/Model',
	'mvc/Collection',
	'util/Util',

	'geomag/Measurement'
], function (
	Model,
	Collection,
	Util,

	Measurement
) {
	'use strict';


	/** Define default attributes. */
	var DEFAULTS = {
		'id': null,
		'set_number': null,
		'declination_valid': 'Y',
		'declination_shift': 0,
		'horizontal_intensity_valid': 'Y',
		'vertical_intensity_valid': 'Y',
		'observer_user_id': null,
		'annotation': null,
		'measurements': null,
		'absD': null,
		'absH': null,
		'absZ': null,
		'baseD': null,
		'baseH': null,
		'baseZ': null,
		'startD': null,
		'startH': null,
		'startZ': null,
		'endD': null,
		'endH': null,
		'endZ': null
	};


	/**
	 * Constructor.
	 *
	 * @param  options {Object} observatory attributes.
	 */
	var Reading = function (options) {
		// Call parent constructor
		Model.call(this, Util.extend({}, DEFAULTS, options));
		this._initialize();
	};
	// Reading extends Model
	Reading.prototype = Object.create(Model.prototype);


	Reading.prototype._initialize = function () {
		var _this = this,
		    measurements = this.get('measurements'),
		    data = null,
		    i = null,
		    len = null,
		    onChangeHandler = null;

		if (measurements === null) {
			measurements = new Collection([
				new Measurement({type: Measurement.FIRST_MARK_UP}),
				new Measurement({type: Measurement.FIRST_MARK_DOWN}),
				new Measurement({type: Measurement.WEST_DOWN}),
				new Measurement({type: Measurement.EAST_DOWN}),
				new Measurement({type: Measurement.WEST_UP}),
				new Measurement({type: Measurement.EAST_UP}),
				new Measurement({type: Measurement.SECOND_MARK_UP}),
				new Measurement({type: Measurement.SECOND_MARK_DOWN}),
				new Measurement({type: Measurement.SOUTH_DOWN}),
				new Measurement({type: Measurement.NORTH_UP}),
				new Measurement({type: Measurement.SOUTH_UP}),
				new Measurement({type: Measurement.NORTH_DOWN})
			]);

			this.set({'measurements': measurements});
		}

		data = measurements.data();
		len = data.length;

		onChangeHandler = function (evt) {
			_this.trigger('change:measurement', evt);
		};

		for (i = 0; i < len; i++) {
			data[i].on('change', onChangeHandler);
		}
	};

	/**
	 * Get the Measurements for this reading.
	 *
	 * @return a key:array of type:[measurements]
	 *
	 * This is needed for future enhancements where we will have multiple
	 * measurements per type.  Use this call so we don't have to refactor
	 * everything later.
	 */
	Reading.prototype.getMeasurements = function () {
		var measurements = this.get('measurements'),
		    r = {},
		    data,
		    m,
		    type,
		    i;

		if (measurements !== null) {
			data = measurements.data();

			for (i = 0; i < data.length; i++) {
				m = data[i];
				type = m.get('type');
				if (!r.hasOwnProperty(type)) {
					r[type] = [];
				}
				r[type].push(m);
			}
		}

		return r;
	};

	/**
	 * Utility method to call a function on each measurement in this reading.
	 *
	 * @param callback {Function}
	 *        function to call with each measurement.
	 */
	Reading.prototype.eachMeasurement = function (callback) {
		var measurements = this.get('measurements').data(),
		    i,
		    len;
		for (i = 0, len = measurements.length; i < len; i++) {
			callback(measurements[i]);
		}
	};


	// return constructor from closure
	return Reading;
});
