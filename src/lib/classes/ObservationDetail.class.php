<?php

/**
 * Data class representing an observation with child data.
 */
class ObservationDetail extends Observation {

	//multi valued attributes
	public $readings;

	public function __construct ($id=null, $observatory_id=null, $begin=null,
				$end=null, $reviewer_user_id=null, $mark_id=null,
				$electronics_id=null, $theodolite_id=null,
				$pier_temperature=null, $elect_temperature=null,
				$flux_temperature=null, $proton_temperature=null,
				$reviewed=null, $annotation=null, $readings=array()) {
		parent::__construct($id, $observatory_id, $begin, $end,
					$reviewer_user_id, $mark_id, $electronics_id,
					$theodolite_id, $pier_temperature, $elect_temperature,
					$flux_temperature, $proton_temperature, $reviewed, $annotation);
		$this->readings = $readings;
	}

	public static function fromArray (&$p) {
		$readings = array();
		if (isset($p['readings'])) {
			foreach ($p['readings'] as $reading) {
				$readings[] = Reading::fromArray($reading);
			}
		}

		return new ObservationDetail($p['id'], $p['observatory_id'],
					$p['begin'], $p['end'], $p['reviewer_user_id'],
					$p['mark_id'], $p['electronics_id'], $p['theodolite_id'],
					$p['pier_temperature'], $p['elect_temperature'],
					$p['flux_temperature'], $p['proton_temperature'],
					$p['reviewed'], $p['annotation'], $readings);
	}

	public function toArray () {
		$subclassArray = array('readings' => $this->readings);
		return array_merge (parent::toArray(), $subclassArray);
	}

}

?>
