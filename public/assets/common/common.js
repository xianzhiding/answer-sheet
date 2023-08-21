/*
 * @Description: common.js
 * @Author: dingxianzhi
 * @Email: dingxz@moofen.cn
 * @Date: 2019-06-29 11:51:39
 * @LastEditTime: 2021-02-10 10:41:57
 */
"use strict";
/*
 * 格式化字符串
 * 用法：'my name is {0}, age {1}'.format('xianzhi', 30)
 */
/* 
String.prototype.format = function () {
    let self = this;
    for (let i = 0; i < arguments.length; i++) {
        self = self.replace(new RegExp('\\{' + i + '\\}', 'g'), arguments[i]);
    }
    return self;
}; */
String.prototype.format = function (...args) {
    let self = this;
    for (let i = 0; i < args.length; i++) {
        self = self.replace(new RegExp('\\{' + i + '\\}', 'g'), args[i]);
    }
    return self;
};
// 获取浏览器地址栏参数
String.prototype.queryURLParams = function() {
    const reg = /([^&?=]+)=([^&?=]+)/g, obj = {};
    /* this.replace(reg, function(c){
        obj[arguments[1]] = arguments[2];
    }); */
    // ES6 方法
    this.replace(reg, (...arg)=>{
        obj[arg[1]] = arg[2];
    });
    return obj;
};
/*
 * 日期格式化函数
 *  
 *  var date = new Date(number).format("yyyy-MM-dd");
 *
 */
