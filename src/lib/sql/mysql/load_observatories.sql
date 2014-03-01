/* BDT - add observatory entry */
INSERT INTO observatory (name, code, location, latitude, longitude, geomagnetic_latitude, geomagnetic_longitude, elevation, orientation, default_pier_id)
VALUES ('Boulder Test (BDT)','BDT','Boulder, CO' ,'40.1375' ,'105.2372' ,'48.40' ,'320.59' ,'1682' ,'HDZF', NULL);

/* get id of newly-added observatory row */
SELECT id FROM observatory WHERE code='BDT' INTO @observatory_id;

/* add BDT's instruments - two pairs*/
/* this pair is current but the begin time is just an estimate */
INSERT INTO instrument (observatory_id, serial_number, begin, end, name, type)
VALUES ( @observatory_id, '814503', 1000*unix_timestamp('2012-01-01 00:00:00'), NULL, 'Electronics', 'elec');
INSERT INTO instrument (observatory_id, serial_number, begin, end, name, type)
VALUES ( @observatory_id, '110', 1000*unix_timestamp('2012-01-01 00:00:00'), NULL, 'Theodolite', 'theo');
/* this pair was replaced, but don't know when - use 2011-12-31 as best guess for now */
INSERT INTO instrument (observatory_id, serial_number, begin, end, name, type)
VALUES ( @observatory_id, '154162', 1000*unix_timestamp('1970-01-01 00:00:00'), 1000*unix_timestamp('2011-12-31 23:59:59'), 'Electronics', 'elec');
INSERT INTO instrument (observatory_id, serial_number, begin, end, name, type)
VALUES ( @observatory_id, '035', 1000*unix_timestamp('1970-01-01 00:00:00'), 1000*unix_timestamp('2011-12-31 23:59:59'), 'Theodolite', 'theo');

/* add pier=Main */
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( @observatory_id, 'Main', 1000*unix_timestamp('1970-01-01 00:00:00'), NULL, -23.1, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='814503' AND begin=1000*unix_timestamp('2012-01-01 00:00:00') ),
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='110' AND begin=1000*unix_timestamp('2012-01-01 00:00:00') )
);

/* set observatory.default_pier_id to Main */
UPDATE observatory
SET default_pier_id = (SELECT id FROM pier
                       WHERE observatory_id=@observatory_id
                         AND name = 'Main'
                         AND begin = 1000*unix_timestamp('1970-01-01 00:00:00')
                      )
WHERE code = 'BDT';

/* add Mark=AZ */
INSERT INTO mark (pier_id, name, begin, end, azimuth)
VALUES (
  (SELECT id FROM pier WHERE observatory_id=@observatory_id
                         AND name='Main'
                         AND begin=1000*unix_timestamp('1970-01-01 00:00:00')),
   'AZ', 1000*unix_timestamp('1970-01-01 00:00:00'), NULL, 199.1383
);

/* update pier.default_mark_id */
/* See note above explaining why user-defined variables are needed */
SELECT id
FROM pier
WHERE observatory_id=@observatory_id
  AND name='Main'
  AND begin=1000*unix_timestamp('1970-01-01 00:00:00')
INTO @pier_id;

SELECT id
FROM mark
WHERE name = 'AZ'
  AND begin = 1000*unix_timestamp('1970-01-01 00:00:00')
  AND pier_id = @pier_id
INTO @default_mark_id;


UPDATE PIER SET default_mark_id = @default_mark_id
WHERE id = @pier_id;
/* BOU - add observatory entry */
INSERT INTO observatory (name, code, location, latitude, longitude, geomagnetic_latitude, geomagnetic_longitude, elevation, orientation, default_pier_id)
VALUES ('Boulder (BOU)','BOU','Boulder, CO' ,'40.1375' ,'105.2372' ,'48.40' ,'320.59' ,'1682' ,'HDZF', NULL);

/* get id of newly-added observatory row */
SELECT id FROM observatory WHERE code='BOU' INTO @observatory_id;

/* add BOU's instruments - two pairs*/
/* this pair is current but the begin time is just an estimate */
INSERT INTO instrument (observatory_id, serial_number, begin, end, name, type)
VALUES ( (SELECT id FROM observatory WHERE code='BOU'), '814503', 1000*unix_timestamp('2012-01-01 00:00:00'), NULL, 'Electronics', 'elec');
INSERT INTO instrument (observatory_id, serial_number, begin, end, name, type)
VALUES ( (SELECT id FROM observatory WHERE code='BOU'), '110', 1000*unix_timestamp('2012-01-01 00:00:00'), NULL, 'Theodolite', 'theo');
/* this pair was replaced, but don't know when - use 2011-12-31 as best guess for now */
INSERT INTO instrument (observatory_id, serial_number, begin, end, name, type)
VALUES ( (SELECT id FROM observatory WHERE code='BOU'), '154162', 1000*unix_timestamp('1970-01-01 00:00:00'), 1000*unix_timestamp('2011-12-31 23:59:59'), 'Electronics', 'elec');
INSERT INTO instrument (observatory_id, serial_number, begin, end, name, type)
VALUES ( (SELECT id FROM observatory WHERE code='BOU'), '035', 1000*unix_timestamp('1970-01-01 00:00:00'), 1000*unix_timestamp('2011-12-31 23:59:59'), 'Theodolite', 'theo');

/* add pier=Main */
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( @observatory_id, 'Main', 1000*unix_timestamp('1970-01-01 00:00:00'), 1000*unix_timestamp('2004-09-09 20:20:00'), -7, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='814503' AND begin=1000*unix_timestamp('2012-01-01 00:00:00') ),
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='110' AND begin=1000*unix_timestamp('2012-01-01 00:00:00') )
);
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( @observatory_id, 'Main', 1000*unix_timestamp('2004-09-09 20:20:00'), 1000*unix_timestamp('2004-09-30 19:45:00'), -31.6, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='814503' AND begin=1000*unix_timestamp('2012-01-01 00:00:00') ),
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='110' AND begin=1000*unix_timestamp('2012-01-01 00:00:00') )
);
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( @observatory_id, 'Main', 1000*unix_timestamp('2004-09-30 19:45:00'), 1000*unix_timestamp('2004-10-28 20:45:00'), -8.4, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='814503' AND begin=1000*unix_timestamp('2012-01-01 00:00:00') ),
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='110' AND begin=1000*unix_timestamp('2012-01-01 00:00:00') )
);
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( @observatory_id, 'Main', 1000*unix_timestamp('2004-10-28 20:45:00'), 1000*unix_timestamp('2005-06-01 16:15:00'), 8.4, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='814503' AND begin=1000*unix_timestamp('2012-01-01 00:00:00') ),
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='110' AND begin=1000*unix_timestamp('2012-01-01 00:00:00') )
);
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( @observatory_id, 'Main', 1000*unix_timestamp('2005-04-19 18:00:00'), 1000*unix_timestamp('2005-04-19 19:00:00'), 49.4, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='814503' AND begin=1000*unix_timestamp('2012-01-01 00:00:00') ),
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='110' AND begin=1000*unix_timestamp('2012-01-01 00:00:00') )
);
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( @observatory_id, 'Main', 1000*unix_timestamp('2005-04-19 19:00:00'), 1000*unix_timestamp('2005-06-01 16:15:00'), 49.4, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='814503' AND begin=1000*unix_timestamp('2012-01-01 00:00:00') ),
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='110' AND begin=1000*unix_timestamp('2012-01-01 00:00:00') )
);
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( @observatory_id, 'Main', 1000*unix_timestamp('2005-06-01 16:15:00'), 1000*unix_timestamp('2005-07-07 18:00:00'), -19.9, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='814503' AND begin=1000*unix_timestamp('2012-01-01 00:00:00') ),
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='110' AND begin=1000*unix_timestamp('2012-01-01 00:00:00') )
);
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( @observatory_id, 'Main', 1000*unix_timestamp('2005-07-07 18:00:00'), NULL, -23.1, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='814503' AND begin=1000*unix_timestamp('2012-01-01 00:00:00') ),
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='110' AND begin=1000*unix_timestamp('2012-01-01 00:00:00') )
);
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( @observatory_id, 'AUX', 1000*unix_timestamp('2005-07-07 18:00:00'), NULL, -20.7, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='814503' AND begin=1000*unix_timestamp('2012-01-01 00:00:00') ),
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='110' AND begin=1000*unix_timestamp('2012-01-01 00:00:00') )
);

/* set observatory.default_pier_id to Main */
/* Note: MySQL's prohibits using 'SELECT FROM' clauses for the target table in the SET and/or */
/* WHERE clauses - workaround via user-defined variables */
SELECT id
FROM pier
WHERE observatory_id=@observatory_id
  AND name = 'Main'
  AND begin = 1000*unix_timestamp('2005-07-07 18:00:00')
INTO @default_pier_id;

UPDATE observatory
SET default_pier_id = @default_pier_id
WHERE code = 'BOU';

