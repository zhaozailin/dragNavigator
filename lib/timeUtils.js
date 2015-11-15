/**
 * Created by zzl on 2015/11/15.
 */
var timeUtils = (function() {

    // 倒序获取年月集合
    var _calcPreTimes = function(size, curTime) {
        var preTimes = [];
        var preMonth = curTime.month;
        var preYear = curTime.year;
        for (var i = 0; i < size; i++) {
            preMonth--;

            // 跨年
            if (preMonth === 0) {
                preMonth = 12;
                preYear--;
            }

            preTimes.push({year: preYear, month: preMonth});
        }
        return preTimes;
    };

    // 正序获取年月集合
    var _calcNextTimes = function(size, curTime) {
        var nextTimes = [];
        var nextMonth = curTime.month;
        var nextYear = curTime.year;
        for (var i = 0; i < size; i++) {
            nextMonth++;

            // 跨年
            if (nextMonth === 13) {
                nextMonth = 1;
                nextYear++;
            }

            nextTimes.push({year: nextYear, month: nextMonth});
        }
        return nextTimes;
    };

    // 计算出指定数量的年月集合
    var calcTimes = function(totalNum, curTime) {
        var halfNum = (totalNum - 1) / 2;
        var preTimes = _calcPreTimes(halfNum, curTime);
        var nextTimes = _calcNextTimes(halfNum, curTime);
        return _.union(preTimes.reverse(), [curTime], nextTimes);
    };

    return {
        calcTimes: calcTimes
    };
})();

