<?php

/**
 * Data class representing one reading.
 */
class Reading {

	// reading attributes
	public $id;
	public $observation_id;
	public $set_number;
	public $observer_user_id;
	public $declination_valid;
	public $declination_shift;
	public $horizontal_intensity_valid;
	public $vertical_intensity_valid;
	public $annotation;

	// multi-value attributes
	public $measurements;

	public function __construct ($id=null, $observation_id=null,
				$set_number=null, $observer_user_id=null,
				$declination_valid=null, $declination_shift=null,
				$horizontal_intensity_valid=null, $vertical_intensity_valid=null,
				$annotation=null, $measurements=array()) {
		$this->id = $id;
		$this->observation_id = $observation_id;
		$this->set_number = $set_number;
		$this->observer_user_id = $observer_user_id;
		$this->declination_valid = $declination_valid;
		$this->declination_shift = $declination_shift;
		$this->horizontal_intensity_valid = $horizontal_intensity_valid;
		$this->vertical_intensity_valid = $vertical_intensity_valid;
		$this->annotation = $annotation;

		$this->measurements = $measurements;
	}

	public static function fromArray (&$p) {
		$measurements = array();
		if (isset($p['measurements'])) {
			foreach ($p['measurement'] as $measurement) {
				$measurements[] = Measurement::fromArray($measurement);
			}
		}

		return new Reading ($p['id'], $p['observation_id'], $p['set_number'],
					$p['observer_user_id'], $p['declination_valid'],
					$p['declination_shift'], $p['horizontal_intensity_valid'],
					$p['vertical_intensity_valid'], $p['annotation'],
					$measurements);
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
				'annotation' => $this->annotation,
				'measurements' => $this->measurements);
	}

}

?>
