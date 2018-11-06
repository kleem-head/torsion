var torsionjs = require('torsion');
var start = process.hrtime();

/**
 * Асинхронная функция (реализовано через setImmediate), реализующая прстую математическую операцию: если указан opt.increment == true, то число data увиличивается на 1, 
 * если opt.decrement  == true, то число уменьшается на 1. Если ни одна из опций не указана, то генерируется ошибка. 
 * @param {integer} data число, слагаемое или уменьшаемое, в зависимости от параметра
 * @param {object} opt  параметр операции. 
 * @param {function} callback 
 */
function mathAsync(data, opt, callback) {
    "use strict";
    var error = null;
    !opt.increment || (data = data + 1);
    !opt.decrement || (data = data - 1);
    opt && !opt.increment && !opt.decrement && (error = new Error('Bad options'));
    setImmediate(callback, error, data);

}
/**
 * Асинхронная функция (реализовано через process.nextTick), реализующая две простых математических операции: если указан opt.increment == true и/или opt2.increment == true, 
 * то число data увиличивается на 1,  если opt.decrement  == true и/или opt2.decrement  == true, то число уменьшается на 1. Если ни одна из опций не уазана, то генерируется ошибка. 
 * @param {integer} data  число, над которым будут производиться операции
 * @param {object} opt первый параметр операции
 * @param {object} opt2 второй параметр операции
 * @param {function} callback 
 */
function mathAsync2(data, opt, opt2, callback) {
    "use strict";
    var error = null;
    !opt.increment || (data = data + 1);
    !opt.decrement || (data = data - 1);
    !opt2.increment || (data = data + 1);
    !opt2.decrement || (data = data - 1);
    opt && !opt.increment && !opt.decrement && (error = new Error('Bad options'));
    opt2 && !opt2.increment && !opt2.decrement && (error = new Error('Bad options 2'));
    //return callback(error, data);
    process.nextTick(callback, error, data)
}

/**
 * Синхронная функция, реализующая прстую математическую операцию: если указан opt.increment == true, то число data увиличивается на 1, 
 * если opt.decrement  == true, то число уменьшается на 1. Если ни одна из опций не указана, то генерируется ошибка. 
 * @param {*} data число, слагаемое или уменьшаемое, в зависимости от параметра
 * @param {*} opt параметр операции
 */
function mathSync(data, opt) {
    "use strict";
    var error = null;
    !opt.increment || (data = data + 1);
    !opt.decrement || (data = data - 1);
    opt && !opt.increment && !opt.decrement && (error = new Error('Bad options'));
    return error || data;
}

/**
 * Синхронная функция, реализующая две простых математических операции: если указан opt.increment == true и/или opt2.increment == true, 
 * то число data увиличивается на 1,  если opt.decrement  == true и/или opt2.decrement  == true, то число уменьшается на 1. 
 * Если ни одна из опций не уазана, то генерируется ошибка. 
 * @param {*} data число, над которым будут производиться операции
 * @param {*} opt первый параметр операции
 * @param {*} opt2 второй параметр операции
 */

function mathSync2(data, opt, opt2) {
    "use strict";
    var error = null;
    !opt.increment || (data = data + 1);
    !opt.decrement || (data = data - 1);
    !opt2.increment || (data = data + 1);
    !opt2.decrement || (data = data - 1);
    opt && !opt.increment && !opt.decrement && (error = new Error('Bad options'));
    opt2 && !opt2.increment && !opt2.decrement && (error = new Error('Bad options 2'));
    return error || data;
}
/**
 * Синхронная функция, вымолняющая простые матеманические операции над тремя числами, в зависимости от пераметров
 * @param {integer} a первое число, над которым будут производиться операции
 * @param {integer} b второе число, над которым будут производиться операции
 * @param {integer} c третье число, над которым будут производиться операции
 * @param {object} opt первый параметр операции
 * @param {object} opt2 второй параметр операции
 */
function math(a, b, c, opt, opt2) {
    "use strict";
    var error = null,
        data;
    !opt.sum || (data = a + b);
    !opt.sub || (data = a - b);
    !opt2.sum || (data = data + c);
    !opt2.sub || (data = data - c);
    opt && !opt.sum && !opt.sub && (error = new Error('Bad options'));
    opt2 && !opt2.sum && !opt2.sub && (error = new Error('Bad options 2'));
    return error || data;
}

/**
 * Асинхронная функция, выполняющая математические операции над элементами массива. Для упрощения в массиве 
 * обрабатываются только два первых элемента. Результат - массив.
 * @param {array} data входной массив
 * @param {object} opt параметры обработки
 * @param {function} callback 
 */