/* add Mark=AZ */
INSERT INTO mark (pier_id, name, begin, end, azimuth)
VALUES (
  (SELECT id FROM pier WHERE observatory_id=@observatory_id
                         AND name='Main'
                         AND begin = 1000*unix_timestamp('2005-07-07 18:00:00') ),
   'AZ', 1000*unix_timestamp('1970-01-01 00:00:00'), NULL, 199.1383
);
INSERT INTO mark (pier_id, name, begin, end, azimuth)
VALUES (
  (SELECT id FROM pier WHERE observatory_id=@observatory_id
                         AND name='Aux'
                         AND begin = 1000*unix_timestamp('2005-07-07 18:00:00') ),
   'Aux', 1000*unix_timestamp('1970-01-01 00:00:00'), NULL, 199.0933
);

/* update pier.default_mark_id */
/* See note above explaining why user-defined variables are needed */
SELECT id
FROM pier
WHERE observatory_id=@observatory_id
  AND name='Main'
  AND begin = 1000*unix_timestamp('2005-07-07 18:00:00')
INTO @pier_id;

SELECT id
FROM mark
WHERE name = 'AZ'
  AND begin = 1000*unix_timestamp('1970-01-01 00:00:00')
  AND pier_id = @pier_id
INTO @default_mark_id;


UPDATE PIER SET default_mark_id = @default_mark_id
WHERE id = @pier_id;

/* BRW - add observatory entry */
INSERT INTO observatory (name, code, location, latitude, longitude, geomagnetic_latitude, geomagnetic_longitude, elevation, orientation)
 VALUES ('Barrow (BRW)','BRW' ,'Point Barrow, AK','71.3225' ,'156.6231' ,'69.61' ,'246.26' ,'12' ,'HDZF');

/* get id of newly-added observatory row */
SELECT id FROM observatory WHERE code='BRW' INTO @observatory_id;

/* add BRW's instruments */
/* this pair is current but the begin time is just an estimate */
INSERT INTO instrument (observatory_id, serial_number, begin, end, name, type)
VALUES ( @observatory_id, '359137', 1000*unix_timestamp('1970-01-01 00:00:00'), NULL, 'Electronics', 'elec');
INSERT INTO instrument (observatory_id, serial_number, begin, end, name, type)
VALUES ( @observatory_id, '0137', 1000*unix_timestamp('1970-01-01 00:00:00'), NULL, 'Theodolite', 'theo');

/* add pier=Main */
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( @observatory_id, 'Main', 1000*unix_timestamp('1970-01-01 00:00:00'), 1000*unix_timestamp('2005-08-29 17:00:00'), 6, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='359137' AND begin=1000*unix_timestamp('1970-01-01 00:00:00') ),
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='0137' AND begin=1000*unix_timestamp('1970-01-01 00:00:00') )
);
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( @observatory_id, 'Main', 1000*unix_timestamp('2005-08-29 17:00:00'), 1000*unix_timestamp('2006-01-01 00:00:00'), -2, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='359137' AND begin=1000*unix_timestamp('1970-01-01 00:00:00') ),
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='0137' AND begin=1000*unix_timestamp('1970-01-01 00:00:00') )
);
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( @observatory_id, 'Main', 1000*unix_timestamp('2006-01-01 00:00:00'), 1000*unix_timestamp('2006-01-01 00:00:01'), -2, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='359137' AND begin=1000*unix_timestamp('1970-01-01 00:00:00') ),
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='0137' AND begin=1000*unix_timestamp('1970-01-01 00:00:00') )
);
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( @observatory_id, 'Main', 1000*unix_timestamp('2006-01-01 00:00:01'), 1000*unix_timestamp('2006-08-10 22:22:00'), -2, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='359137' AND begin=1000*unix_timestamp('1970-01-01 00:00:00') ),
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='0137' AND begin=1000*unix_timestamp('1970-01-01 00:00:00') )
);
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( @observatory_id, 'Main', 1000*unix_timestamp('2006-08-10 22:22:00'), 1000*unix_timestamp('2011-07-01 00:00:00'), -1.3, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='359137' AND begin=1000*unix_timestamp('1970-01-01 00:00:00') ),
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='0137' AND begin=1000*unix_timestamp('1970-01-01 00:00:00') )
);
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( @observatory_id, 'Main', 1000*unix_timestamp('2011-07-01 00:00:00'), 1000*unix_timestamp('2012-01-01 00:00:00'), -0.8, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='359137' AND begin=1000*unix_timestamp('1970-01-01 00:00:00') ),
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='0137' AND begin=1000*unix_timestamp('1970-01-01 00:00:00') )
);
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( @observatory_id, 'Main', 1000*unix_timestamp('2012-01-01 00:00:00'), NULL, -1, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='359137' AND begin=1000*unix_timestamp('1970-01-01 00:00:00') ),
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='0137' AND begin=1000*unix_timestamp('1970-01-01 00:00:00') )
);
/* set observatory.default_pier_id to Main */
/* Note: MySQL's prohibits using 'SELECT FROM' clauses for the target table in the SET and/or */
/* WHERE clauses - workaround via user-defined variables */
SELECT id
FROM pier
WHERE observatory_id=@observatory_id
  AND name = 'Main'
  AND begin = 1000*unix_timestamp('2012-01-01 00:00:00')
INTO @default_pier_id;

UPDATE observatory
SET default_pier_id = @default_pier_id
WHERE code = 'BRW';

/* add Mark='New Azimuth' */
INSERT INTO mark (pier_id, name, begin, end, azimuth)
VALUES (
  (SELECT id FROM pier WHERE observatory_id=@observatory_id
                         AND name='Main'
                         AND begin = 1000*unix_timestamp('2012-01-01 00:00:00') ),
   'New Azimuth', 1000*unix_timestamp('1970-01-01 00:00:00'), NULL, 7.9650
);

/* update pier.default_mark_id */
/* See note above explaining why user-defined variables are needed */
SELECT id
FROM pier
WHERE observatory_id=@observatory_id
  AND name='Main'
  AND begin = 1000*unix_timestamp('2012-01-01 00:00:00')
INTO @pier_id;

SELECT id
FROM mark
WHERE name = 'New Azimuth'
  AND begin = 1000*unix_timestamp('1970-01-01 00:00:00')
  AND pier_id = @pier_id
INTO @default_mark_id;

UPDATE PIER SET default_mark_id = @default_mark_id
WHERE id = @pier_id;
/* BSL - add observatory entry */
INSERT INTO observatory (name, code, location, latitude, longitude, geomagnetic_latitude, geomagnetic_longitude, elevation, orientation)
 VALUES ('Barrow (BSL)','BSL' ,'Point Barrow, AK','71.3225' ,'156.6231' ,'69.61' ,'246.26' ,'12' ,'HDZF');

/* get id of newly-added observatory row */
SELECT id FROM observatory WHERE code='BSL' INTO @observatory_id;

/* add BSL's instruments - note that there's no theodolite */
INSERT INTO instrument (observatory_id, serial_number, begin, end, name, type)
VALUES ( @observatory_id, '312713', 1000*unix_timestamp('1970-01-01 00:00:00'), NULL, 'Electronics', 'elec');

/* add pier=Main */
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( @observatory_id, 'Main', 1000*unix_timestamp('1970-01-01 00:00:00'), 1000*unix_timestamp('2007-01-01 00:00:00'), -1, NULL,
         ( SELECT id FROM instrument WHERE  observatory_id=@observatory_id AND serial_number='312713' AND begin=1000*unix_timestamp('1970-01-01 00:00:00')),
         NULL
);
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( @observatory_id, 'Main', 1000*unix_timestamp('2007-01-01 00:00:00'), 1000*unix_timestamp('2009-02-01 00:00:00'), 7.4, NULL,
         ( SELECT id FROM instrument WHERE  observatory_id=@observatory_id AND serial_number='312713' AND begin=1000*unix_timestamp('1970-01-01 00:00:00')),
         NULL
);
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( @observatory_id, 'Main', 1000*unix_timestamp('2009-02-01 00:00:00'), 1000*unix_timestamp('2009-03-01 00:00:00'), 3.5, NULL,
         ( SELECT id FROM instrument WHERE  observatory_id=@observatory_id AND serial_number='312713' AND begin=1000*unix_timestamp('1970-01-01 00:00:00')),
         NULL
);
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( @observatory_id, 'Main', 1000*unix_timestamp('2009-03-01 00:00:00'), 1000*unix_timestamp('2009-04-01 00:00:00'), 1.4, NULL,
         ( SELECT id FROM instrument WHERE  observatory_id=@observatory_id AND serial_number='312713' AND begin=1000*unix_timestamp('1970-01-01 00:00:00')),
         NULL
);
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( @observatory_id, 'Main', 1000*unix_timestamp('2009-04-01 00:00:00'), 1000*unix_timestamp('2009-05-01 00:00:00'), -0.6, NULL,
         ( SELECT id FROM instrument WHERE  observatory_id=@observatory_id AND serial_number='312713' AND begin=1000*unix_timestamp('1970-01-01 00:00:00')),
         NULL
);
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( @observatory_id, 'Main', 1000*unix_timestamp('2009-05-01 00:00:00'), 1000*unix_timestamp('2009-06-01 00:00:00'), -2.5, NULL,
         ( SELECT id FROM instrument WHERE  observatory_id=@observatory_id AND serial_number='312713' AND begin=1000*unix_timestamp('1970-01-01 00:00:00')),
         NULL
);
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( @observatory_id, 'Main', 1000*unix_timestamp('2009-06-01 00:00:00'), NULL, -4.2, NULL,
         ( SELECT id FROM instrument WHERE  observatory_id=@observatory_id AND serial_number='312713' AND begin=1000*unix_timestamp('1970-01-01 00:00:00')),
         NULL
);
/* set observatory.default_pier_id to Main */
/* Note: MySQL's prohibits using 'SELECT FROM' clauses for the target table in the SET and/or */
/* WHERE clauses - workaround via user-defined variables */
SELECT id
FROM pier
WHERE observatory_id=@observatory_id
  AND name = 'Main'
  AND begin = 1000*unix_timestamp('2009-06-01 00:00:00')
