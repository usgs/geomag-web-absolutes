/* BDT - add observatory entry */ 
INSERT INTO observatory (name, code, location, latitude, longitude, geomagnetic_latitude, geomagnetic_longitude, elevation, orientation, default_pier_id)
VALUES ('Boulder Test (BDT)','BDT','Boulder, CO' ,'40.1375' ,'105.2372' ,'48.40' ,'320.59' ,'1682' ,'HDZF', NULL);

/* add BDT's instruments - two pairs*/
/* this pair is current but the begin time is just an estimate */
INSERT INTO instrument (observatory_id, serial_number, begin, end, name, type)
VALUES ( (SELECT id FROM observatory WHERE code='BDT'), '814503', strftime('%s','2012-01-01 00:00:00'), NULL, 'Electronics', 'elec');
INSERT INTO instrument (observatory_id, serial_number, begin, end, name, type)
VALUES ( (SELECT id FROM observatory WHERE code='BDT'), '110', strftime('%s','2012-01-01 00:00:00'), NULL, 'Theodolite', 'theo');
/* this pair was replaced, but don't know when - use 2011-12-31 as best guess for now */
INSERT INTO instrument (observatory_id, serial_number, begin, end, name, type)
VALUES ( (SELECT id FROM observatory WHERE code='BDT'), '154162', strftime('%s','1970-01-01 00:00:00'), strftime('%s','2011-12-31 23:59:59'), 'Electronics', 'elec');
INSERT INTO instrument (observatory_id, serial_number, begin, end, name, type)
VALUES ( (SELECT id FROM observatory WHERE code='BDT'), '035', strftime('%s','1970-01-01 00:00:00'), strftime('%s','2011-12-31 23:59:59'), 'Theodolite', 'theo');

/* add pier=Main */
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( ( SELECT id FROM observatory WHERE code='BDT' ), 'Main', strftime('%s','1970-01-01 00:00:00'), NULL, -23.1, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory WHERE code='BDT') AND serial_number='814503' AND begin=strftime('%s','2012-01-01 00:00:00') ),
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory WHERE code='BDT') AND serial_number='110' AND begin=strftime('%s','2012-01-01 00:00:00') )
);

/* set observatory.default_pier_id to Main */
UPDATE observatory 
SET default_pier_id = (SELECT id FROM pier
                       WHERE observatory_id = (SELECT id FROM observatory obs WHERE obs.code='BDT')
                         AND name = 'Main'
                         AND begin = strftime('%s','1970-01-01 00:00:00')
                      )
WHERE code = 'BDT'; 
 
/* add Mark=AZ */
INSERT INTO mark (pier_id, name, begin, end, azimuth) 
VALUES ( 
  (SELECT id FROM pier WHERE observatory_id=(SELECT id FROM observatory WHERE observatory.code='BDT') 
                         AND name='Main' 
                         AND begin=strftime('%s','1970-01-01 00:00:00')),
   'AZ', strftime('%s','1970-01-01 00:00:00'), NULL, 199.1383 
);

/* update pier.default_mark_id */
UPDATE PIER SET default_mark_id = (SELECT id FROM mark WHERE name = 'AZ'
                                     AND begin = strftime('%s','1970-01-01 00:00:00')
                                     AND pier_id = (SELECT id FROM pier 
                                                    WHERE observatory_id = (SELECT id FROM observatory obs WHERE obs.code='BDT')
                                                      AND name = 'Main'
                                                      AND begin = strftime('%s','1970-01-01 00:00:00')
                                                    )
                                   )
WHERE id = (SELECT id FROM pier WHERE observatory_id = ( SELECT id FROM observatory obs WHERE obs.code='BDT' )
                                  AND name='Main'
                                  AND begin=strftime('%s','1970-01-01 00:00:00')
            )                                   
;

/* BOU - add observatory entry */ 
INSERT INTO observatory (name, code, location, latitude, longitude, geomagnetic_latitude, geomagnetic_longitude, elevation, orientation, default_pier_id)
VALUES ('Boulder (BOU)','BOU','Boulder, CO' ,'40.1375' ,'105.2372' ,'48.40' ,'320.59' ,'1682' ,'HDZF', NULL);

/* add BOU's instruments - two pairs*/
/* this pair is current but the begin time is just an estimate */
INSERT INTO instrument (observatory_id, serial_number, begin, end, name, type)
VALUES ( (SELECT id FROM observatory WHERE code='BOU'), '814503', strftime('%s','2012-01-01 00:00:00'), NULL, 'Electronics', 'elec');
INSERT INTO instrument (observatory_id, serial_number, begin, end, name, type)
VALUES ( (SELECT id FROM observatory WHERE code='BOU'), '110', strftime('%s','2012-01-01 00:00:00'), NULL, 'Theodolite', 'theo');
/* this pair was replaced, but don't know when - use 2011-12-31 as best guess for now */
INSERT INTO instrument (observatory_id, serial_number, begin, end, name, type)
VALUES ( (SELECT id FROM observatory WHERE code='BOU'), '154162', strftime('%s','1970-01-01 00:00:00'), strftime('%s','2011-12-31 23:59:59'), 'Electronics', 'elec');
INSERT INTO instrument (observatory_id, serial_number, begin, end, name, type)
VALUES ( (SELECT id FROM observatory WHERE code='BOU'), '035', strftime('%s','1970-01-01 00:00:00'), strftime('%s','2011-12-31 23:59:59'), 'Theodolite', 'theo');

/* add pier=Main */

INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( ( SELECT id FROM observatory WHERE code='BOU' ), 'Main', strftime('%s','1970-01-01 00:00:00'), strftime('%s','2004-09-09 20:20:00'), -7, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory WHERE code='BOU') AND serial_number='814503' AND begin=strftime('%s','2012-01-01 00:00:00') ),
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory WHERE code='BOU') AND serial_number='110' AND begin=strftime('%s','2012-01-01 00:00:00') )
);
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( ( SELECT id FROM observatory WHERE code='BOU' ), 'Main', strftime('%s','2004-09-09 20:20:00'), strftime('%s','2004-09-30 19:45:00'), -31.6, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory WHERE code='BOU') AND serial_number='814503' AND begin=strftime('%s','2012-01-01 00:00:00') ),
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory WHERE code='BOU') AND serial_number='110' AND begin=strftime('%s','2012-01-01 00:00:00') )
);
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( ( SELECT id FROM observatory WHERE code='BOU' ), 'Main', strftime('%s','2004-09-30 19:45:00'), strftime('%s','2004-10-28 20:45:00'), -8.4, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory WHERE code='BOU') AND serial_number='814503' AND begin=strftime('%s','2012-01-01 00:00:00') ),
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory WHERE code='BOU') AND serial_number='110' AND begin=strftime('%s','2012-01-01 00:00:00') )
);
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( ( SELECT id FROM observatory WHERE code='BOU' ), 'Main', strftime('%s','2004-10-28 20:45:00'), strftime('%s','2005-06-01 16:15:00'), 8.4, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory WHERE code='BOU') AND serial_number='814503' AND begin=strftime('%s','2012-01-01 00:00:00') ),
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory WHERE code='BOU') AND serial_number='110' AND begin=strftime('%s','2012-01-01 00:00:00') )
);
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( ( SELECT id FROM observatory WHERE code='BOU' ), 'Main', strftime('%s','2005-04-19 18:00:00'), strftime('%s','2005-04-19 19:00:00'), 49.4, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory WHERE code='BOU') AND serial_number='814503' AND begin=strftime('%s','2012-01-01 00:00:00') ),
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory WHERE code='BOU') AND serial_number='110' AND begin=strftime('%s','2012-01-01 00:00:00') )
);
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( ( SELECT id FROM observatory WHERE code='BOU' ), 'Main', strftime('%s','2005-04-19 19:00:00'), strftime('%s','2005-06-01 16:15:00'), 49.4, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory WHERE code='BOU') AND serial_number='814503' AND begin=strftime('%s','2012-01-01 00:00:00') ),
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory WHERE code='BOU') AND serial_number='110' AND begin=strftime('%s','2012-01-01 00:00:00') )
);
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( ( SELECT id FROM observatory WHERE code='BOU' ), 'Main', strftime('%s','2005-06-01 16:15:00'), strftime('%s','2005-07-07 18:00:00'), -19.9, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory WHERE code='BOU') AND serial_number='814503' AND begin=strftime('%s','2012-01-01 00:00:00') ),
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory WHERE code='BOU') AND serial_number='110' AND begin=strftime('%s','2012-01-01 00:00:00') )
);
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( ( SELECT id FROM observatory WHERE code='BOU' ), 'Main', strftime('%s','2005-07-07 18:00:00'), NULL, -23.1, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory WHERE code='BOU') AND serial_number='814503' AND begin=strftime('%s','2012-01-01 00:00:00') ),
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory WHERE code='BOU') AND serial_number='110' AND begin=strftime('%s','2012-01-01 00:00:00') )
);
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( ( SELECT id FROM observatory WHERE code='BOU' ), 'AUX', strftime('%s','2005-07-07 18:00:00'), NULL, -20.7, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory WHERE code='BOU') AND serial_number='814503' AND begin=strftime('%s','2012-01-01 00:00:00') ),
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory WHERE code='BOU') AND serial_number='110' AND begin=strftime('%s','2012-01-01 00:00:00') )
);

/* set observatory.default_pier_id to Main */
UPDATE observatory 
SET default_pier_id = (SELECT id FROM pier
                       WHERE observatory_id = (SELECT id FROM observatory obs WHERE obs.code='BOU')
                         AND name = 'Main'
                         AND begin = strftime('%s','2005-07-07 18:00:00')
                      )
WHERE code = 'BOU'; 
 
/* add Mark=AZ */
INSERT INTO mark (pier_id, name, begin, end, azimuth) 
VALUES ( 
  (SELECT id FROM pier WHERE observatory_id=(SELECT id FROM observatory WHERE observatory.code='BOU') 
                         AND name='Main' 
                         AND strftime('%s','2005-07-07 18:00:00')),
   'AZ', strftime('%s','1970-01-01 00:00:00'), NULL, 199.1383 
);

/* add Mark=AUX */
INSERT INTO mark (pier_id, name, begin, end, azimuth) 
VALUES ( 
  (SELECT id FROM pier WHERE observatory_id=(SELECT id FROM observatory WHERE observatory.code='BOU') 
                         AND name='AUX' 
                         AND strftime('%s','2005-07-07 18:00:00')),
   'AUX', strftime('%s','1970-01-01 00:00:00'), NULL, 199.0933 
);

