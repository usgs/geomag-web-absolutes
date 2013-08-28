<?php

/**
 * Data class representing a pier.
 */
class Pier {
	
	// pier attributes
	public $id;
	public $observatoryId;
	public $name;
	public $begin;
	public $end;
	public $correction;
	public $defaultMarkId;
	public $defaultElectronicsId;
	public $defaultTheodoliteId;
	
	//multi valued attributes
	public $marks;
	
	public function __construct ($id=null, $observatoryId=null, 
				                 $name=null, $begin=null,
				                 $end=null, $correction=null, 
				                 $defaultMarkId=null, 
				                 $defaultElectronicsId=null, 
				                 $defaultTheodoliteId=null, 
				                 $marks=array()) {
		$this->id = $id;
		$this->observatoryId = $observatoryId;
		$this->name = $name;
		$this->begin = $begin;
		$this->end = $end;
		$this->correction = $correction;
		$this->defaultMarkId = $defaultMarkId;
		$this->defaultElectronicsId = $defaultElectronicsId;
		$this->defaultTheodoliteId = $defaultTheodoliteId;
		$this->marks = $marks;
	}
	
	public static function fromArray (&$p) {
		$marks = array(); 
		if (isset($p['marks'])) {
			foreach ($p['marks'] as $mark) {
				$marks[] = Mark::fromArray($mark);
			}
		}
		return new Pier($p['id'], $p['observatoryId'], $p['name'],
					    $p['begin'], $p['end'], $p['correction'],
					    $p['defaultMarkId'], $p['defaultElectronicsId'], 
					    $p['defaultTheodoliteId'], $marks);
	}
	
	public function toArray () {
		return array('id' => $this->id, 
					 'observatoryId' => $this->observatoryId,
					 'name' => $this->name, 'begin' => $this->begin, 
					 'end' => $this->end, 'correction' => $this->correction, 
					 'defaultMarkId' => $this->defaultMarkId, 
					 'defaultElectronicsId' => $this->defaultElectronicsId, 
					 'defaultTheodoliteId' => $this->defaultTheodoliteId, 
					 'marks' => $this->marks);
	}
}
?>
