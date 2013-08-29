<?php

/**
 * Data class representing a mark.
 */
class Mark {

	// mark attributes
	public $id;
	public $pierId;
	public $name;
	public $begin;
	public $end;
	public $azimuth;

	public function __construct ($id=null, $pierId=null, $name=null,
				$begin=null, $end=null, $azimuth=null) {
		$this->id = $id;
		$this->pierId = $pierId;
		$this->name = $name;
		$this->begin = $begin;
		$this->end = $end;
		$this->azimuth = $azimuth;
	}

	public static function fromArray (&$p) {
		return new Mark($p['id'], $p['pierId'], $p['name'], $p['begin'],
					$p['end'], $p['azimuth']);
	}

	public function toArray () {
		return array('id' => $this->id,
					'pierId' => $this->pierId,
					'name' => $this->name,
					'begin' => $this->begin,
					'end' => $this->end,
					'azimuth' => $this->azimuth);
	}

}

?>
