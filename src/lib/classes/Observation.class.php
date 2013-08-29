<?php

/**
 * Data class representing one observation with detail 
 */
class Observation {

	// observation attributes
	public $id;
	public $observatoryId;
	public $begin;
	public $end;
	public $reviewerUserId;
	public $markId;
	public $electronicsId;
	public $theodoliteId;
	public $pierTemperature;
	public $electTemperature;
	public $fluxTemperature;
	public $protonTemperature;
	public $annotation;

	public function __construct ($id=null, $observatoryId=null, $begin=null,
				$end=null ,$reviewerUserId=null, $markId=null,
				$electronicsId=null, $theodoliteId=null,
				$pierTemperature=null, $electTemperature=null,
				$fluxTemperature=null, $protonTemperature=null,
				$annotation=null) {
		$this->id = $id;
		$this->observatoryId = $observatoryId;
		$this->begin = $begin;
		$this->end = $end;
		$this->reviewerUserId = $reviewerUserId;
		$this->markId = $markId;
		$this->electronicsId = $electronicsId;
		$this->theodoliteId = $theodoliteId;
		$this->pierTemperature = $pierTemperature;
		$this->electTemperature = $electTemperature;
		$this->fluxTemperature = $fluxTemperature;
		$this->protonTemperature = $protonTemperature;
		$this->annotation = $annotation;
	}

	public static function fromArray (&$p) {
		return new Observation($p['id'], $p['observatoryId'], $p['begin'],
				$p['end'], $p['reviewerUserId'], $p['markId'],
				$p['electronicsId'],$p['theodoliteId'],
				$p['pierTemperature'],$p['electTemperature'],
				$p['fluxTemperature'],$p['protonTemperature'],
				$p['annotation']);
	}

	public function toArray () {
		return array('id' => $this->id,
				'observatoryId' => $this->observatoryId,
				'begin' => $this->begin,
				'end' => $this->end,
				'reviewerUserId' => $this->reviewerUserId,
				'markId' => $this->markId,
				'electronicsId' => $this->electronicsId,
				'theodoliteId' => $this->theodoliteId,
				'pierTemperature' => $this->pierTemperature,
				'electTemperature' => $this->electTemperature,
				'fluxTemperature' => $this->fluxTemperature,
				'protonTemperature' => $this->protonTemperature,
				'annotation' => $this->annotation);
	}

}

?>

