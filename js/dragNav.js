/**
 * Created by zhaozailin on 2015/11/15.
 */
(function() {

    // 初始化拖动事件
    var _initDrag = function(scrollObj, topBoundary, bottomBoundary, config, data, callback) {

        // 当前选中的数据
        var curInfo = data[(data.length - 1) / 2];

        var eleHeight = config.eleHeight;
        scrollObj.draggable({
            axis: "y",
            drag: function( event, ui ) {
                var top = ui.position.top;
                if (top >= topBoundary) {
                    ui.position.top = topBoundary;
                    return false;
                }
                else if (top <= bottomBoundary) {
                    ui.position.top = bottomBoundary;
                    return false;
                }
            },
            stop: function( event, ui ) {
                var top = ui.position.top;
                var newTop = 0;
                if (-top % eleHeight > eleHeight / 2) {
                    newTop = top - (top % eleHeight) - eleHeight;
                }
                else {
                    newTop = top - (eleHeight - (-top % eleHeight)) + eleHeight;
                }

                // 拖动停止后选中的数据
                var stopObj = data[-newTop / eleHeight + (config.visibleNum - 1) / 2];

                // 发生变化
                if (stopObj.leftInfo !== curInfo.leftInfo || stopObj.centerInfo !== curInfo.centerInfo) {
                    if (callback) {
                        callback(stopObj);
                    }
                }
                else {
                    scrollObj.css("top", newTop + "px");
                }
            }
        });
    };

    // 初始化点击事件
    var _initClick = function(scrollObj, config, data, callback) {
        scrollObj.click(function(e) {
            var eleObj = $(e.target).closest("li");
            if (eleObj.length > 0) {

                // 获取点击的元素序号
                var idx = eleObj.attr("idx");

                var idxSpan = idx - ((data.length - 1) / 2 + 1);
                if (idxSpan !== 0) {

                    // 非enabled状态不可点击
                    if (!data[idx - 1].enabled) {
                        return;
                    }

                    // 计算滚动间距
                    var scrollSpan = -idxSpan * config.eleHeight;

                    // 滚动动画
                    scrollObj.animate({
                        top: "+=" + scrollSpan
                    }, 500, function() {
                        if (callback) {
                            callback(data[idx - 1]);
                        }
                    });
                }
            }
        });
    };

    // 初始化
    var init = function(config, data, callback) {
        var number = data.length;
        var eleHeight = config.eleHeight;
        var visibleHeight = config.visibleNum * eleHeight;
        var domObj = config.domObj;
        var visibleObj = document.createElement("div");
        visibleObj.className = "drag-nav-wrapper";
        $(visibleObj).css("height", visibleHeight + "px");
        domObj.html(visibleObj);

        // 计算出滚动边界
        var topBoundary = 1;
        var bottomBoundary = 1;

        var scrollObj = document.createElement("div");
        scrollObj.className = "drag-nav-scroll";

        // 中间的文本值
        var middleText = "";

        var ulHtml = "<ul>";
        for (var i = 0; i < number; i++) {
            var tmp = data[i];
            ulHtml += "<li idx='" + (i + 1) + "' class='" + (!tmp.enabled ? "drag-nav-disabled" : "")+ "'>" +
                "<div class='drag-nav-left' style='display:" + (tmp.leftShow ? "block" : "none") + "'>" + tmp.leftInfo + "</div>" +
                "<div style='height: " + eleHeight + "px' class='drag-nav-center'>" + tmp.centerInfo + "</div>" +
                "<i></i>" +
                "</li>";

            if (i === (number - 1) / 2) {
                middleText = tmp.centerInfo;
            }

            // 计算上边界
            if (topBoundary === 1 && tmp.enabled) {
                topBoundary = -(i * eleHeight);
            }

            // 计算下边界
            else if (topBoundary !== 1 && bottomBoundary === 1 && !tmp.enabled) {
                bottomBoundary = -(i * eleHeight);
            }
        }
        ulHtml += "</ul>";

        topBoundary = topBoundary + (visibleHeight - eleHeight) / 2;
        bottomBoundary = bottomBoundary + (visibleHeight - eleHeight) / 2 + eleHeight;

        $(scrollObj).html(ulHtml);
        $(visibleObj).html(scrollObj);

        $(visibleObj).append("<div class='drag-nav-middle' style='height: " + eleHeight + "px;top: " + (visibleHeight - eleHeight) / 2 + "px'></div>");
        $(visibleObj).append("<div class='drag-nav-focus-flag' style='line-height: " + eleHeight + "px;height: " + eleHeight + "px;top: " + (visibleHeight - eleHeight) / 2 + "px'>" + middleText + "</div>");

        // 滚动区域
        var scrollObj = $(scrollObj);

        // 使滚动区域垂直居中
        scrollObj.css("top", (-(number * eleHeight - visibleHeight) / 2) + "px");

        // 初始化拖动事件
        _initDrag(scrollObj, topBoundary, bottomBoundary, config, data, function(stopInfo) {
            if (callback) {
                callback(stopInfo);
            }
        });

        // 初始化点击事件
        _initClick(scrollObj, config, data, function(stopInfo) {
            if (callback) {
                callback(stopInfo);
            }
        });
    };

    var dragNav = {
        init: init
    };

    // 支持AMD
    if (typeof define === "function" && define.amd ) {
        define(function() {
            return dragNav;
        });
    }
    else {
        window.dragNav = dragNav;
    }
})();