'use strict';

var Format = require('geomag/Formatter');

var Validate = {

  validDegrees: function (value) {
    if (value === null || value === '') {
      return false;
    }
    return this.inRange(value, 0, 360);
  },

  validSeconds: function (value) {
    if (value === null || value === '') {
      return false;
    }
    return this.inRange(value, 0, 60);
  },

  validMinutes: function (value) {
    if (value === null || value === '') {
      return false;
    }
    return this.inRange(value, 0, 60);
  },

  validTime: function (value) {
    // for 24-hour time, leading zeroes mandatory.
    var pattern = /^(2[0-3]|[01][0-9]):?[0-5][0-9]:?[0-5][0-9]$/;
    if (value.match(pattern)) {
      return true;
    }
    return false;
  },

  validDate: function (value) {
    var currentDate;

    currentDate = new Date().getTime();
    currentDate = Format.date(currentDate);

    if (value > currentDate) {
      return false;
    }
    return true;
  },

  isNull: function (value) {
    if (!value) {
      return true;
    }
  },

  inRange: function (value, begin, end) {
    if (isNaN(value)) {
      return false;
    }
    if (value >= begin && value < end) {
      return true;
    }
    return false;
  }

};

module.exports = Validate;
