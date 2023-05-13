# Changelog

## v2.1.0 (13/05/2023)

- Doc property removed from array types. (frk-dc)
- Omit undefined or boolean item types. (frk-dc)
- Process complex array types (array of arrays/enums/objects). (pdanpdan)
- Process default on all structure types. (pdanpdan)

## v2.0.0 (26/04/2023)

- JSON schema number type now converts to double Avro type.

## v1.8.1 (13/04/2023)

- Remove unwanted console.log.

## v1.8.0 (01/04/2023)

- Support for JSON schema draft v6+ schema IDs. (mikeb1rd)
- Support for optional arrays and arrays with multiple types. (mikeb1rd)
- Convert enums without null but are optional. (mikeb1rd)

## v1.7.0 (19/03/2023)

- Nullable enums now supported. (mikeb1rd)

## v1.6.1 (08/10/2022)

- Fields now have unique names. (pdanpdan)

## v1.6.0 (27/04/2019)

- Supports optional properties.

## v1.5.0 (07/04/2019)

- Namespace and name of initial Avro record now generated from JSON Schema ID.

## v1.4.0 (03/12/2018)

- Array elements now supported. (pdanpdan)

## v1.3.1 (18/04/2018)

- Allows object properties to be omitted.

## v1.3.0 (23/02/2018)

- Supports namespaces.
- Supports default values.
- Supports fields with multiple types.

## v1.2.0 (20/02/2018)

- Now supports descriptions.

## v1.1.0 (14/06/2017)

- Now supports `enum` properties.

## v1.0.0 (10/06/2017)

- Initial release.
