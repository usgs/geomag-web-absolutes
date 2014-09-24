/* FRD - add observatory entry */
INSERT INTO observatory (name, code, location, latitude, longitude, geomagnetic_latitude, geomagnetic_longitude, elevation, orientation)
 VALUES ('Fredericksburg (FRD)','FRD' ,'Corbin, VA','38.2047' ,'-77.3729' ,'48.40' ,'353.38' ,'69' ,'HDZF');

/* get id of newly-added observatory row */
SELECT id FROM observatory WHERE code='FRD' INTO @observatory_id;

/* add FRD's current instruments - Inst. No., 814503/0109 */
INSERT INTO instrument (observatory_id, serial_number, begin, end, name, type)
VALUES ( @observatory_id, '814503', 1000*unix_timestamp('1970-01-01 00:00:00'), NULL, 'Electronics', 'elec');
INSERT INTO instrument (observatory_id, serial_number, begin, end, name, type)
VALUES ( @observatory_id, '0109', 1000*unix_timestamp('1970-01-01 00:00:00'), NULL, 'Theodolite', 'theo');

/* add pier=Main */
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( @observatory_id, '3D', 1000*unix_timestamp('1970-01-01 00:00:00'), NULL, -4.6, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='814503' AND begin=1000*unix_timestamp('1970-01-01 00:00:00') ),
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='0109' AND begin=1000*unix_timestamp('1970-01-01 00:00:00') )
);

/* set observatory.default_pier_id to 3D */
SELECT id 
FROM pier
WHERE observatory_id=@observatory_id
  AND name = '3D'
  AND begin = 1000*unix_timestamp('1970-01-01 00:00:00')
INTO @default_pier_id;
                                  
UPDATE observatory
SET default_pier_id = @default_pier_id
WHERE code = 'FRD'; 
 
/* add Mark=West Monument */
INSERT INTO mark (pier_id, name, begin, end, azimuth) 
VALUES ( 
  (SELECT id FROM pier WHERE observatory_id=@observatory_id
                         AND name='3D' 
                         AND begin=1000*unix_timestamp('1970-01-01 00:00:00')),
   'West Monument', 1000*unix_timestamp('1970-01-01 00:00:00'), NULL, 13.4926
);

/* update pier.default_mark_id */
SELECT id
FROM pier 
WHERE observatory_id=@observatory_id
  AND name='3D'
  AND begin=1000*unix_timestamp('1970-01-01 00:00:00')
INTO @pier_id;

SELECT id
FROM mark
WHERE name = 'West Monument'
  AND begin = 1000*unix_timestamp('1970-01-01 00:00:00')
  AND pier_id = @pier_id
INTO @default_mark_id;

UPDATE PIER SET default_mark_id = @default_mark_id
WHERE id = @pier_id;
