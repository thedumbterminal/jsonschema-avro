# jsonschema-avro

[![npm](https://img.shields.io/npm/v/jsonschema-avro.svg)](https://www.npmjs.com/package/jsonschema-avro)
[![Build Status](https://travis-ci.org/thedumbterminal/jsonschema-avro.svg?branch=master)](https://travis-ci.org/thedumbterminal/jsonschema-avro)

Converts JSON-schema definitions into Avro definitions.

## Install

    npm install jsonschema-avro

## Consume

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

Please ensure that the input JSON schema is dereferenced so that all external references have been resolved. [json-schema-ref-parser](https://www.npmjs.com/package/json-schema-ref-parser) can do this, prior to using this module.

## Test

    npm test

## TODO

* Handle `anyOf` and `allOf`.
