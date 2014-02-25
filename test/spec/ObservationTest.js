/* global define, describe, it */
define([
	'chai',
	'sinon',

	'mvc/Model',

	'geomag/Observation'
], function (
	chai,
	sinon,

	Model,

	Observation
) {
	'use strict';
	var expect = chai.expect;

	describe('Observation Unit Tests', function () {

		describe('Constructor', function () {
			var o = new Observation();

			it('should be an instance of an Observation', function () {
				expect(o).to.be.an.instanceOf(Observation);
			});

			it('should be an instance of a Model', function () {
				expect(o).to.be.an.instanceOf(Model);
			});

		}); // END :: Constructor

		describe('eachReading()', function () {

			it ('calls callback for each reading', function () {
				var callback = sinon.spy(),
				    observation = new Observation(),
				    readings = observation.get('readings').data(),
				    r,
				    rlen;

				observation.eachReading(callback);
				// called once for each measurement
				expect(callback.callCount).to.equal(readings.length);
				// called in the correct order
				for (r = 0, rlen = readings.length; r < rlen; r++) {
					expect(callback.getCall(r).args[0]).to.equal(readings[r]);
				}
			});

		});


		describe('eachMeasurement()', function () {

			it ('calls callback for each measurement', function () {
				var callback = sinon.spy(),
				    observation = new Observation(),
				    readings = observation.get('readings').data(),
				    reading,
				    r,
				    rlen,
				    measurements,
				    m,
				    mlen,
				    numMeasurements = 0;

				observation.eachMeasurement(callback);

				// called in the correct order
				for (r = 0, rlen = readings.length; r < rlen; r++) {
					reading = readings[r];
					measurements = reading.get('measurements').data();
					for (m = 0, mlen = measurements.length; m < mlen; m++) {
						expect(callback.getCall(numMeasurements++).args[0]).to.equal(measurements[m]);
					}
				}

				// called once for each measurement
				expect(callback.callCount).to.equal(numMeasurements);
			});

		});

	}); // END :: Observation Unit Tests

});
