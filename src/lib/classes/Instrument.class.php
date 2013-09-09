<?php

/**
 * Data class representing an instrument.
 */
class Instrument {

	// instrument attributes
	public $id;
	public $observatory_id;
	public $serial_number;
	public $begin;
	public $end;
	public $name;
	public $type;

	public function __construct ($id=null, $observatory_id=null,
				$serial_number=null, $begin=null, $end=null, $name=null,
				$type=null) {
		$this->id = $id;
		$this->observatory_id = $observatory_id;
		$this->serial_number = $serial_number;
		$this->begin = $begin;
		$this->end = $end;
		$this->name = $name;
		$this->type = $type;
	}

	public static function fromArray (&$p) {
		return new Instrument($p['id'], $p['observatory_id'],
					$p['serial_number'], $p['begin'], $p['end'],
					$p['name'], $p['type']);
	}

	public function toArray () {
		return array('id' => $this->id,
					'observatory_id' => $this->observatory_id,
					'serial_number' => $this->serial_number,
					'begin' => $this->begin,
					'end' => $this->end,
					'name' => $this->name,
					'type' => $this->type);
	}

}

?>