/* update pier.default_mark_id */
UPDATE PIER SET default_mark_id = (SELECT id FROM mark WHERE name = 'AZ'
                                     AND begin = strftime('%s','1970-01-01 00:00:00')
                                     AND pier_id = (SELECT id FROM pier 
                                                    WHERE observatory_id = (SELECT id FROM observatory obs WHERE obs.code='BOU')
                                                      AND name = 'Main'
                                                      AND begin = begin=strftime('%s','2005-07-07 18:00:00')
                                                    )
                                   )
WHERE id = (SELECT id FROM pier WHERE observatory_id = ( SELECT id FROM observatory obs WHERE obs.code='BOU' )
                                  AND name='Main'
                                  AND begin=strftime('%s','2005-07-07 18:00:00')
            )                                   
;

UPDATE PIER SET default_mark_id = (SELECT id FROM mark WHERE name = 'AUX'
                                     AND begin = strftime('%s','1970-01-01 00:00:00')
                                     AND pier_id = (SELECT id FROM pier 
                                                    WHERE observatory_id = (SELECT id FROM observatory obs WHERE obs.code='BOU')
                                                      AND name = 'Main'
                                                      AND begin = begin=strftime('%s','2005-07-07 18:00:00')
                                                    )
                                   )
WHERE id = (SELECT id FROM pier WHERE observatory_id = ( SELECT id FROM observatory obs WHERE obs.code='BOU' )
                                  AND name='AUX'
                                  AND begin=strftime('%s','2005-07-07 18:00:00')
            )                                   
;

/* BRW - add observatory entry */ 
INSERT INTO observatory (name, code, location, latitude, longitude, geomagnetic_latitude, geomagnetic_longitude, elevation, orientation)
 VALUES ('Barrow (BRW)','BRW' ,'Point Barrow, AK','71.3225' ,'156.6231' ,'69.61' ,'246.26' ,'12' ,'HDZF');
 
/* add BRW's instruments */
/* this pair is current but the begin time is just an estimate */
INSERT INTO instrument (observatory_id, serial_number, begin, end, name, type)
VALUES ( (SELECT id FROM observatory WHERE code='BRW'), '359137', strftime('%s','1970-01-01 00:00:00'), NULL, 'Electronics', 'elec');
INSERT INTO instrument (observatory_id, serial_number, begin, end, name, type)
VALUES ( (SELECT id FROM observatory WHERE code='BRW'), '0137', strftime('%s','1970-01-01 00:00:00'), NULL, 'Theodolite', 'theo');

/* add pier=Main */
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( ( SELECT id FROM observatory WHERE code='BRW' ), 'Main', strftime('%s','1970-01-01 00:00:00'), strftime('%s','2005-08-29 17:00:00'), 6, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory WHERE code='BRW') AND serial_number='359137' AND begin=strftime('%s','1970-01-01 00:00:00') ),
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory WHERE code='BRW') AND serial_number='0137' AND begin=strftime('%s','1970-01-01 00:00:00') )
);
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( ( SELECT id FROM observatory WHERE code='BRW' ), 'Main', strftime('%s','2005-08-29 17:00:00'), strftime('%s','2006-01-01 00:00:00'), -2, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory WHERE code='BRW') AND serial_number='359137' AND begin=strftime('%s','1970-01-01 00:00:00') ),
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory WHERE code='BRW') AND serial_number='0137' AND begin=strftime('%s','1970-01-01 00:00:00') )
);
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( ( SELECT id FROM observatory WHERE code='BRW' ), 'Main', strftime('%s','2006-01-01 00:00:00'), strftime('%s','2006-01-01 00:00:01'), -2, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory WHERE code='BRW') AND serial_number='359137' AND begin=strftime('%s','1970-01-01 00:00:00') ),
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory WHERE code='BRW') AND serial_number='0137' AND begin=strftime('%s','1970-01-01 00:00:00') )
);
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( ( SELECT id FROM observatory WHERE code='BRW' ), 'Main', strftime('%s','2006-01-01 00:00:01'), strftime('%s','2006-08-10 22:22:00'), -2, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory WHERE code='BRW') AND serial_number='359137' AND begin=strftime('%s','1970-01-01 00:00:00') ),
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory WHERE code='BRW') AND serial_number='0137' AND begin=strftime('%s','1970-01-01 00:00:00') )
);
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( ( SELECT id FROM observatory WHERE code='BRW' ), 'Main', strftime('%s','2006-08-10 22:22:00'), strftime('%s','2011-07-01 00:00:00'), -1.3, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory WHERE code='BRW') AND serial_number='359137' AND begin=strftime('%s','1970-01-01 00:00:00') ),
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory WHERE code='BRW') AND serial_number='0137' AND begin=strftime('%s','1970-01-01 00:00:00') )
);
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( ( SELECT id FROM observatory WHERE code='BRW' ), 'Main', strftime('%s','2011-07-01 00:00:00'), strftime('%s','2012-01-01 00:00:00'), -0.8, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory WHERE code='BRW') AND serial_number='359137' AND begin=strftime('%s','1970-01-01 00:00:00') ),
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory WHERE code='BRW') AND serial_number='0137' AND begin=strftime('%s','1970-01-01 00:00:00') )
);
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( ( SELECT id FROM observatory WHERE code='BRW' ), 'Main', strftime('%s','2012-01-01 00:00:00'), NULL, -1, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory WHERE code='BRW') AND serial_number='359137' AND begin=strftime('%s','1970-01-01 00:00:00') ),
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory WHERE code='BRW') AND serial_number='0137' AND begin=strftime('%s','1970-01-01 00:00:00') )
);


/* set observatory.default_pier_id to Main */
UPDATE observatory 
SET default_pier_id = (SELECT id FROM pier
                       WHERE observatory_id = (SELECT id FROM observatory obs WHERE obs.code='BRW')
                         AND name = 'Main'
                         AND begin = strftime('%s','2012-01-01 00:00:00')
                      )
WHERE code = 'BRW'; 
 
/* add Mark='New Azimuth' */
INSERT INTO mark (pier_id, name, begin, end, azimuth) 
VALUES ( 
  (SELECT id FROM pier WHERE observatory_id=(SELECT id FROM observatory WHERE observatory.code='BRW') 
                         AND name='Main' 
                         AND strftime('%s','2012-01-01 00:00:00')),
   'New Azimuth', strftime('%s','1970-01-01 00:00:00'), NULL, 7.9650
);

/* update pier.default_mark_id */
UPDATE PIER SET default_mark_id = (SELECT id FROM mark WHERE name = 'New Azimuth'
                                     AND begin = strftime('%s','1970-01-01 00:00:00')
                                     AND pier_id = (SELECT id FROM pier 
                                                    WHERE observatory_id = (SELECT id FROM observatory obs WHERE obs.code='BRW')
                                                      AND name = 'Main'
                                                      AND begin = strftime('%s','2012-01-01 00:00:00')
                                                    )
                                   )
WHERE id = (SELECT id FROM pier WHERE observatory_id = ( SELECT id FROM observatory obs WHERE obs.code='BRW' )
                                  AND name='Main'
                                  AND strftime('%s','2012-01-01 00:00:00')
            )                                   
;

/* BSL - add observatory entry */ 
INSERT INTO observatory (name, code, location, latitude, longitude, geomagnetic_latitude, geomagnetic_longitude, elevation, orientation)
 VALUES ('Barrow (BSL)','BSL' ,'Point Barrow, AK','71.3225' ,'156.6231' ,'69.61' ,'246.26' ,'12' ,'HDZF');
 
/* add BSL's instruments - note that there's no theodolite */
INSERT INTO instrument (observatory_id, serial_number, begin, end, name, type)
VALUES ( (SELECT id FROM observatory WHERE code='BSL'), '312713', strftime('%s','1970-01-01 00:00:00'), NULL, 'Electronics', 'elec');

/* add pier=Main */
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( ( SELECT id FROM observatory WHERE code='BSL' ), 'Main', strftime('%s','1970-01-01 00:00:00'), strftime('%s','2007-01-01 00:00:00'), -1, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory WHERE code='BSL') AND serial_number='312713' AND begin=strftime('%s','1970-01-01 00:00:00')),
         NULL
);
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( ( SELECT id FROM observatory WHERE code='BSL' ), 'Main', strftime('%s','2007-01-01 00:00:00'), strftime('%s','2009-02-01 00:00:00'), 7.4, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory WHERE code='BSL') AND serial_number='312713' AND begin=strftime('%s','1970-01-01 00:00:00')),
         NULL
);
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( ( SELECT id FROM observatory WHERE code='BSL' ), 'Main', strftime('%s','2009-02-01 00:00:00'), strftime('%s','2009-03-01 00:00:00'), 3.5, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory WHERE code='BSL') AND serial_number='312713' AND begin=strftime('%s','1970-01-01 00:00:00')),
         NULL
);
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( ( SELECT id FROM observatory WHERE code='BSL' ), 'Main', strftime('%s','2009-03-01 00:00:00'), strftime('%s','2009-04-01 00:00:00'), 1.4, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory WHERE code='BSL') AND serial_number='312713' AND begin=strftime('%s','1970-01-01 00:00:00')),
         NULL
);
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( ( SELECT id FROM observatory WHERE code='BSL' ), 'Main', strftime('%s','2009-04-01 00:00:00'), strftime('%s','2009-05-01 00:00:00'), -0.6, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory WHERE code='BSL') AND serial_number='312713' AND begin=strftime('%s','1970-01-01 00:00:00')),
         NULL
);
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( ( SELECT id FROM observatory WHERE code='BSL' ), 'Main', strftime('%s','2009-05-01 00:00:00'), strftime('%s','2009-06-01 00:00:00'), -2.5, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory WHERE code='BSL') AND serial_number='312713' AND begin=strftime('%s','1970-01-01 00:00:00')),
         NULL
);
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( ( SELECT id FROM observatory WHERE code='BSL' ), 'Main', strftime('%s','2009-06-01 00:00:00'), NULL, -4.2, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory WHERE code='BSL') AND serial_number='312713' AND begin=strftime('%s','1970-01-01 00:00:00')),
         NULL
);


/* set observatory.default_pier_id to Main */
UPDATE observatory 
SET default_pier_id = (SELECT id FROM pier
                       WHERE observatory_id = (SELECT id FROM observatory obs WHERE obs.code='BSL')
                         AND name = 'Main'
                         AND begin = strftime('%s','2009-06-01 00:00:00')
                      )
