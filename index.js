const fs = require("fs");

try {
    // read contents of the file
    const data = fs.readFileSync("test-file.txt", "utf8");
    // split the contents by new line
    const lines = data.split(/\r?\n/);
    // opening file streams with the option to append
    const xmlStream = fs.createWriteStream("customers.xml", {flags: "a"});
    const csvStream = fs.createWriteStream("products.csv", {flags: "a"});
    const jsonStream = fs.createWriteStream("orders.json", {flags: "a"});

    const jsonObject = {"orders": []};
    let orderCount = -1;

    lines.forEach(line => {
        console.log(line);
        const lineArray = line.replace(/\"/gi, "").split(',');
        const recordType = lineArray[0];
        
        switch (recordType) {
            case "customer":
                xml(lineArray);
                break;
            case "product":
                csv(csvStream, line, lineArray[5]);
                break;
            case "order":
                orderCount++;
                orderJson(jsonObject, lineArray);
                break;
            case "order-line":
                orderLineJson(jsonObject, lineArray, orderCount);
                break;
            default:
                break;
        }
    });

    jsonStream.write(JSON.stringify(jsonObject));


} catch(err) {
    console.log('Error: ', err.stack);
}

function xml() {}

function csv(stream, line, currency) {
    const defaultCurrency = currency ? "" : '"USD"';
    stream.write(line + defaultCurrency + '\n');
}

function orderJson(jsonObject, lineArray) {
    const order = {
        "id": lineArray[1],
        "head": {
            "sub_total": Number(lineArray[3]).toFixed(2),
            "tax": Number(lineArray[4]).toFixed(2),
            "total": Number(lineArray[5]).toFixed(2),
            "customer": lineArray[6]
        },
        "lines": []
    }

    jsonObject["orders"].push(order);
}

function orderLineJson(jsonObject, lineArray, orderCount) {
    const price = Number(lineArray[3]);
    const quantity = Number(lineArray[4]);
    const row_total = price * quantity;

    const line = {
        "position": Number(lineArray[1]),
        "name": lineArray[2],
        "price": price.toFixed(2),
        "quantity": quantity,
        "row_total": row_total.toFixed(2)
    }

    jsonObject["orders"][orderCount]["lines"].push(line);
}