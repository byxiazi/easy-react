function storageFactory(storage) {
    return {
        setItem: function (key, value, errMsg) {
            if (typeof value === 'string') {
                storage.setItem(key, value);
            }
            else {
                try {
                    var _value = JSON.stringify(value);
                    storage.setItem(key, _value);
                }
                catch (e) {
                    throw new Error(errMsg || "\u6682\u4E0D\u652F\u6301" + typeof value + "\u7C7B\u578B\u503C\u7684\u7F13\u5B58");
                }
            }
        },
        getItem: function (key) {
            var value = storage.getItem(key);
            if (value === null)
                return value;
            try {
                var _value = JSON.parse(value);
                return _value;
            }
            catch (e) {
                return value;
            }
        },
        removeItem: function (key) {
            storage.removeItem(key);
        },
    };
}
export var local = storageFactory(localStorage);
export var session = storageFactory(sessionStorage);
//# sourceMappingURL=storage.js.map