WHERE code = 'BSL'; 
 
/* add Mark=Main */
INSERT INTO mark (pier_id, name, begin, end, azimuth) 
VALUES ( 
  (SELECT id FROM pier WHERE observatory_id=(SELECT id FROM observatory WHERE observatory.code='BSL') 
                         AND name='Main' 
                         AND strftime('%s','2009-06-01 00:00:00') ),
   'Main', strftime('%s','1970-01-01 00:00:00'), NULL, 176.6458
);

/* update pier.default_mark_id */
UPDATE PIER SET default_mark_id = (SELECT id FROM mark WHERE name = 'Main'
                                     AND begin = strftime('%s','1970-01-01 00:00:00')
                                     AND pier_id = (SELECT id FROM pier 
                                                    WHERE observatory_id = (SELECT id FROM observatory obs WHERE obs.code='BSL')
                                                      AND name = 'Main'
                                                      AND begin = strftime('%s','2009-06-01 00:00:00')
                                                    )
                                   )
WHERE id = (SELECT id FROM pier WHERE observatory_id = ( SELECT id FROM observatory obs WHERE obs.code='BSL' )
                                  AND name='Main'
                                  AND begin = strftime('%s','2009-06-01 00:00:00')
            )                                   
;

/* CMO - observatory entry */
INSERT INTO observatory (name, code, location, latitude, longitude, geomagnetic_latitude, geomagnetic_longitude, elevation, orientation, default_pier_id)
 VALUES ('College (CMO)','CMO' ,'Fairbanks, AK' ,'64.8742' ,'147.8597' ,'65.38' ,'261.63' ,'197' ,'HDZF', NULL);

/* insert CMO's instruments */
INSERT INTO instrument (observatory_id, serial_number, begin, end, name, type)
VALUES ( (SELECT id FROM observatory obs WHERE obs.code='CMO'), '200803', strftime('%s','1970-01-01 00:00:00'), NULL, 'Electronics', 'elec');
INSERT INTO instrument (observatory_id, serial_number, begin, end, name, type)
VALUES ( (SELECT id FROM observatory obs WHERE obs.code='CMO'), '0143', strftime('%s','1970-01-01 00:00:00'), NULL, 'Theodolite', 'theo');

/* add pier=1A */
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( ( SELECT id FROM observatory obs WHERE obs.code='CMO' ), '1A', strftime('%s','1970-01-01 00:00:00'), strftime('%s','2005-03-10 21:00:00'), 10, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory obs WHERE obs.code='CMO') AND serial_number='200803' AND begin=strftime('%s','1970-01-01 00:00:00') ),
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory obs WHERE obs.code='CMO') AND serial_number='0143' AND begin=strftime('%s','1970-01-01 00:00:00') )
);
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( ( SELECT id FROM observatory obs WHERE obs.code='CMO' ), '1A', strftime('%s','2005-03-10 21:00:00'), strftime('%s','2005-06-01 00:00:00'), -11.5, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory obs WHERE obs.code='CMO') AND serial_number='200803' AND begin=strftime('%s','1970-01-01 00:00:00') ),
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory obs WHERE obs.code='CMO') AND serial_number='0143' AND begin=strftime('%s','1970-01-01 00:00:00') )
);
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( ( SELECT id FROM observatory obs WHERE obs.code='CMO' ), '1A', strftime('%s','2005-06-01 00:00:00'), strftime('%s','2012-01-26 20:00:00'), 11.8, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory obs WHERE obs.code='CMO') AND serial_number='200803' AND begin=strftime('%s','1970-01-01 00:00:00') ),
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory obs WHERE obs.code='CMO') AND serial_number='0143' AND begin=strftime('%s','1970-01-01 00:00:00') )
);
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( ( SELECT id FROM observatory obs WHERE obs.code='CMO' ), '1A', strftime('%s','2012-01-26 20:00:00'), NULL, 10.5, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory obs WHERE obs.code='CMO') AND serial_number='200803' AND begin=strftime('%s','1970-01-01 00:00:00') ),
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory obs WHERE obs.code='CMO') AND serial_number='0143' AND begin=strftime('%s','1970-01-01 00:00:00') )
);

/* set observatory.default_pier_id to 1A */
UPDATE observatory 
SET default_pier_id = (SELECT id FROM pier
                       WHERE observatory_id = (SELECT id FROM observatory obs WHERE obs.code='CMO')
                         AND name = '1A'
                         AND begin = strftime('%s','2012-01-26 20:00:00')
                      )
WHERE code = 'CMO'; 

/* add  mark=Azimuth */
INSERT INTO mark (pier_id, name, begin, end, azimuth) 
VALUES ( 
  (SELECT id FROM pier WHERE observatory_id=(SELECT id FROM observatory obs WHERE obs.code='CMO') 
                         AND name='1A' 
                         AND begin = strftime('%s','2012-01-26 20:00:00') ),
   'Azimuth', strftime('%s','1970-01-01 00:00:00'), NULL, 27.5613
);

/* update pier.default_mark_ids */
UPDATE PIER SET default_mark_id = (SELECT id FROM mark WHERE name = 'Azimuth'
                                     AND begin = strftime('%s','1970-01-01 00:00:00')
                                     AND pier_id = (SELECT id FROM pier 
                                                    WHERE observatory_id = (SELECT id FROM observatory obs WHERE obs.code='CMO')
                                                      AND name = '1A'
                                                      AND begin = strftime('%s','2012-01-26 20:00:00')
                                                    )
                                   )
WHERE id = (SELECT id FROM pier WHERE observatory_id = ( SELECT id FROM observatory WHERE code='CMO' )
                                  AND name='1A'
                                  AND begin = strftime('%s','2012-01-26 20:00:00')                                     
            )                                   
;
/* DED - add observatory entry */ 
INSERT INTO observatory (name, code, location, latitude, longitude, geomagnetic_latitude, geomagnetic_longitude, elevation, orientation)
 VALUES ('Deadhorse (DED)','DED' ,'Deadhorse, AK' ,'70.3552' ,'148.7928' ,NULL,NULL ,'10' ,'HDZF');
 
/* add DED's instruments */
INSERT INTO instrument (observatory_id, serial_number, begin, end, name, type)
VALUES ( (SELECT id FROM observatory WHERE code='DED'), '808381', strftime('%s', '1970-01-01 00:00:00'), NULL, 'Electronics', 'elec');
INSERT INTO instrument (observatory_id, serial_number, begin, end, name, type)
VALUES ( (SELECT id FROM observatory WHERE code='DED'), '0095', strftime('%s', '1970-01-01 00:00:00'), NULL, 'Theodolite', 'theo');

/* add pier=Main */
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( ( SELECT id FROM observatory WHERE code='DED' ), 'Main', strftime('%s', '2010-03-22 00:00:00'), strftime('%s', '2010-08-18 01:15:00'), 0.6, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory WHERE code='DED') AND serial_number='808381' AND begin=strftime('%s', '1970-01-01 00:00:00') ),
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory WHERE code='DED') AND serial_number='0095' AND begin=strftime('%s', '1970-01-01 00:00:00') )
);
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( ( SELECT id FROM observatory WHERE code='DED' ), 'Main', strftime('%s', '2010-08-18 01:15:00'), NULL, -1.5, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory WHERE code='DED') AND serial_number='808381' AND begin=strftime('%s', '1970-01-01 00:00:00') ),
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory WHERE code='DED') AND serial_number='0095' AND begin=strftime('%s', '1970-01-01 00:00:00') )
);

/* set observatory.default_pier_id to Main */
UPDATE observatory 
SET default_pier_id = (SELECT id FROM pier
                       WHERE observatory_id = (SELECT id FROM observatory obs WHERE obs.code='DED')
                         AND name = 'Main'
                         AND begin = strftime('%s', '2010-08-18 01:15:00')
                      )
WHERE code = 'DED'; 
 
/* add Mark=Main */
INSERT INTO mark (pier_id, name, begin, end, azimuth) 
VALUES ( 
  (SELECT id FROM pier WHERE observatory_id=(SELECT id FROM observatory WHERE observatory.code='DED') 
                         AND name='Main' 
                         AND begin = strftime('%s', '2010-08-18 01:15:00') ),
   'Main', strftime('%s', '1970-01-01 00:00:00'), NULL, 263.1269
);

/* update pier.default_mark_id */
UPDATE PIER SET default_mark_id = (SELECT id FROM mark WHERE name = 'Main'
                                     AND begin = strftime('%s', '1970-01-01 00:00:00')
                                     AND pier_id = (SELECT id FROM pier 
                                                    WHERE observatory_id = (SELECT id FROM observatory obs WHERE obs.code='DED')
                                                      AND name = 'Main'
                                                      AND begin = strftime('%s', '2010-08-18 01:15:00')
                                                    )
                                   )
WHERE id = (SELECT id FROM pier WHERE observatory_id = ( SELECT id FROM observatory obs WHERE obs.code='DED' )
                                  AND name='Main'
                                  AND begin = strftime('%s', '2010-08-18 01:15:00')                                    
            )                                   
;

/* FRD - add observatory entry */
INSERT INTO observatory (name, code, location, latitude, longitude, geomagnetic_latitude, geomagnetic_longitude, elevation, orientation)
 VALUES ('Fredericksburg (FRD)','FRD' ,'Corbin, VA','38.2047' ,'77.3729' ,'48.40' ,'353.38' ,'69' ,'HDZF');

/* add FRD's instruments */
INSERT INTO instrument (observatory_id, serial_number, begin, end, name, type)
VALUES ( (SELECT id FROM observatory WHERE code='FRD'), '154155', strftime('%s','1970-01-01 00:00:00'), NULL, 'Electronics', 'elec');
INSERT INTO instrument (observatory_id, serial_number, begin, end, name, type)
VALUES ( (SELECT id FROM observatory WHERE code='FRD'), '0109', strftime('%s','1970-01-01 00:00:00'), NULL, 'Theodolite', 'theo');

