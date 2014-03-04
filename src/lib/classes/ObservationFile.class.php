<?php

include_once 'ObservationDetail.class.php';

class ObservationFile {


	// NB: It may seem odd that some reading fields map to seemingly incorrect
	//     labels. For example WestDownTime => SouthDown etc... This is actually
	//     correct and is a correction for a legacy issue.

	// Mapping from file labels to object fields
	public static $READING_FIELDS = array(
		'Adjust Declination' => 'declination_shift',
		'Adjust Declination Up' => 'declination_shift',
		'FirstMarkUp' => 'FirstMarkUp',
		'FirstMarkDown' => 'FirstMarkDown',
		'NorthDownTime' => 'WestDown',
		'NorthUpTime' => 'EastUp',
		'SouthDownTime' => 'EastDown',
		'SouthUpTime' => 'WestUp',
		'WestDownTime' => 'SouthDown',
		'WestUpTime' => 'NorthUp',
		'EastDownTime' => 'NorthDown',
		'EastUpTime' => 'SouthUp',
		'SecondMarkUp' => 'SecondMarkUp',
		'SecondMarkDown' => 'SecondMarkDown',
		'Mean H' => 'h',
		'Mean D' => 'e',
		'Mean Z' => 'z',
		'Mean F' => 'f'
	);

	// Mapping from file labels to object fields
	public static $INCLUDE_FIELDS = array(
		'Include D Set' => 'declination_valid',
		'Include H Set' => 'horizontal_intensity_valid',
		'Include V Set' => 'vertical_intensity_valid'
	);


	// Raw data fields from the data file. Populated during file parsing and
	// converted to objects and corresponding ID values during toObservation
	// method.
	private $observatoryCode = null;
	private $dateOffset = 0;
	private $electronicsSerial = null;
	private $theodoliteSerial = null;
	private $pierName = null;
	private $markName = null;

	// Flag indicating if remarks have been started. Once remarks are started, all
	// subsequent lines in the data file are considered part of the remarks.
	private $remarksStarted = false;

	// Current reading. Null until startReading is called.
	private $currentReading = null;

	// List of ObservatoryDetail objects used for lookups
	private $observatories = null;

	// Meta information about the observation
	private $metaInfo = array();

	// Hash of readings found in the data file. Keyed by set number.
	private $readings = array();

	// Hash of flags indicating whether to include declination/vertial/horizontal
	// components for each reading. Keyed by set_number
	private $includes = array();


	/**
	 * @Constructor
	 *
	 * @param observatories {Array{ObservatoryDetail}}
	 *        An array of ObservatoryDetail objects used for lookups when
	 *        converting raw field information into objects and corresponding ID
	 *        values.
	 */
	public function __construct ($observatories = array()) {
		$this->observatories = $observatories;
	}


	// ------------------------------------------------------------
	// Public methods
	// ------------------------------------------------------------

	/**
	 * Converts all the information that has been stored to this file object
	 * into an observation instance.
	 *
	 * @param $warnings {Array} By reference. Optional.
	 *        A buffer into which generated warnings will be logged. If not
	 *        specified, warnings are logged to STDERR.
	 *
	 * @return {Observation}
	 */
	public function toObservation (&$warnings = null) {
		// Save last reading
		$this->_saveCurrentReading();

		// This will be an ObservatoryDetail instance
		$observatory = $this->_getObservatoryFromCode($this->observatoryCode,
				$warnings);

		// While getting readings, begin/end time information (needed for subsequent
		// lookups) is calculated simultaneously.
		$beginEndStamps = array();
		$readings = $this->_getReadings($beginEndStamps, $warnings);

		$begin = $beginEndStamps['begin'];
		$end = $beginEndStamps['end'];

		$pier = $this->_getPierFromName($observatory, $this->pierName, $begin, $end,
				$warnings);
		$mark = $this->_getMarkFromName($pier, $this->markName, $begin, $end,
				$warnings);

		$electronics = $this->_getInstrumentFromSerial($observatory,
				$this->electronicsSerial, $begin, $end, 'electronics', $warnings);
		$theodolite = $this->_getInstrumentFromSerial($observatory,
				$this->theodoliteSerial, $begin, $end, 'theodolite', $warnings);

		$observation = array(
			'id' => null,
			'observatory_id' => ($observatory !== null) ? $observatory->id : null,
			'begin' => $beginEndStamps['begin'],
			'end'   => $beginEndStamps['end'],
			'reviewer_user_id' => null,
			'mark_id' => ($mark !== null) ? $mark->id : null,
			'electronics_id' => ($electronics !== null) ? $electronics->id : null,
			'theodolite_id' => ($theodolite !== null) ? $theodolite->id : null,
			'pier_temperature' => $this->metaInfo['pier_temperature'],
			'elect_temperature' => $this->metaInfo['elect_temperature'],
			'flux_temperature' => $this->metaInfo['flux_temperature'],
			'proton_temperature' => $this->metaInfo['proton_temperature'],
			'reviewed' => 'N',
			'annotation' => $this->metaInfo['annotation'],
			'readings' => $readings
		);

		return ObservationDetail::fromArray($observation);
	}