function mathAsyncArray(data, opt, callback) {
    "use strict";
    //console.log('mathAsyncArray',data,opt);
    var error = null,
        newdata = [];
    !opt.increment || (newdata[0] = data[0] + data[1], newdata[1] = data[0] - data[1]);
    !opt.decrement || (newdata[0] = data[0] - data[1], newdata[1] = data[0] + data[1]);
    opt && !opt.increment && !opt.decrement && (error = new Error('Bad options'));
    setImmediate(callback, error, newdata);
}

/**
 * Cинхронная функция, выполняющая математические операции над элементами массива. Для упрощения в массиве 
 * обрабатываются только два первых элемента. Результат - массив.
 * @param {array} data входной массив
 * @param {object} opt параметры обработки
 */
function mathSyncArray(data, opt) {
    "use strict";
    var error = null,
        newdata = [];
    !opt.increment || (newdata[0] = data[0] + data[1], newdata[1] = data[0] - data[1]);
    !opt.decrement || (newdata[0] = data[0] - data[1], newdata[1] = data[0] + data[1]);
    opt && !opt.increment && !opt.decrement && (error = new Error('Bad options'));
    return error || newdata;
}

/**
 * Асинхронная функция, выполняющая слияние массива. Для упрощения в массиве 
 * обрабатываются только два первых элемента. Результат - число.
 * @param {array} data 
 * @param {object} opt 
 * @param {function} callback 
 */
function concatAsync(data, opt, callback) {
    "use strict";
    var error = null,
        newdata;
    !opt.increment || (newdata = data[0] + data[1]);
    !opt.decrement || (newdata = data[0] - data[1]);
    opt && !opt.increment && !opt.decrement && (error = new Error('Bad options'));
    setImmediate(callback, error, newdata);
}

/**
 * Синхронная функция, выполняющая слияние массива. Для упрощения в массиве 
 * обрабатываются только два первых элемента. Результат - число.
 * @param {array} data 
 * @param {object} opt 
 */
function concatSync(data, opt) {
    "use strict";
    var error = null,
        newdata = [];
    !opt.increment || (newdata = data[0] + data[1]);
    !opt.decrement || (newdata = data[0] - data[1]);
    opt && !opt.increment && !opt.decrement && (error = new Error('Bad options'));
    return error || newdata;
}

/**
 * Синхронная функция, увеличивающая число на единицу. Содержит внтутри долгий цикл. Нужно чтобы потянуть время.
 * @param {integer} data число, которое увеличится на единицу
 * @param {any} opt параметр, не используется
 */
function cicleSync(data, opt) {
    "use strict";
    var i = 0;
    for (i; i < 100000000; i++) {}

    return data + 1;
}
/**
 * Асинхронная функция, увеличивающая число на единицу. Содержит внтутри долгий цикл. Нужно чтобы потянуть время.
 * @param {integer} data число, которое увеличится на единицу
 * @param {any} opt параметры, не используется
 * @param {function} cb 
 */
function cicle(data, opt, cb) {
    "use strict";
    //console.log('concatSync',data,opt);
    var i = 0,
        error = null;
    for (i; i < 100000000; i++) {}
    return setImmediate(cb, error, data);
}
/**
 * Синхронная функция, проверяет наличие результата. Выполняет роль теста.
 *  * @param {*} data 
 */
function simpleTrigger(data) {
    return data !== undefined;
}


/**
 * Формируем операцию.
 * 
 * Определение операции http://torsionx.blogspot.com/2016/12/blog-post_35.html?view=magazine
 * 
 */

torsionjs.operation.new('longtime', [
    [cicleSync, {}],
    [cicle, {}],
    [cicleSync, {}],
    [cicle, {}],
    [cicleSync, {}],
    [cicle, {}],
])

/**
 * Формируем маршрут
 * 
 * Определение маршрута http://torsionx.blogspot.com/2016/12/blog-post_35.html?view=magazine
 * 
 */
torsionjs.route.new('longtimetest')
    .BEGIN(1, 'longtime')
    .from([0])
    .ifUndef([1])
    .trigger(simpleTrigger)
    .END()

.BEGIN(2, 'longtime')
    .from([0])
    .ifUndef([2])
    .ifDef([1])
    .trigger(simpleTrigger)
    .END()

.BEGIN(3, 'longtime')
    .from([0])
    .ifUndef([3])
    .ifDef([2])
    .trigger(simpleTrigger)
    .END()

.BEGIN(4, 'longtime')
    .from([1, 2, 3])
    .ifUndef([4])
    .ifDef([1, 2, 3])
    .trigger(simpleTrigger).RETURN()
    .END()

.SAVE('longtimetest');


/**
 * Формируем операцию.
 * 
 * Определение операции http://torsionx.blogspot.com/2016/12/blog-post_35.html?view=magazine
 * 
 */
