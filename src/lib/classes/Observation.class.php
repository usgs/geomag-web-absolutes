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
	public $annotation;
	
	public function __construct($id=null, $observatoryId=null, $begin=null, 
			                    $end=null,$annotation=null) { 
		$this->id = $id;
		$this->observatoryId = $observatoryId;
		$this->begin = $begin;
		$this->end = $end;
		$this->annotation = $annotation;
	}
	
	public static function fromArray(&$p) {
		
		return new Observation ($p['id'], $p['observatoryId'], $p['begin'], 
				                $p['end'], $p['annotation']);
	}
	
	public function toArray() {
		return array ('id' => $this->id, 'observatoryId' => $this->observatoryId,
				     'begin' => $this->begin, 
				     'end' => $this->end,
				     'annotation' => $this->annotation); 
	}	
}


?>