	/**
	 * @APIMethod
	 *
	 * Starts a new reading in $this->currentReading. If $this->currentReading is
	 * not null, it is first saved to $this->readings before staring the new
	 * reading.
	 *
	 * @param $line {String}
	 *        The line from the data file that is starting the reading. Should
	 *        contain set number information.
	 */
	public function startReading ($line) {
		$this->_saveCurrentReading();

		$parts = explode(',', $line);
		$setNumber = trim($parts[1]);

		$this->currentReading = null;
		$this->currentReading = array(
			'id' => null,
			'observation_id' => null,
			'observer_user_id' => null,
			'set_number' => intval($setNumber),
			'declination_shift' => 0,
			'declination_valid' => 'Y',
			'horizontal_intensity_valid' => 'Y',
			'vertical_intensity_valid' => 'Y',
			'annotation' => null,
			'measurements' => array()
		);
	}

	/**
	 * @APIMethod
	 *
	 * Updates the current reading with information found in the given $line. If
	 * this method is called before a reading is started, the information is
	 * discarded.
	 *
	 * @param $line {String}
	 *        The line from the data file with information to update the reading.
	 */
	public function updateCurrentReading ($line) {
		if ($this->currentReading === null) { return; }

		$parts = explode(',', $line);
		$field = trim($parts[0]);

		if ($field === 'Adjust Declination' && trim($parts[1]) !== '0') {
			$this->currentReading['decination_shift'] = -180;
		} else if ($field == 'Adjust Decination Up') {
			$this->currentReading['declination_shift'] = 180;
		} else if ($field === 'FirstMarkUp' || $field === 'FirstMarkDown' ||
				$field === 'SecondMarkUp' || $field === 'SecondMarkDown') {

			$type = self::$READING_FIELDS[$field];
			$angle = $this->__parseAngle(trim($parts[1]), trim($parts[2]),
					trim($parts[3]));

			$measurement = array(
				'id' => null,
				'reading_id' => null,
				'type' => $type,
				'time' => null,
				'angle' => $angle,
				'h' => null,
				'e' => null,
				'z' => null,
				'f' => null
			);

			// Key by type since no real-time data component
			$this->currentReading['measurements'][$type] = $measurement;

		} else if ($field === 'NorthUpTime' || $field === 'NorthDownTime' ||
				$field === 'SouthUpTime' || $field === 'SouthDownTime' ||
				$field === 'WestUpTime' || $field === 'WestDownTime' ||
				$field === 'EastUpTime' || $field === 'EastDownTime') {

			$type = self::$READING_FIELDS[$field];
			$time = trim($parts[1]);
			$angle = $this->__parseAngle(trim($parts[2]), trim($parts[3]),
					trim($parts[4]));

			$measurement = array(
				'id' => null,
				'reading_id' => null,
				'type' => $type,
				'time' => $time,
				'angle' => $angle,
				'h' => null,
				'e' => null,
				'z' => null,
				'f' => null
			);

			// Key by time so we can update real-time data more efficiently later
			$this->currentReading['measurements'][$time] = $measurement;

		} else if (substr($field, 0, 4) === 'Mean') {
			$dataType = self::$READING_FIELDS[$field];

			for ($i = 2; $i < count($parts); $i++) {
				$data = $parts[$i];
				$dataParts = explode(':', $data);
				$time = trim($dataParts[0]);
				$value = trim($dataParts[1]);

				if (isset($this->currentReading['measurements'][$time])) {
					$this->currentReading['measurements'][$time][$dataType] = $value;
				}
			}
		}
	}

