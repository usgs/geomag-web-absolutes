/* global chai, sinon, describe, it */
'use strict';

var Measurement = require('geomag/Measurement'),
    Observation = require('geomag/Observation'),
    ObservatoryFactory = require('geomag/ObservatoryFactory'),
    Xhr = require('util/Xhr');


var expect = chai.expect;

var URL = '/observation_data.php';
var FACTORY = ObservatoryFactory();
var anyErrors = false;


/*
 * This test depends on describe and it being processed sequentially.
 * It also depends on test data that is not guaranteed to exist,
 *     (observatory_id=3, mark_id=3, in server side testdata.db),
 *     and so is being skipped.
 * When these dependencies are in place, these tests pass.
 */

describe.skip('Unit tests for observation_data.php', function () {
  var observation,
      measurementTime = new Date().getTime(),
      measurementAngle = 123.4,
      updatedMeasurementAngle = 2.2345;

  observation = Observation({
    // TODO: this depends on specific test data...
    observatory_id: 3,
    mark_id: 3
  });
  // set a data point for verification
  observation.get('readings').data()[0].
      getMeasurements()[Measurement.FIRST_MARK_UP][0].set({
          'time': measurementTime,
          'angle': measurementAngle});

  describe('create', function () {
    it('returns the created observation', function (done) {
      Xhr.ajax({
        url: URL,
        method: 'POST',
        rawdata: JSON.stringify(observation),
        success: function (data) {
          var created = FACTORY._getObservation(data);
          expect(created.get('id')).to.not.equal(null);
          expect(created.get('readings').data()[0].
              getMeasurements()[Measurement.FIRST_MARK_UP][0].get('time')).
              to.equal(measurementTime);
          // update reference for next test
          observation = created;
          done();
        },
        error: function (err) {
          anyErrors = true;
          done(new Error('Xhr error code was ' + err));
        }
      });
    });

    it('fails if the observation has an id', function (done) {
      if (anyErrors) {
        done(new Error('previous tests failed'));
        return;
      }

      Xhr.ajax({
        url: URL,
        method: 'POST',
        rawdata: JSON.stringify(observation),
        success: function () {
          anyErrors = true;
          done(new Error('expected error when creating existing observation'));
        },
        error: function () {
          done();
        }
      });
    });
  });

  describe('read', function () {
    it('returns the requested observation', function (done) {
      if (anyErrors) {
        done(new Error('previous tests failed'));
        return;
      }
      Xhr.ajax({
        url: URL,
        method: 'GET',
        data: {
          id: observation.id
        },
        success: function (data) {
          var read = FACTORY._getObservation(data);
          expect(JSON.stringify(read)).to.deep.equal(JSON.stringify(observation));
          done();
        },
        error: function (err) {
          anyErrors = true;
          done(new Error('Xhr error code was ' + err));
        }
      });
    });

    it('generates an error if the observation does not exist', function (done) {
      if (anyErrors) {
        done(new Error('previous tests failed'));
        return;
      }
      Xhr.ajax({
        url: URL,
        method: 'GET',
        data: {
          id: observation.id + 1 // in theory this is one past the just created test observation
        },
        success: function () {
          anyErrors = true;
          done(new Error('expected error reading observation that does not exist'));
        },
        error: function () {
          done();
        }
      });
    });
  });

  describe('update', function () {
    it('returns the updated observation', function (done) {

      observation.get('readings').data()[0].
          getMeasurements()[Measurement.FIRST_MARK_UP][0].set({
              'angle': updatedMeasurementAngle});
      Xhr.ajax({
        url: URL,
        method: 'PUT',
        rawdata: JSON.stringify(observation),
        success: function (data) {
          var updated = FACTORY._getObservation(data);
          expect(updated.get('readings').data()[0].
              getMeasurements()[Measurement.FIRST_MARK_UP][0].get('angle')).
              to.equal(updatedMeasurementAngle);
          observation = updated;
          done();
        },
        error: function (err) {
          done(new Error('Xhr error code was ' + err));
        }
      });
    });

    it('fails if the observation does not have an id', function (done) {
      Xhr.ajax({
        url: URL,
        method: 'PUT',
        rawdata: JSON.stringify(new Observation()),
        success: function () {
          done(new Error('expected error updating observation without id'));
        },
        error: function () {
          done();
        }
      });
    });
  });

  describe('delete', function () {
    it('deletes the observation', function (done) {
      if (anyErrors) {
        done(new Error('previous tests failed'));
        return;
      }
      Xhr.ajax({
        url: URL,
        method: 'DELETE',
        data: {
          id: observation.id
        },
        success: function () {
          done();
        },
        error: function (err) {
          anyErrors = true;
          done(new Error('Xhr error code was ' + err));
        }
      });
    });

    it('fails if the observation does not exist', function (done) {
      if (anyErrors) {
        done(new Error('previous tests failed'));
        return;
      }
      // same call as previous test, should throw error second time
      Xhr.ajax({
        url: URL,
        method: 'DELETE',
        data: {
          id: observation.id
        },
        success: function () {
          done(new Error('expected error deleting observation that does not exist'));
        },
        error: function () {
          done();
        }
      });
    });
  });

});
