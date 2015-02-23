<?php

/**
 * Data class representing an observatory (with no child data).
 */
class Observatory {

  // observatory attributes
  public $id;
  public $code;
  public $name;
  public $default_pier_id;
  public $location;
  public $latitude;
  public $longitude;
  public $geomagnetic_latitude;
  public $geomagnetic_longitude;
  public $elevation;
  public $orientation;

  public function __construct ($id=null, $code=null, $name=null,
        $default_pier_id=null, $location=null, $latitude=null,
        $longitude=null, $geomagnetic_latitude=null,
        $geomagnetic_longitude=null, $elevation=null,
        $orientation=null) {
    $this->id = $id;
    $this->code = $code;
    $this->name = $name;
    $this->default_pier_id = $default_pier_id;
    $this->location = $location;
    $this->latitude = $latitude;
    $this->longitude = $longitude;
    $this->geomagnetic_latitude = $geomagnetic_latitude;
    $this->geomagnetic_longitude = $geomagnetic_longitude;
    $this->elevation = $elevation;
    $this->orientation = $orientation;
  }

  public static function fromArray (&$p) {
    return new Observatory($p['id'], $p['code'], $p['name'],
          $p['default_pier_id'], $p['location'], $p['latitude'],
          $p['longitude'], $p['geomagnetic_latitude'],
          $p['geomagnetic_longitude'], $p['elevation'],
          $p['orientation']);
  }

  public function toArray () {
    return array('id' => $this->id, 'code' => $this->code,
          'name' => $this->name,
          'default_pier_id' => $this->default_pier_id,
          'location' => $this->location,
          'latitude' => $this->latitude,
          'longitude' => $this->longitude,
          'geomagnetic_latitude' => $this->geomagnetic_latitude,
          'geomagnetic_longitude' => $this->geomagnetic_longitude,
          'elevation' => $this->elevation,
          'orientation' => $this->orientation);
  }

}

?>
