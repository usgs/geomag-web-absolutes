/*global define*/
define([
	'mvc/Util',
	'mvc/View'
], function (
	Util,
	View
){
	'use strict';

	var DEFAULT_OPTIONS = {
		'baselineCalculator': null
	};

	var DeclinationView = function (options) {
		options = Util.extend({}, DEFAULT_OPTIONS, options);

		// call parent constructor
		View.call(this, options);
	};

	// extend View class
	DeclinationView.prototype = Object.create(View.prototype);


	DeclinationView.prototype.initialize = function (options) {
		this._options = options;

		this.el.innerHTML = [
			'<dl>',
				'<dt>Magnetic South Meridian</dt>',
				'<dd class="magneticSouthMeridian"></dd>',
				'<dt>Mean Mark</dt>',
				'<dd class="meanMark"></dd>',
				'<dt>Magnetic Azimuth of Mark</dt>',
				'<dd class="magneticAzimuthOfMark"></dd>',
				'<dt>True Azimuth of Mark</dt>',
				'<dd class="trueAzimuthOfMark"></dd>',
				'<dt>Magnetic Declination</dt>',
				'<dd class="magneticDeclination"></dd>',
				'<dt>(WU - ED) * 60</dt>',
				'<dd class="westUpMinusEastDown"></dd>',
				'<dt>(EU - WD) * 60</dt>',
				'<dd class="eastUpMinusWestDown"></dd>',
				'<dt>F mean</dt>',
				'<dd class="fMean"></dd>',
				'<dt>Pier Correction</dt>',
				'<dd class="pierCorrection"></dd>',
				'<dt>Corrected F</dt>',
				'<dd class="correctedF"></dd>',
			'</dl>'
		].join('');
	};

	// return constructor
	return DeclinationView;
});
