/* GUA - add observatory entry */
INSERT INTO observatory (name, code, location, latitude, longitude, geomagnetic_latitude, geomagnetic_longitude, elevation, orientation)
 VALUES ('Guam (GUA)','GUA','Dededo, Guam','13.5895' ,'144.8694' ,'5.30' ,'215.64' ,'140' ,'HDZF');

/* get id of newly-added observatory row */
SELECT id FROM observatory WHERE code='GUA' INTO @observatory_id;

/* add GUA's current instruments - Inst. No., 154155/0125 */
INSERT INTO instrument (observatory_id, serial_number, begin, end, name, type)
VALUES ( @observatory_id, '154155', 1000*unix_timestamp('1970-01-01 00:00:00'), NULL, 'Electronics', 'elec');
INSERT INTO instrument (observatory_id, serial_number, begin, end, name, type)
VALUES ( @observatory_id, '0125', 1000*unix_timestamp('1970-01-01 00:00:00'), NULL, 'Theodolite', 'theo');

/* add pier=Main */
INSERT INTO PIER (observatory_id, name, begin, end, correction, default_mark_id, default_electronics_id, default_theodolite_id)
VALUES ( @observatory_id, 'Main', 1000*unix_timestamp('1970-01-01 00:00:00'), NULL, 7.9, NULL,
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='154155' AND begin=1000*unix_timestamp('1970-01-01 00:00:00') ),
         ( SELECT id FROM instrument WHERE observatory_id=@observatory_id AND serial_number='0125' AND begin=1000*unix_timestamp('1970-01-01 00:00:00') )
);

/* set observatory.default_pier_id to Main */
SELECT id
FROM pier
WHERE observatory_id=@observatory_id
  AND name = 'Main'
  AND begin = 1000*unix_timestamp('1970-01-01 00:00:00')
INTO @default_pier_id;

UPDATE observatory
SET default_pier_id = @default_pier_id
WHERE code = 'GUA';

/* add Mark=Azimuth */
INSERT INTO mark (pier_id, name, begin, end, azimuth)
VALUES (
  (SELECT id FROM pier WHERE observatory_id=@observatory_id
                         AND name='Main'
                         AND begin = 1000*unix_timestamp('1970-01-01 00:00:00') ),
   'Azimuth', 1000*unix_timestamp('1970-01-01 00:00:00'), NULL, 2.5233
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
WHERE name = 'Azimuth'
  AND begin = 1000*unix_timestamp('1970-01-01 00:00:00')
  AND pier_id = @pier_id
INTO @default_mark_id;

UPDATE PIER SET default_mark_id = @default_mark_id
WHERE id = @pier_id;
