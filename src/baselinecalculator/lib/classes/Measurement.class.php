<?php

/**
 * Data class representing one measurement.
 */
class Measurement {

  // measurement attributes
  public $id;
  protected $reading_id;
  public $type;
  public $time;
  public $angle;
  public $h;
  public $e;
  public $z;
  public $f;

  public function __construct ($id=null, $reading_id=null, $type=null,
        $time=null, $angle=null, $h=null, $e=null, $z=null, $f=null) {
    $this->id = $id;
    $this->reading_id = $reading_id;
    $this->type = $type;
    $this->time = $time;
    $this->angle = $angle;
    $this->h = $h;
    $this->e = $e;
    $this->z = $z;
    $this->f = $f;
  }

  public static function fromArray (&$p) {
    return new Measurement($p['id'],
        isset($p['reading_id']) ? $p['reading_id'] : null, $p['type'],
        $p['time'], $p['angle'], $p['h'], $p['e'], $p['z'],
        $p['f']);
  }

  public function toArray () {
    return array('id' => $this->id,
        'readingId' => $this->reading_id,
        'type' => $this->type,
        'time' => $this->time,
        'angle' => $this->angle,
        'h' => $this->h,
        'e' => $this->e,
        'z' => $this->z,
        'f' => $this->f);
  }

}

?>
