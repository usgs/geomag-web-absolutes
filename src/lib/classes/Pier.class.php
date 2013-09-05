<?php

/**
 * Data class representing a pier.
 */
class Pier {

	// pier attributes
	public $id;
	public $observatory_id;
	public $name;
	public $begin;
	public $end;
	public $correction;
	public $default_mark_id;
	public $default_electronics_id;
	public $default_theodolite_id;

	//multi valued attributes
	public $marks;

	public function __construct ($id=null, $observatory_id=null,
				$name=null, $begin=null, $end=null, $correction=null,
				$default_mark_id=null, $default_electronics_id=null,
				$default_theodolite_id=null, $marks=array()) {
		$this->id = $id;
		$this->observatory_id = $observatory_id;
		$this->name = $name;
		$this->begin = $begin;
		$this->end = $end;
		$this->correction = $correction;
		$this->default_mark_id = $default_mark_id;
		$this->default_electronics_id = $default_electronics_id;
		$this->default_theodolite_id = $default_theodolite_id;
		$this->marks = $marks;
	}

	public static function fromArray (&$p) {
		$marks = array();
		if (isset($p['marks'])) {
			foreach ($p['marks'] as $mark) {
				$marks[] = Mark::fromArray($mark);
			}
		}
		return new Pier($p['id'], $p['observatory_id'], $p['name'],
					$p['begin'], $p['end'], $p['correction'],
					$p['defaul_mark_id'], $p['default_electronics_id'],
					$p['default_theodolite_id'], $marks);
	}

	public function toArray () {
		return array('id' => $this->id,
					'observatory_id' => $this->observatory_id,
					'name' => $this->name,
					'begin' => $this->begin,
					'end' => $this->end,
					'correction' => $this->correction,
					'default_mark_id' => $this->default_mark_id,
					'default_electronics_id' => $this->default_electronics_id,
					'default_theodolite_id' => $this->default_theodolite_id,
					'marks' => $this->marks);
	}

}

?>
