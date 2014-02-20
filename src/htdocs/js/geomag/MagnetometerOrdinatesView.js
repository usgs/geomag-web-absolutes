/* global define */
define([
	'mvc/View',
	'util/Util'
], function (
	View,
	Util
) {
	'use strict';


	var DEFAULTS = {
	};


	var MagnetometerOrdinatesView = function (options) {
		this._options = Util.extend({}, DEFAULTS, options);
		View.call(this, this._options);
	};
	MagnetometerOrdinatesView.prototype = Object.create(View.prototype);


	MagnetometerOrdinatesView.prototype.render = function () {
		// TODO :: Render current model
	};

	MagnetometerOrdinatesView.prototype._initialize = function () {
		this._el.innerHTML = [
		'<dl class="tabular">',
					'<dt> </dt>',
						'<dd class=titleMean>Mean Values</dd>',
						'<dd class=titleScale>Scale Value</dd>',
						'<dd class=titleComputed>Computed Values</dd>',
					'<dt>H(C1):</dt>',
						'<dd class="hMean"></dd>',
						'<dd class="hScale"></dd>',
						'<dd class="hComputed"></dd>',
					'<dt>E(C2):</dt>',
						'<dd class="eMean"></dd>',
						'<dd class="eScale"></dd>',
						'<dd class="eComputed"></dd>',
					'<dt>Z(C3):</dt>',
						'<dd class="zMean"></dd>',
						'<dd class="zScale"></dd>',
						'<dd class="zComputed"></dd>',
					'<dt>F(C3):</dt>',
						'<dd class="fMean"></dd>',
						'<dd class="fScale"></dd>',
						'<dd class="fComputed"></dd>',
				'</dl>',
			'</div>',
			'<div id="declination">',
				'<dl>',
					'<dt><abbr title="Absolute D">Abs. D:</abbr></dt>',
					'<dd class="absoluteD"></dd>',
					'<dt><abbr title="Absolute H">Abs. H:</abbr></dt>',
					'<dd class="absoluteH"></dd>',
					'<dt><abbr title="Absolute Z">Abs. Z:</abbr></dt>',
					'<dd class="absoluteZ"></dd>',
					'<dt><abbr title="Corrected F">Corr. F:</abbr></dt>',
					'<dd class="correctedF"></dd>',
				'</dl>',
			'</div>',
			'<div id="baseline">',
				'<dl>',
				'<dt>D Baseline:</dt>',
				'<dd class=dBaseline></dd>',
				'<dt>H Baseline:</dt>',
				'<dd class=dBaseline></dd>',
				'<dt>Z Baseline:</dt>',
				'<dd class=dBaseline></dd>',
				'</dl>'
		].join('');
	};


	return MagnetometerOrdinatesView;
});