INTO @default_pier_id;

UPDATE observatory
SET default_pier_id = @default_pier_id
WHERE code = 'BSL';

UPDATE observatory
SET default_pier_id = (SELECT id FROM pier
                       WHERE observatory_id=@observatory_id
                         AND name = 'Main'
                         AND begin = 1000*unix_timestamp('2009-06-01 00:00:00')
                      )
WHERE code = 'BSL';

/* add Mark=Main */
INSERT INTO mark (pier_id, name, begin, end, azimuth)
VALUES (
  (SELECT id FROM pier WHERE observatory_id=@observatory_id
                         AND name='Main'
                         AND begin = 1000*unix_timestamp('2009-06-01 00:00:00') ),
   'Main', 1000*unix_timestamp('1970-01-01 00:00:00'), NULL, 176.6458
);

/* update pier.default_mark_id */
/* See note above explaining why user-defined variables are needed */
SELECT id
FROM pier
WHERE observatory_id=@observatory_id
  AND name='Main'
  AND begin = 1000*unix_timestamp('2009-06-01 00:00:00')
INTO @pier_id;

SELECT id
FROM mark
WHERE name = 'Main'
  AND begin = 1000*unix_timestamp('1970-01-01 00:00:00')
  AND pier_id = @pier_id
INTO @default_mark_id;

UPDATE PIER SET default_mark_id = @default_mark_id
WHERE id = @pier_id;
/* CMO - observatory entry */
INSERT INTO observatory (name, code, location, latitude, longitude, geomagnetic_latitude, geomagnetic_longitude, elevation, orientation, default_pier_id)
 VALUES ('College (CMO)','CMO' ,'Fairbanks, AK' ,'64.8742' ,'147.8597' ,'65.38' ,'261.63' ,'197' ,'HDZF', NULL);

/* get id of newly-added observatory row */
SELECT id FROM observatory WHERE code='CMO' INTO @observatory_id;

/* insert CMO's instruments */
INSERT INTO instrument (observatory_id, serial_number, begin, end, name, type)
VALUES ( @observatory_id, '200803', 1000*unix_timestamp('1970-01-01 00:00:00'), NULL, 'Electronics', 'elec');
INSERT INTO instrument (observatory_id, serial_number, begin, end, name, type)
VALUES ( @observatory_id, '0143', 1000*unix_timestamp('1970-01-01 00:00:00'), NULL, 'Theodolite', 'theo');

/* add pier=1A */
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( @observatory_id, '1A', 1000*unix_timestamp('1970-01-01 00:00:00'), 1000*unix_timestamp('2005-03-10 21:00:00'), 10, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='200803' AND begin=1000*unix_timestamp('1970-01-01 00:00:00') ),
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='0143' AND begin=1000*unix_timestamp('1970-01-01 00:00:00') )
);
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( @observatory_id, '1A', 1000*unix_timestamp('2005-03-10 21:00:00'), 1000*unix_timestamp('2005-06-01 00:00:00'), -11.5, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='200803' AND begin=1000*unix_timestamp('1970-01-01 00:00:00') ),
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='0143' AND begin=1000*unix_timestamp('1970-01-01 00:00:00') )
);
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( @observatory_id, '1A', 1000*unix_timestamp('2005-06-01 00:00:00'), 1000*unix_timestamp('2012-01-26 20:00:00'), 11.8, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='200803' AND begin=1000*unix_timestamp('1970-01-01 00:00:00') ),
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='0143' AND begin=1000*unix_timestamp('1970-01-01 00:00:00') )
);
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( @observatory_id, '1A', 1000*unix_timestamp('2012-01-26 20:00:00'), NULL, 10.5, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='200803' AND begin=1000*unix_timestamp('1970-01-01 00:00:00') ),
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='0143' AND begin=1000*unix_timestamp('1970-01-01 00:00:00') )
);
/* set observatory.default_pier_id to 1A */
/* Note: MySQL's prohibits using 'SELECT FROM' clauses for the target table in the SET and/or */
/* WHERE clauses - workaround via user-defined variables */
SELECT id
FROM pier
WHERE observatory_id=@observatory_id
  AND name = '1A'
  AND begin = 1000*unix_timestamp('2012-01-26 20:00:00')
INTO @default_pier_id;

UPDATE observatory
SET default_pier_id = @default_pier_id
WHERE code = 'CMO';

/* add  mark=Azimuth */
INSERT INTO mark (pier_id, name, begin, end, azimuth)
VALUES (
  (SELECT id FROM pier WHERE observatory_id=@observatory_id
                         AND name='1A'
                         AND begin = 1000*unix_timestamp('2012-01-26 20:00:00') ),
   'Azimuth', 1000*unix_timestamp('1970-01-01 00:00:00'), NULL, 27.5613
);

/* update pier.default_mark_ids */
/* See note above explaining why user-defined variables are needed */
SELECT id
FROM pier
WHERE observatory_id=@observatory_id
  AND name='1A'
  AND begin = 1000*unix_timestamp('2012-01-26 20:00:00')
INTO @pier_id;

SELECT id
FROM mark
WHERE name = 'Azimuth'
  AND begin = 1000*unix_timestamp('1970-01-01 00:00:00')
  AND pier_id = @pier_id
INTO @default_mark_id;

UPDATE PIER SET default_mark_id = @default_mark_id
WHERE id = @pier_id;
/* DED - add observatory entry */
INSERT INTO observatory (name, code, location, latitude, longitude, geomagnetic_latitude, geomagnetic_longitude, elevation, orientation)
 VALUES ('Deadhorse (DED)','DED' ,'Deadhorse, AK' ,'70.3552' ,'148.7928' ,NULL,NULL ,'10' ,'HDZF');

 /* get id of newly-added observatory row */
 SELECT id FROM observatory WHERE code='DED' INTO @observatory_id;

/* add DED's instruments */
INSERT INTO instrument (observatory_id, serial_number, begin, end, name, type)
VALUES ( @observatory_id, '808381', 1000*unix_timestamp( '1970-01-01 00:00:00'), NULL, 'Electronics', 'elec');
INSERT INTO instrument (observatory_id, serial_number, begin, end, name, type)
VALUES ( @observatory_id, '0095', 1000*unix_timestamp( '1970-01-01 00:00:00'), NULL, 'Theodolite', 'theo');

/* add pier=Main */
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( @observatory_id, 'Main', 1000*unix_timestamp('2010-03-22 00:00:00'), 1000*unix_timestamp( '2010-08-18 01:15:00'), 0.6, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='808381' AND begin=1000*unix_timestamp( '1970-01-01 00:00:00') ),
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='0095' AND begin=1000*unix_timestamp( '1970-01-01 00:00:00') )
);
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( @observatory_id, 'Main', 1000*unix_timestamp('2010-08-18 01:15:00'), NULL, -1.5, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='808381' AND begin=1000*unix_timestamp( '1970-01-01 00:00:00') ),
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='0095' AND begin=1000*unix_timestamp( '1970-01-01 00:00:00') )
);
/* set observatory.default_pier_id to Main */
/* Note: MySQL's prohibits using 'SELECT FROM' clauses for the target table in the SET and/or */
/* WHERE clauses - workaround via user-defined variables */
SELECT id
FROM pier
WHERE observatory_id=@observatory_id
  AND name = 'Main'
  AND begin = 1000*unix_timestamp('2010-08-18 01:15:00')
INTO @default_pier_id;

UPDATE observatory
SET default_pier_id = @default_pier_id
WHERE code = 'DED';

/* add Mark=Main */
INSERT INTO mark (pier_id, name, begin, end, azimuth)
VALUES (
  (SELECT id FROM pier WHERE observatory_id=@observatory_id
                         AND name='Main'
                         AND begin = 1000*unix_timestamp('2010-08-18 01:15:00') ),
   'Main', 1000*unix_timestamp( '1970-01-01 00:00:00'), NULL, 263.1269
);

/* update pier.default_mark_id */
/* See note above explaining why user-defined variables are needed */
SELECT id
FROM pier
WHERE observatory_id=@observatory_id
  AND name='Main'
  AND begin = 1000*unix_timestamp('2010-08-18 01:15:00')
INTO @pier_id;

SELECT id
FROM mark
WHERE name = 'Main'
  AND begin = 1000*unix_timestamp('1970-01-01 00:00:00')
  AND pier_id = @pier_id
INTO @default_mark_id;

UPDATE PIER SET default_mark_id = @default_mark_id
WHERE id = @pier_id;
/* FRD - add observatory entry */
INSERT INTO observatory (name, code, location, latitude, longitude, geomagnetic_latitude, geomagnetic_longitude, elevation, orientation)
 VALUES ('Fredericksburg (FRD)','FRD' ,'Corbin, VA','38.2047' ,'77.3729' ,'48.40' ,'353.38' ,'69' ,'HDZF');

