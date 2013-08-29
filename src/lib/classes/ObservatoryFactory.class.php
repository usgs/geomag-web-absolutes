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
				$observatory = new Observatory($row['ID'],
						$row['code'], $row['name'], $row['default_pier_id'],
						$row['location'], $row['latitude'], $row['longitude'],
						$row['geomagnetic_latitude'],
						$row['geomagnetic_longitude'],
						$row['elevation'], $row['orientation']);
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
				$observatory = new ObservatoryDetail($row['ID'],
						$row['code'], $row['name'], $row['default_pier_id'],
						$row['location'], $row['latitude'], $row['longitude'],
						$row['geomagnetic_latitude'],
						$row['geomagnetic_longitude'],
						$row['elevation'], $row['orientation'],
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
				$instrument = new Instrument($row['ID'],
						$row['observatory_id'], $row['serial_number'],
						$row['begin'], $row['end'], $row['name'],
						$row['type']);
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
				$observation = new Observation($row['ID'],
						$row['observatory_id'], $row['begin'], $row['end'],
						$row['reviewer_user_id'], $row['mark_id'],
						$row['electronics_id'], $row['theodolite_id'],
						$row['pier_temperature'], $row['elect_temperature'],
						$row['flux_temperature'], $row['proton_temperature'],
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
				$marks = $this->getMarks($row['ID']);
				$pier = new Pier($row['ID'], $row['observatory_id'],
						$row['name'], $row['begin'], $row['end'],
						$row['correction'], $row['default_mark_id'],
						$row['default_electronics_id'],
						$row['default_theodolite_id'], $marks);
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
				$mark = new Mark($row['ID'], $row['pier_id'],
						$row['name'], $row['begin'], $row['end'],
						$row['azimuth']);
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