torsionjs.operation.new('test', [
    [mathAsyncArray, { increment: true }],
    [mathSyncArray, { decrement: true }],
    [concatSync, { increment: true }],
    [mathSync, { decrement: true }],
    [mathSync2, { increment: true }, { increment: true }],
    [mathAsync, { increment: true }],
    [mathAsync2, { increment: true }, { increment: true }],
    [mathAsync, { increment: true }]
]);

/**
 * Формируем операцию.
 * 
 * Определение операции http://torsionx.blogspot.com/2016/12/blog-post_35.html?view=magazine
 * 
 */
torsionjs.operation.new('math', [
    [math, { sum: true }, { sub: true }]
]);

/**
 * Формируем маршрут
 * 
 * Определение маршрута http://torsionx.blogspot.com/2016/12/blog-post_35.html?view=magazine
 * 
 */
torsionjs.route.new('test')

.BEGIN(1, 'test')
    .from([0])
    .ifUndef([1])
    .trigger(simpleTrigger)
    .END()

.BEGIN(2, 'test')
    .from([0])
    .ifUndef([2])
    .ifDef([1])
    .trigger(simpleTrigger)
    .END()

.BEGIN(3, 'test').from([0])
    .ifUndef([3]).ifDef([2]).trigger(simpleTrigger)
    .END()

.BEGIN(4, 'math')
    .from([1, 2, 3])
    .ifUndef([4])
    .ifDef([1, 2, 3])
    .trigger(simpleTrigger).RETURN()
    .END()

.SAVE('test');


/**
 * Формируем маршрут
 * 
 * Определение маршрута http://torsionx.blogspot.com/2016/12/blog-post_35.html?view=magazine
 * 
 */
torsionjs.route.newSync('testSync')

.BEGIN(1, 'test')
    .from([0])
    .ifUndef([1])
    .trigger(simpleTrigger)
    .END()

.BEGIN(2, 'test')
    .from([0])
    .ifUndef([2])
    .ifDef([1])
    .trigger(simpleTrigger)
    .END()

.BEGIN(3, 'test').from([0])
    .ifUndef([3]).ifDef([2]).trigger(simpleTrigger)
    .END()

.BEGIN(4, 'math')
    .from([1, 2, 3])
    .ifUndef([4])
    .ifDef([1, 2, 3])
    .trigger(simpleTrigger).RETURN()
    .END()

.SAVE('testSync');

/**
 * Формируем маршрут
 * 
 * Определение маршрута http://torsionx.blogspot.com/2016/12/blog-post_35.html?view=magazine
 * 
 */
torsionjs.route.new('test2')

.BEGIN(1, 'test')
    .from([0])
    .ifUndef([1])
    .trigger(simpleTrigger)
    .END()

.BEGIN(2, 'test')
    .from([0])
    .ifUndef([2])
    .ifDef([1])
    .trigger(simpleTrigger)
    .END()

.BEGIN(3, 'test')
    .from([0])
    .ifUndef([3])
    .ifDef([2])
    .trigger(simpleTrigger)
    .END()

.BEGIN(4, 'math')
    .from([1, 2, 3])
    .ifUndef([4])
    .ifDef([1, 2, 3])
    .trigger(simpleTrigger).RETURN()
    .END()

.SAVE();




/**
 * Функция- заглушка. Выводит результат и анализ времени
 * @param {*} msg 
 * @param {*} startHR 
 * @param {*} err 
 * @param {*} data 
 */
function plug(msg, startHR, err, data) {
    var diff = process.hrtime(startHR);
    //torsionjs.syslog.push(msg+'\t'+ diff[0] * 1e9 + diff[1] + '      Ошибка:'+err+' Данные:'+ data);

    console.log(msg, '\t', (diff[0] * 1e9 + diff[1]) + '  Ошибка:' + err, ' Данные:' + data);
}

/**
 * Тесты. В операциях использованы вперемешку синхронные и асинхронные функции, при этом код операции выглядит вот так
 * 
 * torsionjs.operation.new('test', [
 *   [mathAsyncArray, { increment: true }],
 *   [mathSyncArray, { decrement: true }],
 *   [concatSync, { increment: true }],
 *   [mathSync, { decrement: true }],
 *   [mathSync2, { increment: true }, { increment: true }],
 *   [mathAsync, { increment: true }],
 *   [mathAsync2, { increment: true }, { increment: true }],
 *   [mathAsync, { increment: true }]
 * ]);
 * 
 *  */

/**
 * Первая контрольная точка
 */
console.log('=== TEST1 ===');

