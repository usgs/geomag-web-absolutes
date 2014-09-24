/* CMO - observatory entry */
INSERT INTO observatory (name, code, location, latitude, longitude, geomagnetic_latitude, geomagnetic_longitude, elevation, orientation, default_pier_id)
 VALUES ('College (CMO)','CMO' ,'Fairbanks, AK' ,'64.8742' ,'-147.8597' ,'65.38' ,'261.63' ,'197' ,'HDZF', NULL);

/* get id of newly-added observatory row */
SELECT id FROM observatory WHERE code='CMO' INTO @observatory_id;

/* insert CMO's current instruments - Inst. No., 200803/0143 */
INSERT INTO instrument (observatory_id, serial_number, begin, end, name, type)
VALUES ( @observatory_id, '200803', 1000*unix_timestamp('1970-01-01 00:00:00'), NULL, 'Electronics', 'elec');
INSERT INTO instrument (observatory_id, serial_number, begin, end, name, type)
VALUES ( @observatory_id, '0143', 1000*unix_timestamp('1970-01-01 00:00:00'), NULL, 'Theodolite', 'theo');

/* add pier=1A */
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( @observatory_id, '1A', 1000*unix_timestamp('1970-01-01 00:00:00'), NULL, 10.5, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='200803' AND begin=1000*unix_timestamp('1970-01-01 00:00:00') ),
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='0143' AND begin=1000*unix_timestamp('1970-01-01 00:00:00') )
);

/* set observatory.default_pier_id to 1A */
SELECT id 
FROM pier
WHERE observatory_id=@observatory_id
  AND name = '1A'
  AND begin = 1000*unix_timestamp('1970-01-01 00:00:00')
INTO @default_pier_id;
                                  
UPDATE observatory
SET default_pier_id = @default_pier_id
WHERE code = 'CMO'; 

/* add  mark=Azimuth */
INSERT INTO mark (pier_id, name, begin, end, azimuth) 
VALUES ( 
  (SELECT id FROM pier WHERE observatory_id=@observatory_id
                         AND name='1A' 
                         AND begin = 1000*unix_timestamp('1970-01-01 00:00:00') ),
   'Azimuth', 1000*unix_timestamp('1970-01-01 00:00:00'), NULL, 27.5613
);

/* update pier.default_mark_ids */
SELECT id
FROM pier 
WHERE observatory_id=@observatory_id
  AND name='1A'
  AND begin = 1000*unix_timestamp('1970-01-01 00:00:00')
INTO @pier_id;

SELECT id
FROM mark
WHERE name = 'Azimuth'
  AND begin = 1000*unix_timestamp('1970-01-01 00:00:00')
  AND pier_id = @pier_id
INTO @default_mark_id;

UPDATE PIER SET default_mark_id = @default_mark_id
WHERE id = @pier_id;
