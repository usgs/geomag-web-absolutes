<?php

/**
 * Data class representing a mark.
 */
class Mark {

	// mark attributes
	public $id;
	public $pier_id;
	public $name;
	public $begin;
	public $end;
	public $azimuth;

	public function __construct ($id=null, $pier_id=null, $name=null,
				$begin=null, $end=null, $azimuth=null) {
		$this->id = $id;
		$this->pier_id = $pier_id;
		$this->name = $name;
		$this->begin = $begin;
		$this->end = $end;
		$this->azimuth = $azimuth;
	}

	public static function fromArray (&$p) {
		return new Mark($p['id'], $p['pier_id'], $p['name'], $p['begin'],
					$p['end'], $p['azimuth']);
	}

	public function toArray () {
		return array('id' => $this->id,
					'pier_id' => $this->pier_id,
					'name' => $this->name,
					'begin' => $this->begin,
					'end' => $this->end,
					'azimuth' => $this->azimuth);
	}

}

?>
