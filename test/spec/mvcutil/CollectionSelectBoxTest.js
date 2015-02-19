/* global chai, describe, it */
'use strict';

var Collection = require('mvc/Collection'),
    CollectionSelectBox = require('mvcutil/CollectionSelectBox'),
    Model = require('mvc/Model');


var expect = chai.expect;

// collection object for testing.
var COLLECTION = Collection([
  Model({id: 11, name: 'test 11'}),
  Model({id:  5, name: 'test 5'}),
  Model({id: 17, name: 'test 17'})
]);

var SELECT_EL = document.createElement('select');


describe('Unit tests for CollectionSelectBox', function () {

  var selectBox = CollectionSelectBox({
    el: SELECT_EL,
    collection: COLLECTION
  });

  describe('when initialized', function () {

    it('is deselected by default', function () {
      expect(SELECT_EL.value).to.equal('');
    });

    it('has one option for each item', function () {
      // plus one for default item
      expect(SELECT_EL.childNodes.length).to.equal(
        COLLECTION.data().length + 1);
    });

    it ('preserves collection order', function () {
      for (var i = 0, len = SELECT_EL.childNodes.length - 1; i < len; i++) {
        expect(parseInt(SELECT_EL.childNodes[i+1].value, 10)).to.equal(
            COLLECTION.data()[i].id);
      }
    });

  });

  describe('option values', function () {

    it('use formatOption method', function () {
      var oldFormat = selectBox._options.formatOption;
      selectBox._options.formatOption = function (obj) {
        return 'blah' + obj.id;
      };

      // re-render
      selectBox.render();
      // check
      expect(SELECT_EL.childNodes[1].textContent).to.equal('blah11');

      // restore
      selectBox._options.formatOption = oldFormat;
      selectBox.render();
    });

  });


  describe('when collection is changed', function () {

    it('triggers change event', function (done) {
      var onChange = function () {
        selectBox.off('change', onChange);
        done();
      };

      selectBox.on('change', onChange);
      COLLECTION.add(Model({id: 1, name: 'test 1'}));
    });

  });

  describe('when collection is selected', function () {

    it('triggers change event', function (done) {
      var onChange = function () {
        selectBox.off('change', onChange);
        done();
      };

      COLLECTION.select(COLLECTION.get(11));
      selectBox.on('change', onChange);
      COLLECTION.select(COLLECTION.get(5));
    });

    it('selectbox value updates', function () {
      // set collection to 11
      COLLECTION.select(COLLECTION.get(11));
      expect(COLLECTION.getSelected().id).to.equal(11);
      expect(parseInt(SELECT_EL.value, 10)).to.equal(11);

      // now select by id
      selectBox.selectById(5);
      expect(COLLECTION.getSelected().id).to.equal(5);
      expect(parseInt(SELECT_EL.value, 10)).to.equal(5);
    });

  });

});
