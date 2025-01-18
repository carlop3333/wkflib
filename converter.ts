import * as xml from "https://deno.land/x/xml@6.0.1/mod.ts";

const data = xml.parse(await Deno.open("./wikidump.xml", {read: true}));
const rootFile = await Deno.create('./functions.json');
// deno-lint-ignore no-explicit-any
const functionsList: any = {}
//@ts-ignore: Explicit
console.log(data.mediawiki["~children"].forEach((page) => {
    if (page["~name"] == "page" && String(page.title).startsWith("Z")) {
        const functionID = page.title;
        console.log('Saving function', functionID);
        functionsList[functionID] = JSON.parse(page.revision.text["#text"]);
    }
}));
const encoded = new TextEncoder().encode(JSON.stringify(functionsList));
const written = rootFile.writeSync(encoded);
console.log(`Written ${written} bytes of data.`);