	/**
	 * @APIMethod
	 *
	 * Updates the include flags with information from the given $line.
	 *
	 * @param $line {String}
	 *        The line from the data file with information about include flags.
	 */
	public function updateIncludeInfo ($line) {
		$parts = explode(',', $line);

		$headerParts = explode(' ', trim($parts[0]));
		$value = trim($parts[1]);

		$value = ($value === 'Yes') ? 'Y' : 'N';

		$setNumber = array_pop($headerParts);
		$type = self::$INCLUDE_FIELDS[implode(' ', $headerParts)];

		if (!isset($this->includes[$setNumber])) {
			$this->includes[$setNumber] = array();
		}

		$this->includes[$setNumber][$type] = $value;
	}

	/**
	 * @APIMethod
	 *
	 * Updates the metaInfo with information from the given $line.
	 *
	 * @param $line {String}
	 *        The line from the data file with information about include flags.
	 */
	public function updateMetaInfo ($line) {

		if ($this->remarksStarted) {
			// Once remarks have started, all subsequent lines are considered remarks
			$this->metaInfo['annotation'] .= "\n${line}";
		} else {

			$parts = explode(',', $line);
			$field = trim($parts[0]);

			if (count($parts) > 1) {
				$value = trim($parts[1]);
			} else {
				// Subsequent remarks lines might not have comma-delimited values. Just
				// go with it.
				$value = '';
			}

			if ($field === 'Station ID') {
				$this->observatoryCode = $value;
			} else if ($field === 'Record Date') {
				$this->dateOffset = strtotime($value);
			} else if ($field === 'Inst. No.') {
				$serials = explode('/', $value);
				$theodoliteSet = false;

				// Use first two non-empty values as the (1) theodolite serial number
				// and (2) electornics serial number
				foreach ($serials as $serial) {
					if ($serial !== null && $serial !== '') {
						if (!$theodoliteSet) {
							$this->theodoliteSerial = trim($serial);
							$theodoliteSet = true;
						} else {
							$this->electronicsSerial = trim($serial);
							break;
						}
					}
				}

			} else if ($field === 'Pier') {
				$this->pierName = $value;
			} else if ($field === 'Mark') {
				$this->markName = $value;
			} else if ($field === 'Pier Temperature') {
				$this->metaInfo['pier_temperature'] = $value;
			} else if ($field === 'Elect Temperature') {
				$this->metaInfo['elect_temperature'] = $value;
			} else if ($field === 'Flux Temperature') {
				$this->metaInfo['flux_temperature'] = $value;
			} else if ($field === 'Proton Temperature') {
				$this->metaInfo['proton_temperature'] = $value;
			} else if ($field === 'Remarks') {
				$this->metaInfo['annotation'] = $value;
			}

		}
	}


	// ------------------------------------------------------------
	// Protected methods
	// ------------------------------------------------------------

	/**
	 * @ProtectedMethod
	 *
	 * Adds the current reading to the list of readings assuming the current
	 * reading is not null. The list of readings is keyed by the current reading
	 * set number, thus this method can be safely called repeatedly if needed.
	 *
	 */
	protected function _saveCurrentReading () {
		if ($this->currentReading !== null) {
			$this->readings[$this->currentReading['set_number']] =
					$this->currentReading;
		}
	}

	/**
	 * @ProtectedMethod
	 *
	 * Looks through $this->observatories for the observatory with a given $code.
	 *
	 * @param $code {String}
	 *        The code for the observatory to get.
	 * @param $warnings {Array} By reference. Optional.
	 *        A buffer into which generated warnings will be logged. If not
	 *        specified, warnings are logged to STDERR.
	 *
	 * @return {Observatory}
	 *         The observatory for the given $code, or NULL if no such observatory
	 *         is found.
	 */
	protected function _getObservatoryFromCode ($code, &$warnings = null) {
		foreach ($this->observatories as $observatory) {
			if ($observatory->code === $code) {
				return $observatory;
			}
		}

		$this->__addWarning("No observatory found for code: '${code}.'",
				$warnings);

		return null;
	}

	/**
	 * @ProtectedMethod
	 *
	 * Looks through the piers on the given $observatory for a pier with the given
	 * $name that began prior to the given $begin and ended after the given $end
	 * (or has not yet ended).
	 *
	 * @param $observatory {ObservatoryDetail}
	 *        The observatory to search.
	 * @param $name {String}
	 *        The name of the pier to find.
	 * @param $begin {Integer}
	 *        Millisecond timestamp for the start of the time window.
	 * @param $end {Integer}
	 *        Millisecond timestamp for the end of the time window.
	 * @param $warnings {Array} By reference. Optional.
	 *        A buffer into which generated warnings will be logged. If not
	 *        specified, warnings are logged to STDERR.
	 *
	 * @return {Pier}
	 *         The pier with the given name or NULL if no such pier is found.
	 */
	protected function _getPierFromName ($observatory, $name, $begin, $end,
			&$warnings = null) {

		if ($observatory === null) {
			$this->__addWarning("Failed to find pier for name '${name}'. " .
					'Observatory was null.', $warnings);
			return null;
		}

		return $this->__getFromName($observatory->piers, $name, $begin, $end,
				'pier', $warnings);
	}

