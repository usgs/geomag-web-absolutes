/* global define */
/* global describe */
/* global it */

define([
	'chai',
	'mvc/Collection',
	'geomag/TimeSeries'
], function(chai, Collection, TimeSeries) {
	'use strict';
	var expect = chai.expect;

	var DATA = {
		'time': [1372718591178,1372718592178,1372718593178,1372718594178],
		'h': [1,2,3,4],
		'e': [11,22,33,44],
		'z': [111,222,333,444],
		'f': [1111,2222,3333,4444]
	};



	describe('Unit tests for the "TimeSeries" class', function () {


		describe('getChannelHValue()', function () {
			it('returns "h" value for the given index', function () {
				var timeSeries = new TimeSeries(DATA);
				expect(timeSeries.getChannelHValue(0)).to.equal(1);
			});
		});

		describe('getChannelEValue()', function () {
			it('returns "e" value for the given index', function () {
				var timeSeries = new TimeSeries(DATA);
				expect(timeSeries.getChannelEValue(0)).to.equal(11);
			});
		});

		describe('getChannelZValue()', function () {
			it('returns "z" value for the given index', function () {
				var timeSeries = new TimeSeries(DATA);
				expect(timeSeries.getChannelZValue(0)).to.equal(111);
			});
		});

		describe('getChannelFValue()', function () {
			it('returns "f" value for the given index', function () {
				var timeSeries = new TimeSeries(DATA);
				expect(timeSeries.getChannelFValue(0)).to.equal(1111);
			});
		});


		describe('getChannelValueByTime()', function () {
			it('returns "h" value for correct time and channel slice', function () {
				var timeSeries = new TimeSeries(DATA);
				expect(timeSeries.getChannelValueByTime(1372718591178, 'h')).to.equal(1);
			});

			it('returns "e" value for correct time and channel slice', function () {
				var timeSeries = new TimeSeries(DATA);
				expect(timeSeries.getChannelValueByTime(1372718591178, 'e')).to.equal(11);
			});

			it('returns "z" value for correct time and channel slice', function () {
				var timeSeries = new TimeSeries(DATA);
				expect(timeSeries.getChannelValueByTime(1372718591178, 'z')).to.equal(111);
			});

			it('returns "f" value for correct time and channel slice', function () {
				var timeSeries = new TimeSeries(DATA);
				expect(timeSeries.getChannelValueByTime(1372718591178, 'f')).to.equal(1111);
			});

			it('returns null when the time value does not exist in the times series', function () {
				var timeSeries = new TimeSeries(DATA);
				expect(timeSeries.getChannelValueByTime(9999999999999, 'h')).to.equal(null);
			});

			it('returns null when the channel value does not exist in the time series', function () {
				var timeSeries = new TimeSeries(DATA);
				expect(timeSeries.getChannelValueByTime(1372718591178, 'q')).to.equal(null);
			});
		});

	});

});
