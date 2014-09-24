<?php

include_once 'Observatory.class.php';
include_once 'ObservatoryDetail.class.php';
include_once 'Instrument.class.php';
include_once 'Mark.class.php';
include_once 'Observation.class.php';
include_once 'Pier.class.php';

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

		try {
			$statement->execute();
			while ($row = $statement->fetch(PDO::FETCH_ASSOC)) {
				$observatory = new Observatory(intval($row['ID']),
						$row['code'], $row['name'],
						safeintval($row['default_pier_id']),
						$row['location'], safefloatval($row['latitude']),
						safefloatval($row['longitude']),
						safefloatval($row['geomagnetic_latitude']),
						safefloatval($row['geomagnetic_longitude']),
						safefloatval($row['elevation']), $row['orientation']);
				$objects[] = $observatory;
			}
		} catch (Exception $ex) {
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

		try {
			$statement->execute();
			$row = $statement->fetch(PDO::FETCH_ASSOC);
			if($row) {
				$instruments = $this->getInstruments($id);
				$observations = $this->getObservations($id);
				$piers = $this->getPiers($id);
				$observatory = new ObservatoryDetail(intval($row['ID']),
						$row['code'], $row['name'],
						safeintval($row['default_pier_id']),
						$row['location'], safefloatval($row['latitude']),
						safefloatval($row['longitude']),
						safefloatval($row['geomagnetic_latitude']),
						safefloatval($row['geomagnetic_longitude']),
						safefloatval($row['elevation']), $row['orientation'],
						$instruments, $observations, $piers);
			}
		} catch (Exception $ex) {
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
	protected function getInstruments ($id) {
		$instruments = array();
		$statement = $this->db->prepare('SELECT * FROM instrument ' .
				'WHERE observatory_id=:id ORDER BY name');
		$statement->bindParam(':id', $id, PDO::PARAM_INT);

		try {
			$statement->execute();
			while ($row = $statement->fetch(PDO::FETCH_ASSOC)) {
				$instrument = new Instrument(intval($row['ID']),
						intval($row['observatory_id']),
						$row['serial_number'],
						safeintval($row['begin']), safeintval($row['end']),
						$row['name'], $row['type']);
				$instruments[] = $instrument;
			}
		} catch (Exception $ex) {
			$this->triggerError($statement);
		}

		$statement->closeCursor();
		return $instruments;
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
	protected function getMarks ($id) {
		$marks = array();
		$statement = $this->db->prepare('SELECT * FROM mark WHERE ' .
				'pier_id=:id ORDER BY name');
		$statement->bindParam(':id', $id, PDO::PARAM_INT);

		try {
			$statement->execute();
			while ($row = $statement->fetch(PDO::FETCH_ASSOC)) {
				$mark = new Mark(intval($row['ID']), intval($row['pier_id']),
						$row['name'], safeintval($row['begin']),
						safeintval($row['end']), safefloatval($row['azimuth']));
				$marks[] = $mark;
			}
		} catch (Exception $ex) {
			$this->triggerError($statement);
		}

		$statement->closeCursor();

		return $marks;
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
	protected function getObservations ($id) {
		$observations = array();
		$statement = $this->db->prepare('SELECT * FROM observation WHERE ' .
				'observatory_id=:id ORDER BY begin DESC');
		$statement->bindParam(':id', $id, PDO::PARAM_INT);

		try {
			$statement->execute();
			while ($row = $statement->fetch(PDO::FETCH_ASSOC)) {
				$observation = new Observation(intval($row['ID']),
						intval($row['observatory_id']), safeintval($row['begin']),
						safeintval($row['end']), safeintval($row['reviewer_user_id']),
						safeintval($row['observer_user_id']),
						safeintval($row['mark_id']), safeintval($row['electronics_id']),
						safeintval($row['theodolite_id']),
						safefloatval($row['pier_temperature']),
						safefloatval($row['elect_temperature']),
						safefloatval($row['flux_temperature']),
						safefloatval($row['proton_temperature']),
						$row['reviewed'],
						$row['annotation']);
				$observations[] = $observation;
			}
		} catch (Exception $ex) {
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
	protected function getPiers ($id) {
		$piers = array();
		$statement = $this->db->prepare('SELECT * FROM pier WHERE ' .
				'observatory_id=:id ORDER BY name');
		$statement->bindParam(':id', $id, PDO::PARAM_INT);

		try {
			$statement->execute();
			while ($row = $statement->fetch(PDO::FETCH_ASSOC)) {
				$pier_id = intval($row['ID']);
				$marks = $this->getMarks($pier_id);
				$pier = new Pier($pier_id, intval($row['observatory_id']),
						$row['name'], safeintval($row['begin']),
						safeintval($row['end']), safefloatval($row['correction']),
						safeintval($row['default_mark_id']),
						safeintval($row['default_electronics_id']),
						safeintval($row['default_theodolite_id']), $marks);
				$piers[] = $pier;
			}
		} catch (Exception $ex) {
			$this->triggerError($statement);
		}

		$statement->closeCursor();

		return $piers;
	}

	/**
	 * Create a Pier in the DB.
	 *
	 * @param observatoryId {Integer}
	 *        The database Id of the observatory.
	 *        $pierName {String}'
	 *        The name of the pier.
	 *        $correction {Double}
	 *        The pier correction value.
	 *
	 * @return {Object}
	 *      The object read back from the database.
	 *
	 * @throws {Exception}
	 *      Can throw an exception if an SQL error occurs. See "triggerError"
	 */
	protected function createPier ($observatoryId, $pierName, $correction) {
		$this->db->beginTransaction();
		$statement = $this->db->prepare('INSERT INTO pier (' .
				'observatory_id, name, begin, end, correction,' .
				'default_mark_id, default_electronics_id, default_theodolite_id)' .
				'VALUES ( ' .
				':observatory_id, :name, :begin, :end, :correction,' .
				':default_mark_id, :default_electronics_id, :default_theodolite_id');

		$statement->bindParam(':observatory_id',
				$object->observatory_id, PDO::PARAM_INT);
		$statement->bindParam(':name', $object->name, PDO::PARAM_STR);
		$statement->bindParam(':begin', $object->begin, PDO::PARAM_INT);
		$statement->bindParam(':end', $object->end, PDO::PARAM_INT);
		$statement->bindParam(':correction', $object->correction, PDO::PARAM_STR);
		$statement->bindParam(':default_mark_id',
				$object->default_mark_id, PDO::PARAM_INT);
		$statement->bindParam(':default_electronics_id',
				$object->default_electronics_id, PDO::PARAM_INT);
		$statement->bindParam(':default_theodolite_id',
				$object->default_theodolite_id, PDO::PARAM_INT);

		try {
			$statement->execute();
		} catch (Exception $ex) {
			$this->db->rollback();
			$this->triggerError($statement);
		}

		$statement->closeCursor();

		$pier_id = intval($this->db->lastInsertId());
		$this->db->commit();
		return $this->getPiers($pier_id);
	}

	/**
	 * Create a Mark in the DB.
	 *
	 * @param pierId {Integer}
	 *        The database Id of the pier.
	 *        $markName {String}'
	 *        The name of the mark.
	 *        $azimuth {Double}
	 *        The azimuth value at the mark.
	 *
	 * @return {Object}
	 *      The object read back from the database.
	 *
	 * @throws {Exception}
	 *      Can throw an exception if an SQL error occurs. See "triggerError"
	 */
	protected function createMark ($pierId, $markName, $azimuth) {
		$this->db->beginTransaction();
		$statement = $this->db->prepare('INSERT INTO pier (' .
				'pier_id, name, begin, end, azimuth,' .
				'VALUES ( ' .
				':pier_id, :name, :begin, :end, :azimuth,');

		$statement->bindParam(':pier_id',
				$object->pier_id, PDO::PARAM_INT);
		$statement->bindParam(':name', $object->begin, PDO::PARAM_STR);
		$statement->bindParam(':begin', $object->begin, PDO::PARAM_INT);
		$statement->bindParam(':end', $object->end, PDO::PARAM_INT);
		$statement->bindParam(':azimuth', $object->azimuth, PDO::PARAM_STR);

		try {
			$statement->execute();
		} catch (Exception $ex) {
			$this->db->rollback();
			$this->triggerError($statement);
		}

		$statement->closeCursor();

		$mark_id = intval($this->db->lastInsertId());
		$this->db->commit();
		return $this->getMarks($mark_id);
	}

	/**
	 * Create a Instrument in the DB.
	 *
	 * @param observatoryId {Integer}
	 *        The database Id of the observatory.
	 *        $serial {String}'
	 *        The serial number of the instrument.
	 *        $type {String}
	 *        The type of instrument (Theodolite or Electronics).
	 *
	 * @return {Object}
	 *      The object read back from the database.
	 *
	 * @throws {Exception}
	 *      Can throw an exception if an SQL error occurs. See "triggerError"
	 */
	protected function createInstrument ($observatoryId, $serial, $type) {
		$this->db->beginTransaction();
		$statement = $this->db->prepare('INSERT INTO pier (' .
				'observatory_id, serial_number, begin, end, name, type)' .
				'VALUES ( ' .
				':observatory_id, :serial_number, :begin, :end, :name, :type');

		$statement->bindParam(':observatory_id',
				$object->observatory_id, PDO::PARAM_INT);
		$statement->bindParam(':serial_number',
				$object->serial_number, PDO::PARAM_STR);
		$statement->bindParam(':begin', $object->begin, PDO::PARAM_INT);
		$statement->bindParam(':end', $object->end, PDO::PARAM_INT);
		$statement->bindParam(':name', $object->name, PDO::PARAM_STR);
		$statement->bindParam(':type', $object->type, PDO::PARAM_INT);

		try {
			$statement->execute();
		} catch (Exception $ex) {
			$this->db->rollback();
			$this->triggerError($statement);
		}

		$statement->closeCursor();

		$instrument_id = intval($this->db->lastInsertId());
		$this->db->commit();
		return $this->getInstruments($instrument_id);
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