	/**
	 * @ProtectedMethod
	 *
	 * Looks through the marks on the given $pier for a mark with the given
	 * $name that began prior to the given $begin and ended after the given $end
	 * (or has not yet ended).
	 *
	 * @param $pier {Pier}
	 *        The pier to search.
	 * @param $name {String}
	 *        The name of the mark to find.
	 * @param $begin {Integer}
	 *        Millisecond timestamp for the start of the time window.
	 * @param $end {Integer}
	 *        Millisecond timestamp for the end of the time window.
	 * @param $warnings {Array} By reference. Optional.
	 *        A buffer into which generated warnings will be logged. If not
	 *        specified, warnings are logged to STDERR.
	 *
	 * @return {Mark}
	 *         The mark with the given name or NULL if no such mark is found.
	 */
	protected function _getMarkFromName ($pier, $name, $begin, $end,
			&$warnings = null) {

		if ($pier === null) {
			$this->__addWarning("Failed to find mark for name '${name}'. " .
					'Pier was null.', $warnings);
			return null;
		}

		return $this->__getFromName($pier->marks, $name, $begin, $end, 'mark',
				$warnings);
	}

	/**
	 * @ProtectedMethod
	 *
	 * Looks through the instruments on the given $observatory for an instrument
	 * with the given $serial number that began prior to the given $begin and
	 * ended after the given $end (or has not yet ended).
	 *
	 * @param $observatory {ObservatoryDetail}
	 *        The observatory to search.
	 * @param $serial {String}
	 *        The serial number of the instrument to find.
	 * @param $begin {Integer}
	 *        Millisecond timestamp for the start of the time window.
	 * @param $end {Integer}
	 *        Millisecond timestamp for the end of the time window.
	 * @param $type {String}
	 *        The type of the intended instrument. Used for logging purposes only.
	 * @param $warnings {Array} By reference. Optional.
	 *        A buffer into which generated warnings will be logged. If not
	 *        specified, warnings are logged to STDERR.
	 *
	 * @return {Instrument}
	 *         The instrument with the given name or NULL if no such instrument
	 *         is found.
	 */
	protected function _getInstrumentFromSerial ($observatory, $serial, $begin,
			$end, $type, &$warnings = null) {

		if ($observatory === null) {
			$this->__addWarning("Failed to find ${type} for serial '${serial}'." .
					' Observatory was null.', $warnings);
			return null;
		}

		if ($serial === null) {
			$this->__addWarning("No serial number specified for ${type}.", $warnings);
			return null;
		}

		$instruments = $observatory->instruments;
		foreach ($instruments as $inst) {
			if ($inst->serial_number === $serial && $inst->begin <= $begin &&
					($inst->end === null || $inst->end >= $end)) {
				return $inst;
			}
		}

		$this->__addWarning("No ${type} found for serial '${serial}' between " .
				"'${begin}' and '${end}'.", $warnings);
		return null;
	}

	/**
	 * @ProtectedMethod
	 *
	 * Converts the raw $this->readings into an array suitable for passing to
	 * the Reading::fromArray method.
	 *
	 * The returned object is a new array, that is, conversion is NOT done
	 * in-place thus this method can be called multiple times if needed
	 * (ie. for multiple calls to the toObservation method).
	 *
	 * @param $times {Array} By reference. Optional.
	 *        A buffer into which the start and end time for the earliest and
	 *        latest measurement across all readings is placed.
	 * @param $warnings {Array} By reference. Optional.
	 *        A buffer into which generated warnings will be logged. If not
	 *        specified, warnings are logged to STDERR.
	 *
	 * @return {Array}
	 *         An array of readings suitable to be passed to the
	 *         Reading::fromArray method.
	 */
	protected function _getReadings (&$times = null, &$warnings = null) {

		$r = array();

		// Begin/end times for the measurements in a single reading
		$beginEnd = array();

		// Begin/end times for all measurements across all readings
		$begin = null;
		$end = null;

		foreach ($this->readings as $setNum => $reading) {

			$this->_updateIncludeFlags($reading, $warnings);
			$beginEnd = $this->_updateMeasurements($reading, $warnings);

			// Old file format does not support remarks on a per-reading level
			$reading['annotation'] = null;

			// Update absolute begin/end based on begin/end from this reading
			$begin = ($begin === null) ? $beginEnd['begin'] :
					min($beginEnd['begin'], $begin);
			$end = ($end === null) ? $beginEnd['end'] :
					max($beginEnd['end'], $end);

			$r[] = $reading;
		}

		// If requesting begin/end times, populate with computed values
		if ($times !== null && is_array($times)) {
			$times['begin'] = $begin;
			$times['end'] = $end;
		}

		return $r;
	}

