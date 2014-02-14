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
		this._observation = this._options.observation;

		this._el.innerHTML = [
			'<div id="ordinatesHEZF">',
				'<dl>',
					'<dt> </dt>',
						'<dd class=titleMean>Mean Values</dd>',
						'<dd class=titleScale>Scale Value</dd>',
						'<dd class=titleComputed>Computed Values</dd>',
					'<dt>H(C1):</dt>',
						'<dd class="hMean"></dd>',
						'<dd class="hScale"></dd>',
						'<dd class="hComputed"></dd>',
					'<dt>E(C2):</dt>',
						'<dd class="eMean"></dd>',
						'<dd class="eScale"></dd>',
						'<dd class="eComputed"></dd>',
					'<dt>Z(C3):</dt>',
						'<dd class="zMean"></dd>',
						'<dd class="zScale"></dd>',
						'<dd class="zComputed"></dd>',
					'<dt>F(C3):</dt>',
						'<dd class="fMean"></dd>',
						'<dd class="fScale"></dd>',
						'<dd class="fComputed"></dd>',
				'</dl>',
			'</div>',
			'<div id="declination">',
				'<dl >',
					'<dt><abbr title="Absolute D">Abs. D:</abbr></dt>',
					'<dd class="absoluteD"></dd>',
					'<dt><abbr title="Absolute H">Abs. H:</abbr></dt>',
					'<dd class="absoluteH"></dd>',
					'<dt><abbr title="Absolute Z">Abs. Z:</abbr></dt>',
					'<dd class="absoluteZ"></dd>',
					'<dt><abbr title="Corrected F">Corr. F:</abbr></dt>',
					'<dd class="correctedF"></dd>',
				'</dl>',
			'</div>',
			'<div id="baseline">',
				'<dl >',
					'<dt>D Baseline:</dt>',
						'<dd class=dBaseline></dd>',
						'<dd class=dBaselineNT></dd>',
					'<dt>H Baseline:</dt>',
						'<dd class=dBaseline></dd>',
					'<dt>Z Baseline:</dt>',
						'<dd class=dBaseline></dd>',
				'</dl>',
			'</div>'
		].join('');

		this._hMean = this._el.querySelector('.hMean');
		this._hScale = this._el.querySelector('.hScale');
		this._hComputed = this._el.querySelector('.hComputed');
		this._eMean = this._el.querySelector('.eMean');
		this._eScale = this._el.querySelector('.eScale');
		this._eComputed = this._el.querySelector('.eComputed');
		this._zMean = this._el.querySelector('.zMean');
		this._zScale = this._el.querySelector('.zScale');
		this._zComputed = this._el.querySelector('.zComputed');
		this._fMean = this._el.querySelector('.fMean');
		this._fScale = this._el.querySelector('.fScale');

		this._fComputed = this._el.querySelector('.fComputed');
		this._absoluteD = this._el.querySelector('.absoluteD');
		this._absoluteH = this._el.querySelector('.absoluteH');
		this._absoluteZ = this._el.querySelector('.absoluteZ');
		this._correctedF = this._el.querySelector('.correctedF');

		this._dBaseline = this._el.querySelector('.dBaseline');
		this._dBaselineNT = this._el.querySelector('.dBaselineNT');
		this._hBaseline = this._el.querySelector('.hBaseline');
		this._zBaseline = this._el.querySelector('.zBaseline');


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
		    observation = this._observation,
		    observatory = observation.get('observatory');


		this._hMean.innerHTML = calculator.meanH(reading);
		this._eMean.innerHTML = calculator.meanE(reading);
		this._zMean.innerHTML = calculator.meanZ(reading);

		this._hComputed.innerHTML = this._hMean.innerHTML;

		this._zComputed.innerHTML = this._hMean.innerHTML;
		this._fComputed.innerHTML = this._hMean.innerHTML;

		if( observatory && observatory.get('piers').getSelected() &&
				observatory.get('piers').getSelected().get('marks').getSelected() &&
				observation.get('mark_id') !== null ) {

		this._eScale.innerHTML = calculator.scaleValue(observatory, reading);

		this._eComputed.innerHTML = calculator.computedE(observatory, reading);
		this._absoluteD.innerHTML = calculator.magneticDeclination(observatory, reading) * 60;
		this._absoluteH.innerHTML = calculator.horizontalComponent(observatory, reading);
		this._absoluteZ.innerHTML = calculator.verticalComponent(observatory, reading);
		this._correctedF.innerHTML = calculator.correctedF(observatory, reading);
		this._dBaseline = calculator.baselineD( observatory, reading);
		this._dBaselineNT = calculator.baselineD( observatory, reading) *
												calculator.scaleValue(observatory, reading);
		this._HBaseline = calculator.baselineH( observatory, reading);
		this._ZBaseline = calculator.baselineZ( observatory, reading);
		}

	};


	return MagnetometerOrdinatesView;
});
