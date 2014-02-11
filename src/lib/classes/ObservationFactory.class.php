<?php

class ObservationFactory {

	private $db;

	/**
	 * Creates a new factory object.
	 *
	 * @param db {PDO}
	 *      The PDO database connection for this factory.
	 */
	public function __construct ($db){
		$this->db = $db;
	}

	/**
	 * Reads the requested observation detail object from the database.
	 *
	 * @param id {Integer}
	 *      The database Id of the observation.
	 *
	 * @return {ObservationDetail}
	 *
	 * @throws {Exception}
	 *      Can throw an exception if an SQL error occurs. See "triggerError"
	 */
	public function getObservation ($id) {
		$observation = null;
		$statement = $this->db->prepare('SELECT * FROM observation WHERE ' .
				'id = :id');
		$statement->bindParam(':id', $id, PDO::PARAM_INT);

		if ($statement->execute()) {
			$row = $statement->fetch(PDO::FETCH_ASSOC);
			if($row) {
				$readings = $this->getReadings($id);
				$observation = new ObservationDetail(intval($row['ID']),
						intval($row['observatory_id']), intval($row['begin']),
						intval($row['end']), intval($row['reviewer_user_id']),
						intval($row['mark_id']), intval($row['electronics_id']),
						intval($row['theodolite_id']),
						floatval($row['pier_temperature']),
						floatval($row['elect_temperature']),
						floatval($row['flux_temperature']),
						floatval($row['proton_temperature']),
						$row['annotation'], $readings);
			}
		} else {
			$this->triggerError($statement);
		}
		$statement->closeCursor();

		return $observation;
	}

	/**
	 * Reads all the Measurements for a specific observation.
	 *
	 * @param id {Integer}
	 *      The database Id of the reading.
	 *
	 * @return {Array{Object}}
	 *
	 * @throws {Exception}
	 *      Can throw an exception if an SQL error occurs. See "triggerError"
	 */
	private function getMeasurements ($id) {
		$measurements = array();
		$statement = $this->db->prepare('SELECT * FROM measurement WHERE ' .
				'reading_id = :id ORDER BY type');
		$statement->bindParam(':id', $id, PDO::PARAM_INT);

		if ($statement->execute()) {
			while ($row = $statement->fetch(PDO::FETCH_ASSOC)) {
				$measurement = new Measurement(intval($row['ID']),
						intval($row['reading_id']), $row['type'],
						intval($row['time']), floatval($row['angle']),
						floatval($row['h']), floatval($row['e']),
						floatval($row['z']), floatval($row['f']));
				$measurements[] = $measurement;
			}
		} else {
			$this->triggerError($statement);
		}

		$statement->closeCursor();
		return $measurements;
	}

	/**
	 * Reads all the Readings for a specific observation.
	 *
	 * @param id {Integer}
	 *      The database Id of the observation.
	 *
	 * @return {Array{Object}}
	 *
	 * @throws {Exception}
	 *      Can throw an exception if an SQL error occurs. See "triggerError"
	 */
	private function getReadings ($id) {
		$readings = array();
		$statement = $this->db->prepare('SELECT * FROM reading WHERE ' .
				'observation_id = :id ORDER by set_number');
		$statement->bindParam(':id', $id, PDO::PARAM_INT);

		if ($statement->execute()) {
			while ($row = $statement->fetch(PDO::FETCH_ASSOC)) {
				$reading_id = intval($row['ID']);
				$measurements = $this->getMeasurements($reading_id);
				$reading = new Reading($reading_id,
						intval($row['observation_id']),
						intval($row['set_number']),
						intval($row['observer_user_id']),
						$row['declination_valid'],
						$row['horizontal_intensity_valid'],
						$row['vertical_intensity_valid'],
						$row['annotation'], $measurements );
				$readings[] = $reading;
			}
		} else {
			$this->triggerError($statement);
		}

		$statement->closeCursor();
		return $readings;
	}

	private function triggerError (&$statement) {
		$error = $statement->errorInfo();
		$statement->closeCursor();

		$errorMessage = (is_array($error)&&isset($error[2])&&isset($error[0])) ?
				'[' . $error[0] . '] :: ' . $error[2] : 'Unknown SQL Error';
		$errorCode = (is_array($error)&&isset($error[1])) ?
				$error[1] : -999;

		throw new Exception($errorMessage, $errorCode);
	}

}

?>
