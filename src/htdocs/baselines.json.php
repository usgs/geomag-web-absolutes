<?php

include_once '../conf/config.inc.php';

// check for parameters
$observatory = isset($_GET['observatory']) ? $_GET['observatory'] : null;
$startTime = isset($_GET['starttime']) ? strtotime($_GET['starttime']) : null;
$endTime = isset($_GET['endtime']) ? strtotime($_GET['endtime']) : null;
$includeMeasurements = isset($_GET['includemeasurements']) ?
    ($_GET['includemeasurements'] === 'true') : false;


// validate parameters
if ($observatory == null) {
  sendError('"observatory" query string parameter is required.');
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
  sendError('"starttime" must be before "endtime"');
}


// load observations
$observationStatement = $DB->prepare('
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
    o.reviewed
  FROM observation o
  JOIN observatory obs on (obs.id = o.observatory_id)
  WHERE obs.code = :observatory
  AND o.begin >= :startTime
  AND o.begin <= :endTime
  ORDER BY o.begin
');

$observationStatement->execute(array(
  'observatory' => $observatory,
  'startTime' => $startTime,
  'endTime' => $endTime,
));

$observations = array();
while ($row = $observationStatement->fetch(PDO::FETCH_ASSOC)) {
  $observations[$row['id']] = array(
    'id' => safeintval($row['id']),
    'time' => safeISO8601($row['begin']),
    'pier_temperature' => safefloatval($row['pier_temperature']),
    'elect_temperature' => safefloatval($row['elect_temperature']),
    'flux_temperature' => safefloatval($row['flux_temperature']),
    'proton_temperature' => safefloatval($row['proton_temperature']),
    'outside_temperature' => safefloatval($row['outside_temperature']),
    'mark_id' => safeintval($row['mark_id']),
    'electronics_id' => safeintval($row['electronics_id']),
    'theodolite_id' => safeintval($row['theodolite_id']),
    'reviewed' => ($row['reviewed'] === 'Y')
  );
}
$observationStatement->closeCursor();


// load observation readings
$readingStatement = $DB->prepare('
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
  JOIN observation o on (o.id = r.observation_id)
  JOIN observatory obs on (obs.id = o.observatory_id)
  WHERE obs.code = :observatory
  AND o.begin >= :startTime
  AND o.begin <= :endTime
  ORDER BY r.observation_id, r.set_number
');

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
$readingStatement->closeCursor();


if ($includeMeasurements) {
  $measurementStatement = $DB->prepare('
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

}

// convert Array<id => object> to Array<object>
foreach ($observations as $id => &$observation) {
  $observation['readings'] = array_values($observation['readings']);
}
$observations = array_values($observations);


header('Content-type: application/json');
echo json_encode($observations);
exit();



function safeISO8601 ($date) {
  $date = safefloatval($date);
  if ($date === null) {
    return $date;
  }
  return gmdate('Y-m-d\TH:i:s\Z', $date);
}

function sendError ($error) {
  header('HTTP/1.1 400 Bad Request');
  header('Content-type: application/json');

  echo json_encode(array(
    'error' => $error
  ));
  exit();
}

?>