/* add pier=Main */
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( ( SELECT id FROM observatory WHERE code='FRD' ), '3D', strftime('%s','1970-01-01 00:00:00'), strftime('%s','2005-11-01 00:00:00'), -1.7, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory WHERE code='FRD') AND serial_number='154155' AND begin=strftime('%s','1970-01-01 00:00:00') ),
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory WHERE code='FRD') AND serial_number='0109' AND begin=strftime('%s','1970-01-01 00:00:00') )
);
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( ( SELECT id FROM observatory WHERE code='FRD' ), '3D', strftime('%s','2005-11-01 00:00:00'), NULL, -4.6, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory WHERE code='FRD') AND serial_number='154155' AND begin=strftime('%s','1970-01-01 00:00:00') ),
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory WHERE code='FRD') AND serial_number='0109' AND begin=strftime('%s','1970-01-01 00:00:00') )
);


/* set observatory.default_pier_id to 3D */
UPDATE observatory 
SET default_pier_id = (SELECT id FROM pier
                       WHERE observatory_id = (SELECT id FROM observatory obs WHERE obs.code='FRD')
                         AND name = '3D'
                         AND begin = strftime('%s','2005-11-01 00:00:00')
                      )
WHERE code = 'FRD'; 
 
/* add Mark=West Monument */
INSERT INTO mark (pier_id, name, begin, end, azimuth) 
VALUES ( 
  (SELECT id FROM pier WHERE observatory_id=(SELECT id FROM observatory WHERE observatory.code='FRD') 
                         AND name='3D' 
                         AND begin = strftime('%s','2005-11-01 00:00:00') ),
   'West Monument', strftime('%s','1970-01-01 00:00:00'), NULL, 13.4926
);

/* update pier.default_mark_id */
UPDATE PIER SET default_mark_id = (SELECT id FROM mark WHERE name = 'West Monument'
                                     AND begin = strftime('%s','1970-01-01 00:00:00')
                                     AND pier_id = (SELECT id FROM pier 
                                                    WHERE observatory_id = (SELECT id FROM observatory obs WHERE obs.code='FRD')
                                                      AND name = '3D'
                                                      AND begin = strftime('%s','2005-11-01 00:00:00')
                                                    )
                                   )
WHERE id = (SELECT id FROM pier WHERE observatory_id = ( SELECT id FROM observatory obs WHERE obs.code='FRD' )
                                  AND name='3D'
                                  AND begin = strftime('%s','2005-11-01 00:00:00')
            )                                   
;
/* FRN - add observatory entry */ 
INSERT INTO observatory (name, code, location, latitude, longitude, geomagnetic_latitude, geomagnetic_longitude, elevation, orientation)
 VALUES ('Fresno (FRN)','FRN','ONeals, CA','37.0913' ,'119.7193' ,'43.52' ,'305.25' ,'331' ,'HDZF');
 
/* add FRN's instruments */
INSERT INTO instrument (observatory_id, serial_number, begin, end, name, type)
VALUES ( (SELECT id FROM observatory WHERE code='FRN'), '154181', strftime('%s','1970-01-01 00:00:00'), NULL, 'Electronics', 'elec');
INSERT INTO instrument (observatory_id, serial_number, begin, end, name, type)
VALUES ( (SELECT id FROM observatory WHERE code='FRN'), '140', strftime('%s','1970-01-01 00:00:00'), NULL, 'Theodolite', 'theo');

/* add pier=Main */
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( ( SELECT id FROM observatory WHERE code='FRN' ), 'Main', strftime('%s','1970-01-01 00:00:00'), strftime('%s','2006-01-01 00:01:00'), 35.5, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory WHERE code='FRN') AND serial_number='154181' AND begin=strftime('%s','1970-01-01 00:00:00') ),
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory WHERE code='FRN') AND serial_number='140' AND begin=strftime('%s','1970-01-01 00:00:00') )
);
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( ( SELECT id FROM observatory WHERE code='FRN' ), 'Main', strftime('%s','2006-01-01 00:01:00'), strftime('%s','2005-06-01 00:00:00'), 32.5, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory WHERE code='FRN') AND serial_number='154181' AND begin=strftime('%s','1970-01-01 00:00:00') ),
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory WHERE code='FRN') AND serial_number='140' AND begin=strftime('%s','1970-01-01 00:00:00') )
);
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( ( SELECT id FROM observatory WHERE code='FRN' ), 'Main', strftime('%s','2005-06-01 00:00:00'), strftime('%s','2009-01-01 00:00:00'), -7.1, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory WHERE code='FRN') AND serial_number='154181' AND begin=strftime('%s','1970-01-01 00:00:00') ),
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory WHERE code='FRN') AND serial_number='140' AND begin=strftime('%s','1970-01-01 00:00:00') )
);
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( ( SELECT id FROM observatory WHERE code='FRN' ), 'Main', strftime('%s','2009-01-01 00:00:00'), strftime('%s','2009-02-01 00:00:00'), -9.2, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory WHERE code='FRN') AND serial_number='154181' AND begin=strftime('%s','1970-01-01 00:00:00') ),
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory WHERE code='FRN') AND serial_number='140' AND begin=strftime('%s','1970-01-01 00:00:00') )
);
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( ( SELECT id FROM observatory WHERE code='FRN' ), 'Main', strftime('%s','2009-02-01 00:00:00'), strftime('%s','2009-03-01 00:00:00'), -11.3, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory WHERE code='FRN') AND serial_number='154181' AND begin=strftime('%s','1970-01-01 00:00:00') ),
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory WHERE code='FRN') AND serial_number='140' AND begin=strftime('%s','1970-01-01 00:00:00') )
);
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( ( SELECT id FROM observatory WHERE code='FRN' ), 'Main', strftime('%s','2009-03-01 00:00:00'), strftime('%s','2009-04-01 00:00:00'), -13.4, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory WHERE code='FRN') AND serial_number='154181' AND begin=strftime('%s','1970-01-01 00:00:00') ),
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory WHERE code='FRN') AND serial_number='140' AND begin=strftime('%s','1970-01-01 00:00:00') )
);
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( ( SELECT id FROM observatory WHERE code='FRN' ), 'Main', strftime('%s','2009-04-01 00:00:00'), NULL, -15.5, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory WHERE code='FRN') AND serial_number='154181' AND begin=strftime('%s','1970-01-01 00:00:00') ),
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory WHERE code='FRN') AND serial_number='140' AND begin=strftime('%s','1970-01-01 00:00:00') )
);
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( ( SELECT id FROM observatory WHERE code='FRN' ), 'Default', strftime('%s','2009-04-01 00:00:00'), NULL, -15.5, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory WHERE code='FRN') AND serial_number='154181' AND begin=strftime('%s','1970-01-01 00:00:00') ),
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory WHERE code='FRN') AND serial_number='140' AND begin=strftime('%s','1970-01-01 00:00:00') )
);

/* set observatory.default_pier_id to Main */
UPDATE observatory 
SET default_pier_id = (SELECT id FROM pier
                       WHERE observatory_id = (SELECT id FROM observatory obs WHERE obs.code='FRN')
                         AND name = 'Main'
                         AND begin = strftime('%s','2009-04-01 00:00:00')
                      )
WHERE code = 'FRN'; 
 
/* add Mark=Azimuth Pin */
INSERT INTO mark (pier_id, name, begin, end, azimuth) 
VALUES ( 
  (SELECT id FROM pier WHERE observatory_id=(SELECT id FROM observatory WHERE observatory.code='FRN') 
                         AND name='Main' 
                         AND begin = strftime('%s','2009-04-01 00:00:00') ),
   'Azimuth Pin', strftime('%s','1970-01-01 00:00:00'), NULL, 16.75
);
INSERT INTO mark (pier_id, name, begin, end, azimuth) 
VALUES ( 
  (SELECT id FROM pier WHERE observatory_id=(SELECT id FROM observatory WHERE observatory.code='FRN') 
                         AND name='Default' 
                         AND begin = strftime('%s','2009-04-01 00:00:00') ),
   'Default', strftime('%s','1970-01-01 00:00:00'), NULL, 16.75
);

/* update pier.default_mark_id */
UPDATE PIER SET default_mark_id = (SELECT id FROM mark WHERE name = 'Azimuth Pin'
                                     AND begin = strftime('%s','1970-01-01 00:00:00')
                                     AND pier_id = (SELECT id FROM pier 
                                                    WHERE observatory_id = (SELECT id FROM observatory obs WHERE obs.code='FRN')
                                                      AND name = 'Main'
                                                      AND begin = strftime('%s','2009-04-01 00:00:00')
                                                    )
                                   )
WHERE id = (SELECT id FROM pier WHERE observatory_id = ( SELECT id FROM observatory obs WHERE obs.code='FRN' )
                                  AND name='Main'
                                  AND begin = strftime('%s','2009-04-01 00:00:00')
            )                                   
;

UPDATE PIER SET default_mark_id = (SELECT id FROM mark WHERE name = 'Azimuth Pin'
                                     AND begin = strftime('%s','1970-01-01 00:00:00')
                                     AND pier_id = (SELECT id FROM pier 
                                                    WHERE observatory_id = (SELECT id FROM observatory obs WHERE obs.code='FRN')
                                                      AND name = 'Default'
                                                      AND begin = strftime('%s','2009-04-01 00:00:00')
                                                    )
                                   )
WHERE id = (SELECT id FROM pier WHERE observatory_id = ( SELECT id FROM observatory obs WHERE obs.code='FRN' )
                                  AND name='Default'
                                  AND begin = strftime('%s','2009-04-01 00:00:00')
            )                                   
;/* GUA - add observatory entry */ 
INSERT INTO observatory (name, code, location, latitude, longitude, geomagnetic_latitude, geomagnetic_longitude, elevation, orientation)
 VALUES ('Guam (GUA)','GUA','Dededo, Guam','13.5895' ,'144.8694' ,'5.30' ,'215.64' ,'140' ,'HDZF');
 
/* add GUA's instruments */
INSERT INTO instrument (observatory_id, serial_number, begin, end, name, type)
VALUES ( (SELECT id FROM observatory WHERE code='GUA'), '808075', strftime('%s','1970-01-01 00:00:00'), NULL, 'Electronics', 'elec');
INSERT INTO instrument (observatory_id, serial_number, begin, end, name, type)
VALUES ( (SELECT id FROM observatory WHERE code='GUA'), '030', strftime('%s','1970-01-01 00:00:00'), NULL, 'Theodolite', 'theo');