Date.prototype.format = function (ts) {
    var o = {
        "M+": this.getMonth() + 1, //月份   
        "d+": this.getDate(), //日   
        "h+": this.getHours(), //小时   
        "m+": this.getMinutes(), //分   
        "s+": this.getSeconds(), //秒   
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度   
        "S": this.getMilliseconds() //毫秒   
    };
    if (ts == null || ts.length == 0 || ts == 'undefined') {
        ts = 'yyyy-MM-dd';
    }
    if (/(y+)/.test(ts)) {
        ts = ts.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(ts)) {
            ts = ts.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return ts;
};
!(function (win) {
    const d = document;
    let self = null;
    function MFCommon() {
        self = this;
        this._link();
    };
    MFCommon.prototype = {
        _link() {
            const skin = d.createElement('link');
            skin.rel = 'stylesheet';
            skin.href = './assets/common/theme/default/style.min.css';
            d.head.appendChild(skin);
        }
        // 获取、设置滚动条位置-
        , top(o) {
            if (typeof o == 'undefined') return $(window).scrollTop();
            $(window).scrollTop(o);
        }
        , check: {
            // 手机号码
            phone (s) {
                return /^1\d{10}$/.test(s);
            },
            // 座机
            tel (s) {
                return /(\d{3}[\s\-]?\d{8})|(\d{4}[\s\-]?\d{7})/.test(s);
            },
            // 邮箱
            email (s) {
                return /^([a-z0-9][a-z0-9_\-\.]*)@([a-z0-9][a-z0-9\.\-]{0,20})\.([a-z]{2,4})$/i.test(s);
            },
            // 中文
            namecn (s) {
                return /^[\u4e00-\u9fa5]{2,5}$/.test(s);
            },
            // 英文
            nameen (s) {
                return /^[a-z]{2,20}(\s[a-z]{1,20})*$/i.test(s);
            },
            // QQ号
            qq (s) {
                return /^[1-9][0-9]{4,9}$/.test(s);
            },
            // 数字
            number (s) {
                return /^[0-9]$/.test(s);
            },
            // 身份证简易校验
            card (s) {
                return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(s);
            }
        }
        /**
         * [alert]
         * @param  {[string]}   title    [title信息]
         * @param  {[string]}   msg      [需要显示的内容]
         * @param  {[string]}   btn      [btn确定按钮名称自定义]
         * @param  {Function}   callback   [返回值是否需要返回，如不需要可忽略]
         * 
         * `javascript
         *
         * mfc.alert('提示信息', '你确认提交该条数据吗', '确认提交');
         * 
         * 或
         * 
         * mfc.alert('提示信息', '你确认提交该条数据吗', '确认提交', function(callback) {
         *    if (callback) {
         *        console.log('alert');
         *    }
         * });
         * 
         * `
         */
        , alert(title, message, btn) {
            if(arguments[0] instanceof Object){
            }else{
                this._show(title, message, btn);
            }
        }
        /**
         * [confirm]
         * @param  {[string]}   title    [title信息]
         * @param  {[string]}   msg      [需要显示的内容]
         * @param  {[string]}   btn      [btn确定按钮名称自定义]
         * 
         * `javascript
         * 
         * mfc.confirm('提示信息', '你确认提交该条数据吗', '确认提交', function(callback) {
         *    if (callback) {
         *        console.log('confirm');
         *    }
         * });
         * 
         * `
         */
        , confirm(title, message, btn, callback) {
            this._show(title, message, btn, 'confirm', function (result) {
                if (typeof callback == 'function') callback(result);
            });
        }
        , _show(title, msg, btn, type, callback) {
            const t = Math.ceil(Math.random() * 100);
            $('input,button,a').blur();
            let s = `
                <div class="dui-modal" id="duimodal{3}">
                    <div class="dui-dialog">
                        <div class="dui-dialog-header">
                            <p class="dui-dialog-title">{0}</p>
                            <span class="dui-dialog-close alert_on" data-mark="{3}">&times;</span>
                        </div>
                        <div class="dui-dialog-body">
                            <div class="dui-dialog-content">{1}</div>
                        </div>
                        <div class="dui-dialog-footer">
                            ${type == 'confirm'?'<a class="alert_ok" data-mark="{3}">{2}</a><a class="alert_on" data-mark="{3}">取消</a>' : '<a class="alert_on" data-mark="{3}">{2}</a>'}
                        </div>
                    </div>
                </div>`;
            s = s.format(title||'提示', msg, btn||'取消', t);
            setTimeout(function () {
                $('.dui-dialog').addClass('dui-dialog-scale');
            }, 100);
            // if ($('.dui-modal').length >= 1) return;
            $('body').append(s);
            // 点击遮罩层关闭
            /* if ($('.dui-modal .dui-dialog input').length == 0) {
                $('.dui-modal').on('click', function (event) {
                    const mark = $(this).data('mark');
                    if ($(event.target || event.srcElement).hasClass('dui-modal')) {
                        self.delmodal(mark);
                    }
                });
            } */
            $('.alert_ok').click(function () {
                const mark = $(this).data('mark');
                self.delmodal(mark);
                if (callback) callback(true);
            });
            $('.alert_on').click(function () {
                const mark = $(this).data('mark');
                self.delmodal(mark);
                if (callback) callback(false);
            });
        }
        , modal(title, msg){
            const t = Math.ceil(Math.random() * 100);
            const s = `<div class="dui-modal" id="duimodal{2}"><div class="dui-dialog dui-dialog-lg"><div class="dui-dialog-header"><p class="dui-dialog-title">{0}</p><span class="dui-dialog-close" onclick="mfc.delmodal({2})">&times;</span></div><div class="dui-dialog-body"><div class="dui-dialog-content">{1}</div></div></div></div>`.format(title||'提示', msg, t);
            setTimeout(function () {
                $('.dui-dialog').addClass('dui-dialog-scale');
            }, 100);
            $('body').append(s);
        }
        , delmodal(mark) {
            if (!mark) {
                $('.dui-modal').hide();
            };
            $('#duimodal' + mark).hide();
            setTimeout(function () {
                if (!mark) return $('.dui-modal').remove();
                $('#duimodal' + mark).remove();
            }, 100);
        }
        /**
         * mfc.wait(msg);
         * 功能：加载效果Loading
         * 参数：string;
         * 实例：mfc.wait('数据加载中...');
         */
        , wait(msg) {
            if ($('.dui-wait').length > 0) return;
            const c = '<div class="dui-wait"><div class="dui-loading"><p class="dui-loading-content">{0}</p></div></div>'.format(msg || '加载中...');
            $(d.body).append(c);
        }
        //关闭加载效果
        , waitok() {
            $('.dui-wait').remove();
        }
        // 消息框 bootstrap 样式
        /**
         * @param {内容} content 
         * @param {参数} opts 
         * type: 'primary', // 控制颜色 primary, secondary, success, danger, warning, info, light, dark  
         * position: 'topright', //控制方向 topleft, topcenter, topright, bottomleft, bottomcenter, bottonright, center,
         * appendType: 'append', //追加位置 append, prepend
         * closeBtn: false, // 是否显示关闭按钮
         * autoClose: 2000 // 定时关闭时间
         */
        , notice(content, opts) {
            opts = $.extend(true, {
                type: 'primary',
                position: 'topright',
                appendType: 'append',
                closeBtn: false,
                autoClose: 5000
            }, opts);
            // 定义样式
            // const $skin = $('<style type="text/css">.dui-notice-container {position: fixed; z-index: 999999}.dui-notice-container .alert {box-shadow: 0 5px 5px rgba(0, 0, 0, 0.1);border-radius: .25rem}.dui-notice-container-topleft {top: 10px;left: 10px}.dui-notice-container-topcenter {top: 10px;left: 50%;transform: translate(-50%, 0)}.dui-notice-container-topright {top: 10px;right: 10px}.dui-notice-container-bottomleft {bottom: 10px;left: 10px}.dui-notice-container-bottomcenter {bottom: 10px;left: 50%;transform: translate(-50%, 0)}.dui-notice-container-bottomright {bottom: 10px;right: 10px}.dui-notice-container-center {top: 50%;left: 50%;transform: translate(-50%, -50%)}</style>');
            // 得到容器 $container
            let $container = $('#dui-notice-container-' + opts.position);
            if (!$container.length) {
                $container = $('<div id="dui-notice-container-' + opts.position + '" class="dui-notice-container dui-notice-container-' + opts.position + '"></div>');
                // $('head').append($skin);
                $('body').append($container);
            }
            // alert $el
            const $el = $(`<div class="alert fade alert-${opts.type}" role="alert">${content}</div>`);
            // 关闭按钮
            if (opts.closeBtn) {
                $el.append(`
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                `).addClass('alert-dismissible');
            };
            //定时关闭
            if (opts.autoClose) {
                setTimeout(() => {
                    $el.alert('close');
                }, opts.autoClose);
            };
            opts.appendType === 'append' ? $container.append($el) : $container.prepend($el);
            setTimeout(() => {
                $el.addClass('show');
            }, 50);
            return;
        }
        , checkbox(el){
            const v = [];
            $(el + ' input[type="checkbox"]:checked').each(function () {
                v.push($(this).val());
            });
            return v;
        }
        , radios(el){
            let v;
            $(el + ' input[type="radio"]:checked').each(function () {
                v = $(this).val();
            });
            return v;
        }
        , checked(el, type) {
            let v = [];
            if (type) {
                $(el + ' input[type="checkbox"]:checked').each(function () {
                    v.push($(this).val());
                });
                return v;
            } else {
                $(el + ' input[type="radio"]:checked').each(function () {
                    v = $(this).val();
                });
                return v;
            };
        }
        /**
         * [getLocSrc 获取地址栏参数]
         * @param  {[type]} name [参数名]
         */
        , getLocSrc(param) {
            /* const reg = new RegExp("(^|&)" + param + "=([^&]*)(&|$)", "i"),
                r = window.location.search.substr(1).match(reg);
            if (r != null) return unescape(r[2]);
            return null; */
            // 获取参数
    	    var url = window.location.search;
    	    // 正则筛选地址栏
    	    var reg = new RegExp("(^|&)" + param + "=([^&]*)(&|$)");
    	    // 匹配目标参数
    	    var result = url.substr(1).match(reg);
    	    //返回参数值
    	    return result ? decodeURIComponent(result[2]) : null;
        }
        // 模拟log打印，主要用在手机端
        , log(s) {
            const d = $('.dui-log');
            if (typeof s == 'object') {
                let s1 = '';
                for (let a in s) {
                    s1 += '{0}:{1}, '.format(a, s[a]);
                }
                s = s1;
            }
            if (d.length == 0) {
                $('body').append('<div class="dui-log" style="position:fixed;z-index:888;left:0;top:0;background:rgba(0,0,0,0.3);"></div>');
                d = $('.dui-log');
            }
            d.append('<p>' + s + '</p>');
        }
        , verifyCode(id) {
            const num = [],
                canvas_width = d.getElementById(id).clientWidth,
                canvas_height = d.getElementById(id).clientHeight,
                canvas = d.getElementById(id),
                context = canvas.getContext("2d"),
                sCode = "1,2,3,4,5,6,7,8,9,0",
                aCode = sCode.split(","),
                aLength = aCode.length;
            canvas.width = canvas_width;
            canvas.height = canvas_height;
            for (let i = 0; i <= 3; i++) {
                const j = Math.floor(Math.random() * aLength),
                    deg = Math.random() * 40 * Math.PI / 180,
                    txt = aCode[j],
                    x = 10 + i * 20,
                    y = 20 + Math.random() * 8;
                num[i] = txt.toLowerCase();
                context.font = "bold 23px 微软雅黑";
                context.translate(x, y);
                context.rotate(deg);
                context.fillStyle = this._drawColor();
                context.fillText(txt, 0, 0);
                context.rotate(-deg);
                context.translate(-x, -y);
            }
            // 验证码上显示线条
            for (let i = 0; i <= 5; i++) {
                context.strokeStyle = this._drawColor();
                context.beginPath();
                context.moveTo(Math.random() * canvas_width, Math.random() * canvas_height);
                context.lineTo(Math.random() * canvas_width, Math.random() * canvas_height);
                context.stroke();
            }
            //验证码上显示小点
            for (let i = 0; i <= 50; i++) {
                const x = Math.random() * canvas_width,
                    y = Math.random() * canvas_height;
                context.strokeStyle = this._drawColor();
                context.fillStyle = this._drawColor();
                context.beginPath();
                context.arc(x, y, 1, 0, 2 * Math.PI);
                context.fill();
                context.stroke();
            }
            return num.join("");
        }
        // 绘制颜色
        , _drawColor() {
            const r = Math.floor(Math.random() * 256),
                g = Math.floor(Math.random() * 256),
                b = Math.floor(Math.random() * 256);
            return "rgb(" + r + "," + g + "," + b + ")";
        }
        // 动态加载js并支持回调-
        , loadJs(src, callback) {
            const sc = d.createElement('script');
            sc.src = src;
            sc.async='async';
            if (callback) {
                if (d.addEventListener) {
                    sc.addEventListener("load", callback, false);
                } else {
                    sc.onreadystatechange = function() {
                        if (/loaded|complete/.test(sc.readyState)) {
                            sc.onreadystatechange = null;
                            callback();
                        }
                    };
                }
            }
            d.body.appendChild(sc);
        }
        // 发送验证码
        , sendVerifyCode(options){
            const timer = setInterval(function () {
                if (options.time === 0) {
                    options.btn
                        .text('重新获取')
                        .attr('disabled', false);
                    clearInterval(timer);
                } else {
                    options.btn
                        .text('还剩' + options.time + '秒')
                        .attr('disabled', true);
                    options.time--;
                }
            }, 1000);
        }
        , getContextPath() {
            var pathName = window.location.pathname.substring(1);
            var webName = pathName == '' ? '' : pathName.substring(0, pathName.indexOf('/'));
            // return window.location.protocol + '//' + window.location.host + '/' + webName + '/';
            return "/"+ webName ;
        }
        , examTypeChecked: function(el) {
            const v = [];
            $(el + ' input[type="checkbox"]:checked').each(function () {
                v.push($(this).val());
            });
            if (v.length == 0)
                return 0;
            else if (v.length == 1)
                return v[0];
            else
                return 3;
        }
        // 深度拷贝
        , deepCopy(obj){
            let result = obj.constructor === Array ? [] : {};
            if(typeof obj !== 'object' || obj == null) return obj;
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    const okey = obj[key];                
                    result[key] = deepCopy(okey)
                }
            }
            return result;
        },
        
        getDay(day) {
            const d = new Date().getTime();
            let t = 0;
            switch (day*1) {
                case 1:
                    t = -7
                    break;
                case 2:
                    t = -30
                    break;
                case 3:
                    t = -182
                    break;
                case 4:
                    t = -365
                    break;
            }
            return d + 1000 * 60 * 60 * 24 * t;
        }
        ,getPushTimeAfter(t){
            const d = new Date().getTime();
            return d + 1000 * 60 * 60 * 24 * (t*-1);
        }
        // 日期格式转换为时间戳
        , timestamp(str){
            if(str && typeof str === 'string'){
                return new Date(str).getTime();
            }
        }
        // 下载文件
        , down(url, data = {}, method = 'GET', fileName, contextType) {
            mfc.wait("下载中...");
            var formData = new FormData();
            if (data != undefined && data != null) {
                for (var prop in data) {
                    formData.append(prop, data[prop]);
                }
            }
            var xhr = new XMLHttpRequest();
            xhr.responseType = "blob";
            xhr.open(method, url, true);
            xhr.onload = function () {
                mfc.waitok();
                if (this.status != 200) {
                    mfc.alert('提示', '下载失败！');
                    return;
                }
                var content = this.response;
                var blobParam = {};
                if (contextType != undefined) {
                    blobParam.type = contextType;
                }
                var blob = new Blob([content], blobParam);
                var a = document.createElement('a');
                a.href = URL.createObjectURL(blob);
                a.download = fileName;
                a.style.display = 'none';
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
            };
            xhr.send(formData);
        }
        ,btoa(str){
            return btoa(encodeURI(str))
        }
        ,atob(str){
            return decodeURI(atob(str))
        }
    };
    win.MFCommon = MFCommon;
})(window);