//torsionjs.operation.run('longtime')(plug.bind(null, '\n>>>Завершен TEST',process.hrtime()))(0);
torsionjs.route.run('test')([125, 459], plug.bind(null, '>>>Завершен TEST 1', process.hrtime())).run();
torsionjs.route.run('test')([125, 459], plug.bind(null, '>>>Завершен TEST 2', process.hrtime())).run();
torsionjs.route.run('test')([125, 459], plug.bind(null, '>>>Завершен TEST 3', process.hrtime())).run();
torsionjs.route.run('testSync')([125, 459], plug.bind(null, '>>>Завершен TEST Sync 1', process.hrtime())).run();
torsionjs.route.run('testSync')([125, 459], plug.bind(null, '>>>Завершен TEST Sync 2', process.hrtime())).run();
torsionjs.route.run('testSync')([125, 459], plug.bind(null, '>>>Завершен TEST Sync 3', process.hrtime())).run();
torsionjs.operation.run('test')(plug.bind(null, '>>>Завершен TEST 6', process.hrtime()))([10, 0]);
torsionjs.operation.run('test')(plug.bind(null, '>>>Завершен TEST 7', process.hrtime()))([12, 7]);

/**
 * Вторая контрольная точка. 
 * 
 * Весь код между контрольными точками асинхронный, поэтому появится в консоли позже.
 * Причем в порядке выполнения , а не в порядке запуска.
 */
console.log('=== TEST2 ===');
var finish;

function plugsyslog(msg, startHR, err, data) {
    finish = process.hrtime(start);
    var diff = process.hrtime(startHR);
    torsionjs.syslog.push(msg + '\t' + (diff[0] * 1e9 + diff[1]) + '  Ошибка:' + err + ' Данные:' + data);
    //console.log('push:',torsionjs.syslog);
}
var i = 10;
while (~~i) {
    //Множественный запуск маршрутов
    //Некое подобие нагрузочного теста
    torsionjs.route.run('test')([12, 7], plugsyslog.bind(null, 'Завершен TEST ' + i + ':001', process.hrtime())).run();
    torsionjs.route.run('test')([15, 29], plugsyslog.bind(null, 'Завершен TEST ' + i + ':002', process.hrtime())).run();
    torsionjs.route.run('test')([143, 73], plugsyslog.bind(null, 'Завершен TEST ' + i + ':003', process.hrtime())).run();
    torsionjs.route.run('test')([125, 459], plugsyslog.bind(null, 'Завершен TEST ' + i + ':004', process.hrtime())).run();
    torsionjs.route.run('test')([15, 29], plugsyslog.bind(null, 'Завершен TEST ' + i + ':005', process.hrtime())).run();
    torsionjs.route.run('test')([125, 459], plugsyslog.bind(null, 'Завершен TEST ' + i + ':006', process.hrtime())).run();
    torsionjs.route.run('test')([143, 73], plugsyslog.bind(null, 'Завершен TEST ' + i + ':007', process.hrtime())).run();
    torsionjs.route.run('test')([125, 459], plugsyslog.bind(null, 'Завершен TEST ' + i + ':008', process.hrtime())).run();
    torsionjs.route.run('test')([12, 7], plugsyslog.bind(null, 'Завершен TEST ' + i + ':009', process.hrtime())).run();
    torsionjs.route.run('test')([125, 459], plugsyslog.bind(null, 'Завершен TEST ' + i + ':010', process.hrtime())).run();
    torsionjs.route.run('testSync')([125, 459], plugsyslog.bind(null, '>>>Завершен TEST Sync ' + i + ':1', process.hrtime())).run();
    torsionjs.route.run('testSync')([125, 459], plugsyslog.bind(null, '>>>Завершен TEST Sync ' + i + ':2', process.hrtime())).run();
    torsionjs.route.run('testSync')([125, 459], plugsyslog.bind(null, '>>>Завершен TEST Sync ' + i + ':3', process.hrtime())).run();
    torsionjs.operation.run('test')(plugsyslog.bind(null, '>>>Завершен TEST ОПЕРАЦИИ' + i + ':6', process.hrtime()))([10, 0]);
    torsionjs.operation.run('test')(plugsyslog.bind(null, '>>>Завершен TEST ОПЕРАЦИИ' + i + ':7', process.hrtime()))([12, 7]);
    --i;

}

/*
process.on('exit',function(){
    var diff=process.hrtime(start);
    console.log('ОБЩЕЕ ВРЕМЯ:'+ (diff[0] * 1e9 + diff[1]));
    console.log(torsionjs.syslog.join('\n'));
});*/


setTimeout(function() {
    var t = finish[0] * 1e9 + finish[1];
    console.log('ОБЩЕЕ ВРЕМЯ:' + t);
    console.log(torsionjs.syslog.join('\n'));
    //console.log(torsionjs.syslog.slice(-20).join('\n'));
    console.log('ОБЩЕЕ ВРЕМЯ:' + t);

}, 1000);