	/**
	 * @ProtectedMethod
	 *
	 * Updates the include flags for the declination/vertical/horizontal
	 * components of the given reading. If no include flag information is
	 * specified (for the reading set number as a whole, or for an individual
	 * component), the default assumption is the component IS valid.
	 *
	 * @param $reading {Reading} By reference.
	 *        The reading on which to update the include flags.
	 * @param $warnings {Array} By reference. Optional.
	 *        A buffer into which generated warnings will be logged. If not
	 *        specified, warnings are logged to STDERR.
	 *
	 */
	protected function _updateIncludeFlags (&$reading, &$warnings = null) {

		$setNum = $reading['set_number'];

		if (!isset($this->includes[$setNum])) {
			$this->__addWarning("No include flags found for set '${setNum}'." .
					'Defaulting to assuming all components are valid.', $warnings);
			return;
		}

		$flags = $this->includes[$setNum];

		if (!isset($flags['declination_valid'])) {
			$this->__addWarning("No declination flag for set '${setNum}'. " .
					'Assuming declination is valid.');
		} else {
			$reading['declination_valid'] = $flags['declination_valid'];
		}

		if (!isset($flags['horizontal_intensity_valid'])) {
			$this->__addWarning('No horizontal intensity flag for set ' .
					"'${setNum}'. Assuming horizontal intensity is valid.",
					$warnings);
		} else {
			$reading['horizontal_intensity_valid'] =
					$flags['horizontal_intensity_valid'];
		}

		if (!isset($flags['vertical_intensity_valid'])) {
			$this->__addWarning('No vertical intensity flag for set ' .
					"'${setNum}'. Assuming vertical intensity is valid.", $warnings);
		} else {
			$reading['vertical_intensity_valid'] =
					$flags['vertical_intensity_valid'];
		}
	}

	/**
	 * @ProtectedMethod
	 *
	 * Adds $this->dateOffset to measurement time values for the given reading to
	 * create full millisecond time stamps.
	 *
	 * @param $reading {Reading} By reference.
	 *        The reading for which to update measurement times.
	 * @param $warnings {Array} By reference. Optional.
	 *        A buffer into which generated warnings will be logged. If not
	 *        specified, warnings are logged to STDERR.
	 *
	 * @return {Array}
	 *         A hash containing 'begin' and 'end' keys with values corresponding
	 *         to the earliest and latest measurement time in the reading.
	 */
	protected function _updateMeasurements (&$reading, &$warnings = null) {

		$begin = null;
		$end = null;

		foreach ($reading['measurements'] as $mKey => $measurement) {

			if ($mKey === 'FirstMarkUp' || $mKey === 'FirstMarkDown' ||
					$mKey === 'SecondMarkUp' || $mKey === 'SecondMarkDown') {
				continue; // No times on these measurements
			}

			try {
				$milliseconds = $this->__getStampFromDateAndTime($this->dateOffset,
						$measurement['time']);
			} catch (Exception $e) {
				$this->__addWarning($e->getMessage(), $warnings);
				$milliseconds = null;
			}

			if ($milliseconds != null) {
				$begin = ($begin === null) ? $milliseconds : min($begin, $milliseconds);
				$end = ($end === null) ? $milliseconds : max($end, $milliseconds);
				$measurement['time'] = $milliseconds;
			}

			// Put measurement back in place so the reading reference is updated
			$reading['measurements'][$mKey] = $measurement;
		}

		return array('begin' => $begin, 'end' => $end);
	}


	// ------------------------------------------------------------
	// Private methods
	// ------------------------------------------------------------

