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
			it('returns "h" value for correct index', function () {
				var timeSeries = new TimeSeries(DATA);
				expect(timeSeries.getChannelHValue(1372718591178)).to.equal(1);
			});

			it('returns null when the timeseries value does not exist', function () {
				var timeSeries = new TimeSeries(DATA);
				expect(timeSeries.getChannelHValue(9999999999999)).to.equal(null);
			});
		});

		describe('getChannelEValue()', function () {
			it('returns "e" value for correct index', function () {
				var timeSeries = new TimeSeries(DATA);
				expect(timeSeries.getChannelEValue(1372718591178)).to.equal(11);
			});

			it('returns null when the timeseries value does not exist', function () {
				var timeSeries = new TimeSeries(DATA);
				expect(timeSeries.getChannelEValue(9999999999999)).to.equal(null);
			});
		});

		describe('getChannelZValue()', function () {
			it('returns "z" value for correct index', function () {
				var timeSeries = new TimeSeries(DATA);
				expect(timeSeries.getChannelZValue(1372718591178)).to.equal(111);
			});

			it('returns null when the timeseries value does not exist', function () {
				var timeSeries = new TimeSeries(DATA);
				expect(timeSeries.getChannelZValue(9999999999999)).to.equal(null);
			});
		});

		describe('getChannelFValue()', function () {
			it('returns "f" value for correct index', function () {
				var timeSeries = new TimeSeries(DATA);
				expect(timeSeries.getChannelFValue(1372718591178)).to.equal(1111);
			});

			it('returns null when the timeseries value does not exist', function () {
				var timeSeries = new TimeSeries(DATA);
				expect(timeSeries.getChannelFValue(9999999999999)).to.equal(null);
			});
		});

	});

});
