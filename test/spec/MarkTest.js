/* global define */
/* global describe */
/* global it */

define([
	'chai',
	'mvc/Model',
	'geomag/Mark'
], function (chai, Model, Mark) {
	'use strict';
	var expect = chai.expect;

	describe('Unit tests for the "Mark" class', function () {
		var testObect = { name:  'Main',
											begin: 1372193224820,
											end:   1372193224880,
											azimuth: 176.1
		};

		describe('constructor()', function () {
			it('evaluates to instance of "Mark"', function () {
				var mark = new Mark();
				expect(mark instanceof Mark);
				expect(mark instanceof Model);
			});

			it('works when passed an obect', function () {
					var mark = new Mark(testObect);
					expect(mark.get('name')).to.equal(testObect.name);
			});
		});
	});
});
