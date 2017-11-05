"use strict";
/**
 * Проект torsion.js. 
 * @project torsion.js
 * @idea  Андрей Климов и Валерий Кошуба
 * @author Andrei Kleemov aka kleem-head
 * @license Смотри файл LICENSE.md, расположенный в корневой дириктории проекта
 * @copyright Andrei Kleemov aka kleem-head
 * @version 0.0.1
 * @date 16 марта 2017
 * @module torsionjs
 * @tutorial torsionjs
 */

/**
 * В этой версии использована хэш-таблица для предотращения затирания колбэков
 * в функции trap. 
 * @type Number
 */


var debugLevel = 0;
var api = Object.create(null);
api.operation = Object.create(null);
api.O = Object.create(null);
api.syslog = [''];
api.route = Object.create(null);
api.management = Object.create(null);
api.R = Object.create(null);

function trapManager() {

}
function trickClosure(trap, cbId) {
    return function trick(err, input) {
        "use strict";
        //TODO This function is not optimal
        //TODO check more then 2 argument in callback 
        var
                errIsUndefined = Object.prototype.toString.call(err) === '[object Undefined]',
                inputIsUndefined = Object.prototype.toString.call(input) === '[object Undefined]',
                errInstanceOfError = err instanceof Error,
                resolver = (!(errIsUndefined && inputIsUndefined) *
                        (1 * errInstanceOfError +
                                2 * !errInstanceOfError * (inputIsUndefined) +
                                3 * !errInstanceOfError * (!inputIsUndefined)));
        // console.log('trick resolver:', resolver, arguments);
        (resolver === 1) && !trap[cbId].callback(err, undefined) && (delete trap[cbId]);//прилетела ошибка
        (resolver === 2) && !trap[cbId].callback(null, err) && (delete trap[cbId]);//синхронный результат
        (resolver === 3) && !trap[cbId].callback.apply(null, arguments) && (delete trap[cbId]);//асинхронный результат
    };
}
;

function Trap(f, args) {
    "use strict";
    var trap = Object.create(null);
    trap.f = f;
    trap.args = args;
    trap.id = (Math.random().toString()).slice(2);


    return function trapCallbackHandler(callback) {
        "use strict";
        var cbId = (Math.random().toString()).slice(2);
        trap[cbId] = Object.create(null);
        trap[cbId].callback = callback;
        trap.trick = trickClosure(trap, cbId);
        return function trapDataHandler(/*data,data....data*/) {
            var data = [], i = 0, l = arguments.length;
            //цикл вместо Array.prototype.slice.call(arguments)
            while (l--) {
                data.push(arguments[l]);
            }

            //console.log('trapCallbackHandler arguments: ',trap.f,trap.args,arguments,data);
            //расчет-проверка необходимого количесва аргументов для функции
            //(trap.f.length - 1) > (arguments.length + trap.args.length)&&(console.log('!!!!'))&& (data = arguments[0]);
            l = trap.args.length;
            //цикл вместо Array.prototype.concat.call(data, trap.args)
            while (l--) {
                data.push(trap.args[l]);
            }
            data.push(trap.trick);
            //console.log('trapCallbackHandler data: ',data,trap.trick);
            //трюк 


            try {
                trap.trick(trap.f.apply(null, data));// - такой вызов медленнее
                // trap.trick(trap.f.call(null, data[0], data[1], data[2], data[3], data[4], data[5], data[6], data[7], data[8], data[9]));
            } catch (err) {
                trap.trick(err);
            }
        };
        //})(trap);
    };
}

