Observatory Reference Information
=================================

The `observatory` table defines basic observatory metadata.
Several tables store reference information for each observatory including:
- `pier`
- `mark`
- `instrument`

Observatory baseline observations are stored in the `observation` table,
and refer to reference information using database ids.  Each observation has
one or more readings, stored in the `reading` table.  Each reading has one or
more measurements, stored in the `measurement` table.


# Reference tables

Records in reference tables represent time intervals for the associated
information, and multiple records may refer to the same physical instrument,
pier, or mark.

All reference tables (`pier`, `mark`, and `instrument`) use
`begin` and `end` unix epoch timestamps to identify the time interval for which
information is considered valid.

The interval is closed for `begin` (includes the begin time)
and open for `end` (excludes the end time),
which can be written as `[begin, end)`.

- `begin` - (int) unix epoch timestamp.

  When `begin` is null that indicates no start time,
  or that the information can be used for any time before `end`

- `end` - (int) unix epoch timestamp.

  When `end` is null that indicates no end time,
  or that the information can be used for any time after `begin`.

> NOTE: Because observations refer to information in reference tables using ids,
> **do not modify existing reference data**.
> Instead, close the epoch for an existing records by setting the `end` time
> and insert a new record to represent a new epoch.


## Instrument

The `instrument` table describes hardware used to create baseline observations.
- `id` - (int) primary key
- `observatory_id` - (int) foreign key to `observatory.id`
- `serial_number` - (text) serial number of instrument
- `name` - (text) name of instrument
- `type` - (text) but usually `theodolite` or `electronics`
- `begin`, `end` - (int) time when instrument is valid

The logical key for this table is the combination of
  (`observatory_id`, `serial_number`, `type`, `begin`).

> If an instrument is both `theodolite` and `electronics`,
> it should have one record in this table for each type.
> Similarly, if an instrument is repaired, multiple records may be used to
> identify the instrument before and after its repair.

## Pier

The `pier` table describes a pier correction value for a specific time period,
rather than a physical pier, so there may be multiple records for the same
physical pier.
- `id` - (int) primary key
- `observatory_id` - (int) foreign key to `observatory.id`
- `name` - (text) name of pier
- `correction` - (float) pier correction value
- `default_mark_id` - (int) foreign key to `mark.id`
- `default_electronics_id` - (int) foreign key to `instrument.id`
- `default_theodolite_id` - (int) foreign key to `instrument.id`
- `begin`, `end` - (int) time when pier correction is valid

The unique constraint for this table is the combination of
  (`observatory_id`, `name`, `correction`, `begin`).

## Mark

The `mark` table describes the azimuth to a given mark, for a *specific* `pier`.

- `id` - (int) primary key
- `pier_id` - (int) foreign key to `pier.id`
- `name` - (text) name of azimuth
- `azimuth` - (float) azimuth from pier to mark
- `begin`, `end` - time when mark azimuth is valid.

> Piers may have multiple marks associated, with different names or azimuths,
> but mark records are always associated to a specific pier correction epoch.


## Examples

> NOTE: these examples are specific to mysql.

# Add a new pier correction

```sql
-- define pier to insert
SET @observatory = 'BOU';
SET @pier_begin = UNIX_TIMESTAMP('2016-01-01T00:00:00Z');
SET @pier_correction = -22.0;
SET @pier_name = 'MainPCDCP';
SET @mark_name = 'AZ';
SET @mark_azimuth = 199.1383;
-- end define pier, remaining SQL should not require modification


-- look up observatory id
SET @observatory_id = (SELECT id FROM observatory WHERE code=@observatory);

-- close existing pier and mark epoch
UPDATE pier p
SET p.end = @pier_begin
WHERE observatory_id = @observatory_id
AND p.end is NULL;

-- add new pier epoch
INSERT INTO pier (observatory_id, name, begin, end, correction)
VALUES (
  @observatory_id,
  @pier_name,
  @pier_begin,
  null,
  @pier_correction
);
SET @pier_id = LAST_INSERT_ID();

-- add new mark epoch associated to new pier epoch
INSERT INTO mark (pier_id, name, begin, end, azimuth)
VALUES (
  @pier_id,
  @mark_name,
  @pier_begin,
  null,
  @mark_azimuth
);
SET @mark_id = LAST_INSERT_ID();

-- set new mark as default for new pier
UPDATE pier
SET default_mark_id = @mark_id
WHERE id = @pier_id;

-- set new pier as default for observatory
UPDATE observatory
SET default_pier_id = @pier_id
WHERE id = @observatory_id;
```
