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

    // 转为导航所需的数据结构
    var switchNavData = function(curTime, enabledTimes) {
        var times = calcTimes(21, curTime);
        return _.map(times, function(time) {
            var enabled = false;
            for (var i = 0; i < enabledTimes.length; i++) {
                if (time.year === enabledTimes[i].year && time.month === enabledTimes[i].month) {
                    enabled = true;
                    break;
                }
            }

            return {
                leftInfo: time.year + "年",
                leftShow: time.month === 1,
                centerInfo: time.month + "月",
                enabled: enabled
            }
        });
    };

    // 转为导航所需的数据结构
    var switchNavDataForYear = function(curYear, enabledYear) {
        var beginYear = parseInt(curYear) - 10;
        var allYears = [];
        for (var i = 0; i < 21; i++) {
            allYears.push(beginYear + "");
            beginYear++;
        }

        return _.map(allYears, function(year) {
            var enabled = false;
            for (var j = 0; j < enabledYear.length; j++) {
                if (year === enabledYear[j]) {
                    enabled = true;
                    break;
                }
            }

            return {
                leftInfo: "",
                leftShow: false,
                centerInfo: year + "年",
                enabled: enabled
            }
        });
    };

    return {
        calcTimes: calcTimes,
        switchNavData: switchNavData,
        switchNavDataForYear: switchNavDataForYear
    };
})();