/* get id of newly-added observatory row */
SELECT id FROM observatory WHERE code='FRD' INTO @observatory_id;

/* add FRD's instruments */
INSERT INTO instrument (observatory_id, serial_number, begin, end, name, type)
VALUES ( @observatory_id, '154155', 1000*unix_timestamp('1970-01-01 00:00:00'), NULL, 'Electronics', 'elec');
INSERT INTO instrument (observatory_id, serial_number, begin, end, name, type)
VALUES ( @observatory_id, '0109', 1000*unix_timestamp('1970-01-01 00:00:00'), NULL, 'Theodolite', 'theo');

/* add pier=Main */

INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( @observatory_id, '3D', 1000*unix_timestamp('1970-01-01 00:00:00'), 1000*unix_timestamp('2005-11-01 00:00:00'), -1.7, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='154155' AND begin=1000*unix_timestamp('1970-01-01 00:00:00') ),
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='0109' AND begin=1000*unix_timestamp('1970-01-01 00:00:00') )
);
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( @observatory_id, '3D', 1000*unix_timestamp('2005-11-01 00:00:00'), NULL, -4.6, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='154155' AND begin=1000*unix_timestamp('1970-01-01 00:00:00') ),
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='0109' AND begin=1000*unix_timestamp('1970-01-01 00:00:00') )
);
/* set observatory.default_pier_id to 3D */
/* Note: MySQL's prohibits using 'SELECT FROM' clauses for the target table in the SET and/or */
/* WHERE clauses - workaround via user-defined variables */
SELECT id
FROM pier
WHERE observatory_id=@observatory_id
  AND name = '3D'
  AND begin = 1000*unix_timestamp('2005-11-01 00:00:00')
INTO @default_pier_id;

UPDATE observatory
SET default_pier_id = @default_pier_id
WHERE code = 'FRD';

/* add Mark=West Monument */
INSERT INTO mark (pier_id, name, begin, end, azimuth)
VALUES (
  (SELECT id FROM pier WHERE observatory_id=@observatory_id
                         AND name='3D'
                         AND begin=1000*unix_timestamp('2005-11-01 00:00:00')),
   'West Monument', 1000*unix_timestamp('1970-01-01 00:00:00'), NULL, 13.4926
);

/* update pier.default_mark_id */
/* See note above explaining why user-defined variables are needed */
SELECT id
FROM pier
WHERE observatory_id=@observatory_id
  AND name='3D'
  AND begin=1000*unix_timestamp('2005-11-01 00:00:00')
INTO @pier_id;

SELECT id
FROM mark
WHERE name = 'West Monument'
  AND begin = 1000*unix_timestamp('1970-01-01 00:00:00')
  AND pier_id = @pier_id
INTO @default_mark_id;

UPDATE PIER SET default_mark_id = @default_mark_id
WHERE id = @pier_id;
/* FRN - add observatory entry */
INSERT INTO observatory (name, code, location, latitude, longitude, geomagnetic_latitude, geomagnetic_longitude, elevation, orientation)
 VALUES ('Fresno (FRN)','FRN','ONeals, CA','37.0913' ,'119.7193' ,'43.52' ,'305.25' ,'331' ,'HDZF');

/* get id of newly-added observatory row */
SELECT id FROM observatory WHERE code='FRN' INTO @observatory_id;

/* add FRN's instruments */
INSERT INTO instrument (observatory_id, serial_number, begin, end, name, type)
VALUES ( @observatory_id, '154181', 1000*unix_timestamp('1970-01-01 00:00:00'), NULL, 'Electronics', 'elec');
INSERT INTO instrument (observatory_id, serial_number, begin, end, name, type)
VALUES ( @observatory_id, '140', 1000*unix_timestamp('1970-01-01 00:00:00'), NULL, 'Theodolite', 'theo');

/* add pier=Main */
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( @observatory_id, 'Main', 1000*unix_timestamp('1970-01-01 00:00:00'), 1000*unix_timestamp('2006-01-01 00:01:00'), 35.5, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='154181' AND begin=1000*unix_timestamp('1970-01-01 00:00:00') ),
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='140' AND begin=1000*unix_timestamp('1970-01-01 00:00:00') )
);
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( @observatory_id, 'Main', 1000*unix_timestamp('2006-01-01 00:01:00'), 1000*unix_timestamp('2005-06-01 00:00:00'), 32.5, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='154181' AND begin=1000*unix_timestamp('1970-01-01 00:00:00') ),
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='140' AND begin=1000*unix_timestamp('1970-01-01 00:00:00') )
);
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( @observatory_id, 'Main', 1000*unix_timestamp('2005-06-01 00:00:00'), 1000*unix_timestamp('2009-01-01 00:00:00'), -7.1, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='154181' AND begin=1000*unix_timestamp('1970-01-01 00:00:00') ),
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='140' AND begin=1000*unix_timestamp('1970-01-01 00:00:00') )
);
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( @observatory_id, 'Main', 1000*unix_timestamp('2009-01-01 00:00:00'), 1000*unix_timestamp('2009-02-01 00:00:00'), -9.2, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='154181' AND begin=1000*unix_timestamp('1970-01-01 00:00:00') ),
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='140' AND begin=1000*unix_timestamp('1970-01-01 00:00:00') )
);
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( @observatory_id, 'Main', 1000*unix_timestamp('2009-02-01 00:00:00'), 1000*unix_timestamp('2009-03-01 00:00:00'), -11.3, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='154181' AND begin=1000*unix_timestamp('1970-01-01 00:00:00') ),
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='140' AND begin=1000*unix_timestamp('1970-01-01 00:00:00') )
);
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( @observatory_id, 'Main', 1000*unix_timestamp('2009-03-01 00:00:00'), 1000*unix_timestamp('2009-04-01 00:00:00'), -13.4, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='154181' AND begin=1000*unix_timestamp('1970-01-01 00:00:00') ),
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='140' AND begin=1000*unix_timestamp('1970-01-01 00:00:00') )
);
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( @observatory_id, 'Main', 1000*unix_timestamp('2009-04-01 00:00:00'), NULL, -15.5, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='154181' AND begin=1000*unix_timestamp('1970-01-01 00:00:00') ),
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='140' AND begin=1000*unix_timestamp('1970-01-01 00:00:00') )
);
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( @observatory_id, 'Default', 1000*unix_timestamp('2009-04-01 00:00:00'), NULL, -15.5, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='154181' AND begin=1000*unix_timestamp('1970-01-01 00:00:00') ),
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='140' AND begin=1000*unix_timestamp('1970-01-01 00:00:00') )
);
/* set observatory.default_pier_id to Main */
/* Note: MySQL's prohibits using 'SELECT FROM' clauses for the target table in the SET and/or */
/* WHERE clauses - workaround via user-defined variables */
SELECT id
FROM pier
WHERE observatory_id=@observatory_id
  AND name = 'Main'
  AND begin = 1000*unix_timestamp('2009-04-01 00:00:00')
INTO @default_pier_id;

UPDATE observatory
SET default_pier_id = @default_pier_id
WHERE code = 'FRN';

/* add Mark=Azimuth Pin */
INSERT INTO mark (pier_id, name, begin, end, azimuth)
VALUES (
  (SELECT id FROM pier WHERE observatory_id=@observatory_id
                         AND name='Main'
                         AND begin=1000*unix_timestamp('2009-04-01 00:00:00') ),
   'Azimuth Pin', 1000*unix_timestamp('1970-01-01 00:00:00'), NULL, 16.75
);
INSERT INTO mark (pier_id, name, begin, end, azimuth)
VALUES (
  (SELECT id FROM pier WHERE observatory_id=@observatory_id
                         AND name='Default'
                         AND begin=1000*unix_timestamp('2009-04-01 00:00:00') ),
   'Default', 1000*unix_timestamp('1970-01-01 00:00:00'), NULL, 16.75
);

/* update pier.default_mark_id */
/* See note above explaining why user-defined variables are needed */SELECT id
FROM pier
WHERE observatory_id=@observatory_id
  AND name='Main'
  AND begin=1000*unix_timestamp('2009-04-01 00:00:00')
INTO @pier_id;

SELECT id
FROM mark
WHERE name = 'Azimuth Pin'
  AND begin = 1000*unix_timestamp('1970-01-01 00:00:00')
  AND pier_id = @pier_id
INTO @default_mark_id;

UPDATE PIER SET default_mark_id = @default_mark_id
WHERE id = @pier_id;
/* GUA - add observatory entry */
INSERT INTO observatory (name, code, location, latitude, longitude, geomagnetic_latitude, geomagnetic_longitude, elevation, orientation)
 VALUES ('Guam (GUA)','GUA','Dededo, Guam','13.5895' ,'144.8694' ,'5.30' ,'215.64' ,'140' ,'HDZF');

/* get id of newly-added observatory row */
SELECT id FROM observatory WHERE code='GUA' INTO @observatory_id;

/* add GUA's instruments */
INSERT INTO instrument (observatory_id, serial_number, begin, end, name, type)
VALUES ( @observatory_id, '808075', 1000*unix_timestamp('1970-01-01 00:00:00'), NULL, 'Electronics', 'elec');
INSERT INTO instrument (observatory_id, serial_number, begin, end, name, type)
VALUES ( @observatory_id, '030', 1000*unix_timestamp('1970-01-01 00:00:00'), NULL, 'Theodolite', 'theo');

