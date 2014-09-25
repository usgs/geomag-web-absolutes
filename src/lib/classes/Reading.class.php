<?php

/**
 * Data class representing one reading.
 */
class Reading {

	// reading attributes
	public $id;
	protected $observation_id;
	public $set_number;
	public $observer_user_id;
	public $declination_shift;
	public $annotation;

	// calibration values
	public $horizontal_intensity_valid;
	public $startH;
	public $endH;
	public $absH;
	public $baseH;

	public $vertical_intensity_valid;
	public $startZ;
	public $endZ;
	public $absZ;
	public $baseZ;

	public $declination_valid;
	public $startD;
	public $endD;
	public $absD;
	public $baseD;

	// multi-value attributes
	public $measurements;

	public function __construct ($id=null, $observation_id=null,
				$set_number=null, $observer_user_id=null,
				$declination_valid=null, $declination_shift=null,
				$horizontal_intensity_valid=null, $vertical_intensity_valid=null,
				$startH, $endH, $absH, $baseH,
				$startZ, $endZ, $absZ, $baseZ,
				$startD, $endD, $absD, $baseD,
				$annotation=null, $measurements=array()) {

		$this->id = $id;
		$this->observation_id = $observation_id;
		$this->set_number = $set_number;
		$this->observer_user_id = $observer_user_id;
		$this->declination_valid = $declination_valid;
		$this->declination_shift = $declination_shift;
		$this->horizontal_intensity_valid = $horizontal_intensity_valid;
		$this->vertical_intensity_valid = $vertical_intensity_valid;

		$this->startH = $startH;
		$this->endH = $endH;
		$this->absH = $absH;
		$this->baseH = $baseH;

		$this->startZ = $startZ;
		$this->endZ = $endZ;
		$this->absZ = $absZ;
		$this->baseZ = $baseZ;

		$this->startD = $startD;
		$this->endD = $endD;
		$this->absD = $absD;
		$this->baseD = $baseD;

		$this->annotation = $annotation;

		$this->measurements = $measurements;
	}

	public static function fromArray (&$p) {
		$measurements = array();
		if (isset($p['measurements'])) {
			foreach ($p['measurements'] as $measurement) {
				$measurements[] = Measurement::fromArray($measurement);
			}
		}

		return new Reading ($p['id'],
				isset($p['observation_id']) ?$p['observation_id'] : null,
				$p['set_number'], $p['observer_user_id'], $p['declination_valid'],
				$p['declination_shift'], $p['horizontal_intensity_valid'],
				$p['vertical_intensity_valid'],
				$p['startH'], $p['endH'], $p['absH'], $p['baseH'],
				$p['startZ'], $p['endZ'], $p['absZ'], $p['baseZ'],
				$p['startD'], $p['endD'], $p['absD'], $p['baseD'],
				$p['annotation'], $measurements);
	}

	public function toArray () {
		return array('id' => $this->id,
				'observation_id'=> $this->observationId,
				'set_number' => $this->set_number,
				'observer_user_id' => $this->observer_user_id,
				'declination_valid' => $this->declination_valid,
				'declination_shift' => $this->declination_shift,
				'horizontal_intensity_valid' => $this->horizontal_intensity_valid,
				'vertical_intensity_valid' => $this->vertical_intensity_valid,
				'startH' => $this->startH,
				'endH' => $this->endH,
				'absH' => $this->absH,
				'baseH' => $this->baseH,
				'startZ' => $this->startZ,
				'endZ' => $this->endZ,
				'absZ' => $this->absZ,
				'baseZ' => $this->baseZ,
				'startD' => $this->startD,
				'endD' => $this->endD,
				'absD' => $this->absD,
				'baseD' => $this->baseD,
				'annotation' => $this->annotation,
				'measurements' => $this->measurements);
	}

}

?>
