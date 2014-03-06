/* global define */
define([
	'mvc/View',
	'util/Util',

	'geomag/Formatter',
	'geomag/Measurement'
], function (
	View,
	Util,

	Format,
	Measurement
) {
	'use strict';


	var DEFAULTS = {
		'observation': null,
		'baselineCalculator': null,
		'readings': null
	};


	var MagnetometerOrdinatesView = function (options) {
		this._options = Util.extend({}, DEFAULTS, options);
		View.call(this, this._options);
	};

	MagnetometerOrdinatesView.prototype = Object.create(View.prototype);


	MagnetometerOrdinatesView.prototype._initialize = function () {
		var measurements = this._options.reading.getMeasurements();

		this._reading = this._options.reading;
		this._calculator = this._options.baselineCalculator;

		this._el.innerHTML = [
			'<table>',
				'<thead>',
					'<tr>',
						'<th scope="col" class="channel">Channel</th>',
						'<th scope="col" class="mean">Ordinate Mean</th>',
						'<th scope="col" class="absolute">Absolute</th>',
						'<th scope="col" class="baseline">Baseline</th>',
					'</tr>',
				'</thead>',
				'<tbody>',
					'<tr>',
						'<th class="channel h">H</th>',
						'<td class="mean hMean"></td>',
						'<td class="absolute absoluteH"></td>',
						'<td class="baseline hBaseline"></td>',
					'</tr>',
					'<tr>',
						'<th class="channel e">E</th>',
						'<td class="mean eMean"></td>',
						'<td class="absolute absoluteE"></td>',
						'<td class="baseline eBaseline"></td>',
					'</tr>',
					'<tr>',
						'<th class="channel d">D</th>',
						'<td class="mean dMean"></td>',
						'<td class="absolute absoluteD"></td>',
						'<td class="baseline dBaseline"></td>',
					'</tr>',
					'<tr>',
						'<th class="channel z">Z</th>',
						'<td class="mean zMean"></td>',
						'<td class="absolute absoluteZ"></td>',
						'<td class="baseline zBaseline"></td>',
					'</tr>',
					'<tr>',
						'<th class="channel f">F</th>',
						'<td class="mean fMean"></td>',
						'<td class="absolute absoluteF"></td>',
						'<td class="baseline fBaseline"></td>',
					'</tr>',
				'</tbody>',
			'</table>',
			'<p class="pier-correction">Pier Correction',
				'<span class="pier-correction-value"></span>',
			'</p>',
			'<p class="scaleValue"></p>'
		].join('');

		this._hMean = this._el.querySelector('.hMean');
		this._eMean = this._el.querySelector('.eMean');
		this._dMean = this._el.querySelector('.dMean');
		this._zMean = this._el.querySelector('.zMean');
		this._fMean = this._el.querySelector('.fMean');

		this._absoluteD = this._el.querySelector('.absoluteD');
		this._absoluteH = this._el.querySelector('.absoluteH');
		this._absoluteZ = this._el.querySelector('.absoluteZ');
		this._absoluteF = this._el.querySelector('.absoluteF');

		this._hBaseline = this._el.querySelector('.hBaseline');
		this._eBaseline = this._el.querySelector('.eBaseline');
		this._dBaseline = this._el.querySelector('.dBaseline');
		this._zBaseline = this._el.querySelector('.zBaseline');

		this._pierCorrection = this._el.querySelector('.pier-correction-value');
		this._scaleValue = this._el.querySelector('.scaleValue');

		// hook up to measurements on change.
		// Only need time/angles not markup/markdown
		measurements[Measurement.WEST_DOWN][0].on('change', this.render, this);
		measurements[Measurement.EAST_DOWN][0].on('change', this.render, this);
		measurements[Measurement.WEST_UP][0].on('change', this.render, this);
		measurements[Measurement.EAST_UP][0].on('change', this.render, this);
		measurements[Measurement.SOUTH_DOWN][0].on('change', this.render, this);
		measurements[Measurement.NORTH_UP][0].on('change', this.render, this);
		measurements[Measurement.SOUTH_UP][0].on('change', this.render, this);
		measurements[Measurement.NORTH_DOWN][0].on('change', this.render, this);
		// hook up to calculator on change.
		// for changes to pier and mark.
		this._calculator.on('change', this.render, this);

		this.render();
	};

	MagnetometerOrdinatesView.prototype.render = function () {
		var calculator = this._calculator,
		    reading = this._reading;

		this._hMean.innerHTML = Format.nanoteslas(calculator.meanH(reading));
		this._eMean.innerHTML = Format.nanoteslas(calculator.meanE(reading));
		this._dMean.innerHTML = Format.minutes(calculator.computedE(reading));
		this._zMean.innerHTML = Format.nanoteslas(calculator.meanZ(reading));
		this._fMean.innerHTML = Format.nanoteslas(calculator.meanF(reading));

		this._absoluteH.innerHTML =
				Format.nanoteslas(calculator.horizontalComponent(reading));
		this._absoluteD.innerHTML =
				Format.minutes((calculator.magneticDeclination(reading) * 60));
		this._absoluteZ.innerHTML =
				Format.nanoteslas(calculator.verticalComponent(reading));
		this._absoluteF.innerHTML =
				Format.nanoteslas(calculator.correctedF(reading));

		this._hBaseline.innerHTML =
				Format.nanoteslas(calculator.baselineH(reading));
		this._eBaseline.innerHTML =
				Format.nanoteslas(calculator.baselineE(reading));
		this._dBaseline.innerHTML = Format.minutes(calculator.d(reading));
		this._zBaseline.innerHTML =
				Format.nanoteslas(calculator.baselineZ(reading));

		this._pierCorrection.innerHTML =
				Format.rawNanoteslas(calculator.pierCorrection());
		this._scaleValue.innerHTML = [
				'Ordinate Mean D is calculated using ',
				'<code>(Corrected F * scaleValue / 60)</code>',
				', where <code>',
						'scaleValue = ', calculator.scaleValue(reading).toFixed(4),
				'</code>'].join('');
	};


	return MagnetometerOrdinatesView;
});
