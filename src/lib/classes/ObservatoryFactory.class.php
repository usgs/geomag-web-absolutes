<?php

class ObservatoryFactory {

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
	 * Reads all the observatories from the database into an array of
	 * standard observatory objects.
	 *
	 * @return {Array{Object}}
	 *
	 * @throws {Exception}
	 *      Can throw an exception if an SQL error occurs. See "triggerError"
	 */
	public function getObservatories () {
		$objects = array();
		$statement = $this->db->prepare('SELECT * FROM observatory ' .
				'ORDER BY name');
		if ($statement->execute()) {
			while ($row = $statement->fetch(PDO::FETCH_ASSOC)) {
				$observatory = new Observatory(intval($row['ID']),
						$row['code'], $row['name'],
						intval($row['default_pier_id']),
						$row['location'], floatval($row['latitude']),
						floatval($row['longitude']),
						floatval($row['geomagnetic_latitude']),
						floatval($row['geomagnetic_longitude']),
						floatval($row['elevation']), $row['orientation']);
				$objects[] = $observatory;
			}
		} else {
			$this->triggerError($statement);
		}
		$statement->closeCursor();

		return $objects;
	}

	/**
	 * Reads the requested observatory detail object from the database.
	 *
	 * @param id {Integer}
	 *      The database Id of the observatory.
	 *
	 * @return {ObservatoryDetail}
	 *
	 * @throws {Exception}
	 *      Can throw an exception if an SQL error occurs. See "triggerError"
	 */
	public function getObservatory ($id) {
		$observatory = null;
		$statement = $this->db->prepare('SELECT * FROM observatory WHERE ' .
				'id = :id');
		$statement->bindParam(':id', $id, PDO::PARAM_INT);

		if ($statement->execute()) {
			$row = $statement->fetch(PDO::FETCH_ASSOC);
			if($row) {
				$instruments = $this->getInstruments($id);
				$observations = $this->getObservations($id);
				$piers = $this->getPiers($id);
				$observatory = new ObservatoryDetail(intval($row['ID']),
						$row['code'], $row['name'],
						intval($row['default_pier_id']),
						$row['location'], floatval($row['latitude']),
						floatval($row['longitude']),
						floatval($row['geomagnetic_latitude']),
						floatval($row['geomagnetic_longitude']),
						floatval($row['elevation']), $row['orientation'],
						$instruments, $observations, $piers);
			}
		} else {
			$this->triggerError($statement);
		}
		$statement->closeCursor();

		return $observatory;
	}

	/**
	 * Reads the all instruments linked to a specific observatory.
	 *
	 * @param id {Integer}
	 *      The database Id of the observatory.
	 *
	 * @return {Array{Object}}
	 *
	 * @throws {Exception}
	 *      Can throw an exception if an SQL error occurs. See "triggerError"
	 */
	private function getInstruments ($id) {
		$instruments = array();
		$statement = $this->db->prepare('SELECT * FROM instrument ' .
				'WHERE observatory_id=:id ORDER BY name');
		$statement->bindParam(':id', $id, PDO::PARAM_INT);

		if ($statement->execute()) {
			while ($row = $statement->fetch(PDO::FETCH_ASSOC)) {
				$instrument = new Instrument(intval($row['ID']),
						intval($row['observatory_id']),
						$row['serial_number'],
						intval($row['begin']), intval($row['end']),
						$row['name'], $row['type']);
				$instruments[] = $instrument;
			}
		} else {
			$this->triggerError($statement);
		}

		$statement->closeCursor();
		return $instruments;
	}

	/**
	 * Reads the all observations linked to a specific observatory
	 * (top-level data only, no child arrays).
	 *
	 * @param id {Integer}
	 *      The database Id of the observatory.
	 *
	 * @return {Array{Object}}
	 *
	 * @throws {Exception}
	 *      Can throw an exception if an SQL error occurs. See "triggerError"
	 */
	public function getObservations ($id) {
		$observations = array();
		$statement = $this->db->prepare('SELECT * FROM observation WHERE ' .
				'observatory_id=:id ORDER BY begin DESC');
		$statement->bindParam(':id', $id, PDO::PARAM_INT);

		if ($statement->execute()) {
			while ($row = $statement->fetch(PDO::FETCH_ASSOC)) {
				$observation = new Observation(intval($row['ID']),
						intval($row['observatory_id']), intval($row['begin']),
						intval($row['end']), intval($row['reviewer_user_id']),
						intval($row['mark_id']), intval($row['electronics_id']),
						intval($row['theodolite_id']),
						floatval($row['pier_temperature']),
						floatval($row['elect_temperature']),
						floatval($row['flux_temperature']),
						floatval($row['proton_temperature']),
						$row['annotation']);
				$observations[] = $observation;
			}
		} else {
			$this->triggerError($statement);
		}

		$statement->closeCursor();
		return $observations;
	}

	/**
	 * Reads the all piers linked to a specific observatory.
	 *
	 * @param id {Integer}
	 *      The database Id of the observatory.
	 *
	 * @return {Array{Object}}
	 *
	 * @throws {Exception}
	 *      Can throw an exception if an SQL error occurs. See "triggerError"
	 */
	public function getPiers ($id) {
		$piers = array();
		$statement = $this->db->prepare('SELECT * FROM pier WHERE ' .
				'observatory_id=:id ORDER BY name');
		$statement->bindParam(':id', $id, PDO::PARAM_INT);

		if ($statement->execute()) {
			while ($row = $statement->fetch(PDO::FETCH_ASSOC)) {
				$pier_id = intval($row['ID']);
				$marks = $this->getMarks($pier_id);
				$pier = new Pier($pier_id, intval($row['observatory_id']),
						$row['name'], intval($row['begin']),
						intval($row['end']), floatval($row['correction']),
						intval($row['default_mark_id']),
						intval($row['default_electronics_id']),
						intval($row['default_theodolite_id']), $marks);
				$piers[] = $pier;
			}
		} else {
			$this->triggerError($statement);
		}

		$statement->closeCursor();
		return $piers;
	}

	/**
	 * Reads the all marks linked to a specific pier.
	 *
	 * @param id {Integer}
	 *      The database Id of the pier.
	 *
	 * @return {Array{Object}}
	 *
	 * @throws {Exception}
	 *      Can throw an exception if an SQL error occurs. See "triggerError"
	 */
	public function getMarks ($id) {
		$marks = array();
		$statement = $this->db->prepare('SELECT * FROM mark WHERE ' .
				'pier_id=:id ORDER BY name');
		$statement->bindParam(':id', $id, PDO::PARAM_INT);

		if ($statement->execute()) {
			while ($row = $statement->fetch(PDO::FETCH_ASSOC)) {
				$mark = new Mark(intval($row['ID']), intval($row['pier_id']),
						$row['name'], intval($row['begin']),
						intval($row['end']), floatval($row['azimuth']));
				$marks[$row['ID']] = $mark;
			}
		} else {
			$this->triggerError($statement);
		}

		$statement->closeCursor();
		return $marks;
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
