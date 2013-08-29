<?php

/**
 * Data class representing an instrument.
 */
class Instrument {

	// instrument attributes
	public $id;
	public $observatoryId;
	public $serialNumber;
	public $begin;
	public $end;
	public $name;
	public $type;

	public function __construct ($id=null, $observatoryId=null,
				$serialNumber=null, $begin=null, $end=null, $name=null,
				$type=null) {
		$this->id = $id;
		$this->observatoryId = $observatoryId;
		$this->serialNumber = $serialNumber;
		$this->begin = $begin;
		$this->end = $end;
		$this->name = $name;
		$this->type = $type;
	}

	public static function fromArray (&$p) {
		return new Instrument($p['id'], $p['observatoryId'],
					$p['serialNumber'], $p['begin'], $p['end'],
					$p['name'], $p['type']);
	}

	public function toArray () {
		return array('id' => $this->id,
					'observatoryId' => $this->observatoryId,
					'serialNumber' => $this->serialNumber,
					'begin' => $this->begin,
					'end' => $this->end,
					'name' => $this->name,
					'type' => $this->type);
	}

}

?>
