<?php

class MagProcPublisher {

	function __construct ($db) {
		$this->db = $db;
		$this->_initStatements();
	}

	public function publish (&$observation, $observer, $reviewer) {
		$readings = $observation->readings;
		$observationId = $observation->id;

		$this->db->beginTranscation();
		try {
			foreach ($readings as $reading) {
				$this->_publishReading($reading, $observationId,
						$observer, $reviewer);
			}

			$this->db->commit();
		} catch (Exception $e) {
			$this->db->rollback();
			$this->triggerError($e);
		}
	}

	private function _publishReading ($reading, $observationId,
			$observer, $reviewer) {

		$component; $start_time; $end_time; $abs; $base;

		$stationdid = $observationId;
		$created_by = $observer;
		$approved_by = $reviewer;

		$this->insertCalibration->bindValue(':station_id', $observationId,
				PDO::PARAM_INT);
		$this->insertCalibration->bindValue(':created_by', $observer,
				PDO::PARAM_STR);
		$this->insertCalibration->bindValue(':approved_by', $reviewer,
				PDO::PARAM_STR);

		$this->insertCalibration->bindParam(':component', $component,
				PDO::PARAM_STR);
		$this->insertCalibration->bindParam(':start_time', $start_time,
			PDO::PARAM_STR);
		$this->insertCalibration->bindParam(':end_time', $end_time,
				PDO::PARAM_STR);
		$this->insertCalibration->bindParam(':abs', $abs,
				PDO::PARAM_STR);
		$this->insertCalibration->bindParam(':base', $base,
				PDO::PARAM_STR);


		if ($reading->declination_valid === 'Y') {
			$component = 'D';
			$start_time = date("Y-m-d H:i:s",$reading->startD);
			$end_time = date("Y-m-d H:i:s",$reading->endD);
			$abs = $reading->absD;
			$base = $reading->baseD;

			$this->insertCalibration->execute();
		}

		if ($reading->horizontal_intensity_valid === 'Y') {
			$component = 'H';
			$start_time = date("Y-m-d H:i:s",$reading->startH);
			$end_time = date("Y-m-d H:i:s",$reading->endH);
			$abs = $reading->absH;
			$base = $reading->baseH;

			$this->insertCalibration->execute();
		}

		if ($reading->vertical_intensity_valid === 'Y') {
			$component = 'Z';
			$start_time = date("Y-m-d H:i:s",$reading->startZ);
			$end_time = date("Y-m-d H:i:s",$reading->endZ);
			$abs = $reading->absZ;
			$base = $reading->baseZ;

			$this->insertCalibration->execute();
		}

		$this->insertCalibration->closeCursor();
	}

	private function _initStatements () {
		$this->insertCalibration = $this->db->prepare(
				'INSERT INTO calibration (' .
					'component, station_id, type, start_time, end_time,' .
					'abs, baseline, created_by, approved_by' .
				') VALUES ( ' .
					':component, :station_id, \'c\', :start_time, :end_time,' .
					':abs, :baseline, :created_by, :approved_by');
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
