/*global define*/
/*global describe*/
/*global it*/
define([
	'chai',
	'mvc/Model',
	'util/Util',

	'geomag/Formatter',
	'geomag/InclinationView',
	'geomag/Measurement',
	'geomag/Observation',
	'geomag/Reading'
], function (
	chai,
	Model,
	Util,

	Format,
	InclinationView,
	Measurement,
	Observation,
	Reading
) {
	'use strict';


	var expect = chai.expect;

	// dummy ObservationBaselineCalculator for testing
	var testObservationBaselineCalculator = Util.extend(new Model(), {
		inclination: function() { return 1; },
		horizontalComponent: function () { return 2; },
		verticalComponent: function () { return 3; },
		southDownMinusNorthUp: function () { return 4; },
		northDownMinusSouthUp: function () { return 5; }
	});

	// dummy Inclination View that tracks whether its
	// render method has been called
	var TestInclinationView = function (options) {
		this.called = false;
		InclinationView.call(this, options);
	};
	TestInclinationView.prototype = Object.create(InclinationView.prototype);
	TestInclinationView.prototype.render = function() {
		this.called = true;
	};

	var viewOptions = {
		reading: new Reading(),
		observation: new Observation(),
		baselineCalculator: testObservationBaselineCalculator
	};

	describe('Unit tests for InclinationView class', function () {

		it('can be "require"d', function () {
			/*jshint -W030*/
			expect(InclinationView).to.not.be.undefined;
			/*jshint +W030*/
		});

		it('can be instantiated', function () {
			var view = new InclinationView({
				reading: new Reading(),
				baselineCalculator: testObservationBaselineCalculator
			});

			/*jshint -W030*/
			expect(view._options).to.not.be.undefined;
			expect(view._inclinationAngle).to.not.be.undefined;
			expect(view._horizontalComponent).to.not.be.undefined;
			expect(view._verticalComponent).to.not.be.undefined;
			expect(view._southDownMinusNorthUp).to.not.be.undefined;
			expect(view._northDownMinusSouthUp).to.not.be.undefined;
			/*jshint +W030*/
		});

		describe('Constructor', function () {
			var m = new InclinationView(viewOptions);

			it('should be an instance of a InclinationView', function () {
				expect(m).to.be.an.instanceOf(InclinationView);
			});

		});

		describe('Initialize', function () {
			var i = 0,
			    len = 0,
			    reading = new Reading(),
			    measurements = reading.getMeasurements(),
			    observation = new Observation(),
			    view;

			view = new TestInclinationView({
				reading: reading,
				observation: observation,
				baselineCalculator: testObservationBaselineCalculator
			});

			it('binds measurement change to render', function () {
				var testmeasurements = [
						measurements[Measurement.SOUTH_DOWN][0],
						measurements[Measurement.NORTH_UP][0],
						measurements[Measurement.SOUTH_UP][0],
						measurements[Measurement.NORTH_DOWN][0]
				];

				for (i = 0, len = testmeasurements.length; i < len; i++){
					view.called = false;
					testmeasurements[i].trigger('change');
					expect(view.called).to.equal(true);
				}
			});

			it('binds calculator change to render', function () {
				view.called = false;
				testObservationBaselineCalculator.trigger('change');
				expect(view.called).to.equal(true);
			});

		});

		describe('Render', function () {

			it('updates view elements', function () {
				var calculator = testObservationBaselineCalculator,
				    view;

				view = new InclinationView({
					reading: new Reading(),
					observation: new Observation(),
					baselineCalculator: calculator
				});

				expect(view._inclinationAngle.innerHTML).to.equal(
						Format.degreesAndDegreesMinutes(calculator.inclination()));
				expect(view._horizontalComponent.textContent).to.equal(
						calculator.horizontalComponent().toFixed(3) + 'nT');
				expect(view._verticalComponent.textContent).to.equal(
						calculator.verticalComponent().toFixed(3) + 'nT');

				expect(view._southDownMinusNorthUp.textContent).to.equal(
						(calculator.southDownMinusNorthUp()*60).toFixed(3) + '\'');
				expect(view._northDownMinusSouthUp.textContent).to.equal(
						(calculator.northDownMinusSouthUp()*60).toFixed(3) + '\'');
			});

		});

	});

});
