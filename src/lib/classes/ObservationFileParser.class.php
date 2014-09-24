<?php

include_once 'ObservationFile.class.php';

class ObservationFileParser {

	// Loaded with ObservatoryDetail objects during instantiation
	protected $observatories = array();


	/**
	 * @Constructor
	 *
	 * @param $observatoryFactory {ObservatoryFactory}
	 *        A factory object capable of fetching Observatory and
	 *        ObservatoryDetail objects from a data source.
	 */
	public function __construct ($observatoryFactory) {
		$this->factory = $observatoryFactory;
		$this->__loadObservatories();
	}


	// ------------------------------------------------------------
	// Public methods
	// ------------------------------------------------------------

	/**
	 * @APIMethod
	 *
	 * @param $file {String}
	 *        The name of the file to parse.
	 * @param $warnings {Array} Optional
	 *        If specified, parse warnings will be pushed onto this array.
	 *
	 * @return {Observation}
	 *         The parsed observation suitable for adding to the database using
	 *         a factory.
	 */
	public function parse ($file, &$warnings = null) {
		if (!file_exists($file)) {
			throw new Exception ("No such file: '$file'.");
		}

		$observationFile = new ObservationFile($this->observatories);
		$lines = file($file);
		$i = 0; $numLines = count($lines);
		$line = null;

		for (; $i < $numLines; $i++) {
			$line = $lines[$i];

			// Skip blank lines
			if ($line === '') { continue; }

			$field = explode(',', $line);
			$field = trim($field[0]);

			if ($this->_isNewReading($field)) {
				$observationFile->startReading($line);
			} else if ($this->_isReadingField($field)) {
				$observationFile->updateCurrentReading($line);
			} else if ($this->_isIncludeInfo($field)) {
				$observationFile->updateIncludeInfo($line);
			} else {
				$observationFile->updateMetaInfo($line);
			}
		}

		return $observationFile->toObservation($warnings);
	}


	// ------------------------------------------------------------
	// Protected methods
	// ------------------------------------------------------------

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
	 * @param $field {String}
	 *        The field label from the observation file.
	 *
	 * @return {Boolean}
	 *         True if this field indicates the start of a new reading. False
	 *         otherwise.
	 */
	protected function _isNewReading ($field) {
		return ($field === 'Set');
	}

	/**
	 * @param $field {String}
	 *        The field label from the observation file.
	 *
	 * @return {Boolean}
	 *         True if this field contains reading attribute data. False
	 *         otherwise.
	 */
	protected function _isReadingField ($field) {
		return array_key_exists($field, ObservationFile::$READING_FIELDS);
	}

	/**
	 * @param $field {String}
	 *        The field label from the observation file.
	 *
	 * @return {Boolean}
	 *         True if this field contains include flag data. False otherwise.
	 */
	protected function _isIncludeInfo ($field) {
		// Actual field name includes set number. Since set number is variable,
		// must trim that off for comparison.
		$fieldParts = explode(' ', $field);
		array_pop($fieldParts);
		$subField = implode(' ', $fieldParts);

		return array_key_exists($subField, ObservationFile::$INCLUDE_FIELDS);
	}


	// ------------------------------------------------------------
	// Private methods
	// ------------------------------------------------------------

	/**
	 * Loads $this->observatories with ObservatoryDetail instances representing
	 * all the observatories available from the instance factory.
	 *
	 */
	private function __loadObservatories () {
		$summaries = $this->factory->getObservatories();

		foreach ($summaries as $summary) {
			$this->observatories[] = $this->factory->getObservatory($summary->id);
		}
	}
}
