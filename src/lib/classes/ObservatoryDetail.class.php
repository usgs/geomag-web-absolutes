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
				$default_pier_id=null, $location=null,
				$latitude=null, $longitude=null,
				$geomagnetic_latitude=null,
				$geomagnetic_longitude=null, $elevation=null,
				$orientation=null, $instruments=array(),
				$observations=array(), $piers=array()) {
		parent::__construct($id, $code, $name, $default_pier_id, $location,
				$latitude, $longitude, $geomagnetic_latitude,
				$geomagnetic_longitude, $elevation, $orientation);
		$this->instruments = $instruments;
		$this->observations = $observations;
		$this->piers = $piers;
	}

	public static function fromArray (&$p) {
		$instruments = array();
		$observations = array();
		$piers = array();

		if (isset($p['instruments'])) {
			foreach ($p['instruments'] as $instrument) {
				$instruments[] = Instrument::fromArray($instrument);
			}
		}
		if (isset($p['observations'])) {
			foreach ($p['observations'] as $observation) {
				$observations[] = Observation::fromArray($observation);
			}
		}
		if (isset($p['piers'])) {
			foreach ($p['piers'] as $pier) {
				$piers[] = Pier::fromArray($pier);
			}
		}

		return new ObservatoryDetail($p['id'], $p['code'], $p['name'],
					$p['default_pier_id'], $p['location'],
					$p['latitude'], $p['longitude'],
					$p['geomagnetic_latitude'],
					$p['geomagnetic_longitude'],
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