/* add pier=West */
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( ( SELECT id FROM observatory WHERE code='GUA' ), 'West', strftime('%s','1970-01-01 00:00:00'), strftime('%s','2005-01-01 00:00:00'), -49, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory WHERE code='GUA') AND serial_number='808075' AND begin=strftime('%s','1970-01-01 00:00:00') ),
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory WHERE code='GUA') AND serial_number='030' AND begin=strftime('%s','1970-01-01 00:00:00') )
);
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( ( SELECT id FROM observatory WHERE code='GUA' ), 'West', strftime('%s','2005-01-01 00:00:00'), strftime('%s','2003-08-01 00:00:00'), -46, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory WHERE code='GUA') AND serial_number='808075' AND begin=strftime('%s','1970-01-01 00:00:00') ),
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory WHERE code='GUA') AND serial_number='030' AND begin=strftime('%s','1970-01-01 00:00:00') )
);
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( ( SELECT id FROM observatory WHERE code='GUA' ), 'West', strftime('%s','2003-08-01 00:00:00'), strftime('%s','2007-09-25 04:58:00'), 12.5, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory WHERE code='GUA') AND serial_number='808075' AND begin=strftime('%s','1970-01-01 00:00:00') ),
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory WHERE code='GUA') AND serial_number='030' AND begin=strftime('%s','1970-01-01 00:00:00') )
);
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( ( SELECT id FROM observatory WHERE code='GUA' ), 'West', strftime('%s','2007-09-25 04:58:00'), strftime('%s','2013-04-01 00:00:00'), 9.6, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory WHERE code='GUA') AND serial_number='808075' AND begin=strftime('%s','1970-01-01 00:00:00') ),
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory WHERE code='GUA') AND serial_number='030' AND begin=strftime('%s','1970-01-01 00:00:00') )
);
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( ( SELECT id FROM observatory WHERE code='GUA' ), 'West', strftime('%s','2013-04-01 00:00:00'), NULL, 7.9, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory WHERE code='GUA') AND serial_number='808075' AND begin=strftime('%s','1970-01-01 00:00:00') ),
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory WHERE code='GUA') AND serial_number='030' AND begin=strftime('%s','1970-01-01 00:00:00') )
);

INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( ( SELECT id FROM observatory WHERE code='GUA' ), 'Main', strftime('%s','2007-09-25 04:58:00'), strftime('%s','2013-04-01 00:00:00'), 9.6, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory WHERE code='GUA') AND serial_number='808075' AND begin=strftime('%s','1970-01-01 00:00:00') ),
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory WHERE code='GUA') AND serial_number='030' AND begin=strftime('%s','1970-01-01 00:00:00') )
);
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( ( SELECT id FROM observatory WHERE code='GUA' ), 'Main', strftime('%s','2013-04-01 00:00:00'), NULL, 7.9, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory WHERE code='GUA') AND serial_number='808075' AND begin=strftime('%s','1970-01-01 00:00:00') ),
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory WHERE code='GUA') AND serial_number='030' AND begin=strftime('%s','1970-01-01 00:00:00') )
);

/* set observatory.default_pier_id to West */
UPDATE observatory 
SET default_pier_id = (SELECT id FROM pier
                       WHERE observatory_id = (SELECT id FROM observatory obs WHERE obs.code='GUA')
                         AND name = 'West'
                         AND begin = strftime('%s','2013-04-01 00:00:00')
                      )
WHERE code = 'GUA'; 
 
/* add Mark=South Monument */
INSERT INTO mark (pier_id, name, begin, end, azimuth) 
VALUES ( 
  (SELECT id FROM pier WHERE observatory_id=(SELECT id FROM observatory WHERE observatory.code='GUA') 
                         AND name='West' 
                         AND begin = strftime('%s','2013-04-01 00:00:00') ),
   'South Monument', strftime('%s','1970-01-01 00:00:00'), NULL, 2.5233
);

/* update pier.default_mark_id */
UPDATE PIER SET default_mark_id = (SELECT id FROM mark WHERE name = 'South Monument'
                                     AND begin = strftime('%s','1970-01-01 00:00:00')
                                     AND pier_id = (SELECT id FROM pier 
                                                    WHERE observatory_id = (SELECT id FROM observatory obs WHERE obs.code='GUA')
                                                      AND name = 'West'
                                                      AND begin = strftime('%s','2013-04-01 00:00:00')
                                                    )
                                   )
WHERE id = (SELECT id FROM pier WHERE observatory_id = ( SELECT id FROM observatory obs WHERE obs.code='GUA' )
                                  AND name='West'
                                  AND begin = strftime('%s','2013-04-01 00:00:00')
            )                                   
;

UPDATE PIER SET default_mark_id = (SELECT id FROM mark WHERE name = 'South Monument'
                                     AND begin = strftime('%s','1970-01-01 00:00:00')
                                     AND pier_id = (SELECT id FROM pier 
                                                    WHERE observatory_id = (SELECT id FROM observatory obs WHERE obs.code='GUA')
                                                      AND name = 'Main'
                                                      AND begin = strftime('%s','2013-04-01 00:00:00')
                                                    )
                                   )
WHERE id = (SELECT id FROM pier WHERE observatory_id = ( SELECT id FROM observatory obs WHERE obs.code='GUA' )
                                  AND name='Main'
                                  AND begin = strftime('%s','2013-04-01 00:00:00')
            )                                   
;/* HON - add observatory entry */ 
INSERT INTO observatory (name, code, location, latitude, longitude, geomagnetic_latitude, geomagnetic_longitude, elevation, orientation)
 VALUES ('Honolulu (HON)','HON','Ewa Beach, HI','21.3166' ,'157.9996' ,'21.64' ,'269.74' ,'4' ,'HDZF');
 
/* add HON's instruments - note that there's no theodolite */
INSERT INTO instrument (observatory_id, serial_number, begin, end, name, type)
VALUES ( (SELECT id FROM observatory WHERE code='HON'), '313836', strftime('%s','1970-01-01 00:00:00'), NULL, 'Electronics', 'elec');

/* add pier=Main */
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( ( SELECT id FROM observatory WHERE code='HON' ), 'Main', strftime('%s','1970-01-01 00:00:00'), strftime('%s','2001-08-23 03:00:00'), 19.6, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory WHERE code='HON') AND serial_number='313836' AND begin=strftime('%s','1970-01-01 00:00:00') ),
         NULL
);
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( ( SELECT id FROM observatory WHERE code='HON' ), 'Main', strftime('%s','2001-08-23 03:00:00'), strftime('%s','2004-12-01 00:00:00'), 14, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory WHERE code='HON') AND serial_number='313836' AND begin=strftime('%s','1970-01-01 00:00:00') ),
         NULL
);
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( ( SELECT id FROM observatory WHERE code='HON' ), 'Main', strftime('%s','2004-12-01 00:00:00'), strftime('%s','2010-01-01 00:00:00'), 17.5, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory WHERE code='HON') AND serial_number='313836' AND begin=strftime('%s','1970-01-01 00:00:00') ),
         NULL
);
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( ( SELECT id FROM observatory WHERE code='HON' ), 'Main', strftime('%s','2010-01-01 00:00:00'), NULL, 14.5, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory WHERE code='HON') AND serial_number='313836' AND begin=strftime('%s','1970-01-01 00:00:00') ),
         NULL
);


/* set observatory.default_pier_id to Main */
UPDATE observatory 
SET default_pier_id = (SELECT id FROM pier
                       WHERE observatory_id = (SELECT id FROM observatory obs WHERE obs.code='HON')
                         AND name = 'Main'
                         AND begin = strftime('%s','2010-01-01 00:00:00')
                      )
WHERE code = 'HON'; 
 
/* add Mark=Main Azimuth */
INSERT INTO mark (pier_id, name, begin, end, azimuth) 
VALUES ( 
  (SELECT id FROM pier WHERE observatory_id=(SELECT id FROM observatory WHERE observatory.code='HON') 
                         AND name='Main' 
                         AND begin = strftime('%s','2010-01-01 00:00:00') ),
   'Main Azimuth', strftime('%s','1970-01-01 00:00:00'), NULL, 142.6483
);

/* update pier.default_mark_id */
UPDATE PIER SET default_mark_id = (SELECT id FROM mark WHERE name = 'Main Azimuth'
                                     AND begin = strftime('%s','1970-01-01 00:00:00')
                                     AND pier_id = (SELECT id FROM pier 
                                                    WHERE observatory_id = (SELECT id FROM observatory obs WHERE obs.code='HON')
                                                      AND name = 'Main'
                                                      AND begin = strftime('%s','2010-01-01 00:00:00')
                                                    )
                                   )
WHERE id = (SELECT id FROM pier WHERE observatory_id = ( SELECT id FROM observatory obs WHERE obs.code='HON' )
                                  AND name='Main'
                                  AND begin = strftime('%s','2010-01-01 00:00:00')
            )                                   
;

/* NEW - add observatory entry */ 
INSERT INTO observatory (name, code, location, latitude, longitude, geomagnetic_latitude, geomagnetic_longitude, elevation, orientation)
 VALUES ('Newport (NEW)','NEW','Colville National Forest, WA','48.2649' ,'117.1231' ,'54.85' ,'304.68' ,'770' ,'HDZF');
 
/* add NEW's instruments */
INSERT INTO instrument (observatory_id, serial_number, begin, end, name, type)
VALUES ( (SELECT id FROM observatory WHERE code='NEW'), '152320', strftime('%s','1970-01-01 00:00:00'), NULL, 'Electronics', 'elec');
INSERT INTO instrument (observatory_id, serial_number, begin, end, name, type)
VALUES ( (SELECT id FROM observatory WHERE code='NEW'), '0142', strftime('%s','1970-01-01 00:00:00'), NULL, 'Theodolite', 'theo');