/* add pier=West */

INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( @observatory_id, 'West', 1000*unix_timestamp('1970-01-01 00:00:00'), 1000*unix_timestamp('2005-01-01 00:00:00'), -49, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='808075' AND begin=1000*unix_timestamp('1970-01-01 00:00:00') ),
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='030' AND begin=1000*unix_timestamp('1970-01-01 00:00:00') )
);
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( @observatory_id, 'West', 1000*unix_timestamp('2005-01-01 00:00:00'), 1000*unix_timestamp('2003-08-01 00:00:00'), -46, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='808075' AND begin=1000*unix_timestamp('1970-01-01 00:00:00') ),
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='030' AND begin=1000*unix_timestamp('1970-01-01 00:00:00') )
);
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( @observatory_id, 'West', 1000*unix_timestamp('2003-08-01 00:00:00'), 1000*unix_timestamp('2007-09-25 04:58:00'), 12.5, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='808075' AND begin=1000*unix_timestamp('1970-01-01 00:00:00') ),
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='030' AND begin=1000*unix_timestamp('1970-01-01 00:00:00') )
);
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( @observatory_id, 'West', 1000*unix_timestamp('2007-09-25 04:58:00'), 1000*unix_timestamp('2013-04-01 00:00:00'), 9.6, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='808075' AND begin=1000*unix_timestamp('1970-01-01 00:00:00') ),
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='030' AND begin=1000*unix_timestamp('1970-01-01 00:00:00') )
);
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( @observatory_id, 'West', 1000*unix_timestamp('2013-04-01 00:00:00'), NULL, 7.9, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='808075' AND begin=1000*unix_timestamp('1970-01-01 00:00:00') ),
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='030' AND begin=1000*unix_timestamp('1970-01-01 00:00:00') )
);
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( @observatory_id, 'Main', 1000*unix_timestamp('2007-09-25 04:58:00'), 1000*unix_timestamp('2013-04-01 00:00:00'), 9.6, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='808075' AND begin=1000*unix_timestamp('1970-01-01 00:00:00') ),
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='030' AND begin=1000*unix_timestamp('1970-01-01 00:00:00') )
);
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( @observatory_id, 'Main', 1000*unix_timestamp('2013-04-01 00:00:00'), NULL, 7.9, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='808075' AND begin=1000*unix_timestamp('1970-01-01 00:00:00') ),
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='030' AND begin=1000*unix_timestamp('1970-01-01 00:00:00') )
);

/* set observatory.default_pier_id to West */
/* Note: MySQL's prohibits using 'SELECT FROM' clauses for the target table in the SET and/or */
/* WHERE clauses - workaround via user-defined variables */
SELECT id
FROM pier
WHERE observatory_id=@observatory_id
  AND name = 'West'
  AND begin = 1000*unix_timestamp('2013-04-01 00:00:00')
INTO @default_pier_id;

UPDATE observatory
SET default_pier_id = @default_pier_id
WHERE code = 'GUA';

/* add Mark=South Monument */
INSERT INTO mark (pier_id, name, begin, end, azimuth)
VALUES (
  (SELECT id FROM pier WHERE observatory_id=@observatory_id
                         AND name='West'
                         AND begin = 1000*unix_timestamp('2013-04-01 00:00:00') ),
   'South Monument', 1000*unix_timestamp('1970-01-01 00:00:00'), NULL, 2.5233
);
INSERT INTO mark (pier_id, name, begin, end, azimuth)
VALUES (
  (SELECT id FROM pier WHERE observatory_id=@observatory_id
                         AND name='Main'
                         AND begin = 1000*unix_timestamp('2013-04-01 00:00:00') ),
   'Azimuth', 1000*unix_timestamp('1970-01-01 00:00:00'), NULL, 2.5233
);

/* update pier.default_mark_id */
/* See note above explaining why user-defined variables are needed */
SELECT id
FROM pier
WHERE observatory_id=@observatory_id
  AND name='West'
  AND begin = 1000*unix_timestamp('2013-04-01 00:00:00')
INTO @pier_id;

SELECT id
FROM mark
WHERE name = 'South Monument'
  AND begin = 1000*unix_timestamp('1970-01-01 00:00:00')
  AND pier_id = @pier_id
INTO @default_mark_id;

UPDATE PIER SET default_mark_id = @default_mark_id
WHERE id = @pier_id;
/* HON - add observatory entry */
INSERT INTO observatory (name, code, location, latitude, longitude, geomagnetic_latitude, geomagnetic_longitude, elevation, orientation)
 VALUES ('Honolulu (HON)','HON','Ewa Beach, HI','21.3166' ,'157.9996' ,'21.64' ,'269.74' ,'4' ,'HDZF');

/* get id of newly-added observatory row */
SELECT id FROM observatory WHERE code='HON' INTO @observatory_id;

/* add HON's instruments - note that there's no theodolite */
INSERT INTO instrument (observatory_id, serial_number, begin, end, name, type)
VALUES ( @observatory_id, '313836', 1000*unix_timestamp('1970-01-01 00:00:00'), NULL, 'Electronics', 'elec');

/* add pier=Main */
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( @observatory_id, 'Main', 1000*unix_timestamp('1970-01-01 00:00:00'), 1000*unix_timestamp('2001-08-23 03:00:00'), 19.6, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='313836' AND begin=1000*unix_timestamp('1970-01-01 00:00:00') ),
         NULL
);
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( @observatory_id, 'Main', 1000*unix_timestamp('2001-08-23 03:00:00'), 1000*unix_timestamp('2004-12-01 00:00:00'), 14, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='313836' AND begin=1000*unix_timestamp('1970-01-01 00:00:00') ),
         NULL
);
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( @observatory_id, 'Main', 1000*unix_timestamp('2004-12-01 00:00:00'), 1000*unix_timestamp('2010-01-01 00:00:00'), 17.5, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='313836' AND begin=1000*unix_timestamp('1970-01-01 00:00:00') ),
         NULL
);
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( @observatory_id, 'Main', 1000*unix_timestamp('2010-01-01 00:00:00'), NULL, 14.5, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='313836' AND begin=1000*unix_timestamp('1970-01-01 00:00:00') ),
         NULL
);

/* set observatory.default_pier_id to Main */
/* Note: MySQL's prohibits using 'SELECT FROM' clauses for the target table in the SET and/or */
/* WHERE clauses - workaround via user-defined variables */
SELECT id
FROM pier
WHERE observatory_id=@observatory_id
  AND name = 'Main'
  AND begin = 1000*unix_timestamp('2010-01-01 00:00:00')
INTO @default_pier_id;

UPDATE observatory
SET default_pier_id = @default_pier_id
WHERE code = 'HON';

/* add Mark=Main Azimuth */
INSERT INTO mark (pier_id, name, begin, end, azimuth)
VALUES (
  (SELECT id FROM pier WHERE observatory_id=@observatory_id
                         AND name='Main'
                         AND begin = 1000*unix_timestamp('2010-01-01 00:00:00') ),
   'Main Azimuth', 1000*unix_timestamp('1970-01-01 00:00:00'), NULL, 142.6483
);
INSERT INTO mark (pier_id, name, begin, end, azimuth)
VALUES (
  (SELECT id FROM pier WHERE observatory_id=@observatory_id
                         AND name='Main'
                         AND begin = 1000*unix_timestamp('2010-01-01 00:00:00') ),
   'Main', 1000*unix_timestamp('1970-01-01 00:00:00'), NULL, 142.6483
);
INSERT INTO mark (pier_id, name, begin, end, azimuth)
VALUES (
  (SELECT id FROM pier WHERE observatory_id=@observatory_id
                         AND name='Main'
                         AND begin = 1000*unix_timestamp('2010-01-01 00:00:00') ),
   'Main', 1000*unix_timestamp('1970-01-01 00:00:00'), NULL, 142.3217
);

/* update pier.default_mark_id */
/* See note above explaining why user-defined variables are needed */
SELECT id
FROM pier
WHERE observatory_id=@observatory_id
  AND name='Main'
  AND begin = 1000*unix_timestamp('2010-01-01 00:00:00')
INTO @pier_id;

SELECT id
FROM mark
WHERE name = 'Main Azimuth'
  AND begin = 1000*unix_timestamp('1970-01-01 00:00:00')
  AND pier_id = @pier_id
INTO @default_mark_id;

UPDATE PIER SET default_mark_id = @default_mark_id
WHERE id = @pier_id;
/* NEW - add observatory entry */
INSERT INTO observatory (name, code, location, latitude, longitude, geomagnetic_latitude, geomagnetic_longitude, elevation, orientation)
 VALUES ('Newport (NEW)','NEW','Colville National Forest, WA','48.2649' ,'117.1231' ,'54.85' ,'304.68' ,'770' ,'HDZF');

/* get id of newly-added observatory row */
SELECT id FROM observatory WHERE code='NEW' INTO @observatory_id;

