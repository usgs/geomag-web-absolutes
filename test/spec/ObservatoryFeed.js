/*global define*/
/*jshint quotmark:false*/

/**
 * This is an example data feed, for testing purposes.
 *
 * NOTES:
 * - the define function wrapper is only for testing purposes,
 *   and would not appear in the feed (unless via a jsonp callback parameter).
 * - id would normally be database primary key.
 * - dates (begin/end) are millisecond epoch timestamps.
 * - comments next to dates are for information only,
 *   and would not appear in the feed.
 */
define({
	"observatories": [
		{
			"id": "example_obs_001",
			"code": "BOU",
			"name": "Boulder",
			"location": "Boulder, CO",
			"latitude": 40.1375,
			"longitude": -105.2372,
			"geomagnetic_latitude": 48.40,
			"geomagnetic_longitude": 320.59,
			"elevation": 1682,
			"orientation": "HDZF",
			"instruments": [
				{
					"id": "example_elec_001",
					"serial_number": "814503",
					"begin": 1356998400000, // 2013-01-01
					"end": 1372032000000, // 2013-06-24
					"name": "Electronics",
					"type": "elec"
				},
				{
					"id": "example_theo_001",
					"serial_number": "110",
					"begin": 1357084800000, // 2013-01-02
					"end": 1371945600000, // 2013-06-23
					"name": "Theodolite",
					"type": "theo"
				}
			],
			"piers": [
				{
					"id": "example_pier_001",
					"name": "Main",
					"begin": 1338508800000, // 2012-06-01
					"end": null,
					"correction": -23.1,
					"marks": [
						{
							"id": "example_mark_001",
							"name": "AZ",
							"begin": 1343779200000, // 2012-08-01
							"end": null,
							"azimuth": 199.1383
						}
					],
					"default_mark_id": "example_mark_001",
					"default_electronics_id": "example_elec_001",
					"default_theodolite_id": "example_theo_001"
				}
			],
			"default_pier_id": "example_pier_001"
		},

		{
			"id": "example_obs_002",
			"code": "CMO",
			"name": "College",
			"location": "Fairbanks, AK",
			"latitude": 64.8742,
			"longitude": -147.8597,
			"geomagnetic_latitude": 65.38,
			"geomagnetic_longitude": 261.63,
			"elevation": 197,
			"orientation": "HDZF",
			"instruments": [
				{
					"id": "example_theo_002",
					"serial_number": "200803",
					"begin": 1359763200000, // 2013-02-02
					"end": 1372118400000, // 2013-06-25
					"name": "Theodolite",
					"type": "theo"
				}
			],
			"piers": [
				{
					"id": "example_pier_002",
					"name": "1A",
					"begin": 1342310400000, // 2012-07-15
					"end": null,
					"correction": 10.5,
					"marks": [
						{
							"id": "example_mark_002",
							"name": "Azimuth",
							"begin": 1356998400000, // 2013-01-01
							"end": null,
							"azimuth": 27.5613
						}
					],
					"default_mark_id": "example_mark_002",
					"default_electronics_id": null,
					"default_theodolite_id": "example_theo_002"
				},
				{
					"id": "example_pier_003",
					"name": "1B",
					"begin": 1349049600000, // 2012-10-01
					"correction": 13.9,
					"marks": [
						{
							"id": "example_mark_003",
							"name": "Azimuth",
							"begin": 1349049600000, // 2012-10-01
							"end": null,
							"azimuth": 26.3883
						}
					],
					"default_mark_id": "example_mark_003",
					"default_electronics_id": null,
					"default_theodolite_id": "example_theo_002"
				}
			],
			"default_pier_id": "example_pier_002"
		}
	]
});
