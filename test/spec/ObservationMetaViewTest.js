/* global define, describe, it */
define([
	'chai',

	'mvc/Collection',
	'mvc/Model',

	'geomag/ObservatoryFactory',
	'geomag/ObservationMetaView'
], function (
	chai,

	Collection,
	Model,

	ObservatoryFactory,
	ObservationMetaView
) {
	'use strict';


	var expect = chai.expect;


	var factory = new ObservatoryFactory();

	// stub in methods
	factory.getObservatory = function (options) {
		options.success(this._getObservatory({
			id: options.id,
			default_pier_id: 4,
			piers: [
				{id: 3, name: 'Pier 3', default_mark_id: 10, correction: 1.23,
						default_electronics_id: 5, default_theodolite_id: 6,
						marks: [{id: 10, name: 'Mark 10', azimuth: 4.56}]},
				{id: 4, name: 'Pier 4', default_mark_id: 12, correction: 7.89,
						default_electronics_id: 7, default_theodolite_id: 6,
						marks: [{id: 11, name: 'Mark 11', azimuth: 10.11},
						        {id: 12, name: 'Mark 12', azimuth: 12.13}]}
			],
			instruments: [
				{id: 5, type: 'elec', name: 'Electronics1', serial: '1234'},
				{id: 6, type: 'theo', name: 'Theodolite1', serial: 'abcd'},
				{id: 7, type: 'elec', name: 'Electronics2', serial: '1235'},
				{id: 8, type: 'theo', name: 'Theodolite2', serial: 'abce'}
			],
			observations: []
		}));
	};

	factory.getObservatories = function (options) {
		options.success(this._getObservatories([
			{id: 1, name: 'Observatory 1'},
			{id: 5, name: 'Observatory 5'}
		]));
	};


	describe('Unit tests for ObservationMetaView', function () {

		var observation = factory.newObservation(),
		    calculator = new Model(),
		    view;


		// load an observatory
		// view._setObservatory(observatory);


		describe('setObservatory()', function () {

			it('sets defaults for empty observation', function () {
				view = new ObservationMetaView({
					observation: observation,
					calculator: calculator
				});

				view._observatorySelectView.selectById(5);

				expect(observation.get('electronics_id')).to.equal(7);
				expect(observation.get('theodolite_id')).to.equal(6);
				expect(observation.get('mark_id')).to.equal(12);
			});

		});

		describe('updates calculator properties', function () {

			it ('sets trueAzimuthOfMark property', function () {
				expect(calculator.get('trueAzimuthOfMark')).to.equal(12.13);
				view._marksSelectView.selectById(11);
				expect(calculator.get('trueAzimuthOfMark')).to.equal(10.11);
			});

			it ('sets pierCorrection property', function () {
				expect(calculator.get('pierCorrection')).to.equal(7.89);
				view._pierSelectView.selectById(3);
				expect(calculator.get('pierCorrection')).to.equal(1.23);
			});

		});

		describe('updated observation properties', function () {

			it('sets observatory_id property', function () {
				view._observatorySelectView.selectById(1);
				expect(observation.get('observatory_id')).to.equal(1);
				view._observatorySelectView.selectById(5);
				expect(observation.get('observatory_id')).to.equal(5);
			});

			it('sets mark_id property', function () {
				view._marksSelectView.selectById(11);
				expect(observation.get('mark_id')).to.equal(11);
				view._marksSelectView.selectById(12);
				expect(observation.get('mark_id')).to.equal(12);
			});

			it('sets electronics_id property', function () {
				view._electronicsSelectView.selectById(7);
				expect(observation.get('electronics_id')).to.equal(7);
				view._electronicsSelectView.selectById(5);
				expect(observation.get('electronics_id')).to.equal(5);
			});

			it('sets theodolite_id property', function () {
				view._theodoliteSelectView.selectById(8);
				expect(observation.get('theodolite_id')).to.equal(8);
				view._theodoliteSelectView.selectById(6);
				expect(observation.get('theodolite_id')).to.equal(6);
			});

		});

	});

});
