<?php

/**
 * Data class representing an observatory (with no child data).
 */
class Observatory {

	// observatory attributes
	public $id;
	public $code;
	public $name;
	public $defaultPierId;
	public $location;
	public $latitude;
	public $longitude;
	public $geomagneticLatitude;
	public $geomagneticLongitude;
	public $elevation;
	public $orientation;

	public function __construct ($id=null, $code=null, $name=null,
				$defaultPierId=null, $location=null, $latitude=null,
				$longitude=null, $geomagneticLatitude=null,
				$geomagneticLongitude=null, $elevation=null,
				$orientation=null) {
		$this->id = $id;
		$this->code = $code;
		$this->name = $name;
		$this->defaultPierId = $defaultPierId;
		$this->location = $location;
		$this->latitude = $latitude;
		$this->longitude = $longitude;
		$this->geomagneticLatitude = $geomagneticLatitude;
		$this->geomagneticLongitude = $geomagneticLongitude;
		$this->elevation = $elevation;
		$this->orientation = $orientation;
	}

	public static function fromArray (&$p) {
		return new Observatory($p['id'], $p['code'], $p['name'],
					$p['defaultPierId'], $p['location'], $p['latitude'],
					$p['longitude'], $p['geomagneticLatitude'],
					$p['geomagneticLongitude'], $p['elevation'],
					$p['orientation']);
	}

	public function toArray () {
		return array('id' => $this->id, 'code' => $this->code,
					'name' => $this->name,
					'defaultPierId' => $this->defaultPierId,
					'location' => $this->location,
					'latitude' => $this->latitude,
					'longitude' => $this->longitude,
					'geomagneticLatitude' => $this->geomagneticLatitude,
					'geomagneticLongitude' => $this->geomagneticLongitude,
					'elevation' => $this->elevation,
					'orientation' => $this->orientation);
	}

}

?>