function pseudoСallback(operation) {

    return function pseudoСallbackInner(err, input) {
        //return function ()
        "use strict";
        // i = arguments.length-1 для того чтобы исключить первый аргумент err
        var data = [], i = arguments.length - 1;
        err && (err.transitIndex = operation.current);
        ++operation.current;
        switch (!err * !!operation.sequence[operation.current] * arguments.length) {
            case 0:
                return  operation.callback.apply(null, arguments);
            case 2:
                //console.log('case 2:',arguments[1]);
                return operation.sequence[operation.current](pseudoСallback(operation))(arguments[1]);
            case 3:
                return operation.sequence[operation.current](pseudoСallback(operation))(arguments[1], arguments[2]);
            case 4:
                return operation.sequence[operation.current](pseudoСallback(operation))(arguments[1], arguments[2], arguments[3]);
            case 5:
                return operation.sequence[operation.current](pseudoСallback(operation))(arguments[1], arguments[2], arguments[3], arguments[4]);
            case 6:
                return operation.sequence[operation.current](pseudoСallback(operation))(arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
            default:
                while (i--) {
                    data[i + 1] = arguments[i + 1];
                }
                return operation.sequence[operation.current](pseudoСallback(operation)).apply(null, data);
        }



    };
}

function newOperation(name, body) {
    //http://www.htmlgoodies.com/beyond/javascript/object.create-the-new-way-to-create-objects-in-javascript.html
    "use strict";
    api.O[name] = function Operation() {
        if (!(this instanceof Operation)) {
            return (new Operation());
        }
    };
    var
            i,
            j,
            args = [],
            fLength = body.length,
            argsLength,
            tmp = api.O[name];
    for (i = 0; i < fLength; i++) {
        argsLength = body[i].length;
        args[i] = [];/**
        * В этой версии использована хэш-таблица для предотращения затирания колбэков
        * в функции trap. 
        * @type Number
        */
       
        for (j = 1; j < argsLength; j++) {
            args[i].push(body[i][j]);
        }
        tmp[i] = Trap(body[i][0], args[i]);
    }
    tmp.count = fLength;
    tmp.prototype.constructor = tmp;
    return api;
}


function runOperation(name) {
    return function runOperationWaitCallback(callback) {
        // return (function (name, callback) {
        var operation = Object.create(null);
        operation.sequence = api.O[name];
        operation.sequenceTimers = [];
        operation.name = name;
        operation.id = 0;
        operation.callback = callback;
        return function runOperationWaitData(/*data1,data2...dataN*/) {
            operation.current = 0;
            operation.sequence[0](pseudoСallback(operation)).apply(null, arguments);
        };
        //   })(name, callback);
    };
}

api.operation.new = newOperation;
api.operation.run = runOperation;


function u(data) {
    return Object.prototype.toString.call(data) === '[object Undefined]';
}

function BEGINSYNC(skeleton, oprtnApi, indexOp, name) {
    skeleton.index = indexOp;
    skeleton.wrappers[indexOp] = api.operation.run(name);
    skeleton.startEngines[indexOp] = 'W[' + indexOp + '](UP(' + indexOp + '))(';
    //skeleton.startEngines[indexOp] = 'setImmediate(W[' + indexOp + '](UP(' + indexOp + ')),';
    skeleton.logik[indexOp] = [];
    return oprtnApi;
}

function BEGIN(skeleton, oprtnApi, indexOp, name) {
    skeleton.index = indexOp;
    skeleton.wrappers[indexOp] = api.operation.run(name);
    //debugLevel === 9 && (skeleton.debugInfo[indexOp] = '!console.log("Маршрут '+skeleton.name+' Старт операции № ' + indexOp + '")');
    //skeleton.startEngines[indexOp] = 'W[' + indexOp + '](UP(' + indexOp + '))(';
    skeleton.startEngines[indexOp] = 'setImmediate(W[' + indexOp + '](UP(' + indexOp + ')),';
    // skeleton.startEngines[indexOp] = 'process.nextTick(W[' + indexOp + '](UP(' + indexOp + ')),';

    //skeleton.startEngines[indexOp] = 'next(W[' + indexOp + '],UP(' + indexOp + '))(';
    skeleton.logik[indexOp] = [];
    return oprtnApi;
}
/**
 * Элемент псевдоязыка формирования операции. Формирует логическое условие на 
 * проверку указанных ключей на значение undefined
 * 
 * @param {Object} skeleton - Маршрут в виде объекта. Содержит все рараметры маршрута.
 * @param {Object} oprtnApi - АПИ псевдоязыка формирования логического управления операцией 
 * @param {Array} trigsArray - Индексы элементов в массиве логических ключей, которые
 * которые будут проверены данным условием.
 * @returns {Object} oprtnApi - АПИ формирования логического управления
 * операцией посредством псевдоязыка
 */
function ifUndef(skeleton, oprtnApi, trigsArray) {
    skeleton.ifUndef_[skeleton.index] = trigsArray
            .map(function (el) {
                return 'U(K[' + el + '])';
            }).join('&&');
    return oprtnApi;
}

/**
 * Элемент псевдоязыка формирования операции. Формирует логическое условие на 
 * проверку каказанных ключей на значение not undefined
 * 
 * @param {Object} skeleton - Маршрут в виде объекта. Содержит все рараметры маршрута.
 * @param {Object} oprtnApi - АПИ псевдоязыка формирования логического управления операцией 
 * @param {Array} trigsArray - Индексы элементов в массиве логических ключей, которые
 * которые будут проверены данным условием.
 * @returns {Object} oprtnApi - АПИ формирования логического управления 
 * операцией посредством псевдоязыка
 */
function ifDef(skeleton, oprtnApi, trigsArray) {
    skeleton.ifDef_[skeleton.index] = trigsArray
            .map(function (el) {
                return '!U(K[' + el + '])';
            }).join('&&');
    return oprtnApi;
}
/**
 * Элемент псевдоязыка формирования операции. Формирует логическое условие на 
 * проверку каказанных ключей на значение true
 * 
 * @param {Object} skeleton - Маршрут в виде объекта. Содержит все рараметры маршрута.
 * @param {Object} oprtnApi - АПИ псевдоязыка формирования логического управления операцией 
 * @param {Array} trigsArray - Индексы элементов в массиве логических ключей, которые
 * которые будут проверены данным условием.
 * @returns {Object} oprtnApi - АПИ формирования логического управления 
 * операцией посредством псевдоязыка
 */
function ifTrue(skeleton, oprtnApi, trigsArray) {
    skeleton.ifTrue_[skeleton.index] = trigsArray
            .map(function (el) {
                return 'K[' + el + ']';
            }).join('&&');
    return oprtnApi;
}

/**
 * Элемент псевдоязыка формирования операции. Формирует логическое условие на 
 * проверку каказанных ключей на значение false 
 * 
 * @param {Object} skeleton - Маршрут в виде объекта. Содержит все рараметры маршрута.
 * @param {Object} oprtnApi - АПИ псевдоязыка формирования логического управления операцией 
 * @param {Array} trigsArray - Индексы элементов в массиве логических ключей, которые
 * которые будут проверены данным условием.
 * @returns {Object} oprtnApi - АПИ формирования логического управления 
 * операцией посредством псевдоязыка
 */
function ifFalse(skeleton, oprtnApi, trigsArray) {
    skeleton.ifFalse_[skeleton.index] = trigsArray
            .map(function (el) {
                return '!K[' + el + ']';
            }).join('&&');
    return oprtnApi;
}

/**
 * Элемент псевдоязыка формирования операции. Формирует передачу данных на
 * исполнение операции на основании массива индексов indexDataArray.
 * 
 * @param {Object} skeleton - Маршрут в виде объекта. Содержит все рараметры маршрута.
 * @param {Object} oprtnApi - АПИ псевдоязыка формирования логического 
 * управления операцией 
 * @param {Array} indexDataArray - Индексы элементов в массиве данных, которые 
 * будут переданы операции на обработку
 * @returns {Object} oprtnApi - АПИ формирования логического управления 
 * операцией посредством псевдоязыка
 */
function from(skeleton, oprtnApi, indexDataArray) {
    skeleton.dataIndexes[skeleton.index] = indexDataArray
            .map(function (el) {
                return 'D[' + el + ']';
            }).join(',');
    return oprtnApi;
}
/**
 * Элемент псевдоязыка формирования операции. Сигнализирует исполнителю маршрута,
 * что после получения результата данной операции маршрут может быть завершен.
 * @param {Object} skeleton - Маршрут в виде объекта. Содержит все рараметры маршрута.
 * @param {Object} oprtnApi - АПИ псевдоязыка формирования логического 
 * управления операцией 
 * @returns {Object} oprtnApi - АПИ формирования логического управления 
 * операцией посредством псевдоязыка
 */
function RETURN(skeleton, oprtnApi) {
    skeleton.result[skeleton.index] = true;
    return oprtnApi;
}

/**
 * Элемент псевдоязыка формирования операции. Добавляет логическую проверку
 * результата операции .
 * @param {Object} skeleton - Маршрут в виде объекта. Содержит все рараметры маршрута.
 * @param {Object} oprtnApi - АПИ псевдоязыка формирования логического 
 * управления операцией 
 * @param {Function} trigerCode - Функция логической проверки резыльтата операции. 
 * @returns {Object} oprtnApi - АПИ формирования логического управления 
 * операцией посредством псевдоязыка
 */
function trigger(skeleton, oprtnApi, trigerCode) {
    skeleton.triggers[skeleton.index] = trigerCode;
    return oprtnApi;
}
;
/**
 * Элемент псевдоязыка формирования маршрута. Завершает предоставление АПИ псевдоязыка
 * формирования логического управления операцией.  
 * @param {Object} skeleton - Маршрут в виде объекта. Содержит все рараметры маршрута.
 * @param {Object} routeApi - АПИ псевдоязыка формирования маршрута.
 * @returns {Object} routeApi - АПИ псевдоязыка формирования маршрута.
 */
function END(skeleton, routeApi) {
    skeleton.logik[skeleton.index].push('U(K[0])'); //если еще не сработал callback, т.е. можно выполняться
    skeleton.logik[skeleton.index].push('!I[' + skeleton.index + ']'); //Защита от форка
    skeleton.ifUndef_[skeleton.index] && skeleton.logik[skeleton.index].push(skeleton.ifUndef_[skeleton.index]);
    skeleton.ifDef_[skeleton.index] && skeleton.logik[skeleton.index].push(skeleton.ifDef_[skeleton.index]);
    skeleton.ifTrue_[skeleton.index] && skeleton.logik[skeleton.index].push(skeleton.ifTrue_[skeleton.index]);
    skeleton.ifFalse_[skeleton.index] && skeleton.logik[skeleton.index].push(skeleton.ifFalse_[skeleton.index]);
    skeleton.logik[skeleton.index].push('(I[' + skeleton.index + ']=' + skeleton.index + ')'); //Признак исполнения
    debugLevel > 0 && (skeleton.logik[skeleton.index].push(skeleton.debugInfo[skeleton.index]));
    skeleton.logik[skeleton.index].push(skeleton.startEngines[skeleton.index] + skeleton.dataIndexes[skeleton.index] + ')');
    skeleton.smart.push(skeleton.logik[skeleton.index].join('&&'));
    skeleton.index = -1;
    return routeApi;
}
;

/**
 * Элемент псевдоязыка формирования маршрута. Реализует сохранение маршрута в
 * хранилище.
 * @param {Object} skeleton - маршрут в виде объекта. Содержит все рараметры маршрута.
 * @returns {unresolved}
 */
function SAVE(skeleton) {
    api.R[skeleton.name] = Object.create(null);
    api.R[skeleton.name].name = skeleton.name;
    api.R[skeleton.name].logik = new Function('W,K,D,I,U,UP,CB', skeleton.smart + ';');
    api.R[skeleton.name].wrappers = skeleton.wrappers;
    api.R[skeleton.name].triggers = skeleton.triggers;
    api.R[skeleton.name].result = skeleton.result;
    return skeleton = null;
}


function newRouteSync(name) {
    var skeleton = Object.create(null),
            oApi = Object.create(null),
            rApi = Object.create(null);
    skeleton.name = name;
    skeleton.wrappers = [];
    skeleton.triggers = [];
    skeleton.logik = [];
    skeleton.ifUndef_ = [];
    skeleton.ifDef_ = [];
    skeleton.ifTrue_ = [];
    skeleton.ifFalse_ = [];
    skeleton.result = [];
    skeleton.dataIndexes = [];
    skeleton.debugInfo = [];
    skeleton.startEngines = [];
    skeleton.smart = [
        '!U(K[0])&&!K[0]&&K[0]!==2&&(K[0]=2)&&!(function(){return CB(D[0],null)}())',
        '!U(K[0])&&K[0]&&K[0]!==2&&(K[0]=2)&&!(function(){return CB(null,D[0])}())'
    ];
    rApi.BEGIN = BEGINSYNC.bind(null, skeleton, oApi);
    oApi.ifUndef = ifUndef.bind(null, skeleton, oApi);
    oApi.ifDef = ifDef.bind(null, skeleton, oApi);
    oApi.ifTrue = ifTrue.bind(null, skeleton, oApi);
    oApi.ifFalse = ifFalse.bind(null, skeleton, oApi);
    oApi.from = from.bind(null, skeleton, oApi);
    oApi.RETURN = RETURN.bind(null, skeleton, oApi);
    oApi.trigger = trigger.bind(null, skeleton, oApi);
    oApi.END = END.bind(null, skeleton, rApi);
    rApi.SAVE = SAVE.bind(null, skeleton);
    return rApi;
}

/**
 * Предоставляет доступ к АПИ формирования маршрута посредством псевдоязыка
 * @memberof safeStorage.moduleApi
 * @param {String} name имя маршрута
 * @returns {Object} routeApi
 */
function newRoute(name) {
    var skeleton = Object.create(null),
            oApi = Object.create(null),
            rApi = Object.create(null);
    skeleton.name = name;
    skeleton.wrappers = [];
    skeleton.triggers = [];
    skeleton.logik = [];
    skeleton.ifUndef_ = [];
    skeleton.ifDef_ = [];
    skeleton.ifTrue_ = [];
    skeleton.ifFalse_ = [];
    skeleton.result = [];
    skeleton.dataIndexes = [];
    skeleton.debugInfo = [];
    skeleton.startEngines = [];

    skeleton.smart = [
        '!U(K[0])&&!K[0]&&K[0]!==2&&(K[0]=2)&&(function(){return CB(D[0],null)}())',
        '!U(K[0])&&K[0]&&K[0]!==2&&(K[0]=2)&&(function(){return CB(null,D[0])}())'
    ];

    rApi.BEGIN = BEGIN.bind(null, skeleton, oApi);
    oApi.ifUndef = ifUndef.bind(null, skeleton, oApi);
    oApi.ifDef = ifDef.bind(null, skeleton, oApi);
    oApi.ifTrue = ifTrue.bind(null, skeleton, oApi);
    oApi.ifFalse = ifFalse.bind(null, skeleton, oApi);
    oApi.from = from.bind(null, skeleton, oApi);
    oApi.RETURN = RETURN.bind(null, skeleton, oApi);
    oApi.trigger = trigger.bind(null, skeleton, oApi);
    oApi.END = END.bind(null, skeleton, rApi);
    rApi.SAVE = SAVE.bind(null, skeleton);
    return rApi;
}
function onInputAndCallback(route, input, callback) {//удалить фунуцию
    "use strict";
    route.data.push(input);
    route.callback = callback;
    return  {
        run: (function run(route) {
            return function (index) {
                route.parent.logik(route.parent.wrappers, route.keys, route.data, route.inWork, u, update(route), route.callback);
            };
        })(route)
    };

}

function update(route) {
    return function(index){
        return function (err, res) {
        //process.nextTick(onResult, route, index, err, res);
        //return function onResult(route, index, err, res) {
            "use strict";
            route.keys[index] = !!route.parent.triggers[index](res);
            route.data[index] = res;
            route.inWork[index] = 0;
            route.parent.result[index] && route.keys[index] && (route.data[0] = res, route.keys[0] = true);
            //process.nextTick(route.parent.logik,route.parent.wrappers, route.keys, route.data, route.inWork, u, update.bind(null, route), route.callback);
            route.parent.logik(route.parent.wrappers, route.keys, route.data, route.inWork, u, update(route), route.callback);
            return true;
       // };


    };
    };
    
}

function runRoute(name) {
    "use strict";
    var route = Object.create(null);
    route.id = (Math.random().toString()).slice(2);
    route.parent = api.R[name];
    route.keys = [];
    route.inWork = [];
    route.data = [];
    route.timers = [];
    return function onInputAndCallback(input, callback) {
        "use strict";
        return (function (route, input, callback) {
            "use strict";
            route.data.push(input);
            route.callback = callback;
            return  {
                run: (function (route) {
                    return function (index) {
                        route.parent.logik(route.parent.wrappers, route.keys, route.data, route.inWork, u, update(route), route.callback);
                    };
                })(route)
            };
        })(route, input, callback);
    };
}


api.operation.new = newOperation;
api.operation.run = runOperation;
api.route.new = newRoute;
api.route.newSync = newRouteSync;
api.route.run = runRoute;
module.exports = api;


