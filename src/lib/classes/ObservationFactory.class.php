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
	 * Creates an observation.
	 *
	 * @param object {Object}
	 *      The new object to create.
	 *
	 * @return {Object}
	 *      The object read back from the database.
	 *
	 * @throws {Exception}
	 *      Can throw an exception if an SQL error occurs. See "triggerError"
	 */
	public function createObservation($object) {
		$this->db->beginTransaction();
		$statement = $this->db->prepare('INSERT INTO observation (' .
				'observatory_id, begin, end, reviewer_user_id, mark_id, ' .
				'electronics_id, theodolite_id, pier_temperature, '.
				'elect_temperature, flux_temperature, proton_temperature, '.
				'annotation) VALUES ( ' .
				':observatory_id, :begin, :end, :reviewer_user_id, :mark_id, ' .
				':electronics_id, :theodolite_id, :pier_temperature, ' .
				':elect_temperature, :flux_temperature, :proton_temperature, ' .
				':annotation)');

		$statement->bindParam(':observatory_id',
				$object->observatory_id, PDO::PARAM_INT);
		$statement->bindParam(':begin', $object->begin, PDO::PARAM_INT);
		$statement->bindParam(':end', $object->end, PDO::PARAM_INT);
		$statement->bindParam(':reviewer_user_id',
				$object->reviewer_user_id, PDO::PARAM_INT);
		$statement->bindParam(':mark_id', $object->mark_id, PDO::PARAM_INT);
		$statement->bindParam(':electronics_id',
				$object->electronics_id, PDO::PARAM_INT);
		$statement->bindParam(':theodolite_id',
				$object->theodolite_id, PDO::PARAM_INT);
		$statement->bindParam(':pier_temperature',
				$object->pier_temperature, PDO::PARAM_STR);
		$statement->bindParam(':elect_temperature',
				$object->elect_temperature, PDO::PARAM_STR);
		$statement->bindParam(':flux_temperature',
				$object->flux_temperature, PDO::PARAM_STR);
		$statement->bindParam(':proton_temperature',
				$object->proton_temperature, PDO::PARAM_STR);
		$statement->bindParam(':annotation',
				$object->annotation, PDO::PARAM_STR);
		if (!$statement->execute()) {
			$this->db->rollback();
			$this->triggerError($statement);
		}
		$statement->closeCursor();

		$observation_id = intval($this->db->lastInsertId());
		$this->createReadings($object->readings, $observation_id);
		$this->db->commit();
		return $this->getObservation($observation_id);
	}

	/**
	 * Deletes an observation.
	 *
	 * @param object {Object}
	 *      The new object to create.
	 *
	 * @return {Boolean}
	 *      Always return true if successful. Can throw an exception.
	 *
	 * @throws {Exception}
	 *      Can throw an exception if an SQL error occurs. See "triggerError"
	 */
	public function deleteObservation($object) {
		$this->db->beginTransaction();
		$this->deleteReadings($object->id);
		$statement = $this->db->prepare('DELETE FROM observation WHERE id=:id');
		$statement->bindParam(':id', $object->id, PDO::PARAM_INT);
		if (!$statement->execute()) {
			$this->db->rollback();
			$this->triggerError($statement);
		}
		$statement->closeCursor();
		$this->db->commit();
		return true;
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
						intval($row['observatory_id']), safeintval($row['begin']),
						safeintval($row['end']), safeintval($row['reviewer_user_id']),
						safeintval($row['mark_id']), safeintval($row['electronics_id']),
						safeintval($row['theodolite_id']),
						safefloatval($row['pier_temperature']),
						safefloatval($row['elect_temperature']),
						safefloatval($row['flux_temperature']),
						safefloatval($row['proton_temperature']),
						$row['annotation'], $readings);
			}
		} else {
			$this->triggerError($statement);
		}
		$statement->closeCursor();

		return $observation;
	}

	/**
	 * Updates an observation.
	 *
	 * @param object {Object}
	 *      The new object to create.
	 *
	 * @return {Object}
	 *      The object read back from the database.
	 *
	 * @throws {Exception}
	 *      Can throw an exception if an SQL error occurs. See "triggerError"
	 */
	public function updateObservation($object) {
		$this->db->beginTransaction();
		$statement = $this->db->prepare('UPDATE observation set ' .
				'observatory_id=:observatory_id, begin=:begin, end=:end, '.
				'reviewer_user_id=:reviewer_user_id, mark_id=:mark_id, ' .
				'electronics_id=:electronics_id, ' .
				'theodolite_id=:theodolite_id, ' .
				'pier_temperature=:pier_temperature, '.
				'elect_temperature=:elect_temperature, '.
				'flux_temperature=:flux_temperature, '.
				'proton_temperature=:proton_temperature, '.
				'annotation=:annotation WHERE id=:id');

		$statement->bindParam(':observatory_id',
				$object->observatory_id, PDO::PARAM_INT);
		$statement->bindParam(':begin', $object->begin, PDO::PARAM_INT);
		$statement->bindParam(':end', $object->end, PDO::PARAM_INT);
		$statement->bindParam(':reviewer_user_id',
				$object->reviewer_user_id, PDO::PARAM_INT);
		$statement->bindParam(':mark_id', $object->mark_id, PDO::PARAM_INT);
		$statement->bindParam(':electronics_id',
				$object->electronics_id, PDO::PARAM_INT);
		$statement->bindParam(':theodolite_id',
				$object->theodolite_id, PDO::PARAM_INT);
		$statement->bindParam(':pier_temperature',
				$object->pier_temperature, PDO::PARAM_STR);
		$statement->bindParam(':elect_temperature',
				$object->elect_temperature, PDO::PARAM_STR);
		$statement->bindParam(':flux_temperature',
				$object->flux_temperature, PDO::PARAM_STR);
		$statement->bindParam(':proton_temperature',
				$object->proton_temperature, PDO::PARAM_STR);
		$statement->bindParam(':annotation',
				$object->annotation, PDO::PARAM_STR);
		$statement->bindParam(':id', $object->id, PDO::PARAM_INT);
		if (!$statement->execute()) {
			$this->db->rollback();
			$this->triggerError($statement);
		}
		$statement->closeCursor();

		$this->deleteReadings($object->id);
		$this->createReadings($object->readings, $object->id);
		$this->db->commit();
		return $this->getObservation($object->id);
	}

	/**
	 * Creates measurement records for a reading.
	 *
	 * @param measurements {Array{Object}}
	 *      The new objects to create.
	 *
	 * @param id {Integer}
	 *      The id of the parent reading.
	 *
	 * @return {Boolean}
	 *      Always return true if successful. Can throw an exception.
	 *
	 * @throws {Exception}
	 *      Can throw an exception if an SQL error occurs. See "triggerError"
	 */
	protected function createMeasurements($measurements, $id) {
		$statement = $this->db->prepare('INSERT INTO measurement (' .
				'reading_id, type, time, angle, h, e, z, f) VALUES (' .
				':reading_id, :type, :time, :angle, :h, :e, :z, :f)');

		foreach ($measurements as $object) {
			$statement->bindParam(':reading_id', $id, PDO::PARAM_INT);
			$statement->bindParam(':type', $object->type, PDO::PARAM_STR);
			$statement->bindParam(':time', $object->time, PDO::PARAM_INT);
			$statement->bindParam(':angle', $object->angle, PDO::PARAM_INT);
			$statement->bindParam(':h', $object->h, PDO::PARAM_STR);
			$statement->bindParam(':e', $object->e, PDO::PARAM_STR);
			$statement->bindParam(':z', $object->z, PDO::PARAM_STR);
			$statement->bindParam(':f', $object->f, PDO::PARAM_STR);
			if (!$statement->execute()) {
				$this->db->rollback();
				$this->triggerError($statement);
			}
			$statement->closeCursor();
		}
		return true;
	}

	/**
	 * Creates reading records for an observation.
	 *
	 * @param readings {Array{Object}}
	 *      The new objects to create.
	 *
	 * @param id {Integer}
	 *      The id of the parent observation.
	 *
	 * @return {Boolean}
	 *      Always return true if successful. Can throw an exception.
	 *
	 * @throws {Exception}
	 *      Can throw an exception if an SQL error occurs. See "triggerError"
	 */
	protected function createReadings($readings, $id) {
		$statement = $this->db->prepare('INSERT INTO reading (' .
				'observation_id, set_number, observer_user_id, ' .
				'declination_valid, horizontal_intensity_valid, ' .
				'vertical_intensity_valid, annotation) VALUES (' .
				':observation_id, :set_number, :observer_user_id, ' .
				':declination_valid, :horizontal_intensity_valid, ' .
				':vertical_intensity_valid, :annotation)');

		foreach ($readings as $object) {
			$statement->bindParam(':observation_id', $id, PDO::PARAM_INT);
			$statement->bindParam(':set_number',
					$object->set_number, PDO::PARAM_INT);
			$statement->bindParam(':observer_user_id',
					$object->observer_user_id, PDO::PARAM_INT);
			$statement->bindParam(':declination_valid',
					$object->declination_valid, PDO::PARAM_STR);
			$statement->bindParam(':horizontal_intensity_valid',
					$object->horizontal_intensity_valid, PDO::PARAM_STR);
			$statement->bindParam(':vertical_intensity_valid',
					$object->vertical_intensity_valid, PDO::PARAM_STR);
			$statement->bindParam(':annotation',
					$object->annotation, PDO::PARAM_STR);
			if (!$statement->execute()) {
				$this->db->rollback();
				$this->triggerError($statement);
			}
			$statement->closeCursor();
			$reading_id = intval($this->db->lastInsertId());
			$this->createMeasurements($object->measurements, $reading_id);
		}
		return true;
	}

	/**
	 * Deletes measurment records for a reading.
	 *
	 * @param id {Integer}
	 *      The database Id of the reading.
	 *
	 * @return {Boolean}
	 *      Always return true if successful. Can throw an exception.
	 *
	 * @throws {Exception}
	 *      Can throw an exception if an SQL error occurs. See "triggerError"
	 */
	protected function deleteMeasurements($id) {
		$statement = $this->db->prepare('DELETE FROM measurement WHERE id=:id');
		$measurements = $this->getMeasurements($id);
		foreach ($measurements as $object) {
			$statement->bindParam(':id', $object->id, PDO::PARAM_INT);
			if (!$statement->execute()) {
				$this->db->rollback();
				$this->triggerError($statement);
			}
			$statement->closeCursor();
		}
		return true;
	}

	/**
	 * Deletes reading records for an observation.
	 *
	 * @param id {Integer}
	 *      The database Id of the observation.
	 *
	 * @return {Boolean}
	 *      Always return true if successful. Can throw an exception.
	 *
	 * @throws {Exception}
	 *      Can throw an exception if an SQL error occurs. See "triggerError"
	 */
	protected function deleteReadings($id) {
		$statement = $this->db->prepare('DELETE FROM reading WHERE id=:id');
		$readings = $this->getReadings($id);
		foreach ($readings as $object) {
			$this->deleteMeasurements($object->id);
			$statement->bindParam(':id', $object->id, PDO::PARAM_INT);
			if (!$statement->execute()) {
				$this->db->rollback();
				$this->triggerError($statement);
			}
			$statement->closeCursor();
		}
		return true;
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
	protected function getMeasurements ($id) {
		$measurements = array();
		$statement = $this->db->prepare('SELECT * FROM measurement WHERE ' .
				'reading_id = :id ORDER BY type');
		$statement->bindParam(':id', $id, PDO::PARAM_INT);

		if ($statement->execute()) {
			while ($row = $statement->fetch(PDO::FETCH_ASSOC)) {
				$measurement = new Measurement(intval($row['ID']),
						intval($row['reading_id']), $row['type'],
						safeintval($row['time']), safefloatval($row['angle']),
						safefloatval($row['h']), safefloatval($row['e']),
						safefloatval($row['z']), safefloatval($row['f']));
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
	protected function getReadings ($id) {
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
						safeintval($row['set_number']),
						safeintval($row['observer_user_id']),
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

	protected function triggerError (&$statement) {
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
