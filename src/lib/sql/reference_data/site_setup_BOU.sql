/* BOU - add observatory entry */
INSERT INTO observatory (name, code, location, latitude, longitude, geomagnetic_latitude, geomagnetic_longitude, elevation, orientation, default_pier_id)
VALUES ('Boulder (BOU)','BOU','Boulder, CO' ,'40.1375' ,'-105.2372' ,'48.40' ,'320.59' ,'1682' ,'HDZF', NULL);

/* get id of newly-added observatory row */
SELECT id FROM observatory WHERE code='BOU' INTO @observatory_id;

/* add BOU's current instruments - Inst. No., 109648/0110/110 */
INSERT INTO instrument (observatory_id, serial_number, begin, end, name, type)
VALUES ( @observatory_id, '109648', 1000*unix_timestamp('1970-01-01 00:00:00'), NULL, 'Electronics', 'elec');
INSERT INTO instrument (observatory_id, serial_number, begin, end, name, type)
VALUES ( @observatory_id, '0110', 1000*unix_timestamp('1970-01-01 00:00:00'), NULL, 'Theodolite', 'theo');

/* add pier=Main */
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( @observatory_id, 'Main', 1000*unix_timestamp('1970-01-01 00:00:00'), NULL, -23.1, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='109648' AND begin=1000*unix_timestamp('1970-01-01 00:00:00') ),
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='0110' AND begin=1000*unix_timestamp('1970-01-01 00:00:00') )
);

/* set observatory.default_pier_id to Main */
SELECT id
FROM pier
WHERE observatory_id=@observatory_id
  AND name = 'Main'
  AND begin=1000*unix_timestamp('1970-01-01 00:00:00')
INTO @default_pier_id;

UPDATE observatory
SET default_pier_id = @default_pier_id
WHERE code = 'BOU';

/* add Mark=AZ */
INSERT INTO mark (pier_id, name, begin, end, azimuth)
VALUES (
  (SELECT id FROM pier WHERE observatory_id=@observatory_id
                         AND name='Main'
                         AND begin=1000*unix_timestamp('1970-01-01 00:00:00') ),
   'AZ', 1000*unix_timestamp('1970-01-01 00:00:00'), NULL, 199.1383
);

/* update pier.default_mark_id */
SELECT id
FROM pier
WHERE observatory_id=@observatory_id
  AND name='Main'
  AND begin = 1000*unix_timestamp('1970-01-01 00:00:00')
INTO @pier_id;

SELECT id
FROM mark
WHERE name = 'AZ'
  AND begin = 1000*unix_timestamp('1970-01-01 00:00:00')
  AND pier_id = @pier_id
INTO @default_mark_id;

UPDATE PIER SET default_mark_id = @default_mark_id
WHERE id = @pier_id;