/* add NEW's instruments */
INSERT INTO instrument (observatory_id, serial_number, begin, end, name, type)
VALUES ( @observatory_id, '152320', 1000*unix_timestamp('1970-01-01 00:00:00'), NULL, 'Electronics', 'elec');
INSERT INTO instrument (observatory_id, serial_number, begin, end, name, type)
VALUES ( @observatory_id, '0142', 1000*unix_timestamp('1970-01-01 00:00:00'), NULL, 'Theodolite', 'theo');

/* add pier=Main */
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( @observatory_id, 'Main', 1000*unix_timestamp('1970-01-01 00:00:00'), 1000*unix_timestamp('2002-03-04 23:00:00'), -5, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='152320' AND begin=1000*unix_timestamp('1970-01-01 00:00:00') ),
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='0142' AND begin=1000*unix_timestamp('1970-01-01 00:00:00') )
);
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( @observatory_id, 'Main', 1000*unix_timestamp('2002-03-04 23:00:00'), 1000*unix_timestamp('2002-03-23 05:45:00'), -6, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='152320' AND begin=1000*unix_timestamp('1970-01-01 00:00:00') ),
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='0142' AND begin=1000*unix_timestamp('1970-01-01 00:00:00') )
);
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( @observatory_id, 'Main', 1000*unix_timestamp('2002-03-23 05:45:00'), 1000*unix_timestamp('2005-11-01 01:00:00'), -5, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='152320' AND begin=1000*unix_timestamp('1970-01-01 00:00:00') ),
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='0142' AND begin=1000*unix_timestamp('1970-01-01 00:00:00') )
);
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( @observatory_id, 'Main', 1000*unix_timestamp('2005-11-01 01:00:00'), 1000*unix_timestamp('2006-01-01 00:01:00'), -6.2, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='152320' AND begin=1000*unix_timestamp('1970-01-01 00:00:00') ),
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='0142' AND begin=1000*unix_timestamp('1970-01-01 00:00:00') )
);
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( @observatory_id, 'Main', 1000*unix_timestamp('2006-01-01 00:01:00'), 1000*unix_timestamp('2006-02-06 17:15:00'), -5, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='152320' AND begin=1000*unix_timestamp('1970-01-01 00:00:00') ),
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='0142' AND begin=1000*unix_timestamp('1970-01-01 00:00:00') )
);
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( @observatory_id, 'Main', 1000*unix_timestamp('2006-02-06 17:15:00'), 1000*unix_timestamp('2007-05-15 19:00:00'), -6.2, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='152320' AND begin=1000*unix_timestamp('1970-01-01 00:00:00') ),
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='0142' AND begin=1000*unix_timestamp('1970-01-01 00:00:00') )
);
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( @observatory_id, 'Main', 1000*unix_timestamp('2007-05-15 19:00:00'), 1000*unix_timestamp('2012-05-10 00:00:00'), -4.2, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='152320' AND begin=1000*unix_timestamp('1970-01-01 00:00:00') ),
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='0142' AND begin=1000*unix_timestamp('1970-01-01 00:00:00') )
);
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( @observatory_id, 'Main', 1000*unix_timestamp('2012-05-10 00:00:00'), NULL, -7.1, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='152320' AND begin=1000*unix_timestamp('1970-01-01 00:00:00') ),
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='0142' AND begin=1000*unix_timestamp('1970-01-01 00:00:00') )
);
/* set observatory.default_pier_id to Main */
/* Note: MySQL's prohibits using 'SELECT FROM' clauses for the target table in the SET and/or */
/* WHERE clauses - workaround via user-defined variables */
SELECT id
FROM pier
WHERE observatory_id=@observatory_id
  AND name = 'Main'
  AND begin = 1000*unix_timestamp('2012-05-10 00:00:00')
INTO @default_pier_id;

UPDATE observatory
SET default_pier_id = @default_pier_id
WHERE code = 'NEW';

/* add Mark=Main */
INSERT INTO mark (pier_id, name, begin, end, azimuth)
VALUES (
  (SELECT id FROM pier WHERE observatory_id=@observatory_id
                         AND name='Main'
                         AND begin=1000*unix_timestamp('2012-05-10 00:00:00') ),
   'Main', 1000*unix_timestamp('1970-01-01 00:00:00'), NULL, 16.955
);

/* update pier.default_mark_id */
/* See note above explaining why user-defined variables are needed */
SELECT id
FROM pier
WHERE observatory_id=@observatory_id
  AND name='Main'
  AND begin=1000*unix_timestamp('2012-05-10 00:00:00')
INTO @pier_id;

SELECT id
FROM mark
WHERE name = 'Main'
  AND begin = 1000*unix_timestamp('1970-01-01 00:00:00')
  AND pier_id = @pier_id
INTO @default_mark_id;

UPDATE PIER SET default_mark_id = @default_mark_id
WHERE id = @pier_id;
/* SHU - add observatory entry */
INSERT INTO observatory (name, code, location, latitude, longitude, geomagnetic_latitude, geomagnetic_longitude, elevation, orientation)
 VALUES ('Shumagin (SHU)','SHU','Sand Point, Popof, AK' ,'55.3472' ,'160.4644' ,'256.78' ,'160.46' ,'80' ,'HDZF');

/* get id of newly-added observatory row */
SELECT id FROM observatory WHERE code='SHU' INTO @observatory_id;

/* add SHU's instruments - not that there's no theodolite */
INSERT INTO instrument (observatory_id, serial_number, begin, end, name, type)
VALUES ( @observatory_id, '613997', 1000*unix_timestamp('1970-01-01 00:00:00'), NULL, 'Electronics', 'elec');

/* add pier=Main */
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( @observatory_id, 'Main', 1000*unix_timestamp('2003-10-01 00:00:00'), 1000*unix_timestamp('2008-08-01 00:30:00'), 11.8, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='613997' AND begin=1000*unix_timestamp('1970-01-01 00:00:00' )),
         NULL
);
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( @observatory_id, 'Main', 1000*unix_timestamp('2008-08-01 00:30:00'), NULL, 13.1, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='613997' AND begin=1000*unix_timestamp('1970-01-01 00:00:00' )),
         NULL
);

/* set observatory.default_pier_id to Main */
/* Note: MySQL's prohibits using 'SELECT FROM' clauses for the target table in the SET and/or */
/* WHERE clauses - workaround via user-defined variables */
SELECT id
FROM pier
WHERE observatory_id=@observatory_id
  AND name = 'Main'
  AND begin = 1000*unix_timestamp('2008-08-01 00:30:00')
INTO @default_pier_id;

UPDATE observatory
SET default_pier_id = @default_pier_id
WHERE code = 'SHU';

/* add Mark=Azimuth */
INSERT INTO mark (pier_id, name, begin, end, azimuth)
VALUES (
  (SELECT id FROM pier WHERE observatory_id=@observatory_id
                         AND name='Main'
                         AND begin=1000*unix_timestamp('2008-08-01 00:30:00') ),
   'Azimuth', 1000*unix_timestamp('1970-01-01 00:00:00'), NULL, 179.775
);

/* update pier.default_mark_id */
/* See note above explaining why user-defined variables are needed */
SELECT id
FROM pier
WHERE observatory_id=@observatory_id
  AND name='Main'
  AND begin=1000*unix_timestamp('2008-08-01 00:30:00')
INTO @pier_id;

SELECT id
FROM mark
WHERE name = 'Azimuth'
  AND begin = 1000*unix_timestamp('1970-01-01 00:00:00')
  AND pier_id = @pier_id
INTO @default_mark_id;

UPDATE PIER SET default_mark_id = @default_mark_id
WHERE id = @pier_id;
/* SIT - add observatory entry */
INSERT INTO observatory (name, code, location, latitude, longitude, geomagnetic_latitude, geomagnetic_longitude, elevation, orientation)
 VALUES ('Sitka (SIT)','SIT','Sitka, AK','57.0576' ,'135.3273' ,'60.34' ,'280.35' ,'24' ,'HDZF');

/* get id of newly-added observatory row */
SELECT id FROM observatory WHERE code='SIT' INTO @observatory_id;

/* add SIT's instruments */
INSERT INTO instrument (observatory_id, serial_number, begin, end, name, type)
VALUES ( @observatory_id, '351101', 1000*unix_timestamp('1970-01-01 00:00:00'), NULL, 'Electronics', 'elec');
INSERT INTO instrument (observatory_id, serial_number, begin, end, name, type)
VALUES ( @observatory_id, '0138', 1000*unix_timestamp('1970-01-01 00:00:00'), NULL, 'Theodolite', 'theo');

/* add pier=Main */
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( @observatory_id, 'Main', 1000*unix_timestamp('1970-01-01 00:00:00'), 1000*unix_timestamp('2007-05-08 00:00:00'), -2, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='351101' AND begin=1000*unix_timestamp('1970-01-01 00:00:00') ),
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='0138' AND begin=1000*unix_timestamp('1970-01-01 00:00:00') )
);
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( @observatory_id, 'Main', 1000*unix_timestamp('2007-05-08 00:00:00'), NULL, 3.2, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='351101' AND begin=1000*unix_timestamp('1970-01-01 00:00:00') ),
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='0138' AND begin=1000*unix_timestamp('1970-01-01 00:00:00') )
);
/* set observatory.default_pier_id to Main */
/* Note: MySQL's prohibits using 'SELECT FROM' clauses for the target table in the SET and/or */
/* WHERE clauses - workaround via user-defined variables */
SELECT id
FROM pier
WHERE observatory_id=@observatory_id
  AND name = 'Main'
  AND begin = 1000*unix_timestamp('2007-05-08 00:00:00')
