<?php

/**
 * Data class representing one measurement.
 */
class Measurement {

	// measurement attributes
	public $id;
	public $reading_id;
	public $type;
	public $time;
	public $h;
	public $e;
	public $z;
	public $f;

	public function __construct ($id=null, $reading_id=null, $type=null,
				$time=null, $h=null, $e=null, $z=null, $f=null) {
		$this->id = $id;
		$this->reading_id = $reading_id;
		$this->type = $type;
		$this->time = $time;
		$this->h = $h;
		$this->e = $e;
		$this->z = $z;
		$this->f = $f;
	}

	public static function fromArray (&$p) {
		return new Measurement($p['id'], $p['reading_id'], $p['type'],
					$p['time'], $p['h'], $p['e'], $p['z'], $p['f']);
	}

	public function toArray () {
		return array('id' => $this->id,
					'readingId' => $this->reading_id,
					'type' => $this->type,
					'time' => $this->time,
					'h' => $this->h,
					'e' => $this->e,
					'z' => $this->z,
					'f' => $this->f);
	}

}

?>
