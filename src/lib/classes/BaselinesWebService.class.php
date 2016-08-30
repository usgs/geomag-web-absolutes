<?php


class BaselinesWebService {

  private $db;


  /**
   * Construct a new BaselinesWebService.
   *
   * @param $db {PDO}
   *     PDO database connection to baselines database.
   */
  public function __construct($db) {
    $this->db = $db;
  }


  /**
   * Get baseline observations.
   *
   * @param $observatory {String}
   *     observatory code, e.g. 'BOU'.
   * @param $startTime {Number}
   *     unix epoch timestamp.
   * @param $endTime {Number}
   *     unix epoch timestamp.
   * @param $includeMeasurements {Boolean} default false
   *     whether to include raw measurements for each observation.
   * @return {Array<Array>}
   *     array of observations matching criteria.
   */
  public function getObservations ($observatory, $startTime, $endTime,
      $includeMeasurements = false) {
    $observations = array();

    // load observations
    $observationStatement = $this->db->prepare('
      SELECT
        o.id,
        o.begin,
        o.end,
        o.pier_temperature,
        o.elect_temperature,
        o.flux_temperature,
        o.proton_temperature,
        o.outside_temperature,
        o.mark_id,
        o.electronics_id,
        o.theodolite_id,
        o.reviewed,
        m.azimuth,
        p.correction
      FROM observation o
      JOIN observatory obs ON (obs.id = o.observatory_id)
      LEFT JOIN mark m ON (m.id = o.mark_id)
      LEFT JOIN pier p ON (p.id = m.pier_id)
      WHERE obs.code = :observatory
      AND o.begin >= :startTime
      AND o.begin <= :endTime
      ORDER BY o.begin
    ');

    try {
      $observationStatement->execute(array(
        'observatory' => $observatory,
        'startTime' => $startTime,
        'endTime' => $endTime,
      ));

      while ($row = $observationStatement->fetch(PDO::FETCH_ASSOC)) {
        $observations[$row['id']] =
            array(
              'id' => safeintval($row['id']),
              'time' => safeISO8601($row['begin']),
              'pier_temperature' => safefloatval($row['pier_temperature']),
              'elect_temperature' => safefloatval($row['elect_temperature']),
              'flux_temperature' => safefloatval($row['flux_temperature']),
              'proton_temperature' => safefloatval($row['proton_temperature']),
              'outside_temperature' => safefloatval($row['outside_temperature']),
              'mark_azimuth' => safefloatval($row['azimuth']),
              'pier_correction' => safefloatval($row['correction']),
              'mark_id' => safeintval($row['mark_id']),
              'electronics_id' => safeintval($row['electronics_id']),
              'theodolite_id' => safeintval($row['theodolite_id']),
              'reviewed' => ($row['reviewed'] === 'Y')
            );
      }
    } finally {
      $observationStatement->closeCursor();
    }


    // load observation readings
    $readingStatement = $this->db->prepare('
      SELECT
        r.id,
        r.observation_id,
        r.set_number,
        r.declination_valid,
        r.declination_shift,
        r.horizontal_intensity_valid,
        r.vertical_intensity_valid,
        r.startH,
        r.endH,
        r.absH,
        r.baseH,
        r.startZ,
        r.endZ,
        r.absZ,
        r.baseZ,
        r.startD,
        r.endD,
        r.absD,
        r.baseD
      FROM reading r
      JOIN observation o ON (o.id = r.observation_id)
      JOIN observatory obs ON (obs.id = o.observatory_id)
      WHERE obs.code = :observatory
      AND o.begin >= :startTime
      AND o.begin <= :endTime
      ORDER BY r.observation_id, r.set_number
    ');

    try {
      $readingStatement->execute(array(
        'observatory' => $observatory,
        'startTime' => $startTime,
        'endTime' => $endTime,
      ));

      while ($row = $readingStatement->fetch(PDO::FETCH_ASSOC)) {
        $observations[$row['observation_id']]['readings'][$row['id']] =
            array(
              'id' => safeintval($row['id']),
              'set' => safeintval($row['set_number']),
              'D' => array(
                'absolute' => safefloatval($row['absD']),
                'baseline' => safefloatval($row['baseD']),
                'end' => safeintval($row['endD']),
                'shift' => safeintval($row['declination_shift']),
                'start' => safeintval($row['startD']),
                'valid' => ($row['declination_valid'] === 'Y')
              ),
              'H' => array(
                'absolute' => safefloatval($row['absH']),
                'baseline' => safefloatval($row['baseH']),
                'end' => safeintval($row['endH']),
                'start' => safeintval($row['startH']),
                'valid' => ($row['horizontal_intensity_valid'] === 'Y')
              ),
              'Z' => array(
                'absolute' => safefloatval($row['absZ']),
                'baseline' => safefloatval($row['baseZ']),
                'end' => safeintval($row['endZ']),
                'start' => safeintval($row['startZ']),
                'valid' => ($row['vertical_intensity_valid'] === 'Y')
              )
            );
      }
    } finally {
      $readingStatement->closeCursor();
    }


    // load reading measurements
    if ($includeMeasurements) {
      $measurementStatement = $this->db->prepare('
        SELECT
          r.observation_id,
          m.id,
          m.reading_id,
          m.type,
          m.time,
          m.angle,
          m.h,
          m.e,
          m.z,
          m.f
        FROM measurement m
        JOIN reading r ON (r.id = m.reading_id)
        JOIN observation o ON (o.id = r.observation_id)
        JOIN observatory obs ON (obs.id = o.observatory_id)
        WHERE obs.code = :observatory
        AND o.begin >= :startTime
        AND o.begin <= :endTime
        ORDER BY r.observation_id, r.set_number, m.time
      ');

      try {
        $measurementStatement->execute(array(
          'observatory' => $observatory,
          'startTime' => $startTime,
          'endTime' => $endTime,
        ));

        while ($row = $measurementStatement->fetch(PDO::FETCH_ASSOC)) {
          $observations[$row['observation_id']]['readings'][$row['reading_id']]['measurements'][] =
              array(
                'id' => safeintval($row['id']),
                'type' => $row['type'],
                'time' => safeintval($row['time']),
                'angle' => safefloatval($row['angle']),
                'h' => safefloatval($row['h']),
                'e' => safefloatval($row['e']),
                'z' => safefloatval($row['z']),
                'f' => safefloatval($row['f'])
              );
        }
      } finally {
        $measurementStatement->closeCursor();
      }
    }

    // convert Array<id => object> to Array<object>
    foreach ($observations as $id => &$observation) {
      $observation['readings'] = array_values($observation['readings']);
    }
    $observations = array_values($observations);

    return $observations;
  }


  public function run ($params) {
    // check for parameters
    $observatory = null;
    $startTime = null;
    $endTime = null;
    $includeMeasurements = false;

    // parse parameters
    foreach ($params as $name => $value) {
      if ($name === 'observatory') {
        $observatory = $value;
      } else if ($name === 'starttime') {
        $startTime = strtotime($value);
      } else if ($name === 'endtime') {
        $endTime = strtotime($value);
      } else if ($name === 'includemeasurements') {
        $includeMeasurements = ($value === 'true');
      } else {
        self::sendError('Unknown parameter "' . htmlentities($name) . '"');
      }
    }

    // validate parameters and set defaults
    if ($observatory == null) {
      self::sendError('"observatory" query string parameter is required.');
    }

    $now = time();
    if ($startTime == null) {
      // default 30 days ago
      $startTime = $now - 30 * 86400;
    }
    if ($endTime == null) {
      // default now
      $endTime = $now;
    }

    if ($endTime < $startTime) {
      self::sendError('"starttime" must be before "endtime"');
    }

    try {
      $observations = $this->getObservations(
          $observatory,
          $startTime,
          $endTime,
          $includeMeasurements);
      self::sendJson($observations);
    } catch (Exception $e) {
      self::sendError($e->getMessage(), 503);
    }
  }


  /**
   * Send error response.
   */
  public static function sendError ($error, $status = 400) {
    if ($status === 400) {
      header('HTTP/1.1 400 Bad Request');
    } else {
      header('HTTP/1.1 503 Internal Server Error');
    }
    header('Content-type: application/json');

    echo json_encode(array(
      'metadata' => array(
        'date' => safeISO8601(time()),
        'request' => $_SERVER['REQUEST_URI'],
        'error' => $error
      ),
      'data' => null
    ));
    exit();
  }


  public static function sendJson ($data, $status = 200) {
    header('Content-type: application/json');

    echo json_encode(array(
      'metadata' => array(
        'date' => safeISO8601(time()),
        'request' => $_SERVER['REQUEST_URI'],
        'error' => false
      ),
      'data' => $data
    ));
    exit();
  }

}

?>
