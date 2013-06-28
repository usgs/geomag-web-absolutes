/* global define */
/* global describe */
/* global it */

define([
		'chai',
		'geomag/Pier',
		'mvc/Collection',
		'mvc/Util'
], function (chai, Pier, Collection, Util) {
		'use strict';
		var expect = chai.expect;


		var TEST_PIER_DATA = {
				'id': 'example_pier_001',
				'marks': new Collection([
						{
								'id': 'test_mark_1'
						},
						{
								'id': 'test_mark_2'
						},
						{
								'id': 'test_mark_3'
						}
				]),
				'default_mark_id': null
		};

		var mark1 = {'test1': 'a'},
			mark2 = {'test2': 'b'},
			mark3 = {'test3': 'c'};


		describe('Unit tests for the "Pier" class', function () {

				describe('constructor()', function () {
						it('calls Model constructor, given a name', function () {
								var myPier1 = new Pier({'name': 'testname'});
								expect(myPier1.get('name')).to.equal('testname');
						});
						
						it('calls Model constructor', function () {
								var myPier2 = new Pier(TEST_PIER_DATA);
								expect(myPier2.get('id')).to.equal('example_pier_001');
						});

						it('the constructor makes a collection', function () {
								var mark_list = [mark1, mark2, mark3];
								var myPier3 = new Pier({'marks': mark_list});
								expect(myPier3.marks.data().length).to.equal(3);
						});

						it('the collection modifies the model', function () {
								var mark_list = [mark1, mark2];
								var myPier = new Pier({'marks': mark_list});
								expect(myPier.marks.data().length).to.equal(2);

								myPier.marks.add(mark3);
								expect(myPier.marks.data().length).to.equal(3); // check collection
								expect(myPier.get('marks').length).to.equal(3); // check model
						});
				});

				describe('getDefaultMark()', function () {
						it('returns the default mark when specified', function () {
								var myPier = new Pier(
											Util.extend({}, TEST_PIER_DATA,
															{'default_mark_id': 'test_mark_1'}));
								var defaultMark = myPier.getDefaultMark();
								expect(defaultMark.id).to.equal('test_mark_1');
						});

						it('returns null when no default specified', function () {
								var myPier = new Pier(TEST_PIER_DATA);
								var defaultMark = myPier.getDefaultMark();
								expect(defaultMark).to.equal(null);
						});
				});

		});

});