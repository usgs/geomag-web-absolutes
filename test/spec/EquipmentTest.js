/* global define, describe, it */
define([
	'chai',
	'geomag/Equipment'
], function (
	chai,
	Equipment
) {
	'use strict';
	var expect = chai.expect;

	describe('Equipment Unit Tests', function () {
		var now = new Date();
		var nextWeek = new Date(now.getTime() + (86400000*7));
		var equipmentAttrs = {
			'id': 123,
			'name': 'Test Equipment',
			'type': 'Theodolite',
			'serial_number': 'Abc123Xyz',
			'begin': now,
			'end': nextWeek
		};

		describe('Equipment()', function () {

			it('should accept complete attributes object', function () {
				var e = new Equipment(equipmentAttrs);
				expect(e.get('id')).to.equal(equipmentAttrs.id);
				expect(e.get('name')).to.equal(equipmentAttrs.name);
				expect(e.get('type')).to.equal(equipmentAttrs.type);
				expect(e.get('serial_number')).to.equal(equipmentAttrs.serial_number);
				expect(e.get('begin')).to.equal(equipmentAttrs.begin);
				expect(e.get('end')).to.equal(equipmentAttrs.end);
			});

		}); // END :: Equipment()

	}); // END :: Equipment Unit Tests
});
