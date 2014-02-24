/* global define */
define([
	'mvc/View',
	'mvc/Collection',
	'util/Util',

	'mvcutil/CollectionSelectBox'
], function (
	View,
	Collection,
	Util,

	CollectionSelectBox
) {
	'use strict';


	// default constructor options
	var DEFAULTS = {
	};

	// unique id prefix for form elements
	var IDPREFIX = 'observationmetaview-';

	// unique id sequence for form elements
	var SEQUENCE = 0;


	/**
	 * Utility function to select a collection item based on item id.
	 *
	 * If collection is not null, selects collection item with id
	 * or triggers deselect if no matching item found.
	 *
	 * @param collection {Collection}
	 *        collection being selected.
	 * @param id {Number}
	 *        id of collection item to select.
	 */
	var _selectById = function (collection, id) {
		var item = null;
		if (collection !== null) {
			if (id !== null) {
				item = collection.get(id);
			}
			if (item !== null) {
				collection.select(item);
			} else {
				collection.deselect();
			}
		}
	};


	/**
	 * Construct a new ObservationMetaView.
	 *
	 * @param options {Object}
	 * @param options.observation {Observation}
	 *        observation to display.
	 */
	var ObservationMetaView = function (options) {
		this._options = Util.extend({}, DEFAULTS, options);
		View.call(this, this._options);
	};
	ObservationMetaView.prototype = Object.create(View.prototype);


	ObservationMetaView.prototype.render = function () {
		var obs = this._observation,
		    begin = new Date(obs.get('begin') || new Date().getTime()),
		    y = begin.getUTCFullYear(),
		    m = begin.getUTCMonth() + 1,
		    d = begin.getUTCDate();

		this._date.value = y + '-' + (m<10?'0':'') + m + '-' + (d<10?'0':'') + d;
		this._pierTemperature.value = obs.get('pier_temperature');
	};


	ObservationMetaView.prototype._initialize = function () {
		var _this = this,
		    el = this._el,
		    calculator = this._options.calculator,
		    observation = this._options.observation,
		    observatories = this._options.observatories,
		    observatorySelectView,
		    pierSelectView,
		    marksSelectView,
		    electronicsSelectView,
		    theodoliteSelectView,
		    date,
		    pierTemperature,
		    idPrefix = IDPREFIX + (++SEQUENCE);

		this._calculator = calculator;
		this._observation = observation;
		this._onChange = this._onChange.bind(this);

		el.innerHTML = [
			'<section class="observation-meta-view">',
				'<div class="row">',
					'<div class="column one-of-two right-aligned">',
						'<label for="', idPrefix, '-date">Date</label>',
						'<input id="',  idPrefix, '-date" type="text"',
								' class="date" placeholder="YYYY-MM-DD"/>',
						'<label for="', idPrefix, '-piertemp">',
								'Pier <abbr title="Temperature">Temp</abbr></label>',
						'<input id="',  idPrefix, '-piertemp" type="text"',
								' class="pier-temperature"/>',
					'</div>',
					'<div class="column one-of-two right-aligned">',
						'<label for="', idPrefix, '-observatory">Observatory</label>',
						'<select id="', idPrefix, '-observatory"',
								' class="observatory"></select>',
						'<label for="', idPrefix, '-pier">Pier</label>',
						'<select id="', idPrefix, '-pier"',
								' class="pier"></select>',
						'<label for="', idPrefix, '-mark">Mark</label>',
						'<select id="', idPrefix, '-mark"',
								' class="mark"></select>',
						'<label for="', idPrefix, '-electronics">Electronics</label>',
						'<select id="', idPrefix, '-electronics"',
								' class="electronics"></select>',
						'<label for="', idPrefix, '-theodolite">Theodolite</label>',
						'<select id="', idPrefix, '-theodolite"',
								' class="theodolite"></select>',
					'</div>',
				'</div>',
			'</section>'
		].join('');

		// observatory information inputs
		this._observatorySelectView = observatorySelectView =
				new CollectionSelectBox({
					el: el.querySelector('.observatory'),
					emptyText: 'Loading observatories...'
				});
		this._pierSelectView = pierSelectView =
				new CollectionSelectBox({
					el: el.querySelector('.pier'),
					emptyText: 'Select observatory...'
				});
		this._marksSelectView = marksSelectView =
				new CollectionSelectBox({
					el: el.querySelector('.mark'),
					emptyText: 'Select pier...'
				});
		this._electronicsSelectView = electronicsSelectView =
				new CollectionSelectBox({
					el: el.querySelector('.electronics'),
					emptyText: 'Select observatory...',
					formatOption: this._formatInstrument
				});
		this._theodoliteSelectView = theodoliteSelectView =
				new CollectionSelectBox({
					el: el.querySelector('.theodolite'),
					emptyText: 'Select observatory...',
					formatOption: this._formatInstrument
				});
		// observation inputs
		this._date = date = el.querySelector('.date');
		this._pierTemperature = pierTemperature =
				el.querySelector('.pier-temperature');

		date.addEventListener('change', this._onChange);
		pierTemperature.addEventListener('change', this._onChange);


		this._observatorySelectView.on('change', function (selected) {
			// currently selected observatory
			var observatory_id = observation.get('observatory_id');

			// disable dependent select boxes until observatory loads
			pierSelectView.disable();
			marksSelectView.disable();
			electronicsSelectView.disable();
			theodoliteSelectView.disable();

			if (selected === null) {
				// no selection
				observation.set({observatory_id: null});
			} else {
				if (observatory_id !== selected.id) {
					// different observatory, clear mark and instrument attributes
					observation.set({
						observatory_id: selected.id,
						mark_id: null,
						electronics_id: null,
						theodolite_id: null
					});
					// clear calculator settings
					calculator.set({
						pierCorrection: 0,
						trueAzimuthOfMark: 0
					});
				}
				// load observatory details
				selected.getObservatory({
					success: function (observatory) {
						_this._setObservatory(observatory);
					}
				});
			}

		});

		this._pierSelectView.on('change', function (pier) {
			var marks = null,
			    mark_id = null,
			    mark = null,
			    pierCorrection = 0,
			    trueAzimuthOfMark = 0;
			if (pier !== null) {
				pierCorrection = pier.get('correction');
				// update mark
				marks = pier.get('marks');
				mark_id = observation.get('mark_id') ||
						pier.get('default_mark_id');
				mark = marks.get(mark_id);
				if (mark !== null) {
					marks.select(mark);
					trueAzimuthOfMark = mark.get('azimuth');
				}
				// set defaults
				if (observation.get('electronics_id') === null) {
					electronicsSelectView.selectById(
							pier.get('default_electronics_id'));
				}
				if (observation.get('theodolite_id') === null) {
					theodoliteSelectView.selectById(
							pier.get('default_theodolite_id'));
				}
			}
			// azimuth is also set by marksSelectView.setCollection when
			// mark changes, set now to prevent a double "change" event
			calculator.set({
				pierCorrection: pierCorrection,
				trueAzimuthOfMark: trueAzimuthOfMark
			});
			marksSelectView.setCollection(marks);
		});

		this._marksSelectView.on('change', function (mark) {
			var mark_id = null,
			    trueAzimuthOfMark = 0;
			if (mark !== null) {
				mark_id = mark.id;
				trueAzimuthOfMark = mark.get('azimuth');
			}
			observation.set({mark_id: mark_id});
			calculator.set({trueAzimuthOfMark: trueAzimuthOfMark});
		});

		this._electronicsSelectView.on('change', function (selected) {
			observation.set({
				electronics_id: (selected === null ? null : selected.id)
			});
		});

		this._theodoliteSelectView.on('change', function (selected) {
			observation.set({
				theodolite_id: (selected === null ? null : selected.id)
			});
		});

		// load observatories collection
		observatorySelectView.setCollection(observatories);

		// fill in observation inputs
		this.render();
	};

	/**
	 * Called when an observatory detail has been loaded.
	 *
	 * @param {[type]} observatory [description]
	 */
	ObservationMetaView.prototype._setObservatory = function (observatory) {
		var pierSelectView = this._pierSelectView,
		    electronicsSelectView = this._electronicsSelectView,
		    theodoliteSelectView = this._theodoliteSelectView,
		    // observation selections
		    observation = this._observation,
		    mark_id,
		    electronics_id,
		    theodolite_id,
		    // observatory information
		    piers = observatory.get('piers'),
		    default_pier_id = observatory.get('default_pier_id'),
		    default_electronics_id = null,
		    default_theodolite_id = null,
		    electronics = observatory.getElectronics(),
		    theodolites = observatory.getTheodolites(),
		    // other locals
		    pier = null;

		// update observatory id
		if (observation.get('observatory_id') !== observatory.id) {
			// different observatory, clear related info
			observation.set({
				observatory_id: observatory.id,
				mark_id: null,
				electronics_id: null,
				theodolite_id: null
			});
		}

		// read these after they were potentially reset
		mark_id = observation.get('mark_id');
		electronics_id = observation.get('electronics_id');
		theodolite_id = observation.get('theodolite_id');

		// preserve existing selections
		if (mark_id !== null) {
			pier = observatory.getPierByMarkId(mark_id);
		} else if (default_pier_id !== null) {
			pier = piers.get(default_pier_id);
		}
		if (pier !== null) {
			piers.select(pier);
			default_electronics_id = pier.get('default_electronics_id');
			default_theodolite_id = pier.get('default_theodolite_id');
		}
		_selectById(electronics, electronics_id || default_electronics_id);
		_selectById(theodolites, theodolite_id || default_theodolite_id);

		// update views
		electronicsSelectView.setCollection(electronics);
		theodoliteSelectView.setCollection(theodolites);
		pierSelectView.setCollection(piers);
	};

	/**
	 * Input element change handler.
	 *
	 * Updated observation begin and pier_temperature attributes from form.
	 */
	ObservationMetaView.prototype._onChange = function () {
		var observation = this._observation,
		    date = this._date.value,
		    pierTemperature = this._pierTemperature.value;

		date = this._parseDate(date);
		pierTemperature = (pierTemperature === '' ?
				null : parseFloat(pierTemperature));

		observation.set({
			begin: date,
			pier_temperature: pierTemperature
		});
	};

	/**
	 * Parse a date string into an epoch timestamp.
	 *
	 * @param date {String}
	 *        UTC date in format 'YYYY-MM-DD'.
	 * @return {Number} corresponding epoch timestamp (for 00:00:00), or null.
	 */
	ObservationMetaView.prototype._parseDate = function(date) {
		if (date !== '') {
			var parts = date.split('-');
			return Date.UTC(parseInt(parts[0], 10),
					parseInt(parts[1], 10) - 1,
					parseInt(parts[2], 10));
		}
		return null;
	};

	/**
	 * Formatting callback for electronics and theodolite select views.
	 *
	 * @param instrument {Instrument}
	 * @return {String} content for option element.
	 */
	ObservationMetaView.prototype._formatInstrument = function (instrument) {
		return instrument.get('name') +
				' (' + instrument.get('serial_number') + ')';
	};


	return ObservationMetaView;
});
