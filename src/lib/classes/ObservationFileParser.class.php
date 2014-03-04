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
