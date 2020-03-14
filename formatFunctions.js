function xml(doc, lineArray) {
    const gender = lineArray[5] == 1 ? "male" : "female";

    doc.ele("customer")
        .ele("id")
            .text(lineArray[1])
        .up()
        .ele("name")
            .text(lineArray[2])
        .up()
        .ele("email")
            .text(lineArray[3])
        .up()
        .ele("age")
            .text(Number(lineArray[4]))
        .up()
        .ele("gender")
            .text(gender)
        .up()

}

function csv(stream, line, currency) {
    // if no currency set a default currency of "USD"
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

module.exports = {
    xml,
    csv,
    orderJson,
    orderLineJson
}