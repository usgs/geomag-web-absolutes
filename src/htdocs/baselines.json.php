<?php

include_once '../conf/config.inc.php';
include_once '../lib/classes/BaselinesWebService.class.php';


if (!isset($TEMPLATE)) {
  if (count($_GET) > 0) {
    // any parameters = run service
    $service = new BaselinesWebService($DB);
    $service->run($_GET);
    exit();
  }

  $TITLE = 'Geomag Web Absolutes Observation Web Service documentation';
  $FOOT = '<script src="js/example-url.js"></script>';
  include 'template.inc.php';
}


?>

<h2 id="parameters">Parameters</h2>
<p>
  Only <code>observatory</code> is required, see other parameters for defaults.
</p>


<dl>
  <dt id="observatory">observatory</dt>
  <dd>
    Observatory code.
    <br/>Example: <code>BOU</code>
  </dd>

  <dt id="starttime">starttime</dt>
  <dd>
    ISO8601 formatted start of interval for observations.
    <br/>Default is now - 30 days.
    <br/>Example: <code>2016-01-01T00:00:00Z</code>
  </dd>

  <dt id="endtime">endtime</dt>
  <dd>
    ISO8601 formatted end of interval for observations.
    <br/>Default is now.
    <br/>Example: <code>2016-02-01T00:00:00Z</code>
  </dd>

  <dt id="includemeasurements">includemeasurements</dt>
  <dd>
    Whether to include raw measurements (<code>true</code>),
    or only computed absolutes (<code>false</code>).
    <br/>Default <code>false</code>
  </dd>
</dl>


<h2 id="example">Example URLs</h2>

<ul>
  <li>
    <a class="example-url"
        href="baselines.json.php?observatory=BOU&amp;starttime=2016-01-29&amp;endtime=2016-01-30"
    >
      baselines.json.php?observatory=BOU&amp;starttime=2016-01-29&amp;endtime=2016-01-30
    </a>
    <p>
      Observations at the <code>BOU</code> observatory between
          <code>2016-01-29</code> and <code>2016-01-29</code>
          without measurements.
    </p>
  </li>


  <li>
    <a class="example-url"
        href="baselines.json.php?observatory=BOU&amp;starttime=2016-01-29&amp;endtime=2016-01-30&amp;includemeasurements=true"
    >
      baselines.json.php?observatory=BOU&amp;starttime=2016-01-29&amp;endtime=2016-01-30&amp;includemeasurements=true
    </a>
    <p>
      Observations at the <code>BOU</code> observatory between
          <code>2016-01-29</code> and <code>2016-01-29</code>
          with measurements.
    </p>
  </li>
</ul>


<h2 id="response">Response Format</h2>
<p>
  Responses uses JSON format.
</p>


<h3>Example Error Response<h3>
<p>
  Note that
    <code>metadata.error</code> is a string containing the error message
    and <code>data</code> is null.
</p>

<p>
  A HTTP response status code will also be set to indicate whether the error
  is a bad request (400) or a server error (503).
</p>

<pre>
{
  metadata: {
    date: "2016-08-30T17:47:28Z",
    request: "/baselines.json.php?observatory=BOU&amp;unknown",
    error: "Message describing error"
  },
  data: null
}
</pre>


<h3>Example Success Response</h3>
<p>
  Note that
    <code>metadata.error</code> is <code>false</code>
    and <code>data</code> is not null.
</p>

<pre>{
  "metadata": {
    "date": "2016-08-30T19:28:16Z",
    "request": "/baselines.json.php?observatory=BOU&starttime=2016-01-29&endtime=2016-01-30",
    "error": false
  },
  "data": [
    {
      "id": 3230,
      "time": "2016-01-29T19:48:52Z",
      "pier_temperature": 22.7,
      "elect_temperature": null,
      "flux_temperature": null,
      "proton_temperature": null,
      "outside_temperature": null,
      "reviewed": true,
      "electronics": {
        "id": 1,
        "serial": "0110"
      },
      "theodolite": {
        "id": 2,
        "serial": "109648"
      },
      "mark": {
        "id": 1,
        "azimuth": 199.1383,
        "name": "AZ"
      },
      "pier": {
        "id": 20,
        "correction": -23.1,
        "name": "MainPCDCP"
      },
      "observer": "Teresa",
      "reviewer": "Jake Morris",
      "readings": [
        {
          "id": 23804,
          "set": 1,
          "D": {
            "absolute": 8.6975361,
            "baseline": 8.9705112,
            "end": 1454093252,
            "shift": 0,
            "start": 1454092976,
            "valid": true
          },
          "H": {
            "absolute": 20727.0131395,
            "baseline": -64.9643605,
            "end": 1454093835,
            "start": 1454093543,
            "valid": false
          },
          "Z": {
            "absolute": 47918.9709454,
            "baseline": 589.1059454,
            "end": 1454093835,
            "start": 1454093543,
            "valid": true
          }
        },
        {
          "id": 23805,
          "set": 2,
          "D": {
            "absolute": 8.6812861,
            "baseline": 8.970468,
            "end": 1454094266,
            "shift": 0,
            "start": 1454094018,
            "valid": true
          },
          "H": {
            "absolute": 20726.4422683,
            "baseline": -65.8752317,
            "end": 1454094785,
            "start": 1454094494,
            "valid": true
          },
          "Z": {
            "absolute": 47919.245106,
            "baseline": 589.512606,
            "end": 1454094785,
            "start": 1454094494,
            "valid": true
          }
        },
        {
          "id": 23806,
          "set": 3,
          "D": {
            "absolute": 8.6678139,
            "baseline": 8.96869,
            "end": 1454095214,
            "shift": 0,
            "start": 1454094968,
            "valid": true
          },
          "H": {
            "absolute": 20728.7608689,
            "baseline": -65.9341311,
            "end": 1454095777,
            "start": 1454095449,
            "valid": true
          },
          "Z": {
            "absolute": 47919.3453511,
            "baseline": 589.5653511,
            "end": 1454095777,
            "start": 1454095449,
            "valid": true
          }
        },
        {
          "id": 23807,
          "set": 4,
          "D": {
            "absolute": 8.6555917,
            "baseline": 8.9682093,
            "end": 1454096168,
            "shift": 0,
            "start": 1454095927,
            "valid": true
          },
          "H": {
            "absolute": 20734.1815326,
            "baseline": -64.6059674,
            "end": 1454096628,
            "start": 1454096389,
            "valid": false
          },
          "Z": {
            "absolute": 47918.8061522,
            "baseline": 588.9761522,
            "end": 1454096628,
            "start": 1454096389,
            "valid": true
          }
        }
      ]
    }
  ]
}</pre>

<h4>Data Notes</h4>
<ul>
  <li>
    <code>D</code> (Declination)
    values are reported in decimal <code>degrees</code>.
  </li>
  <li>
    <code>H</code> (Horizontal Intensity) and
    <code>Z</code> (Vertical Intensity)
    values are reported in <code>nT</code>.
  </li>
  <li>
    <code>start</code> and <code>end</code> refer to the time range during which
    measurements related to the absolute and baseline value were collected.

    Values are unix epoch timestamps,
    (number of seconds since the epoch <code>1970-01-01T00:00:00Z</code>),
    and do not include leap seconds.
  </li>
  <li>
    <code>valid</code> indicated whether reviewers believe these are usable measurements.
  </li>
</ul>