	/**
	 * @PrivateMethod
	 *
	 * Helper method to get a named object out of a list of objects. The returned
	 * object must begin prior to the given $begin and later than the given $end.
	 *
	 * @param $objects {Array{Object}}
	 *        An array of objects with a public "name" field.
	 * @param $name {String}
	 *        The name of the desired object.
	 * @param $begin {Integer}
	 *        Timestamp in milliseconds for the start of the time-window.
	 * @param $end {Integer}
	 *        Timestamp in milliseconds for the end of the time-window.
	 *
	 * @param $type {String}
	 *        The type of object being searched. Used for logging purposes only.
	 * @param $warnings {Array} By reference. Optional.
	 *        A buffer into which generated warnings will be logged. If not
	 *        specified, warnings are logged to STDERR.
	 *
	 * @return {Object}
	 *         The named object that was valid during the indicated time window,
	 *         or NULL if no such object could be found.
	 */
	private function __getFromName ($objects, $name, $begin, $end, $type,
			&$warnings = null) {

		if ($objects === null || !is_array($objects)) {
			$this->__addWarning("TypeError [Objects]: Could not find ${type} in " .
					'objects.', $warnings);
			return null;
		}

		foreach ($objects as $object) {
			if ($object->name === $name && $object->begin <= $begin &&
					($object->end === null || $object->end >= $end)) {
				return $object;
			}
		}

		$this->__addWarning("Could not find ${type} for name '${name}' between " .
				"'${begin}' and '${end}'.", $warnings);
		return null;
	}

	/**
	 * @PrivateMethod
	 *
	 * Combines an input date and time into a single datetime stamp in
	 * milliseconds. Only the date portion of the input $date field is used, any
	 * time offset into that date is ignored and instead the input $time value is
	 * used instead.
	 *
	 * This could be moved to a general utilities package if desired.
	 *
	 * @param date {Integer}
	 *        Timestamp for the date to be used as the basis for the final stamp.
	 * @param time {String}
	 *        A 4-, 5-, or 6-character string representing the hours, minutes,
	 *        and/or seconds of a time-of-day to be used for the final stamp.
	 *
	 *        If 4-characters, assumed to be "HHMM"
	 *        If 5-characters, assumed to be "HMMSS"
	 *        If 6-characters, assuemd to be "HHMMSS"
	 *
	 * @return {Integer}
	 *         A timestamp in milliseconds representing the combined date and
	 *         time.
	 */
	private function __getStampFromDateAndTime ($date, $time) {
		$cleanTime = preg_replace('/[^\d]/', '', $time);
		$h = '00';
		$m = '00';
		$s = '00';

		if (strlen($cleanTime) === 4) {
			// HHMM
			$h = substr($cleanTime, 0, 2);
			$m = substr($cleanTime, 2, 2);
		} else if (strlen($cleanTime) === 5) {
			// HMMSS
			$h = '0' + substr($cleanTime, 0, 1);
			$m = substr($cleanTime, 1, 2);
			$s = substr($cleanTime, 3, 2);
		} else if (strlen($cleanTime) === 6) {
			// HHMMSS
			$h = substr($cleanTime, 0, 2);
			$m = substr($cleanTime, 2, 2);
			$s = substr($cleanTime, 4, 2);
		} else {
			throw new Exception("Failed to parse time string '${time}'.");
		}

		return strtotime(sprintf('%s %s:%s:%s', date('Y-m-d', $date),
				$h, $m, $s));
	}

	/**
	 * @PrivateMethod
	 *
	 * Helper method to convert degrees/minutes/seconds into a decimal degrees
	 * angle value.
	 *
	 * This could be moved to a general utilities package if desired.
	 *
	 * @param $degs {Number}
	 *        The degrees portion of the angle.
	 * @param $mins {Number}
	 *        The minutes portion of the angle.
	 * @param $secs {Number}
	 *        The seconds portion of the angle.
	 */
	private function __parseAngle ($degs, $mins, $secs) {
		return (intval($secs) / 3600) + (floatval($mins) / 60) + floatval($degs);
	}

	/**
	 * @PrivateMethod
	 *
	 * Logs the warning either into the given $warnings buffer (presumably for
	 * subsequent logging), or directly to STDERR if $warnings is not provided.
	 *
	 * @param $warning {String}
	 *        The warning message to log.
	 * @param $warnings {Array} By reference. Optional.
	 *        A buffer into which generated warnings will be logged. If not
	 *        specified, warnings are logged to STDERR.
	 */
	private function __addWarning ($warning, &$warnings = null) {
		if ($warnings !== null && is_array($warnings)) {
			$warnings[] = $warning;
		} else {
			fwrite(STDERR, "${warning}\n");
		}
	}
}
