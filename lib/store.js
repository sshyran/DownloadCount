var countCache = 'millions',
    count = exports;

count.get = function get() {
    return countCache;
};

count.set = function set(count) {
    countCache = count;
};
