const fs = require("fs");
const builder = require("xmlbuilder");

const format = require("./formatFunctions")

try {
    // read contents of the file
    const data = fs.readFileSync("test-file.txt", "utf8");
    // split the contents by new line
    const lines = data.split(/\r?\n/);
    // opening file streams with the option to append
    fs.mkdirSync("./output_files");
    const csvStream = fs.createWriteStream("./output_files/products.csv", {flags: "a"});
    const jsonStream = fs.createWriteStream("./output_files/orders.json", {flags: "a"});
    const xmlDoc = builder.create("customers");
    // creating object to create json for jsonStream
    const jsonObject = {"orders": []};
    // -1 since needing correct order index that's incremented every order
    let orderCount = -1;

    lines.forEach(line => {
        const lineArray = line.replace(/\"/gi, "").split(',');
        const recordType = lineArray[0];
        // running different functions on the line based off of record type
        switch (recordType) {
            case "customer":
                format.xml(xmlDoc, lineArray);
                break;
            case "product":
                format.csv(csvStream, line, lineArray[5]);
                break;
            case "order":
                orderCount++;
                format.orderJson(jsonObject, lineArray);
                break;
            case "order-line":
                format.orderLineJson(jsonObject, lineArray, orderCount);
                break;
            default:
                break;
        }
    });
    xmlDoc.end();
    fs.writeFile("./output_files/customers.xml", xmlDoc, logError);
    jsonStream.write(JSON.stringify(jsonObject));

} catch(err) {
    logError(err);
}

function logError(err) {
    if (err) console.log(err);
}