INTO @default_pier_id;

UPDATE observatory
SET default_pier_id = @default_pier_id
WHERE code = 'SIT';

/* add Mark=Azimuth */
INSERT INTO mark (pier_id, name, begin, end, azimuth)
VALUES (
  (SELECT id FROM pier WHERE observatory_id=@observatory_id
                         AND name='Main'
                         AND begin=1000*unix_timestamp('2007-05-08 00:00:00')),
   'Azimuth', 1000*unix_timestamp('1970-01-01 00:00:00'), NULL, 35.525
);

/* update pier.default_mark_id */
/* See note above explaining why user-defined variables are needed */
SELECT id
FROM pier
WHERE observatory_id=@observatory_id
  AND name='Main'
  AND begin=1000*unix_timestamp('2007-05-08 00:00:00')
INTO @pier_id;

SELECT id
FROM mark
WHERE name = 'Azimuth'
  AND begin = 1000*unix_timestamp('1970-01-01 00:00:00')
  AND pier_id = @pier_id
INTO @default_mark_id;

UPDATE PIER SET default_mark_id = @default_mark_id
WHERE id = @pier_id;
/* SJG - add observatory entry */
INSERT INTO observatory (name, code, location, latitude, longitude, geomagnetic_latitude, geomagnetic_longitude, elevation, orientation)
 VALUES ('San Juan (SJG)','SJG','Cayey, PR','18.1110' ,'66.1498' ,'28.31' ,'6.08' ,'424' ,'HDZF');

/* get id of newly-added observatory row */
SELECT id FROM observatory WHERE code='SJG' INTO @observatory_id;

/* add SJG's instruments */
INSERT INTO instrument (observatory_id, serial_number, begin, end, name, type)
VALUES ( @observatory_id, '154162', 1000*unix_timestamp('1970-01-01 00:00:00'), NULL, 'Electronics', 'elec');
INSERT INTO instrument (observatory_id, serial_number, begin, end, name, type)
VALUES ( @observatory_id, '0126', 1000*unix_timestamp('1970-01-01 00:00:00'), NULL, 'Theodolite', 'theo');

/* add pier=Main */
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( @observatory_id, 'Main', 1000*unix_timestamp('1970-01-01 00:00:00'), 1000*unix_timestamp('2003-01-01 00:00:01'), 43.5, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='154162' AND begin=1000*unix_timestamp('1970-01-01 00:00:00') ),
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='0126' AND begin=1000*unix_timestamp('1970-01-01 00:00:00') )
);
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( @observatory_id, 'Main', 1000*unix_timestamp('2003-01-01 00:00:01'), 1000*unix_timestamp('2003-01-16 00:00:00'), 46, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='154162' AND begin=1000*unix_timestamp('1970-01-01 00:00:00') ),
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='0126' AND begin=1000*unix_timestamp('1970-01-01 00:00:00') )
);
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( @observatory_id, 'Main', 1000*unix_timestamp('2003-01-16 00:00:00'), 1000*unix_timestamp('2008-01-18 14:00:00'), -51.7, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='154162' AND begin=1000*unix_timestamp('1970-01-01 00:00:00') ),
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='0126' AND begin=1000*unix_timestamp('1970-01-01 00:00:00') )
);
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( @observatory_id, 'Main', 1000*unix_timestamp('2008-01-18 14:00:00'), NULL, -55, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='154162' AND begin=1000*unix_timestamp('1970-01-01 00:00:00') ),
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='0126' AND begin=1000*unix_timestamp('1970-01-01 00:00:00') )
);
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( @observatory_id, 'N', 1000*unix_timestamp('1970-01-01 00:00:00'), NULL, -55, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='154162' AND begin=1000*unix_timestamp('1970-01-01 00:00:00') ),
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='0126' AND begin=1000*unix_timestamp('1970-01-01 00:00:00') )
);
/* set observatory.default_pier_id to Main */
/* Note: MySQL's prohibits using 'SELECT FROM' clauses for the target table in the SET and/or */
/* WHERE clauses - workaround via user-defined variables */
SELECT id
FROM pier
WHERE observatory_id=@observatory_id
  AND name = 'Main'
  AND begin = 1000*unix_timestamp('2008-01-18 14:00:00')
INTO @default_pier_id;

UPDATE observatory
SET default_pier_id = @default_pier_id
WHERE code = 'SJG';

/* add Mark=Main */
INSERT INTO mark (pier_id, name, begin, end, azimuth)
VALUES (
  (SELECT id FROM pier WHERE observatory_id=@observatory_id
                         AND name='Main'
                         AND begin=1000*unix_timestamp('2008-01-18 14:00:00') ),
   'Main', 1000*unix_timestamp('1970-01-01 00:00:00'), NULL, 117.3116
);
INSERT INTO mark (pier_id, name, begin, end, azimuth)
VALUES (
  (SELECT id FROM pier WHERE observatory_id=@observatory_id
                         AND name='N'
                         AND begin=1000*unix_timestamp('1970-01-01 00:00:00') ),
   'Main', 1000*unix_timestamp('1970-01-01 00:00:00'), NULL, 63.6506
);

/* update pier.default_mark_id */
/* See note above explaining why user-defined variables are needed */
SELECT id
FROM pier
WHERE observatory_id=@observatory_id
  AND name='Main'
  AND begin=1000*unix_timestamp('2008-01-18 14:00:00')
INTO @pier_id;

SELECT id
FROM mark
WHERE name = 'Main'
  AND begin = 1000*unix_timestamp('1970-01-01 00:00:00')
  AND pier_id = @pier_id
INTO @default_mark_id;

UPDATE PIER SET default_mark_id = @default_mark_id
WHERE id = @pier_id;
/* TUC - add observatory entry */
INSERT INTO observatory (name, code, location, latitude, longitude, geomagnetic_latitude, geomagnetic_longitude, elevation, orientation)
 VALUES ('Tucson (TUC)','TUC','Tucson, AZ','32.1745' ,'110.7337' ,'39.88' ,'316.11' ,'946' ,'HDZF');

/* get id of newly-added observatory row */
SELECT id FROM observatory WHERE code='TUC' INTO @observatory_id;

/* add TUC's instruments - two pairs*/
/* this is the original epoch */
INSERT INTO instrument (observatory_id, serial_number, begin, end, name, type)
VALUES ( @observatory_id, '808075', 1000*unix_timestamp('1970-01-01 00:00:00'), 1000*unix_timestamp('2012-05-27 23:59:59'), 'Electronics', 'elec');
INSERT INTO instrument (observatory_id, serial_number, begin, end, name, type)
VALUES ( @observatory_id, '003', 1000*unix_timestamp('1970-01-01 00:00:00'), 1000*unix_timestamp('2012-05-27 23:59:59'), 'Theodolite', 'theo');
/* instruments changed on 05-28-2012 */
INSERT INTO instrument (observatory_id, serial_number, begin, end, name, type)
VALUES ( @observatory_id, '150324', 1000*unix_timestamp('2012-05-28 00:00:00'), NULL, 'Electronics', 'elec');
INSERT INTO instrument (observatory_id, serial_number, begin, end, name, type)
VALUES ( @observatory_id, '141', 1000*unix_timestamp('2012-05-28 00:00:00'), NULL, 'Theodolite', 'theo');

/* Add piers - This observatory has a complex pier history (fortunately all have same name=Main) */
/* this is the first epoch */
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( @observatory_id, 'Main', 1000*unix_timestamp('1970-01-01 00:00:00'), 1000*unix_timestamp('2005-11-01 00:00:00'), -3.7, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='808075' AND begin=1000*unix_timestamp('1970-01-01 00:00:00') ),
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='003' AND begin=1000*unix_timestamp('1970-01-01 00:00:00') )
);
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( @observatory_id, 'Main', 1000*unix_timestamp('2005-11-01 00:00:00'), 1000*unix_timestamp('2006-04-14 00:00:00'), -3.7, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='808075' AND begin=1000*unix_timestamp('1970-01-01 00:00:00') ),
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='003' AND begin=1000*unix_timestamp('1970-01-01 00:00:00') )
);
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( @observatory_id, 'Main', 1000*unix_timestamp('2006-04-14 00:00:00'), 1000*unix_timestamp('2011-01-01 00:00:00'), -2.3, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='808075' AND begin=1000*unix_timestamp('1970-01-01 00:00:00') ),
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='003' AND begin=1000*unix_timestamp('1970-01-01 00:00:00') )
);
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( @observatory_id, 'Main', 1000*unix_timestamp('2011-01-01 00:00:00'), 1000*unix_timestamp('2011-02-01 00:00:00'), -3, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='808075' AND begin=1000*unix_timestamp('1970-01-01 00:00:00') ),
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='003' AND begin=1000*unix_timestamp('1970-01-01 00:00:00') )
);
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( @observatory_id, 'Main', 1000*unix_timestamp('2011-02-01 00:00:00'), 1000*unix_timestamp('2011-03-01 00:00:00'), -4, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='808075' AND begin=1000*unix_timestamp('1970-01-01 00:00:00') ),
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='003' AND begin=1000*unix_timestamp('1970-01-01 00:00:00') )
);
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( @observatory_id, 'Main', 1000*unix_timestamp('2011-03-01 00:00:00'), 1000*unix_timestamp('2012-01-01 00:00:00'), -4.8, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='808075' AND begin=1000*unix_timestamp('1970-01-01 00:00:00') ),
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='003' AND begin=1000*unix_timestamp('1970-01-01 00:00:00') )
);
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( @observatory_id, 'Main', 1000*unix_timestamp('2012-01-01 00:00:00'), 1000*unix_timestamp('2012-08-21 00:00:00'), -5.4, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='808075' AND begin=1000*unix_timestamp('1970-01-01 00:00:00') ),
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='003' AND begin=1000*unix_timestamp('1970-01-01 00:00:00') )
);
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( @observatory_id, 'Main', 1000*unix_timestamp('2012-08-21 00:00:00'), NULL, -4.7, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='808075' AND begin=1000*unix_timestamp('1970-01-01 00:00:00') ),
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='003' AND begin=1000*unix_timestamp('1970-01-01 00:00:00') )
);

