# jsonschema-avro

[![npm](https://img.shields.io/npm/v/jsonschema-avro.svg)](https://www.npmjs.com/package/jsonschema-avro)
[![Node.js CI](https://github.com/thedumbterminal/jsonschema-avro/actions/workflows/main.yml/badge.svg)](https://github.com/thedumbterminal/jsonschema-avro/actions/workflows/main.yml)

Converts JSON-schema definitions into Avro definitions.

## Install

    npm install jsonschema-avro

## Consume

```
const jsonSchemaAvro = require('jsonschema-avro')

const inJson = {
  "description": "Example description",
  "type": "object",
  "properties": {
    "first_name": { "type": "string" },
    "address": {
      "type": "object",
      "properties": {
        "street_address": { "type": "string" }
      }
    }
  }
}

const avro = jsonSchemaAvro.convert(inJson)
```

Please ensure that the input JSON schema is dereferenced so that all external references have been resolved. [json-schema-ref-parser](https://www.npmjs.com/package/@apidevtools/json-schema-ref-parser) can do this, prior to using this module.

## Develop

Avro schema documentation can be found here:

https://docs.oracle.com/cd/E26161_02/html/GettingStartedGuide/avroschemas.html

### Testing

To run all tests:

    npm test

To run a single test, using the name of the sample:

    ONLY=optional npm test

CI uses the following script:

```
npm run ci
```

Please run this on your local machine to ensure CI will pass.

### Code style

This project uses prettier, to format source files run:

    npm run format

## TODO

- Handle `anyOf` and `allOf`.
