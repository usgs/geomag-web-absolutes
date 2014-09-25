<?php

class MagProcPublisher {

	private $db;
	private $insertCalibration;

	function __construct ($db) {
		$this->db = $db;
		$this->_initStatements();
	}

	public function publish ($observation, $observatory, $observer, $reviewer) {
		$readings = $observation->readings;

		try {
			$this->db->beginTransaction();

			foreach ($readings as $reading) {
				$this->_publishReading($reading, $observatory->code,
						$observer, $reviewer);
			}
			$this->db->commit();
		} catch (Exception $e) {
			$this->db->rollback();
			$this->insertCalibration->closeCursor();
			$this->triggerError($e);
		}
	}

	private function _publishReading ($reading, $station_code,
			$observer, $reviewer) {

		$component; $start_time; $end_time; $abs; $baseline;

		$this->insertCalibration->bindValue(':station_id', $station_code,
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
		$this->insertCalibration->bindParam(':baseline', $baseline,
				PDO::PARAM_STR);


		if ($reading->declination_valid === 'Y') {
			$component = 'D';
			$start_time = date("Y-m-d H:i:s", substr($reading->startD, 0, -3));
			$end_time = date("Y-m-d H:i:s", substr($reading->endD, 0, -3));
			$abs = $reading->absD;
			$baseline = $reading->baseD;

			$this->insertCalibration->execute();
		}

		if ($reading->horizontal_intensity_valid === 'Y') {
			$component = 'H';
			$start_time = date("Y-m-d H:i:s", substr($reading->startH, 0, -3));
			$end_time = date("Y-m-d H:i:s", substr($reading->endH, 0, -3));
			$abs = $reading->absH;
			$baseline = $reading->baseH;

			$this->insertCalibration->execute();
		}

		if ($reading->vertical_intensity_valid === 'Y') {
			$component = 'Z';
			$start_time = date("Y-m-d H:i:s", substr($reading->startZ, 0, -3));
			$end_time = date("Y-m-d H:i:s", substr($reading->endZ, 0, -3));
			$abs = $reading->absZ;
			$baseline = $reading->baseZ;

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
					':abs, :baseline, :created_by, :approved_by' .
				')');
	}

	protected function triggerError ($exception) {
		$error = $this->insertCalibration->errorInfo();

		if (is_array($errorInfo)) {
			$errorMessage = (isset($error[2]) && isset($error[0])) ?
					'[' . $error[0] . '] :: ' . $error[2] : 'Unknown SQL Error';
			$errorCode = (isset($error[1])) ?
					$error[1] : -999;

			throw new Exception($errorMessage, $errorCode);
		} else {
			throw $exception;
		}
	}

}
