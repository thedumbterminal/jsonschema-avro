# jsonschema-avro

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

## Test

    npm test

## TODO

* Handle references.
* Handle `anyOf` and `allOf`.
* Handle `Enum` type.