/* add pier=Main */
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( ( SELECT id FROM observatory WHERE code='NEW' ), 'Main', strftime('%s','1970-01-01 00:00:00'), strftime('%s','2002-03-04 23:00:00'), -5, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory WHERE code='NEW') AND serial_number='152320' AND begin=strftime('%s','1970-01-01 00:00:00') ),
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory WHERE code='NEW') AND serial_number='0142' AND begin=strftime('%s','1970-01-01 00:00:00') )
);
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( ( SELECT id FROM observatory WHERE code='NEW' ), 'Main', strftime('%s','2002-03-04 23:00:00'), strftime('%s','2002-03-23 05:45:00'), -6, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory WHERE code='NEW') AND serial_number='152320' AND begin=strftime('%s','1970-01-01 00:00:00') ),
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory WHERE code='NEW') AND serial_number='0142' AND begin=strftime('%s','1970-01-01 00:00:00') )
);
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( ( SELECT id FROM observatory WHERE code='NEW' ), 'Main', strftime('%s','2002-03-23 05:45:00'), strftime('%s','2005-11-01 01:00:00'), -5, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory WHERE code='NEW') AND serial_number='152320' AND begin=strftime('%s','1970-01-01 00:00:00') ),
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory WHERE code='NEW') AND serial_number='0142' AND begin=strftime('%s','1970-01-01 00:00:00') )
);
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( ( SELECT id FROM observatory WHERE code='NEW' ), 'Main', strftime('%s','2005-11-01 01:00:00'), strftime('%s','2006-01-01 00:01:00'), -6.2, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory WHERE code='NEW') AND serial_number='152320' AND begin=strftime('%s','1970-01-01 00:00:00') ),
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory WHERE code='NEW') AND serial_number='0142' AND begin=strftime('%s','1970-01-01 00:00:00') )
);
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( ( SELECT id FROM observatory WHERE code='NEW' ), 'Main', strftime('%s','2006-01-01 00:01:00'), strftime('%s','2006-02-06 17:15:00'), -5, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory WHERE code='NEW') AND serial_number='152320' AND begin=strftime('%s','1970-01-01 00:00:00') ),
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory WHERE code='NEW') AND serial_number='0142' AND begin=strftime('%s','1970-01-01 00:00:00') )
);
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( ( SELECT id FROM observatory WHERE code='NEW' ), 'Main', strftime('%s','2006-02-06 17:15:00'), strftime('%s','2007-05-15 19:00:00'), -6.2, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory WHERE code='NEW') AND serial_number='152320' AND begin=strftime('%s','1970-01-01 00:00:00') ),
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory WHERE code='NEW') AND serial_number='0142' AND begin=strftime('%s','1970-01-01 00:00:00') )
);
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( ( SELECT id FROM observatory WHERE code='NEW' ), 'Main', strftime('%s','2007-05-15 19:00:00'), strftime('%s','2012-05-10 00:00:00'), -4.2, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory WHERE code='NEW') AND serial_number='152320' AND begin=strftime('%s','1970-01-01 00:00:00') ),
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory WHERE code='NEW') AND serial_number='0142' AND begin=strftime('%s','1970-01-01 00:00:00') )
);
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( ( SELECT id FROM observatory WHERE code='NEW' ), 'Main', strftime('%s','2012-05-10 00:00:00'), NULL, -7.1, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory WHERE code='NEW') AND serial_number='152320' AND begin=strftime('%s','1970-01-01 00:00:00') ),
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory WHERE code='NEW') AND serial_number='0142' AND begin=strftime('%s','1970-01-01 00:00:00') )
);

/* set observatory.default_pier_id to Main */
UPDATE observatory 
SET default_pier_id = (SELECT id FROM pier
                       WHERE observatory_id = (SELECT id FROM observatory obs WHERE obs.code='NEW')
                         AND name = 'Main'
                         AND begin = strftime('%s','2012-05-10 00:00:00')
                      )
WHERE code = 'NEW'; 
 
/* add Mark=Main */
INSERT INTO mark (pier_id, name, begin, end, azimuth) 
VALUES ( 
  (SELECT id FROM pier WHERE observatory_id=(SELECT id FROM observatory WHERE observatory.code='NEW') 
                         AND name='Main' 
                         AND begin = strftime('%s','2012-05-10 00:00:00') ),
   'Main', strftime('%s','1970-01-01 00:00:00'), NULL, 16.955
);

/* update pier.default_mark_id */
UPDATE PIER SET default_mark_id = (SELECT id FROM mark WHERE name = 'Main'
                                     AND begin = strftime('%s','1970-01-01 00:00:00')
                                     AND pier_id = (SELECT id FROM pier 
                                                    WHERE observatory_id = (SELECT id FROM observatory obs WHERE obs.code='NEW')
                                                      AND name = 'Main'
                                                      AND begin = strftime('%s','2012-05-10 00:00:00')
                                                    )
                                   )
WHERE id = (SELECT id FROM pier WHERE observatory_id = ( SELECT id FROM observatory obs WHERE obs.code='NEW' )
                                  AND name='Main'
                                  AND begin = strftime('%s','2012-05-10 00:00:00')
            )                                   
;

/* SHU - add observatory entry */ 
INSERT INTO observatory (name, code, location, latitude, longitude, geomagnetic_latitude, geomagnetic_longitude, elevation, orientation)
 VALUES ('Shumagin (SHU)','SHU','Sand Point, Popof, AK' ,'55.3472' ,'160.4644' ,'256.78' ,'160.46' ,'80' ,'HDZF');
 
/* add SHU's instruments - not that there's no theodolite */
INSERT INTO instrument (observatory_id, serial_number, begin, end, name, type)
VALUES ( (SELECT id FROM observatory WHERE code='SHU'), '613997', strftime('%s','1970-01-01 00:00:00'), NULL, 'Electronics', 'elec');

/* add pier=Main */
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( ( SELECT id FROM observatory WHERE code='SHU' ), 'Main', strftime('%s','2003-10-01 00:00:00'), strftime('%s','2008-08-01 00:30:00'), 11.8, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory WHERE code='SHU') AND serial_number='613997' AND begin=strftime('%s','1970-01-01 00:00:00' )),
         NULL
);
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( ( SELECT id FROM observatory WHERE code='SHU' ), 'Main', strftime('%s','2008-08-01 00:30:00'), NULL, 13.1, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory WHERE code='SHU') AND serial_number='613997' AND begin=strftime('%s','1970-01-01 00:00:00' )),
         NULL
);


/* set observatory.default_pier_id to Main */
UPDATE observatory 
SET default_pier_id = (SELECT id FROM pier
                       WHERE observatory_id = (SELECT id FROM observatory obs WHERE obs.code='SHU')
                         AND name = 'Main'
                         AND begin = strftime('%s','2008-08-01 00:30:00')
                      )
WHERE code = 'SHU'; 
 
/* add Mark=Azimuth */
INSERT INTO mark (pier_id, name, begin, end, azimuth) 
VALUES ( 
  (SELECT id FROM pier WHERE observatory_id=(SELECT id FROM observatory WHERE observatory.code='SHU') 
                         AND name='Main' 
                         AND begin = strftime('%s','2008-08-01 00:30:00') ),
   'Azimuth', strftime('%s','1970-01-01 00:00:00'), NULL, 179.775
);

/* update pier.default_mark_id */
UPDATE PIER SET default_mark_id = (SELECT id FROM mark WHERE name = 'Azimuth'
                                     AND begin = strftime('%s','1970-01-01 00:00:00')
                                     AND pier_id = (SELECT id FROM pier 
                                                    WHERE observatory_id = (SELECT id FROM observatory obs WHERE obs.code='SHU')
                                                      AND name = 'Main'
                                                      AND begin = strftime('%s','2008-08-01 00:30:00')
                                                    )
                                   )
WHERE id = (SELECT id FROM pier WHERE observatory_id = ( SELECT id FROM observatory obs WHERE obs.code='SHU' )
                                  AND name='Main'
                                  AND begin = strftime('%s','2008-08-01 00:30:00')
            )                                   
;

/* SIT - add observatory entry */ 
INSERT INTO observatory (name, code, location, latitude, longitude, geomagnetic_latitude, geomagnetic_longitude, elevation, orientation)
 VALUES ('Sitka (SIT)','SIT','Sitka, AK','57.0576' ,'135.3273' ,'60.34' ,'280.35' ,'24' ,'HDZF');
 
/* add SIT's instruments */
INSERT INTO instrument (observatory_id, serial_number, begin, end, name, type)
VALUES ( (SELECT id FROM observatory WHERE code='SIT'), '351101', strftime('%s','1970-01-01 00:00:00'), NULL, 'Electronics', 'elec');
INSERT INTO instrument (observatory_id, serial_number, begin, end, name, type)
VALUES ( (SELECT id FROM observatory WHERE code='SIT'), '0138', strftime('%s','1970-01-01 00:00:00'), NULL, 'Theodolite', 'theo');

/* add pier=Main */
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( ( SELECT id FROM observatory WHERE code='SIT' ), 'Main', strftime('%s','1970-01-01 00:00:00'), strftime('%s','2007-05-08 00:00:00'), -2, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory WHERE code='SIT') AND serial_number='351101' AND begin=strftime('%s','1970-01-01 00:00:00') ),
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory WHERE code='SIT') AND serial_number='0138' AND begin=strftime('%s','1970-01-01 00:00:00') )
);
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( ( SELECT id FROM observatory WHERE code='SIT' ), 'Main', strftime('%s','2007-05-08 00:00:00'), NULL, 3.2, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory WHERE code='SIT') AND serial_number='351101' AND begin=strftime('%s','1970-01-01 00:00:00') ),
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory WHERE code='SIT') AND serial_number='0138' AND begin=strftime('%s','1970-01-01 00:00:00') )
);

/* set observatory.default_pier_id to Main */
UPDATE observatory 
SET default_pier_id = (SELECT id FROM pier
                       WHERE observatory_id = (SELECT id FROM observatory obs WHERE obs.code='SIT')
                         AND name = 'Main'
                         AND begin = strftime('%s','2007-05-08 00:00:00')
                      )
WHERE code = 'SIT'; 
 
/* add Mark=Azimuth */
INSERT INTO mark (pier_id, name, begin, end, azimuth) 
VALUES ( 
  (SELECT id FROM pier WHERE observatory_id=(SELECT id FROM observatory WHERE observatory.code='SIT') 
                         AND name='Main' 
                         AND begin = strftime('%s','2007-05-08 00:00:00') ),
   'Azimuth', strftime('%s','1970-01-01 00:00:00'), NULL, 35.525
);

/* update pier.default_mark_id */
UPDATE PIER SET default_mark_id = (SELECT id FROM mark WHERE name = 'Azimuth'
                                     AND begin = strftime('%s','1970-01-01 00:00:00')
                                     AND pier_id = (SELECT id FROM pier 
                                                    WHERE observatory_id = (SELECT id FROM observatory obs WHERE obs.code='SIT')
                                                      AND name = 'Main'
                                                      AND begin = strftime('%s','2007-05-08 00:00:00')
                                                    )
                                   )
WHERE id = (SELECT id FROM pier WHERE observatory_id = ( SELECT id FROM observatory obs WHERE obs.code='SIT' )
                                  AND name='Main'
                                  AND begin = strftime('%s','2007-05-08 00:00:00')
            )                                   
;

