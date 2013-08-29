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

		// view template
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

		// save references to elements that will be updated during render
		this._magneticSouthMeridian = this.el.querySelector(
				'.magneticSouthMeridian');
		this._meanMark = this.el.querySelector('.meanMark');
		this._magneticAzimuthOfMark = this.el.querySelector(
				'.magneticAzimuthOfMark');
		this._trueAzimuthOfMark = this.el.querySelector('.trueAzimuthOfMark');
		this._magneticDeclination = this.el.querySelector('.magneticDeclination');
		this._westUpMinusEastDown = this.el.querySelector('.westUpMinusEastDown');
		this._eastUpMinusWestDown = this.el.querySelector('.eastUpMinusWestDown');
		this._fMean = this.el.querySelector('.fMean');
		this._pierCorrection = this.el.querySelector('.pierCorrection');
		this._correctedF = this.el.querySelector('.correctedF');
	};

	// return constructor
	return DeclinationView;
});
