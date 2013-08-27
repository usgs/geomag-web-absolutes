<?php

/**
 * Data class representing a pier.
 */
class Pier {
	
	// pier attributes
	public $id;
	public $observatoryId;
	public $serialNumber;
	public $begin;
	public $end;
	public $name;
	public $type;
	
	//multi valued attributes
	public $marks;
	
	public function __construct($id=null, $observatoryId=null, 
			                    $serialNumber=null, $begin=null,
			                    $end=null, $name=null, $type=null,
			                    $marks=array()) {
		$this->id = $id;
		$this->observatoryId = $observatoryId;
		$this->serialNumber = $serialNumber;
		$this->begin = $begin;
		$this->end = $end;
		$this->name = $name;
		$this->type = $type;
		
		$this->marks = $marks;
	}
	
	public static function fromArray(&$p) {
		
		$marks = array(); 
		$readings = array(); 
		
		if (isset($p['marks'])) {
			foreach ( $p['marks'] as $mark ) {
				$marks[] = Mark::fromArray($mark);
			}
		}
		
		return new Pier ($p['id'], $p['observatoryId'], 
				               $p['serialNumber'], $p['begin'], $p['end'], 
				               $p['name'], $p['type'], $marks);
	}
	
	public function toArray() {
		return array ('id' => $this->id, 
				      'observatoryId' => $this->observatoryId,
				      'serialNumber' => $this->serialNumber, 
				      'begin' => $this->begin, 'end' => $this->end, 
				      'name' => $this->name, 'type' => $this->type, 
				      'marks' => $this->marks);
	}
	
	
}


?>