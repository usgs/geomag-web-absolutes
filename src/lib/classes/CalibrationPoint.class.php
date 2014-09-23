<?php

class CalibrationPoint {
	public $component;
	public $starttime;
	public $endtime;
	public $absolute;
	public $baseline;

	public function __construct ($component=null,
				$starttime=null, $endtime=null, $absolute=null,
				$baseline=null) {

		$this->component = $component;
		$this->starttime = $starttime;
		$this->endtime = $endtime;
		$this->absolute = $absolute;
		$this->baseline = $baseline;
	}

	public static function fromArray (&$p) {
		return new CalibrationPoint($p['component'],
				$p['starttime'], $p['endtime'], $p['absolute'], $p['baseline']);
	}

}

?>