/* SJG - add observatory entry */ 
INSERT INTO observatory (name, code, location, latitude, longitude, geomagnetic_latitude, geomagnetic_longitude, elevation, orientation)
 VALUES ('San Juan (SJG)','SJG','Cayey, PR','18.1110' ,'66.1498' ,'28.31' ,'6.08' ,'424' ,'HDZF');
 
/* add SJG's instruments */
INSERT INTO instrument (observatory_id, serial_number, begin, end, name, type)
VALUES ( (SELECT id FROM observatory WHERE code='SJG'), '154162', strftime('%s','1970-01-01 00:00:00'), NULL, 'Electronics', 'elec');
INSERT INTO instrument (observatory_id, serial_number, begin, end, name, type)
VALUES ( (SELECT id FROM observatory WHERE code='SJG'), '0126', strftime('%s','1970-01-01 00:00:00'), NULL, 'Theodolite', 'theo');

/* add pier=Main */
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( ( SELECT id FROM observatory WHERE code='SJG' ), 'Main', strftime('%s','1970-01-01 00:00:00'), strftime('%s','2003-01-01 00:00:01'), 43.5, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory WHERE code='SJG') AND serial_number='154162' AND begin=strftime('%s','1970-01-01 00:00:00') ),
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory WHERE code='SJG') AND serial_number='0126' AND begin=strftime('%s','1970-01-01 00:00:00') )
);
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( ( SELECT id FROM observatory WHERE code='SJG' ), 'Main', strftime('%s','2003-01-01 00:00:01'), strftime('%s','2003-01-16 00:00:00'), 46, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory WHERE code='SJG') AND serial_number='154162' AND begin=strftime('%s','1970-01-01 00:00:00') ),
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory WHERE code='SJG') AND serial_number='0126' AND begin=strftime('%s','1970-01-01 00:00:00') )
);
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( ( SELECT id FROM observatory WHERE code='SJG' ), 'Main', strftime('%s','2003-01-16 00:00:00'), strftime('%s','2008-01-18 14:00:00'), -51.7, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory WHERE code='SJG') AND serial_number='154162' AND begin=strftime('%s','1970-01-01 00:00:00') ),
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory WHERE code='SJG') AND serial_number='0126' AND begin=strftime('%s','1970-01-01 00:00:00') )
);
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( ( SELECT id FROM observatory WHERE code='SJG' ), 'Main', strftime('%s','2008-01-18 14:00:00'), NULL, -55, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory WHERE code='SJG') AND serial_number='154162' AND begin=strftime('%s','1970-01-01 00:00:00') ),
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory WHERE code='SJG') AND serial_number='0126' AND begin=strftime('%s','1970-01-01 00:00:00') )
);

INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( ( SELECT id FROM observatory WHERE code='SJG' ), 'N', strftime('%s','1970-01-01 00:00:00'), NULL, -55, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory WHERE code='SJG') AND serial_number='154162' AND begin=strftime('%s','1970-01-01 00:00:00') ),
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory WHERE code='SJG') AND serial_number='0126' AND begin=strftime('%s','1970-01-01 00:00:00') )
);

/* set observatory.default_pier_id to Main */
UPDATE observatory 
SET default_pier_id = (SELECT id FROM pier
                       WHERE observatory_id = (SELECT id FROM observatory obs WHERE obs.code='SJG')
                         AND name = 'Main'
                         AND begin = strftime('%s','2008-01-18 14:00:00')
                      )
WHERE code = 'SJG'; 
 
/* add Mark=Main */
INSERT INTO mark (pier_id, name, begin, end, azimuth) 
VALUES ( 
  (SELECT id FROM pier WHERE observatory_id=(SELECT id FROM observatory WHERE observatory.code='SJG') 
                         AND name='Main' 
                         AND begin = strftime('%s','2008-01-18 14:00:00') ),
   'Main', strftime('%s','1970-01-01 00:00:00'), NULL, 117.3116
);

INSERT INTO mark (pier_id, name, begin, end, azimuth) 
VALUES ( 
  (SELECT id FROM pier WHERE observatory_id=(SELECT id FROM observatory WHERE observatory.code='SJG') 
                         AND name='N' 
                         AND begin = strftime('%s','1970-01-01 00:00:00') ),
   'Main', strftime('%s','1970-01-01 00:00:00'), NULL, 63.6506
);

/* update pier.default_mark_id */
UPDATE PIER SET default_mark_id = (SELECT id FROM mark WHERE name = 'Main'
                                     AND begin = strftime('%s','1970-01-01 00:00:00')
                                     AND pier_id = (SELECT id FROM pier 
                                                    WHERE observatory_id = (SELECT id FROM observatory obs WHERE obs.code='SJG')
                                                      AND name = 'Main'
                                                      AND begin = strftime('%s','2008-01-18 14:00:00')
                                                    )
                                   )
WHERE id = (SELECT id FROM pier WHERE observatory_id = ( SELECT id FROM observatory obs WHERE obs.code='SJG' )
                                  AND name='Main'
                                  AND begin = strftime('%s','2008-01-18 14:00:00')
            )                                   
;

UPDATE PIER SET default_mark_id = (SELECT id FROM mark WHERE name = 'Main'
                                     AND begin = strftime('%s','1970-01-01 00:00:00')
                                     AND pier_id = (SELECT id FROM pier 
                                                    WHERE observatory_id = (SELECT id FROM observatory obs WHERE obs.code='SJG')
                                                      AND name = 'N'
                                                      AND begin = strftime('%s','2008-01-18 14:00:00')
                                                    )
                                   )
WHERE id = (SELECT id FROM pier WHERE observatory_id = ( SELECT id FROM observatory obs WHERE obs.code='SJG' )
                                  AND name='N'
                                  AND begin = strftime('%s','2008-01-18 14:00:00')
            )                                   
;

/* TUC - add observatory entry */ 
INSERT INTO observatory (name, code, location, latitude, longitude, geomagnetic_latitude, geomagnetic_longitude, elevation, orientation)
 VALUES ('Tucson (TUC)','TUC','Tucson, AZ','32.1745' ,'110.7337' ,'39.88' ,'316.11' ,'946' ,'HDZF');

/* add TUC's instruments - two pairs*/
/* this is the original epoch */
INSERT INTO instrument (observatory_id, serial_number, begin, end, name, type)
VALUES ( (SELECT id FROM observatory WHERE code='TUC'), '808075', strftime('%s','1970-01-01 00:00:00'), strftime('%s','2012-05-27 23:59:59'), 'Electronics', 'elec');
INSERT INTO instrument (observatory_id, serial_number, begin, end, name, type)
VALUES ( (SELECT id FROM observatory WHERE code='TUC'), '003', strftime('%s','1970-01-01 00:00:00'), strftime('%s','2012-05-27 23:59:59'), 'Theodolite', 'theo');
/* instruments changed on 05-28-2012 */
INSERT INTO instrument (observatory_id, serial_number, begin, end, name, type)
VALUES ( (SELECT id FROM observatory WHERE code='TUC'), '150324', strftime('%s','2012-05-28 00:00:00'), NULL, 'Electronics', 'elec');
INSERT INTO instrument (observatory_id, serial_number, begin, end, name, type)
VALUES ( (SELECT id FROM observatory WHERE code='TUC'), '141', strftime('%s','2012-05-28 00:00:00'), NULL, 'Theodolite', 'theo');

/* Add piers - This observatory has a complex pier history (fortunately all have same name=Main) */
/* this is the first epoch */
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( ( SELECT id FROM observatory WHERE code='TUC' ), 'Main', strftime('%s','1970-01-01 00:00:00'), strftime('%s','2005-11-01 00:00:00'), -3.7, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory WHERE code='TUC') AND serial_number='808075' AND begin=strftime('%s','1970-01-01 00:00:00') ),
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory WHERE code='TUC') AND serial_number='003' AND begin=strftime('%s','1970-01-01 00:00:00') )
);
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( ( SELECT id FROM observatory WHERE code='TUC' ), 'Main', strftime('%s','2005-11-01 00:00:00'), strftime('%s','2006-04-14 00:00:00'), -3.7, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory WHERE code='TUC') AND serial_number='808075' AND begin=strftime('%s','1970-01-01 00:00:00') ),
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory WHERE code='TUC') AND serial_number='003' AND begin=strftime('%s','1970-01-01 00:00:00') )
);
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( ( SELECT id FROM observatory WHERE code='TUC' ), 'Main', strftime('%s','2006-04-14 00:00:00'), strftime('%s','2011-01-01 00:00:00'), -2.3, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory WHERE code='TUC') AND serial_number='808075' AND begin=strftime('%s','1970-01-01 00:00:00') ),
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory WHERE code='TUC') AND serial_number='003' AND begin=strftime('%s','1970-01-01 00:00:00') )
);
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( ( SELECT id FROM observatory WHERE code='TUC' ), 'Main', strftime('%s','2011-01-01 00:00:00'), strftime('%s','2011-02-01 00:00:00'), -3, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory WHERE code='TUC') AND serial_number='808075' AND begin=strftime('%s','1970-01-01 00:00:00') ),
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory WHERE code='TUC') AND serial_number='003' AND begin=strftime('%s','1970-01-01 00:00:00') )
);
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( ( SELECT id FROM observatory WHERE code='TUC' ), 'Main', strftime('%s','2011-02-01 00:00:00'), strftime('%s','2011-03-01 00:00:00'), -4, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory WHERE code='TUC') AND serial_number='808075' AND begin=strftime('%s','1970-01-01 00:00:00') ),
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory WHERE code='TUC') AND serial_number='003' AND begin=strftime('%s','1970-01-01 00:00:00') )
);
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( ( SELECT id FROM observatory WHERE code='TUC' ), 'Main', strftime('%s','2011-03-01 00:00:00'), strftime('%s','2012-01-01 00:00:00'), -4.8, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory WHERE code='TUC') AND serial_number='808075' AND begin=strftime('%s','1970-01-01 00:00:00') ),
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory WHERE code='TUC') AND serial_number='003' AND begin=strftime('%s','1970-01-01 00:00:00') )
);
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( ( SELECT id FROM observatory WHERE code='TUC' ), 'Main', strftime('%s','2012-01-01 00:00:00'), strftime('%s','2012-08-21 00:00:00'), -5.4, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory WHERE code='TUC') AND serial_number='808075' AND begin=strftime('%s','1970-01-01 00:00:00') ),
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory WHERE code='TUC') AND serial_number='003' AND begin=strftime('%s','1970-01-01 00:00:00') )
);
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( ( SELECT id FROM observatory WHERE code='TUC' ), 'Main', strftime('%s','2012-08-21 00:00:00'), NULL, -4.7, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory WHERE code='TUC') AND serial_number='808075' AND begin=strftime('%s','1970-01-01 00:00:00') ),
         ( SELECT id FROM instrument WHERE observatory_id=(SELECT id FROM observatory WHERE code='TUC') AND serial_number='003' AND begin=strftime('%s','1970-01-01 00:00:00') )
);