/* set observatory.default_pier_id to Main */
/* Note: MySQL's prohibits using 'SELECT FROM' clauses for the target table in the SET and/or */
/* WHERE clauses - workaround via user-defined variables */
SELECT id
FROM pier
WHERE observatory_id=@observatory_id
  AND name = 'Main'
  AND begin = 1000*unix_timestamp('2012-08-21 00:00:00')
INTO @default_pier_id;

UPDATE observatory
SET default_pier_id = @default_pier_id
WHERE code = 'TUC';

/* There's just one Mark=Main, but these point back to piers, which have complex history.  */
/* So, the mark epochs have to be in lockstep with the piers */
INSERT INTO mark (pier_id, name, begin, end, azimuth)
VALUES (
  (SELECT id FROM pier WHERE observatory_id=@observatory_id
                         AND name='Main'
                         AND begin=1000*unix_timestamp('1970-01-01 00:00:00') ),
   'Main', 1000*unix_timestamp('1970-01-01 00:00:00'), 1000*unix_timestamp('2005-11-01 00:00:00'), 21.3767
);

INSERT INTO mark (pier_id, name, begin, end, azimuth)
VALUES (
  (SELECT id FROM pier WHERE observatory_id=@observatory_id
                         AND name='Main'
                         AND begin = 1000*unix_timestamp('2005-11-01 00:00:00') ),
   'Main', 1000*unix_timestamp('2005-11-01 00:00:00'), 1000*unix_timestamp('2006-04-14 00:00:00'), 21.3767
);

INSERT INTO mark (pier_id, name, begin, end, azimuth)
VALUES (
  (SELECT id FROM pier WHERE observatory_id=@observatory_id
                         AND name='Main'
                         AND begin = 1000*unix_timestamp('2006-04-14 00:00:00') ),
   'Main', 1000*unix_timestamp('2006-04-14 00:00:00'), 1000*unix_timestamp('2011-01-01 00:00:00'), 21.3767
);

INSERT INTO mark (pier_id, name, begin, end, azimuth)
VALUES (
  (SELECT id FROM pier WHERE observatory_id=@observatory_id
                         AND name='Main'
                         AND begin = 1000*unix_timestamp('2011-01-01 00:00:00') ),
   'Main', 1000*unix_timestamp('2011-01-01 00:00:00'), 1000*unix_timestamp('2011-02-01 00:00:00'), 21.3767
);

INSERT INTO mark (pier_id, name, begin, end, azimuth)
VALUES (
  (SELECT id FROM pier WHERE observatory_id=@observatory_id
                         AND name='Main'
                         AND begin = 1000*unix_timestamp('2011-02-01 00:00:00') ),
   'Main', 1000*unix_timestamp('2011-02-01 00:00:00'), 1000*unix_timestamp('2011-03-01 00:00:00'), 21.3767
);

INSERT INTO mark (pier_id, name, begin, end, azimuth)
VALUES (
  (SELECT id FROM pier WHERE observatory_id=@observatory_id
                         AND name='Main'
                         AND begin = 1000*unix_timestamp('2011-03-01 00:00:00') ),
   'Main', 1000*unix_timestamp('2011-03-01 00:00:00'), 1000*unix_timestamp('2012-01-01 00:00:00'), 21.3767
);

INSERT INTO mark (pier_id, name, begin, end, azimuth)
VALUES (
  (SELECT id FROM pier WHERE observatory_id=@observatory_id
                         AND name='Main'
                         AND begin = 1000*unix_timestamp('2012-01-01 00:00:00') ),
   'Main', 1000*unix_timestamp('2012-01-01 00:00:00'), 1000*unix_timestamp('2012-08-21 00:00:00'), 21.3767
);

INSERT INTO mark (pier_id, name, begin, end, azimuth)
VALUES (
  (SELECT id FROM pier WHERE observatory_id=@observatory_id
                         AND name='Main'
                         AND begin = 1000*unix_timestamp('2012-08-21 00:00:00') ),
   'Main', 1000*unix_timestamp('2012-08-21 00:00:00'), NULL, 21.3767
);


/* update default_mark_id in all the different pier epochs */
/* See note above explaining why user-defined variables are needed */
/* default for epoch starting 1970-01-01 */
SELECT id
FROM pier
WHERE observatory_id=@observatory_id
  AND name='Main'
  AND begin=1000*unix_timestamp('1970-01-01 00:00:00')
INTO @pier_id;

SELECT id
FROM mark
WHERE name = 'Main'
  AND begin = 1000*unix_timestamp('1970-01-01 00:00:00')
  AND pier_id = @pier_id
INTO @default_mark_id;

UPDATE PIER SET default_mark_id = @default_mark_id
WHERE id = @pier_id;

SELECT id
FROM pier
WHERE observatory_id=@observatory_id
  AND name='Main'
  AND begin=1000*unix_timestamp('2005-11-01 00:00:00')
INTO @pier_id;

SELECT id
FROM mark
WHERE name = 'Main'
  AND begin = 1000*unix_timestamp('2005-11-01 00:00:00')
  AND pier_id = @pier_id
INTO @default_mark_id;

UPDATE PIER SET default_mark_id = @default_mark_id
WHERE id = @pier_id;

SELECT id
FROM pier
WHERE observatory_id=@observatory_id
  AND name='Main'
  AND begin=1000*unix_timestamp('2006-04-14 00:00:00')
INTO @pier_id;

SELECT id
FROM mark
WHERE name = 'Main'
  AND begin = 1000*unix_timestamp('2006-04-14 00:00:00')
  AND pier_id = @pier_id
INTO @default_mark_id;

UPDATE PIER SET default_mark_id = @default_mark_id
WHERE id = @pier_id;


/* default for 4th epoch  */
SELECT id
FROM pier
WHERE observatory_id=@observatory_id
  AND name='Main'
  AND begin=1000*unix_timestamp('2011-01-01 00:00:00')
INTO @pier_id;

SELECT id
FROM mark
WHERE name = 'Main'
  AND begin = 1000*unix_timestamp('2011-01-01 00:00:00')
  AND pier_id = @pier_id
INTO @default_mark_id;

UPDATE PIER SET default_mark_id = @default_mark_id
WHERE id = @pier_id;

/* default for 5th epoch */
SELECT id
FROM pier
WHERE observatory_id=@observatory_id
  AND name='Main'
  AND begin=1000*unix_timestamp('2011-02-01 00:00:00')
INTO @pier_id;

SELECT id
FROM mark
WHERE name = 'Main'
  AND begin = 1000*unix_timestamp('2011-02-01 00:00:00')
  AND pier_id = @pier_id
INTO @default_mark_id;

UPDATE PIER SET default_mark_id = @default_mark_id
WHERE id = @pier_id;

/* default for 6th epoch */
SELECT id
FROM pier
WHERE observatory_id=@observatory_id
  AND name='Main'
  AND begin=1000*unix_timestamp('2011-03-01 00:00:00')
INTO @pier_id;

SELECT id
FROM mark
WHERE name = 'Main'
  AND begin = 1000*unix_timestamp('2011-03-01 00:00:00')
  AND pier_id = @pier_id
INTO @default_mark_id;

UPDATE PIER SET default_mark_id = @default_mark_id
WHERE id = @pier_id;

/* default for 7th epoch */
SELECT id
FROM pier
WHERE observatory_id=@observatory_id
  AND name='Main'
  AND begin=1000*unix_timestamp('2012-01-01 00:00:00')
INTO @pier_id;

SELECT id
FROM mark
WHERE name = 'Main'
  AND begin = 1000*unix_timestamp('2012-01-01 00:00:00')
  AND pier_id = @pier_id
INTO @default_mark_id;

UPDATE PIER SET default_mark_id = @default_mark_id
WHERE id = @pier_id;

/* default for 8th epoch */
SELECT id
FROM pier
WHERE observatory_id=@observatory_id
  AND name='Main'
  AND begin=1000*unix_timestamp('2012-08-21 00:00:00')
INTO @pier_id;

SELECT id
FROM mark
WHERE name = 'Main'
  AND begin = 1000*unix_timestamp('2012-08-21 00:00:00')
  AND pier_id = @pier_id
INTO @default_mark_id;

UPDATE PIER SET default_mark_id = @default_mark_id
WHERE id = @pier_id;
