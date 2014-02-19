/* global define */
define([
	'mvc/View',
	'util/Util',

	'geomag/Measurement'
], function (
	View,
	Util,

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
		this._reading = this._options.reading;
		this._measurements = this._reading.getMeasurements();
		this._calculator = this._options.baselineCalculator;

		this._el.innerHTML = [
			'<div class="row ordinatesHEZF">',
				'<table>',
					'<thead>',
						'<tr>',
							'<th>&nbsp</th>',
							'<th scope="col" class=titleMean>Ordinate Mean</th>',
							'<th scope="col" class=titleScale>Absolute</th>',
							'<th scope="col" class=titleComputed>Baseline</th>',
						'</tr>',
					'</thead>',
					'<tbody>',
						'<tr>',
							'<th>H</th>',
							'<td class="hMean"></td>',
							'<td class="absoluteH"></td>',
							'<td class="hBaseline"></td>',
						'</tr>',
						'<tr>',
							'<th>E</th>',
							'<td class="eMean"></td>',
							'<td class="absoluteH"></td>',
							'<td class="hBaseline"></td>',
						'</tr>',
						'<tr>',
							'<th>D</th>',
							'<td class="dMean"></td>',
							'<td class="absoluteD"></td>',
							'<td class="dBaseline"></td>',
						'</tr>',
						'<tr>',
							'<th>Z</th>',
							'<td class="zMean"></td>',
							'<td class="absoluteZ"></td>',
							'<td class="zBaseline"></td>',
						'</tr>',
						'<tr>',
							'<th>F</th>',
							'<td class="fMean"></td>',
							'<td class="absoluteF"></td>',
							'<td class="fBaseline"></td>',
						'</tr>',
					'</tbody>',
				'</table>',
				'<p class="scaleValue">',
				'</p>',
			'</div>',
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
		this._eBaseline = this._el.querySelector('.dBaseline');
		this._dBaseline = this._el.querySelector('.dBaseline');
		this._zBaseline = this._el.querySelector('.zBaseline');

		this._scaleValue = this._el.querySelector('.scaleValue');


		this._measurements[Measurement.FIRST_MARK_UP][0].on('change', this.render, this);
		this._measurements[Measurement.FIRST_MARK_DOWN][0].on('change', this.render, this);
		this._measurements[Measurement.WEST_DOWN][0].on('change', this.render, this);
		this._measurements[Measurement.EAST_DOWN][0].on('change', this.render, this);
		this._measurements[Measurement.WEST_UP][0].on('change', this.render, this);
		this._measurements[Measurement.EAST_UP][0].on('change', this.render, this);
		this._measurements[Measurement.SOUTH_DOWN][0].on('change', this.render, this);
		this._measurements[Measurement.NORTH_UP][0].on('change', this.render, this);
		this._measurements[Measurement.SOUTH_UP][0].on('change', this.render, this);
		this._measurements[Measurement.NORTH_DOWN][0].on('change', this.render, this);

		this.render();

	};

	MagnetometerOrdinatesView.prototype.render = function () {
		// TODO :: Render current model
		var calculator = this._calculator,
		    reading = this._reading,
		    meanH = calculator.meanH(reading),
		    meanE = calculator.meanE(reading),
		    meanZ = calculator.meanZ(reading),
		    meanF = calculator.meanF(reading),
		    scaleValue = calculator.scaleValue(reading),
		    absoluteD = (calculator.magneticDeclination(reading) * 60),
		    absoluteH = calculator.horizontalComponent(reading),
		    absoluteZ = calculator.verticalComponent(reading),
		    correctedF = calculator.correctedF(reading),
		    baselineD = calculator.baselineD(reading),
		    baselineE = calculator.baselineD(reading) *
		                  calculator.scaleValue(reading),
		    baselineH = calculator.baselineH(reading),
		    baselineZ = calculator.baselineZ(reading);

		if( meanH !== null ) {this._hMean.innerHTML = meanH.toFixed(2);}
		if( meanE !== null ) {this._eMean.innerHTML = meanE.toFixed(2);}
		if( meanZ !== null ) {this._zMean.innerHTML = meanZ.toFixed(2);}
		if( meanF !== null ) {this._fMean.innerHTML = meanF.toFixed(2);}

		if( scaleValue !== null ) {
			this._scaleValue.innerHTML = '*Scale Value for D = '+
				scaleValue.toFixed(2) +
				' (3437.7468 / Mean F * cos(Inclination))';
		}

		if( absoluteD !== null ) {
			this._absoluteD.innerHTML = absoluteD.toFixed(2);
		}
		if( absoluteH !== null ) {
			this._absoluteH.innerHTML = absoluteH.toFixed(2);
		}
		if( absoluteZ !== null ) {
			this._absoluteZ.innerHTML = absoluteZ.toFixed(2);
		}
		if( correctedF !== null ) {
			this._absoluteF.innerHTML = correctedF.toFixed(2);
		}

		if( baselineD !== null ) {this._dBaseline = baselineD.toFixed(2);}
		if( baselineE !== null ) {this._dBaselineE = baselineE.toFixed(2);}
		if( baselineH !== null ) {this._HBaseline = baselineH.toFixed(2);}
		if( baselineZ !== null ) {this._ZBaseline = baselineZ.toFixed(2);}

	};


	return MagnetometerOrdinatesView;
});