/* set observatory.default_pier_id to Main */
UPDATE observatory 
SET default_pier_id = (SELECT id FROM pier
                       WHERE observatory_id = (SELECT id FROM observatory obs WHERE obs.code='TUC')
                         AND name = 'Main'
                         AND begin = strftime('%s','2012-08-21 00:00:00')
                      )
WHERE code = 'TUC'; 
 
/* There's just one Mark=Main, but these point back to piers, which have complex history.  */
/* So, the mark epochs have to be in lockstep with the piers */
/*   1970-01-01 00:00:00 ->  */
INSERT INTO mark (pier_id, name, begin, end, azimuth) 
VALUES ( 
  (SELECT id FROM pier WHERE observatory_id=(SELECT id FROM observatory WHERE observatory.code='TUC') 
                         AND name='Main' 
                         AND begin=strftime('%s','1970-01-01 00:00:00') ),
   'Main', strftime('%s','1970-01-01 00:00:00'), strftime('%s','2005-11-01 00:00:00'), 21.3767
);

INSERT INTO mark (pier_id, name, begin, end, azimuth) 
VALUES ( 
  (SELECT id FROM pier WHERE observatory_id=(SELECT id FROM observatory WHERE observatory.code='TUC') 
                         AND name='Main' 
                         AND begin = strftime('%s','2005-11-01 00:00:00') ),
   'Main', strftime('%s','2005-11-01 00:00:00'), strftime('%s','2006-04-14 00:00:00'), 21.3767
);

INSERT INTO mark (pier_id, name, begin, end, azimuth) 
VALUES ( 
  (SELECT id FROM pier WHERE observatory_id=(SELECT id FROM observatory WHERE observatory.code='TUC') 
                         AND name='Main' 
                         AND begin = strftime('%s','2006-04-14 00:00:00') ),
   'Main', strftime('%s','2006-04-14 00:00:00'), strftime('%s','2011-01-01 00:00:00'), 21.3767
);

INSERT INTO mark (pier_id, name, begin, end, azimuth) 
VALUES ( 
  (SELECT id FROM pier WHERE observatory_id=(SELECT id FROM observatory WHERE observatory.code='TUC') 
                         AND name='Main' 
                         AND begin = strftime('%s','2011-01-01 00:00:00') ),
   'Main', strftime('%s','2011-01-01 00:00:00'), strftime('%s','2011-02-01 00:00:00'), 21.3767
);

INSERT INTO mark (pier_id, name, begin, end, azimuth) 
VALUES ( 
  (SELECT id FROM pier WHERE observatory_id=(SELECT id FROM observatory WHERE observatory.code='TUC') 
                         AND name='Main' 
                         AND begin = strftime('%s','2011-02-01 00:00:00') ),
   'Main', strftime('%s','2011-02-01 00:00:00'), strftime('%s','2011-03-01 00:00:00'), 21.3767
);

INSERT INTO mark (pier_id, name, begin, end, azimuth) 
VALUES ( 
  (SELECT id FROM pier WHERE observatory_id=(SELECT id FROM observatory WHERE observatory.code='TUC') 
                         AND name='Main' 
                         AND begin = strftime('%s','2011-03-01 00:00:00') ),
   'Main', strftime('%s','2011-03-01 00:00:00'), strftime('%s','2012-01-01 00:00:00'), 21.3767
);

INSERT INTO mark (pier_id, name, begin, end, azimuth) 
VALUES ( 
  (SELECT id FROM pier WHERE observatory_id=(SELECT id FROM observatory WHERE observatory.code='TUC') 
                         AND name='Main' 
                         AND begin = strftime('%s','2012-01-01 00:00:00') ),
   'Main', strftime('%s','2012-01-01 00:00:00'), strftime('%s','2012-08-21 00:00:00'), 21.3767
);

INSERT INTO mark (pier_id, name, begin, end, azimuth) 
VALUES ( 
  (SELECT id FROM pier WHERE observatory_id=(SELECT id FROM observatory WHERE observatory.code='TUC') 
                         AND name='Main' 
                         AND begin = strftime('%s','2012-08-21 00:00:00') ),
   'Main', strftime('%s','2012-08-21 00:00:00'), NULL, 21.3767
);


UPDATE PIER SET default_mark_id = (SELECT id FROM mark WHERE name = 'Main'
                                     AND begin = strftime('%s','1970-01-01 00:00:00')
                                     AND pier_id = (SELECT id FROM pier 
                                                    WHERE observatory_id = (SELECT id FROM observatory obs WHERE obs.code='TUC')
                                                      AND name = 'Main'
                                                      AND begin = strftime('%s','1970-01-01 00:00:00')
                                                    )
                                   )
WHERE id = (SELECT id FROM pier WHERE observatory_id = ( SELECT id FROM observatory obs WHERE obs.code='TUC' )
                                  AND name='Main'
                                  AND begin = strftime('%s','1970-01-01 00:00:00')
            )                                   
;


UPDATE PIER SET default_mark_id = (SELECT id FROM mark WHERE name = 'Main'
                                     AND begin = strftime('%s','2005-11-01 00:00:00')
                                     AND pier_id = (SELECT id FROM pier 
                                                    WHERE observatory_id = (SELECT id FROM observatory obs WHERE obs.code='TUC')
                                                      AND name = 'Main'
                                                      AND begin = strftime('%s','2005-11-01 00:00:00')
                                                    )
                                   )
WHERE id = (SELECT id FROM pier WHERE observatory_id = ( SELECT id FROM observatory obs WHERE obs.code='TUC' )
                                  AND name='Main'
                                  AND begin = strftime('%s','1970-01-01 00:00:00')
            )                                   
;


UPDATE PIER SET default_mark_id = (SELECT id FROM mark WHERE name = 'Main'
                                     AND begin = strftime('%s','2006-04-14 00:00:00')
                                     AND pier_id = (SELECT id FROM pier 
                                                    WHERE observatory_id = (SELECT id FROM observatory obs WHERE obs.code='TUC')
                                                      AND name = 'Main'
                                                      AND begin = strftime('%s','2006-04-14 00:00:00')
                                                    )
                                   )
WHERE id = (SELECT id FROM pier WHERE observatory_id = ( SELECT id FROM observatory obs WHERE obs.code='TUC' )
                                  AND name='Main'
                                  AND begin = strftime('%s','1970-01-01 00:00:00')
            )                                   
;


UPDATE PIER SET default_mark_id = (SELECT id FROM mark WHERE name = 'Main'
                                     AND begin = strftime('%s','2011-01-01 00:00:00')
                                     AND pier_id = (SELECT id FROM pier 
                                                    WHERE observatory_id = (SELECT id FROM observatory obs WHERE obs.code='TUC')
                                                      AND name = 'Main'
                                                      AND begin = strftime('%s','2011-01-01 00:00:00')
                                                    )
                                   )
WHERE id = (SELECT id FROM pier WHERE observatory_id = ( SELECT id FROM observatory obs WHERE obs.code='TUC' )
                                  AND name='Main'
                                  AND begin = strftime('%s','1970-01-01 00:00:00')
            )                                   
;


UPDATE PIER SET default_mark_id = (SELECT id FROM mark WHERE name = 'Main'
                                     AND begin = strftime('%s','2011-02-01 00:00:00')
                                     AND pier_id = (SELECT id FROM pier 
                                                    WHERE observatory_id = (SELECT id FROM observatory obs WHERE obs.code='TUC')
                                                      AND name = 'Main'
                                                      AND begin = strftime('%s','2011-02-01 00:00:00')
                                                    )
                                   )
WHERE id = (SELECT id FROM pier WHERE observatory_id = ( SELECT id FROM observatory obs WHERE obs.code='TUC' )
                                  AND name='Main'
                                  AND begin = strftime('%s','1970-01-01 00:00:00')
            )                                   
;


UPDATE PIER SET default_mark_id = (SELECT id FROM mark WHERE name = 'Main'
                                     AND begin = strftime('%s','2011-03-01 00:00:00')
                                     AND pier_id = (SELECT id FROM pier 
                                                    WHERE observatory_id = (SELECT id FROM observatory obs WHERE obs.code='TUC')
                                                      AND name = 'Main'
                                                      AND begin = strftime('%s','2011-03-01 00:00:00')
                                                    )
                                   )
WHERE id = (SELECT id FROM pier WHERE observatory_id = ( SELECT id FROM observatory obs WHERE obs.code='TUC' )
                                  AND name='Main'
                                  AND begin = strftime('%s','1970-01-01 00:00:00')
            )                                   
;


UPDATE PIER SET default_mark_id = (SELECT id FROM mark WHERE name = 'Main'
                                     AND begin = strftime('%s','2012-01-01 00:00:00')
                                     AND pier_id = (SELECT id FROM pier 
                                                    WHERE observatory_id = (SELECT id FROM observatory obs WHERE obs.code='TUC')
                                                      AND name = 'Main'
                                                      AND begin = strftime('%s','2012-01-01 00:00:00')
                                                    )
                                   )
WHERE id = (SELECT id FROM pier WHERE observatory_id = ( SELECT id FROM observatory obs WHERE obs.code='TUC' )
                                  AND name='Main'
                                  AND begin = strftime('%s','1970-01-01 00:00:00')
            )                                   
;


UPDATE PIER SET default_mark_id = (SELECT id FROM mark WHERE name = 'Main'
                                     AND begin = strftime('%s','2012-08-21 00:00:00')
                                     AND pier_id = (SELECT id FROM pier 
                                                    WHERE observatory_id = (SELECT id FROM observatory obs WHERE obs.code='TUC')
                                                      AND name = 'Main'
                                                      AND begin = strftime('%s','2012-08-21 00:00:00')
                                                    )
                                   )
WHERE id = (SELECT id FROM pier WHERE observatory_id = ( SELECT id FROM observatory obs WHERE obs.code='TUC' )
                                  AND name='Main'
                                  AND begin = strftime('%s','1970-01-01 00:00:00')
            )                                   
;

