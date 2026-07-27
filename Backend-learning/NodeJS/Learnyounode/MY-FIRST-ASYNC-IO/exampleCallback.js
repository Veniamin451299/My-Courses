function foo(internalCallback) {
    // const errorObj = new Error("Данные не найдены (404)");
    const dataObj =("Данные (200)");
    // internalCallback(errorObj);
    internalCallback(null, dataObj);
}

function bar(callback) {
    foo(function (err, data) {
        if(err) {
            console.log("-> Внутри bar: Обнаружена ошибка!");
            return callback(err);
        }
        console.log("File found!");
        callback(null, data);
    });
}

bar(function (finalErr, finalData) {
    if (finalErr) {
        console.log("Итог программы: Произошла ошибка -> ", finalErr.message);
    } else {
        console.log("Итог программы: Файл найден!", finalData);
    }
});