const mfc = new MFCommon();





// 数据本地储存 sessionStorage
!(function(win){
    function MFStorage(nameSpace, splitSign) {
        this.nameSpace = nameSpace;
        this.splitSign = splitSign || '|';
        this.status = {
            SUCCESS: 0,
            FAILURE: 1,
            OVERFLOWER: 2,
            TIMEOUT: 3
        }
    }
    MFStorage.prototype = {
        getKey(key) {
            return this.nameSpace + this.splitSign + key;
        }
        , setItem(key, value, callback, expireTime) {
            if(typeof value == "object" ) return console.log('请将'+key+'的数据转换为字符串形式！');
            let status = this.status.SUCCESS;
            key = this.getKey(key);
            // value = Base64.encode(value);
            expireTime = typeof expireTime === 'number' ? expireTime + new Date().getTime() : -1;
            try {
                // localStorage.setItem(key, expireTime + this.splitSign +  mfc.btoa(value));
                localStorage.setItem(key, expireTime + this.splitSign +  Base64.encode(value));
            } catch (e) {
                status = this.status.OVERFLOWER;
            };
            callback && callback.call(this, status, key, value);
            return value;
        }
        , getItem(key, callback) {
            key = this.getKey(key);
            let status = this.status.SUCCESS, value = localStorage.getItem(key);
            if (value) {
                const index = value.indexOf(this.splitSign), time = value.slice(0, index);
                if (time > new Date().getTime() || time == -1) {
                    value = value.slice(index + this.splitSign.length);
                } else {
                    value = null;
                    status = this.status.TIMEOUT;
                    localStorage.removeItem(key);
                }
            } else {
                status = this.status.FAILURE;
            };
            callback && callback.call(this, status, key, value);
            // return value ? mfc.atob(value) : value;
            return value ? Base64.decode(value) : value;
        }
        , removeItem(key, callback) {
            let status = this.status.FAILURE
            key = this.getKey(key);
            const value = localStorage.getItem(key);
            if (value) {
                value.slice(value.indexOf(this.splitSign) + this.splitSign.length);
                localStorage.removeItem(key);
                status = this.status.SUCCESS;
            };
            callback && callback.call(this, status, key, value);
        }
        , clear() {
            localStorage.clear();
        }
    };
    win.MFStorage = MFStorage;
})(window);
const mfs = new MFStorage('MFS');