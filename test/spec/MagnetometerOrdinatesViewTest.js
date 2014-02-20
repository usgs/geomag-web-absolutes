/*global define*/
/*global describe*/
/*global it*/
define([
	'chai',
	'mvc/Model',
	'util/Util',

	'geomag/Reading',
	'geomag/Observation',
	'geomag/Measurement',
	'geomag/MagnetometerOrdinatesView'
], function (
	chai,
	Model,
	Util,

	Reading,
	Observation,
	Measurement,
	MagnetometerOrdinatesView
){
	'use strict';
	var expect = chai.expect;

	var testObservationBaselineCalculator = Util.extend(new Model(), {
		meanH: function() { return 1; },
		meanE: function() { return 2; },
		meanZ: function() { return 3; },
		meanF: function() { return 4; },
		scaleValue: function() { return 5; },
		magneticDeclination: function() { return 6; },
		horizontalComponent: function() { return 7; },
		verticalComponent: function() { return 8; },
		correctedF: function() { return 9; },
		baselineD: function() { return 10; },
		baselineE: function() { return 11; },
		baselineH: function() { return 12; },
		baselineZ: function() { return 13; },
		computedE: function() { return 15; },
		d: function() { return 14; }
	});

	// dummy MagnetometerOrdinates View that tracks whether its
	// render method has been called
	var TestMagnetometerOrdinatesView = function (options) {
		this.called = false;
		MagnetometerOrdinatesView.call(this, options);
	};
	TestMagnetometerOrdinatesView.prototype = Object.create(MagnetometerOrdinatesView.prototype);
	TestMagnetometerOrdinatesView.prototype.render = function() {
		this.called = true;
	};

	var viewOptions = {
		reading: new Reading(),
		observation: new Observation(),
		baselineCalculator: testObservationBaselineCalculator
	};

	describe('Unit tests for MagnetometerOrdinatesView class', function () {
		it('can be "require"d', function () {
			/*jshint -W030*/
			expect(MagnetometerOrdinatesView).to.not.be.undefined;
			/*jshint +W030*/
		});

		it('can be instantiated', function () {
			var view = new MagnetometerOrdinatesView({
				reading: new Reading(),
				baselineCalculator: testObservationBaselineCalculator
			});

			/*jshint -W030*/
			expect(view._options).to.not.be.undefined;
			expect(view._hMean).to.not.be.undefined;
			expect(view._eMean).to.not.be.undefined;
			expect(view._zMean).to.not.be.undefined;
			expect(view._fMean).to.not.be.undefined;
			expect(view._absoluteH).to.not.be.undefined;
			expect(view._absoluteD).to.not.be.undefined;
			expect(view._absoluteZ).to.not.be.undefined;
			expect(view._absoluteF).to.not.be.undefined;
			expect(view._hBaseline).to.not.be.undefined;
			expect(view._eBaseline).to.not.be.undefined;
			expect(view._dBaseline).to.not.be.undefined;
			expect(view._zBaseline).to.not.be.undefined;
			/*jshint +W030*/
		});

		describe('Constructor', function () {
			var m = new MagnetometerOrdinatesView(viewOptions);

			it('should be an instance of a MagnetometerOrdinatesView', function () {
				expect(m).to.be.an.instanceOf(MagnetometerOrdinatesView);
			});

		});

		describe('Initialize', function () {
			var i = 0,
			    len = 0,
			    reading = new Reading(),
			    measurements = reading.getMeasurements(),
			    observation = new Observation(),
			    view;

			view = new TestMagnetometerOrdinatesView ({
				reading: reading,
				observation: observation,
				baselineCalculator: testObservationBaselineCalculator
			});

			it('binds measurment change to render', function() {
				var testmeasurements = [
					measurements[Measurement.FIRST_MARK_UP][0],
					measurements[Measurement.FIRST_MARK_DOWN][0],
					measurements[Measurement.WEST_DOWN][0],
					measurements[Measurement.EAST_DOWN][0],
					measurements[Measurement.WEST_UP][0],
					measurements[Measurement.EAST_UP][0],
					measurements[Measurement.SOUTH_DOWN][0],
					measurements[Measurement.NORTH_UP][0],
					measurements[Measurement.SOUTH_UP][0],
					measurements[Measurement.NORTH_DOWN][0]
				];

				for(i = 0, len = testmeasurements.length; i < len; i++) {
					view.called = false;
					testObservationBaselineCalculator.trigger('change');
					expect(view.called).to.equal(true);
				}
			});

			it('binds calculator change to render', function () {
				view.called=false;
				testObservationBaselineCalculator.trigger('change');
				expect(view.called).to.equal(true);
			});

		});
	
		describe('Render', function() {
			it('updates view elements', function() {
				var calculator = testObservationBaselineCalculator;

				var magnetometerOrdinatesView = new MagnetometerOrdinatesView({
								reading: new Reading(),
								observation: new Observation(),
								baselineCalculator: calculator});

				expect(magnetometerOrdinatesView._hMean.textContent).to.equal(
					calculator.meanH().toFixed(2));
				expect(magnetometerOrdinatesView._eMean.textContent).to.equal(
					calculator.meanE().toFixed(2));
				expect(magnetometerOrdinatesView._zMean.textContent).to.equal(
					calculator.meanZ().toFixed(2));
				expect(magnetometerOrdinatesView._fMean.textContent).to.equal(
					calculator.meanF().toFixed(2));

				expect(magnetometerOrdinatesView._absoluteH.textContent).to.equal(
					calculator.horizontalComponent().toFixed(2));
				expect(magnetometerOrdinatesView._absoluteD.textContent).to.equal(
					(calculator.magneticDeclination()*60).toFixed(2));
				expect(magnetometerOrdinatesView._absoluteZ.textContent).to.equal(
					calculator.verticalComponent().toFixed(2));
				expect(magnetometerOrdinatesView._absoluteF.textContent).to.equal(
					calculator.correctedF().toFixed(2));

				expect(magnetometerOrdinatesView._hBaseline.textContent).to.equal(
					calculator.baselineH().toFixed(2));
				expect(magnetometerOrdinatesView._eBaseline.textContent).to.equal(
					calculator.baselineE().toFixed(2));
				expect(magnetometerOrdinatesView._dBaseline.textContent).to.equal(
					calculator.d().toFixed(2));
				expect(magnetometerOrdinatesView._zBaseline.textContent).to.equal(
					calculator.baselineZ().toFixed(2));

				expect(magnetometerOrdinatesView._scaleValue.textContent).to.equal(
					'Ordinate Mean D is calculated using ' +
					'(Corrected F * scaleValue / 60) Where scale Value = 5.0000');
			});
		});

	});
});
