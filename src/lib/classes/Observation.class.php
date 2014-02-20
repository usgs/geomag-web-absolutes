<?php

/**
 * Data class representing one observation with detail.
 */
class Observation {

	// observation attributes
	public $id;
	public $observatory_id;
	public $begin;
	public $end;
	public $reviewer_user_id;
	public $mark_id;
	public $electronics_id;
	public $theodolite_id;
	public $pier_temperature;
	public $elect_temperature;
	public $flux_temperature;
	public $proton_temperature;
	public $reviewed;
	public $annotation;

	public function __construct ($id=null, $observatory_id=null, $begin=null,
				$end=null, $reviewer_user_id=null, $mark_id=null,
				$electronics_id=null, $theodolite_id=null,
				$pier_temperature=null, $elect_temperature=null,
				$flux_temperature=null, $proton_temperature=null, $reviewed=null,
				$annotation=null) {
		$this->id = $id;
		$this->observatory_id = $observatory_id;
		$this->begin = $begin;
		$this->end = $end;
		$this->reviewer_user_id = $reviewer_user_id;
		$this->mark_id = $mark_id;
		$this->electronics_id = $electronics_id;
		$this->theodolite_id = $theodolite_id;
		$this->pier_temperature = $pier_temperature;
		$this->elect_temperature = $elect_temperature;
		$this->flux_temperature = $flux_temperature;
		$this->proton_temperature = $proton_temperature;
		$this->reviewed = $reviewed;
		$this->annotation = $annotation;
	}

	public static function fromArray (&$p) {
		return new Observation($p['id'], $p['observatory_id'], $p['begin'],
				$p['end'], $p['reviewer_user_id'], $p['mark_id'],
				$p['electronics_id'], $p['theodolite_id'],
				$p['pier_temperature'], $p['elect_temperature'],
				$p['flux_temperature'], $p['proton_temperature'],
				$p['reviewed'], $p['annotation']);
	}

	public function toArray () {
		return array('id' => $this->id,
				'observatory_id' => $this->observatory_id,
				'begin' => $this->begin,
				'end' => $this->end,
				'reviewer_user_id' => $this->reviewer_user_id,
				'mark_id' => $this->mark_id,
				'electronics_id' => $this->electronics_id,
				'theodolite_id' => $this->theodolite_id,
				'pier_temperature' => $this->pier_temperature,
				'elect_temperature' => $this->elect_temperature,
				'flux_temperature' => $this->flux_temperature,
				'proton_temperature' => $this->proton_temperature,
				'reviewed' => $this->reviewed,
				'annotation' => $this->annotation);
	}

}

?>
