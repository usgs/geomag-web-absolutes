/* global define */
define([
	'mvc/View',
	'util/Util',
	'tablist/TabList',

	'geomag/Reading',
	'geomag/ReadingView'
], function (
	View,
	Util,
	TabList,

	Reading,
	ReadingView
) {
	'use strict';


	var DEFAULTS = {
	};


	var ReadingGroupView = function (options) {
		this._options = Util.extend({}, DEFAULTS, options);
		View.call(this, this._options);
	};
	ReadingGroupView.prototype = Object.create(View.prototype);


	ReadingGroupView.prototype.render = function () {
		var observation = this._observation;

		// TODO :: Load readings off the observation instead.
		this._tablist.addTab(this._createTab(observation, new Reading()));
		this._tablist.addTab(this._createTab(observation, new Reading()));
	};

	ReadingGroupView.prototype._initialize = function () {
		this._observation = this._options.observation;
		this._readings = this._observation.readings;
		this._calculator = this._options.baselineCalculator;

		this._tablist = new TabList({tabPosition: 'top'});
		this._tablist.el.classList.add('reading-group-view');
		this._el.appendChild(this._tablist.el);

		// TODO :: Bind to observation, when readings are added/removed,
		//         you will have to re-render
		this.render();
	};

	ReadingGroupView.prototype._createTab = function (observation, reading) {
		var el = document.createElement('div'),
		    readingView = null;

		el.classList.add('reading-wrapper');
		readingView = new ReadingView({
			el: el,
			observation: observation,
			reading: reading,
			baselineCalculator: this._calculator
		});

		return {
			title: 'Set X', // TODO :: Figure out a real title
			content: el
		};
	};



	return ReadingGroupView;
});
