//jquery 的构造函数
function Jquery(arg) {
    //用来存选出来的元素
    // this.elemenets = [];
    switch (typeof arg) {
        case 'function':
            domReady(arg);
            break;
        case 'string':
            this.elements = getEle(arg);
            break;
        case 'object':
            this.elements.push(arg);
            break;
    }
}
//DOM ready onload 如果参数是函数，则进行domReady操作
function domReady(fn) {
    // FF chrome
    if (document.addEventListener) {
        //jquery中已经省略false，false解决低版本火狐兼容性问题
        document.addEventListener('DOMContentLoaded', fn, false);
    } else {
        document.attachEvent('onreadystatechange', function () {
            if (document.readyState == 'complete') {
                fn();
            }
        });
    }
}

function getByClass(oParent, sClass) {
    //高级浏览器支持getElementsByClassName直接使用
    if (oParent.getElementsByClassName) {
        return oParent.getElementsByClassName(sClass);
    } else {
        //不支持需要选中所有标签的类名来选取
        var res = [];
        var aAll = oParent.getElementsByTagName('*');
        for (var i = 0; i < aAll.length; i++) {
            //选中标签的全部类名是个str='btn on red'=aAll[i].className   使用正则  reg=/\b sClass \b/g
            var reg = new RegExp('\\b' + sClass + '\\b', 'g');
            if (reg.test(aAll[i].className)) {
                res.push(aAll[i]);
            }
        }
        return res;
    }
}

//如果参数是str 进行选择器的操作
function getByStr(aParent, str) {
    //用来存放选中的元素的数组 这个数组在getEle存在，为了每次执行的时候都需要清空，所以使用局部函数的变量
    var aChild = [];
    //aParent开始是[document],再执行完getByStr的时候getEle将aParent指向了getByStr函数的返回值aChild数组以确保循环父级下面的所有匹配元素
    for (var i = 0; i < aParent.length; i++) {
        switch (str.charAt(0)) {
            //id选择器  eg: #box  使用document.getElementById选取
            case '#':
                var obj = document.getElementById(str.substring(1));
                aChild.push(obj);
                break;
                //类选择器  eg: .box  使用上面封装的getByClass选取
            case '.':
                //由于一个标签可以有多个类选择器 所以需要进行循环选取
                var aRes = getByClass(aParent[i], str.substring(1));
                for (var j = 0; j < aRes.length; j++) {
                    aChild.push(aRes[j]);
                }
                break;
                //今天先简单的编写选择器  这里我们假设除了id和类选择器，就是标签选择器
            default:
                // 如果是li.red  那么用正则来判断
                if (/\w+\.\w+/g.test(str)) {
                    //先选择标签，在选择类选择器  使用类选择器的时候重复选择器函数即可
                    var aStr = str.split('.');
                    var aRes = aParent[i].getElementsByTagName(aStr[0]);
                    var reg = new RegExp('\\b' + aStr[1] + '\\b', 'g');
                    //循环选取标签，注意外层已经有i的循环
                    for (var j = 0; j < aRes.length; j++) {
                        if (reg.test(aRes[j].className)) {
                            aChild.push(aRes[j]);
                        }
                    }
                    //如果是li:eq(2) 或者 li:first这样的选择器   书写正则是的时候注意（）可有可以无为？ 有或者没有为* 至少有一个也就是若干个为+   {2,5}这种则为2-5个
                } else if (/\w+\:\w+(\(\d+\))?/g.test(str)) {
                    //讲str进行整理    [li,eq,2]  或者  [li,first]
                    var aStr = str.split(/\:|\(|\)/);
                    //aStr[2]是eq、lt、gt传入的参数，这里使用n来保存
                    var n = aStr[2];
                    //在父级下获取所有匹配aStr[0]项的标签
                    var aRes = aParent[i].getElementsByTagName(aStr[0]);
                    //这时候会循环判断aStr[1]项是的内容，jquery中经常使用的为eq、lt、gt、even、odd、first、last
                    switch (aStr[1]) {
                        //如果是eq则把第n项传入aChild数组即可
                        case 'eq':
                            aChild.push(aRes[n]);
                            break;
                            //如果是lt需要将aRes数组中获取到的小于n的标签循环推入aChild中
                        case 'lt':
                            for (var j = 0; j < n; j++) {
                                aChild.push(aRes[j]);
                            }
                            break;
                            //如果是gt则和lt相反
                        case 'gt':
                            for (var j = n; j < aRes.legth; j++) {
                                aChild.push(aRes[j]);
                            }
                            break;
                            //如果是event的话需要隔数添加，注意jquery中的event是从第0开始循环的
                        case 'event':
                            for (var j = 0; j < aRes.length; j += 2) {
                                aChild.push(aRes[j]);
                            }
                            break;
                            //如果是odd的和event不同的只是从第1项开始循环
                        case 'odd':
                            for (var j = 1; j < aRes.length; j += 2) {
                                aChild.push(aRes[j]);
                            }
                            break;
                            //如果是first，则将aRes[0]推入aChild
                        case 'first':
                            aChild.push(aRes[0]);
                            break;
                        case 'last':
                            aChild.push(aRes[aRes.length - 1]);
                            break;
                    }
                    //属性选择器  eg：input[type=button] 同样适用正则来判断
                } else if (/\w+\[\w+\=\w+\]/g.test(str)) {
                    //将属性选择器切成数组   [input,type,button]
                    var aStr = str.split(/\[|\=|\]/g);
                    var aRes = aParent[i].getElementsByTagName(aStr[0]);
                    //在选中标签中选出有aRes[1]的属性
                    for (var j = 0; j < aRes.length; j++) {
                        //把属性值为aRes[2]的标签推入aChild中
                        if (aRes[j].getAttribute(aStr[1]) == aStr[2]) {
                            aChild.push(aRes[j]);
                        }
                    }
                    //标签选择器  div、span
                } else {
                    var aRes = aParent[i].getElementsByTagName(str);
                    for (var j = 0; j < aRes.length; j++) {
                        aChild.push(aRes[j]);
                    }
                }
                break;
        }
    }
    return aChild;
}

