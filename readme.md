# wkflib

[![JSR](https://jsr.io/badges/@carlop3333/wkflib)](https://jsr.io/@carlop3333/wkflib)

This library converts WikiFunctions XML dumps into readable JSON dumps, and labelizes a part of the dumps: the only thing that is still canonical is the "value" argument: it is leaved by your own interpretation as-is.

NOTE: Node support will be added in the future

## Usage

```js
import {convertXML, Labelizer} from "@carlop3k/wkflib";

// open your XML dump
const file = Deno.openSync("..."); // soon with fs.readFile, or with fetch()

// transform the file into a Deno buffer 
const buf = new Buffer([/* ... */])

// parses the dumped XML and returns another buffer, this time in a JSON format.
const dump = convertXML(buf)

// finally calls the (semi)labelizer, use with the language of your preference
// in this example, English is Z1002
const zobjects = new Labelizer(dump, "Z1002")

// do anything you want with the (semi)labelized dump.
zobjects.getAllObjects();
// or: this retrieves the zobjects with only the type "Type"
zobjects.listAllObjects("Z4");

```