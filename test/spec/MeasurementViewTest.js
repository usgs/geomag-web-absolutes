/* global define, describe, it */
define([
	'chai',

	'mvc/Model',
	'geomag/Measurement',
	'geomag/MeasurementView',
	'geomag/Observation',
	'geomag/Formatter'
], function (
	chai,

	Model,
	Measurement,
	MeasurementView,
	Observation,
	Formatter
) {
	'use strict';

	var expect = chai.expect;
	var viewOptions = {
		el: document.createElement('tr'),
		measurement: new Measurement({
				'id': 1,
				'type': Measurement.FIRST_MARK_UP,
				'time': null,
				'angle': 0,
				'h': null,
				'e': null,
				'z': null,
				'f': null,
			}),
		observation: new Observation({
			'begin': 1393432420000
		})
	};

	describe('MeasurementView Unit Tests', function () {

		describe('Constructor', function () {
			var m = new MeasurementView(viewOptions);

			it('should be an instance of a MeasurementView', function () {
				expect(m).to.be.an.instanceOf(MeasurementView);
			});
		});

		// These are currently passing but take a long time (~10 sec) to complete.
		// We should re-check this test any time the _dmsToDecimal or _decimalToDms
		// methods are updated
		describe.skip('degree_inversion_check', function () {
			var m = new MeasurementView(viewOptions);

			it('gives back original input', function () {
				var deg, min, sec, result;

				for (deg = 0; deg < 360; deg++) {
					for (min = 0; min < 60; min++) {
						for (sec = 0; sec < 60; sec++) {
							result = m._dmsToDecimal(deg, min, sec);
							expect(m._decimalToDms(result)).to.deep.equal([deg, min, sec]);
						}
					}
				}
			});
		});

		describe('validation', function () {

			var m = new MeasurementView(viewOptions),
			    time = m._el.querySelector('.measurement-time').
							querySelector('input'),
			    degrees = m._el.querySelector('.measurement-degrees').
							querySelector('input'),
			    minutes = m._el.querySelector('.measurement-minutes').
							querySelector('input'),
			    seconds = m._el.querySelector('.measurement-seconds').
							querySelector('input');

			var getBlurEvent = function () {
				var blurEvent = document.createEvent('HTMLEvents');
				blurEvent.initEvent('blur', false, false);
				return blurEvent;
			};


			it('correctly validates all invalid measurement values', function () {
				time.value = 'f';
				degrees.value = 'f';
				minutes.value = 'f';
				seconds.value = 'f';

				// trigger blur on each element
				time.dispatchEvent(getBlurEvent());
				degrees.dispatchEvent(getBlurEvent());
				minutes.dispatchEvent(getBlurEvent());
				seconds.dispatchEvent(getBlurEvent());

				expect(time.className).to.equal('error');
				expect(degrees.className).to.equal('error');
				expect(minutes.className).to.equal('error');
				expect(seconds.className).to.equal('error');
			});

			it('correctly sets model when given invalid input', function () {
				var measurement = m._measurement;

				time.value = 'f';
				degrees.value = '9';
				minutes.value = '0';
				seconds.value = 'f';

				// trigger blur on each element
				time.dispatchEvent(getBlurEvent());
				degrees.dispatchEvent(getBlurEvent());
				minutes.dispatchEvent(getBlurEvent());
				seconds.dispatchEvent(getBlurEvent());

				expect(measurement.get('angle')).to.be.equal(0);
				/* jshint -W030 */
				expect(measurement.get('time')).to.be.null;
				/* jshint +W030 */
			});

			it('correctly validates all valid measurement values', function () {
				time.value = '20:20:20';
				degrees.value = 90;
				minutes.value = 30;
				seconds.value = 0;

				// trigger blur on each element
				time.dispatchEvent(getBlurEvent());
				degrees.dispatchEvent(getBlurEvent());
				minutes.dispatchEvent(getBlurEvent());
				seconds.dispatchEvent(getBlurEvent());

				expect(time.className).to.equal('');
				expect(degrees.className).to.equal('');
				expect(minutes.className).to.equal('');
				expect(seconds.className).to.equal('');
			});

			it('correctly sets model when given valid input', function () {
				var measurement = m._measurement,
				    formattedTime;

				time.value = 1393532420000;
				degrees.value = 90;
				minutes.value = 30;
				seconds.value = 0;

				// trigger blur on each element
				time.dispatchEvent(getBlurEvent());
				degrees.dispatchEvent(getBlurEvent());
				minutes.dispatchEvent(getBlurEvent());
				seconds.dispatchEvent(getBlurEvent());

				formattedTime = Formatter.time(measurement.get('time'));

				expect(measurement.get('angle')).to.be.equal(90.5);
				expect(formattedTime).to.be.equal(Formatter.time(1393532420000));
			});

			it('updates model with valid time, even when angle data is invalid',
					function () {
				var measurement = m._measurement,
				    formattedTime;

				time.value = 1393532420000;
				degrees.value = 'f';
				minutes.value = 'f';
				seconds.value = 'f';

				// trigger blur on any element
				time.dispatchEvent(getBlurEvent());

				formattedTime = Formatter.time(measurement.get('time'));

				expect(formattedTime).to.be.equal(Formatter.time(1393532420000));
			});

			it('updates model with valid angle, even when time data is invalid',
					function () {
				var measurement = m._measurement;

				time.value = 'f';
				degrees.value = 90;
				minutes.value = 30;
				seconds.value = 0;

				// trigger blur on any element
				seconds.dispatchEvent(getBlurEvent());

				expect(measurement.get('angle')).to.equal(90.5);
			});
		});
	});
});