function getEle(str) {
    //如果是字符串的话先要去除收尾空格  eg:"   on replace   index  play auto   "
    var arr = str.replace(/^\s+|\s+$/g, '').split(/\s+/g);
    var aChild = [];
    var aParent = [document];
    for (var i = 0; i < arr.length; i++) {
        aChild = getByStr(aParent, arr[i]);
        aParent = aChild
    }
    return aChild;
}
/*实现jquery $符号的写法*/
function $1(arg) {
    var jq = new Jquery(arg);
    return jq.elements;
}

/*添加类名*/
// addClass(test[0], "cls");
function addClass(obj, cls) {
    var obj_class = obj.className,
        blank = (obj_class != '') ? ' ' : '';
    added = obj_class + blank + cls;
    obj.className = added;
}
/*删除类名*/
// removeClass(test[0], "on");
function removeClass(obj, cls) {
    var obj_class = ' ' + obj.className + ' ';
    obj_class = obj_class.replace(/(\s+)/gi, ' '),
        // removed = obj_class.replace(' ' + cls + ' ', ' ');
        removed = obj_class.split(' ' + cls).join('');
    removed = removed.replace(/(^\s+)|(\s+$)/g, '');
    obj.className = removed;
}
/*判断类名*/
// console.log(hasClass(test[0], "test"));
function hasClass(obj, cls) {
    var obj_class = obj.className,
        obj_class_lst = obj_class.split(/\s+/);
    x = 0;
    for (x in obj_class_lst) {
        if (obj_class_lst[x] == cls) {
            return true;
        }
    }
    return false;
}
/*字符串转dom*/
function parseDom(arg) {
    var objE = document.createElement("div");
    objE.innerHTML = arg;
    return objE.childNodes;
};
/*获取元素offsetLeft   注意：此方法会比jQuery offset()相差0-2像素*/
function offsetLeft(obj) {
    var tmp = obj.offsetLeft;
    var val = obj.offsetParent;
    while (val != null) {
        tmp += val.offsetLeft;
        val = val.offsetParent;
    }
    return tmp;
}

function offsetTop(obj) {
    var tmp = obj.offsetTop;
    var val = obj.offsetParent;
    while (val != null) {
        tmp += val.offsetTop;
        val = val.offsetParent;
    }
    return tmp;
}

/*获取元素offset值   注意：此方法会比jQuery offset()相差0-1像素*/
function getRect(element) {
    var rect = element.getBoundingClientRect();
    var top = document.documentElement.clientTop;
    var left = document.documentElement.clientLeft;
    return {
        top: rect.top - top,
        bottom: rect.bottom - top,
        left: rect.left - left,
        right: rect.right - left
    }
}

/*获取指定类名父元素*/

function getParents(obj, cls) {
    var result = null;
    while (clsName(obj, cls)) {
        if (obj.tagName != 'BODY') {
            obj = obj.parentNode;
        } else {
            break
        }
    }

    function clsName(obj, cls) {
        var clsList = obj.className ? obj.className.split(' ') : [];
        for (var i = 0; i < clsList.length; i++) {
            if (clsList[i].indexOf(cls) > -1) {
                result = obj;
                return false
            }
        }
        return true
    }
    return result;
}

// 获取所有的祖先元素(不包括自己)
function allParents(obj) {
    var result = []
    obj = obj.parentNode;
    while (obj.tagName != 'BODY') {
        result.push(obj);
        obj = obj.parentNode;
    }
    return result;
}


/*
 * @param {*} obj 元素组合
 * @param {*} active 类名
 * @param {*} cur 当前元素(可选)
 */
function classsOpt(obj, active, cur) {
    if (active) {
        for (var i = 0; i < obj.length; i++) {
            removeClass(obj[i], active);
        }
    }
    if (cur) {
        addClass(cur, active);
    }
}

/*
 * @param {*} currentEle  当前元素
 * @param {*} childEle 子元素
 */
// 判断是否含有某个子元素(不包括自己)
function hasChildren(currentEle, childEle) {
    var result = childEle.parentNode;
    while (result != currentEle) {
        if (result.tagName != 'BODY') {
            result = result.parentNode;
        } else {
            return false
            break
        }
    }
    return true
}

/* Cookie记录 */

function setCookie(cname, cvalue) {
    var d = new Date();
    d.setTime(d.getTime() + (24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i].trim();
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return null;
}

function delCookie(cname) {
    document.cookie = cname + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
}
