<?php

/**
 * Data class representing an observatory with child 1 to many data.
 */
class ObservatoryDetail extends Observatory {
	
	//multi valued attributes
	public $instruments;
	public $observations;
	public $piers;
	
	public function __construct ($id=null, $code=null, $name=null, 
				                 $defaultPierId=null, $location=null, 
				                 $latitude=null, $longitude=null, 
				                 $geomagneticLatitude=null, 
				                 $geomagneticLongitude=null, $elevation=null, 
				                 $orientation=null, $instruments=array(), 
				                 $observations=array(), $piers=array()) {

		parent::__construct($id, $code, $name, $defaultPierId, $location, 
					        $latitude, $longitude, $geomagneticLatitude, 
					        $geomagneticLongitude, $elevation, $orientation);
		$this->instruments = $instruments;
		$this->observations = $observations;
		$this->piers = $piers;
	}
	
	public static function fromArray (&$p) {
		$instruments = array(); 
		$observations = array(); 
		$piers = array(); 
		
		if (isset($p['instruments'])) {
			foreach ( $p['instruments'] as $instrument ) {
				$instruments[] = Instrument::fromArray($instrument);
			}
		}
		if (isset($p['observations'])) {
			foreach ( $p['observations'] as $observation ) {
				$observations[] = Observation::fromArray($observation);
			}
		}
		if (isset($p['piers'])) {
			foreach ( $p['piers'] as $pier ) {
				$piers[] = Pier::fromArray($pier);
			}
		}
		
		return new ObservatoryDetail($p['id'], $p['code'], $p['name'], 
					                 $p['defaultPierId'], $p['location'], 
					                 $p['latitude'], $p['longitude'], 
					                 $p['geomagneticLatitude'], 
					                 $p['geomagneticLongitude'], 
					                 $p['elevation'], $p['orientation'], 
					                 $instruments, $observations, $piers);
	}
	
	public function toArray () {
		$subclassArray = array('instruments' => $this->instruments,
					           'observations' => $this->observations,
					           'piers' => $this->piers); 
		return array_merge(parent::toArray(), subclassArray);
	}
}
?>
