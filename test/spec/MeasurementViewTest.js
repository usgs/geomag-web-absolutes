/* global define, describe, it */
define([
	'chai',

	'mvc/Model',
	'geomag/Measurement',
	'geomag/MeasurementView',
	'geomag/Observation'
], function (
	chai,

	Model,
	Measurement,
	MeasurementView,
	Observation
) {
	'use strict';

	var expect = chai.expect;
	var viewOptions = {
		el: document.createElement('tr'),
		measurement: new Model({type: Measurement.FIRST_MARK_UP}),
		observation: new Observation()
	};

	describe('MeasurementView Unit Tests', function () {
		describe('Constructor', function () {
			var m = new MeasurementView(viewOptions);

			it('should be an instance of a MeasurementView', function () {
				expect(m).to.be.an.instanceOf(MeasurementView);
			});
		});

		describe('_timeToString', function () {
			var m = new MeasurementView(viewOptions);

			it('parses start of day properly', function () {
				expect(m._timeToString(0)).to.equal('00:00:00');
			});

			it('parses end of day properly', function () {
				expect(m._timeToString(86399999)).to.equal('23:59:59');
			});

			it('parses one minute properly', function () {
				expect(m._timeToString(60000)).to.equal('00:01:00');
			});

			it('parses one hour properly', function () {
				expect(m._timeToString(3600000)).to.equal('01:00:00');
			});

			it('parses noon properly', function () {
				expect(m._timeToString(43200000)).to.equal('12:00:00');
			});

			it('parses a mixed offset properly', function () {
				expect(m._timeToString(40268000)).to.equal('11:11:08');
			});
		});

		describe('_stringToTime', function () {
			var m = new MeasurementView(viewOptions);

			it('parses start of day properly', function () {
				// hhmmss
				expect(m._stringToTime('00:00:00')).to.equal(0);
				expect(m._stringToTime('00 00 00')).to.equal(0);
				expect(m._stringToTime('000000')).to.equal(0);

				// hmmss
				expect(m._stringToTime('0:00:00')).to.equal(0);
				expect(m._stringToTime('0 00 00')).to.equal(0);
				expect(m._stringToTime('00000')).to.equal(0);

				// hhmm
				expect(m._stringToTime('00:00')).to.equal(0);
				expect(m._stringToTime('00 00')).to.equal(0);
				expect(m._stringToTime('0000')).to.equal(0);
			});

			it('parses end of day properly', function () {
				// hhmmss
				expect(m._stringToTime('23:59:59')).to.equal(86399000);
				expect(m._stringToTime('23 59 59')).to.equal(86399000);
				expect(m._stringToTime('235959')).to.equal(86399000);
			});

			it('parses one minute properly', function () {
				// hhmmss
				expect(m._stringToTime('00:01:00')).to.equal(60000);
				expect(m._stringToTime('00 01 00')).to.equal(60000);
				expect(m._stringToTime('000100')).to.equal(60000);

				// hmmss
				expect(m._stringToTime('0:01:00')).to.equal(60000);
				expect(m._stringToTime('0 01 00')).to.equal(60000);
				expect(m._stringToTime('00100')).to.equal(60000);

				// hhmm
				expect(m._stringToTime('00:01')).to.equal(60000);
				expect(m._stringToTime('00 01')).to.equal(60000);
				expect(m._stringToTime('0001')).to.equal(60000);
			});

			it('parses one hour properly', function () {
				// hhmmss
				expect(m._stringToTime('01:00:00')).to.equal(3600000);
				expect(m._stringToTime('01 00 00')).to.equal(3600000);
				expect(m._stringToTime('010000')).to.equal(3600000);

				// hmmss
				expect(m._stringToTime('1:00:00')).to.equal(3600000);
				expect(m._stringToTime('1 00 00')).to.equal(3600000);
				expect(m._stringToTime('10000')).to.equal(3600000);

				// hhmm
				expect(m._stringToTime('01:00')).to.equal(3600000);
				expect(m._stringToTime('01 00')).to.equal(3600000);
				expect(m._stringToTime('0100')).to.equal(3600000);
			});

			it('parses noon properly', function () {
				// hhmmss
				expect(m._stringToTime('12:00:00')).to.equal(43200000);
				expect(m._stringToTime('12 00 00')).to.equal(43200000);
				expect(m._stringToTime('120000')).to.equal(43200000);

				// hhmm
				expect(m._stringToTime('12:00')).to.equal(43200000);
				expect(m._stringToTime('12 00')).to.equal(43200000);
				expect(m._stringToTime('1200')).to.equal(43200000);
			});

			it('parses a mixed offset properly', function () {
				// hhmmss
				expect(m._stringToTime('11:11:08')).to.equal(40268000);
				expect(m._stringToTime('11 11 08')).to.equal(40268000);
				expect(m._stringToTime('111108')).to.equal(40268000);
			});
		});

		describe('_dmsToDecimal', function () {
			var m = new MeasurementView(viewOptions);

			it('parses DMS properly', function () {
				// Edge case
				expect(m._dmsToDecimal(0, 0, 0)).to.equal(0.0);
				// All whole numbers
				expect(m._dmsToDecimal(29, 59, 60)).to.equal(30.0);
				// Decimal degree value
				expect(m._dmsToDecimal(29.5, 29, 60)).to.equal(30.0);
				// Decimal minute value
				expect(m._dmsToDecimal(0, 29.5, 30)).to.equal(0.5);
				// Decimal degree and minute value
				expect(m._dmsToDecimal(29.5, 29.5, 30)).to.equal(30.0);

				// Some tests from real observations
				expect(m._dmsToDecimal(120, 0, 36)).to.equal(120.010);
			});
		});

		describe('_decimalToDms', function () {
			var m = new MeasurementView(viewOptions);

			it('parses decimals properly', function () {
				// Edge case
				expect(m._decimalToDms(0.0)).to.deep.equal([0, 0, 0]);
				expect(m._decimalToDms(30.0)).to.deep.equal([30, 0, 0]);
				expect(m._decimalToDms(30.5)).to.deep.equal([30, 30, 0]);
				expect(m._decimalToDms(0.5)).to.deep.equal([0, 30, 0]);

				// Some tests from real observations
				expect(m._decimalToDms(120.010)).to.deep.equal([120, 0, 36]);
			});
		});
	});
});
