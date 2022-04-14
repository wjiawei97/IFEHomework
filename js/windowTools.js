(function (w) {
  w.myTool = {
    /**
     * 根据id获取元素节点
     * @param {string}id 节点id
     * @returns {any} id为id的节点
     */
    $: function (id) {
      return typeof id === 'string' ? document.getElementById(id) : null;
    },

    /**
     * 返回网页被卷去的高、网页被卷去的左
     * @returns {{top: *, left: *}} top：被卷去的高 left：被卷去的左
     */
    scroll: function () {
      if (window.pageYOffset !== null) { // 最新的浏览器
        return {
          "top": window.pageYOffset,
          "left": window.pageXOffset
        }
      } else if (document.compatMode === 'CSS1Compat') { // W3C
        return {
          "top": document.documentElement.scrollTop,
          "left": document.documentElement.scrollLeft
        }
      }
      return {
        "top": document.body.scrollTop,
        "left": document.body.scrollLeft
      }
    },

    /**
     * 返回当前界面宽度和高度
     * @returns {{width: *, height: *}} width：当前界面宽度 height：当前界面高度
     */
    client: function () {
      if (window.innerWidth !== null) { // 最新的浏览器
        return {
          "width": window.innerWidth,
          "height": window.innerHeight
        }
      } else if (document.compatMode === 'CSS1Compat') { // W3C
        return {
          "width": document.documentElement.clientWidth,
          "height": document.documentElement.clientHeight
        }
      }
      return {
        "width": document.body.clientWidth,
        "height": document.body.clientHeight
      }
    },

    /**
     * 检查obj元素是否的类名中是否有cs
     * @param {Element}obj
     * @param {string}cs
     * @returns {boolean} true有 false无
     */
    hasClassName: function (obj, cs) {
      var reg = new RegExp('\\b' + cs + '\\b');
      return reg.test(obj.className);
    },

    /**
     * 为obj添加类名cs
     * @param {Element}obj
     * @param {string}cs
     */
    addClassName: function (obj, cs) {
      if (!this.hasClassName(obj, cs)) {
        obj.className += ' ' + cs;
      }
    },

    /**
     * 移除所有 obj的cs类：
     * @param {Element}obj
     * @param {string}cs
     */
    removeClassName: function (obj, cs) {
      var reg = new RegExp('\\b' + cs + '\\b');
      // 删除class
      obj.className = obj.className.replace(reg, '');
    },

    /**
     * 对设置和移除obj元素的cs类进行切换：
     * @param {Element}obj
     * @param {string}cs
     */
    toggleClassName: function (obj, cs) {
      if (this.hasClassName(obj, cs)) {
        // 有， 删除
        this.removeClassName(obj, cs);
      } else {
        // 没有，则添加
        this.addClassName(obj, cs);
      }
    },

    /**
     * 控制元素是否显示
     * @param {Element}ele 元素节点
     */
    hide: function (ele) {
      ele.style.display = 'none'
    },
    show: function (ele) {
      ele.style.display = 'block'
    },

    /**
     * 获得某个元素的某个CSS属性
     * @param {Element}obj
     * @param {string}attr
     * @returns {string}
     */
    getCSSAttr: function (obj, attr) {
      if (obj.currentStyle) { // IE 和 opera
        return obj.currentStyle[attr];
      } else {
        return window.getComputedStyle(obj, null)[attr];
      }
    },

    /**
     * 更改某个元素的某个CSS属性
     * @param {Element}eleObj
     * @param {string}attr
     * @param {string | number}value
     */
    setCssAttr: function (eleObj, attr, value) {
      eleObj.style[attr] = value;
    },

    /**
     * 缓动动画函数
     * @param eleObj 要执行缓动动画的元素对象
     * @param json 以JSON格式传入需要改的属性
     * @param fn 回调函数
     */
    slowMoving: function (eleObj, json, fn) {
      clearInterval(eleObj.timer);
      var speed = 0, begin = 0, target = 0, flag = false;
      eleObj.timer = setInterval(function () {
        flag = true;
        for (var key in json) {
          if (json.hasOwnProperty(key)) {
            if (key === 'opacity') {
              begin = parseInt(parseFloat(myTool.getCSSAttr(eleObj, key)) * 100);
              target = parseInt(json[key] * 100);
            } else if ('scrollTop' === key) {
              begin = Math.ceil(Number(eleObj.scrollTop));
              target = parseInt(json[key]);
            } else {
              begin = parseInt(myTool.getCSSAttr(eleObj, key)) || 0;
              target = parseInt(json[key]);
            }
            speed = (target - begin) * 0.2;
            speed = (target > begin) ? Math.ceil(speed) : Math.floor(speed);
            if (key === 'opacity') {
              eleObj.style.opacity = (begin + speed) / 100;
            } else if ('scrollTop' === key) {
              eleObj.scrollTop = begin + speed;
            } else if ("zIndex" === key) {
              eleObj.style[key] = json[key];
            } else {
              eleObj.style[key] = begin + speed + 'px';
            }
            if (begin !== target) {
              flag = false;
            }
          }
        }
        if (flag) {
          clearInterval(eleObj.timer);
          fn && fn();
        }
      }, 100);
    },

    /**
     * 传入总秒数返回对应小时、分钟以及秒数
     * @param second 总秒数
     * @returns {{min: number , hour: number, second: number}}
     */
    secondToHourMinSecond: function (second) {
      return {
        "hour": Math.floor(second / (60 * 60)),
        "min": Math.floor(second % (60 * 60) / 60),
        "second": Math.floor(second % 60)
      }
    },

    /**
     * 传入一个数字，如果是一位数字，前面补0.如果是两位，返回原值。
     * @param {number}num
     * @returns {number}
     */
    addZero: function (num) {
      return num < 10 ? '0' + num : num;
    },

    /**
     * 获取字符串真实长度，目前仅针对中文和英文字符串
     * @param {string}str
     * @returns {number}
     */
    getStrLength: function (str) {
      var len = 0, code = 0;
      for (var i = 0; i < str.length; i++) {
        code = str.charCodeAt(i);
        if (code >= 0 && code <= 127) {
          len += 1;
        } else {
          len += 2;
        }
      }
      return len;
    }
  };
})(window);