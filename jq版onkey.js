(function (jq) {
    jq.extend({
        onKey: function (up, down, left, right, confirm) {
            var _key = {
                groupName: '.onkey-group',
                itemName: '.onkey-item',
                firstName: '.onkey-first',
                itemFocusName: 'onkey-focus',
                itemPressName: 'onkey-press',
                hiddenName: 'onkey-hidden',
                KEY_UP: 'KEY_UP',
                KEY_DOWN: 'KEY_DOWN',
                KEY_LEFT: 'KEY_LEFT',
                KEY_RIGHT: 'KEY_RIGHT',
                KEY_CONFIRM: 'KEY_CONFIRM',
                currentItem: null,
                isPrior: 'prior',
                /* 初始化 */
                init: function (up, down, left, right, confirm) {
                    var _that = this;
                    if ($(this.firstName).hasClass(this.groupName.substr(1))) {
                        this.currentItem = this._getMinPositionNode($(this.firstName).find(this.itemName));
                    } else {
                        this.currentItem = $(this.firstName)[0];
                    }
                    $(this.currentItem).addClass(this.itemFocusName);
                    $(this.firstName).removeClass(this.firstName.substr(1));
                    this._setKeyCode(up, down, left, right, confirm);

                    // 增加索引
                    $(this.itemName).each(function (index, element) {
                        $(element).addClass(_that.itemName.substr(1) + '_' + (index + 1));
                    });

                },
                /* 记录当前焦点 */
                storeFocus: function () {
                    var _class = $(this.currentItem).attr('class').split(' ');
                    for (var i = 0; i < _class.length; i++) {
                        if (_class[i].indexOf(this.itemName.substr(1) + '_') > -1) {
                            $.cookie('onKeyFocus', _class[i]);
                        }
                    }
                },
                /* 恢复上一个焦点 */
                setLastFocus: function () {
                    var _class = $.cookie('onKeyFocus');
                    this.currentItem = $('.' + _class)[0];
                    this._removeClass();
                    $(this.currentItem).addClass(this.itemFocusName);

                },
                /* 设置当前焦点元素 */
                setCurrentItem: function (dom) {
                    this.currentItem = dom;
                    this._removeClass();
                    $(this.currentItem).addClass(this.itemFocusName);
                    this.storeFocus();
                },
                /* 获取当前组中元素 */
                _getCurrentGroupNodes: function (currentItem) {
                    var nodes = $(currentItem).parents(this.groupName).eq(0).find(this.itemName);
                    var showNodes = [];
                    // 判断组中元素是否不参与选中
                    for (var i = 0; i < nodes.length; i++) {
                        if (!($(nodes[i]).hasClass(this.hiddenName) || $(nodes[i]).parents(this.groupName).eq(0).hasClass(this.hiddenName))) {
                            showNodes.push(nodes[i])
                        }
                    }
                    return nodes;
                },
                /* 获取元素组子元素 */
                _getGroupNodes: function (dom) {
                    var nodes = $(dom).find(this.itemName);
                    var showNodes = [];
                    // 判断组中元素是否不参与选中
                    for (var i = 0; i < nodes.length; i++) {
                        if (!$(nodes[i]).hasClass(this.hiddenName)) {
                            showNodes.push(nodes[i])
                        }
                    }
                    return showNodes;
                },
                /* 获取所有组元素 */
                _getGroups: function () {
                    var nodes = $(this.groupName);
                    var showNodes = [];
                    // 判断组中元素是否不参与选中
                    for (var i = 0; i < nodes.length; i++) {
                        if (!$(nodes[i]).hasClass(this.hiddenName)) {
                            showNodes.push(nodes[i])
                        }
                    }
                    return showNodes;
                },
                /* 获取元素集合中最小坐标元素 */
                _getMinPositionNode: function (doms) {
                    var minTop = null;
                    var minLeft = null;
                    var minDom = null;
                    for (var i = 0; i < doms.length; i++) {
                        if (minDom == null) {
                            minDom = doms[i];
                            minTop = $(minDom).offset().top;
                            minLeft = $(minDom).offset().left;
                        } else {
                            if (minTop > $(doms[i]).offset().top || minLeft > $(doms[i]).offset().left) {
                                minDom = doms[i];
                                minTop = $(minDom).offset().top;
                                minLeft = $(minDom).offset().left;
                            }
                        }
                    }
                    return minDom;

                },
                /* 获取最近的坐标 */
                _getSmallDistance: function (x, y, ax, ay) {
                    if (x == ax && y == ay) {}
                    if (x == ax) {
                        var yw = Math.abs(y - ay);
                        var diagonal = Math.sqrt(Math.pow(Math.abs(y - ay), 2) + Math.pow(Math.abs(x - ax), 2));
                        if (diagonal > yw) return yw;
                        else return diagonal;
                    }
                    if (y == ay) {
                        var xw = Math.abs(x - ax);
                        var diagonal = Math.sqrt(Math.pow(Math.abs(y - ay), 2) + Math.pow(Math.abs(x - ax), 2));
                        if (diagonal > xw) {
                            return xw;
                        } else {
                            return diagonal;
                        }
                    }
                    if (y != ay && x != ax) {
                        return Math.sqrt(Math.pow(Math.abs(y - ay), 2) + Math.pow(Math.abs(x - ax), 2));
                    }
                },
                /* 获取元素中临近的元素 */
                _getNearbyDom: function (direction, dom, doms) {
                    if (doms.length == 0) return null;
                    var nearbyDom = null;
                    var arr = 0;
                    var smallDistance = null;
                    var left = $(dom).offset().left;
                    var top = $(dom).offset().top;
                    for (var i = 0; i < doms.length; i++) {
                        if ($(doms[i]).offset().top == top && $(doms[i]).offset().left == left) {
                            var arr1 = ($(dom)[0].id).split("_")[($(dom)[0].id).split("_").length - 1];
                            var arr2 = ($(doms[i])[0].id).split("_")[($(doms[i])[0].id).split("_").length - 1];
                            if (direction == this.KEY_RIGHT) {
                                if (arr1 < arr2) {
                                    nearbyDom = doms[i];
                                    break;
                                }
                            } else if (direction == this.KEY_LEFT) {
                                if (arr1 > arr2 && arr < arr2) {
                                    arr = arr2;
                                    nearbyDom = doms[i];
                                }
                            }

                        } else {
                            if (nearbyDom == null) {
                                nearbyDom = doms[i];
                                var ulSmallDistance = this._getSmallDistance(left, top, $(doms[i]).offset().left, $(doms[i]).offset().top); // 左上
                                var blSmallDistance = this._getSmallDistance(left, top, $(doms[i]).offset().left, $(doms[i]).offset().top + $(doms[i]).height()); // 左下
                                var urSmallDistance = this._getSmallDistance(left, top, $(doms[i]).offset().left + $(doms[i]).width(), $(doms[i]).offset().top); // 右上
                                var brSmallDistance = this._getSmallDistance(left, top, $(doms[i]).offset().left + $(doms[i]).width(), $(doms[i]).offset().top + $(doms[i]).height()); // 右下
                                smallDistance = Math.min(ulSmallDistance, blSmallDistance, urSmallDistance, brSmallDistance);
                            } else {
                                var ulSmallDistance = this._getSmallDistance(left, top, $(doms[i]).offset().left, $(doms[i]).offset().top); // 左上
                                var blSmallDistance = this._getSmallDistance(left, top, $(doms[i]).offset().left, $(doms[i]).offset().top + $(doms[i]).height()); // 左下
                                var urSmallDistance = this._getSmallDistance(left, top, $(doms[i]).offset().left + $(doms[i]).width(), $(doms[i]).offset().top); // 右上
                                var brSmallDistance = this._getSmallDistance(left, top, $(doms[i]).offset().left + $(doms[i]).width(), $(doms[i]).offset().top + $(doms[i]).height()); // 右下
                                var newSmallDistance = Math.min(ulSmallDistance, blSmallDistance, urSmallDistance, brSmallDistance);
                                if (smallDistance > newSmallDistance) {
                                    nearbyDom = doms[i];
                                    smallDistance = newSmallDistance;
                                }
                            }
                        }
                    }
                    return nearbyDom;
                },
                /* 获取元素集合中向某个方向的元素 */
                _getDirectionDom: function (direction, doms, dom) {
                    var nearbyDoms = [];
                    var left = $(dom).offset().left;
                    var top = $(dom).offset().top;
                    var width = $(dom).width();
                    var height = $(dom).height();
                    for (var i = 0; i < doms.length; i++) {
                        if (direction == this.KEY_UP) {
                            if ($(dom).hasClass(this.isPrior) && $(doms[i]).parents().hasClass("tab-menu")) { //此处条件写死了
                                nearbyDoms = [doms[i]];
                                break;
                            }
                            if (top > $(doms[i]).offset().top) {
                                if (($(dom).parent().parent().hasClass("menu_item")) && ($($(dom).parent().parent(".menu_item")).offset().top <= $(doms[i]).offset().top) && ($(dom).parent()[0] != $(doms[i]).parent()[0])) { //此处条件写死了
                                } else {
                                    nearbyDoms.push(doms[i]);
                                }
                            }
                        }
                        if (direction == this.KEY_DOWN) {
                            if ($(doms[i]).hasClass(this.isPrior) && $(dom).parents().hasClass("tab-menu")) { //此处条件写死了
                                nearbyDoms = [doms[i]];
                                break;
                            }
                            if ((top + height) <= $(doms[i]).offset().top) {
                                nearbyDoms.push(doms[i]);
                            }
                        }
                        if (direction == this.KEY_LEFT) {
                            if ($(doms[i]).hasClass(this.isPrior)) {
                                nearbyDoms = [doms[i]];
                                break;
                            }
                            if (left > $(doms[i]).offset().left) {
                                nearbyDoms.push(doms[i]);
                            } else if (left == $(doms[i]).offset().left && top == $(doms[i]).offset().top) {
                                if (doms[i] == dom) {} else {
                                    nearbyDoms.push(doms[i]);
                                }
                            }
                        }
                        if (direction == this.KEY_RIGHT) {
                            if ($(dom).hasClass(this.isPrior)) {
                                nearbyDoms.push(doms[i]);
                            }
                            if (Math.ceil(left + width) <= Math.ceil($(doms[i]).offset().left)) {
                                nearbyDoms.push(doms[i]);
                            } else if (left == $(doms[i]).offset().left && top == $(doms[i]).offset().top) {
                                if (doms[i] == dom) {} else {
                                    nearbyDoms.push(doms[i]);
                                }
                            }
                        }
                    }
                    return this._getNearbyDom(direction, dom, nearbyDoms);
                },
                /* 清除样式 */
                _removeClass: function () {
                    $(this.itemName).removeClass(this.itemFocusName);
                    $(this.itemName).removeClass(this.itemPressName);
                },
                /* 边界判断 */
                isLeftBoundary: function () {
                    var dom = this._getDirectionDom(this.KEY_LEFT, this._getCurrentGroupNodes(this.currentItem), this.currentItem);
                    return dom == null;
                },
                isRightBoundary: function () {
                    var dom = this._getDirectionDom(this.KEY_RIGHT, this._getCurrentGroupNodes(this.currentItem), this.currentItem);
                    return dom == null;
                },
                isTopBoundary: function () {
                    var dom = this._getDirectionDom(this.KEY_UP, this._getCurrentGroupNodes(this.currentItem), this.currentItem);
                    return dom == null;
                },
                isBottomBoundary: function () {
                    var dom = this._getDirectionDom(this.KEY_DOWN, this._getCurrentGroupNodes(this.currentItem), this.currentItem);
                    return dom == null;
                },
                /* 设置方向事件 */
                E: function (direction, fun) {
                    if (!(direction == this.KEY_UP || direction == this.KEY_LEFT || direction == this.KEY_RIGHT || direction == this.KEY_DOWN || direction == this.KEY_CONFIRM)) return;
                    if (direction == this.KEY_CONFIRM) {
                        //this._removeClass();
                        //$(this.currentItem).addClass(this.itemPressName);
                        return fun(this, direction, this.currentItem, false);
                    }
                    var dom = this._getDirectionDom(direction, this._getCurrentGroupNodes(this.currentItem), this.currentItem);
                    if (dom != null) { // 判断同组中有元素
                        this.setCurrentItem(dom);
                    } else { // 判断同组中没有元素
                        if (direction == "KEY_DOWN" || direction == "KEY_UP") {
                            var group = this._getDirectionDom(direction, this._getGroups(), $(this.currentItem).parents(this.groupName).eq(0));                            
                            if (group != null) {
                                var nodes = this._getGroupNodes(group);
                                if (nodes.length > 0) {
                                    this.setCurrentItem(this._getMinPositionNode(nodes));
                                    return fun(this, direction, this.currentItem, true);
                                }
                            }
                        }
                        if (direction == "KEY_LEFT" || direction == "KEY_RIGHT") {
                            if ((direction == "KEY_RIGHT" && $(this.currentItem).parents().hasClass(this.isPrior)) || (direction == "KEY_LEFT" && (($(this.currentItem).parent().parent().parent().parent()[0] == $("." + (this.isPrior)).parent()[0]) || ($(this.currentItem).parent().parent()[0] == $("." + (this.isPrior)).parent()[0])))) {
                                var group = this._getDirectionDom(direction, this._getGroups(), $(this.currentItem).parents(this.groupName).eq(0));
                                if (group != null) {
                                    var nodes = this._getGroupNodes(group);
                                    if (nodes.length > 0) {
                                        this.setCurrentItem(this._getMinPositionNode(nodes));
                                        return fun(this, direction, this.currentItem, true);
                                    }
                                }
                            }
                        }
                    }
                    return fun(this, direction, this.currentItem, false);
                },
                /* 设置按键值 */
                _setKeyCode: function (up, down, left, right, confirm) {
                    this.KEY_UP = up;
                    this.KEY_DOWN = down;
                    this.KEY_LEFT = left;
                    this.KEY_RIGHT = right;
                    this.KEY_CONFIRM = confirm;
                }
            };

            _key.init(up, down, left, right, confirm);
            return _key;
        }
    })
})(jQuery);
