/**
 * ==== Manual ====
 * HOW: 
 * 
 * ARGS: 
 *  1. The object to parse.
 *  2. The file where the object is stored (functions.json)
 *  3. The language to translate to (Recommended English/Z1002)
 * 
 * EXAMPLE: deno run parser.ts Z12427 "./functions.json" Z1002 "./Z12427.json"
 */
function searchForCanonicalData(funcZName: string, funcFile: RawFunctionList, langZName: string): object {
    
}

interface RawFunctionList {
    // deno-lint-ignore no-explicit-any
    [functionName: string]: any
}


if (Deno.args.length !== 0) {
    const parseFunc = Deno.args[0];
    const funcFileName = Deno.args[1];
    const naturalLang = Deno.args[2];
    const placeToStore = Deno.args[3]
    
    //* First open the funcFile
    const funcFile: RawFunctionList = JSON.parse(new TextDecoder().decode(Deno.readFileSync(funcFileName)));
    searchForCanonicalData(parseFunc, funcFile, naturalLang, placeToStore);
}

