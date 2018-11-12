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
                    if (hasClass($1(this.firstName)[0], this.groupName.substr(1))) {
                        this.currentItem = this._getMinPositionNode($1("" + this.firstName + " " + this.itemName));
                    } else {
                        this.currentItem = $1(this.firstName)[0];
                    }

                    addClass(this.currentItem, this.itemFocusName)
                    removeClass($1(this.firstName)[0], this.firstName.substr(1))
                    this._setKeyCode(up, down, left, right, confirm);

                    // 增加索引
                    for (var i = 0; i < $1(this.itemName).length; i++) {
                        var name = _that.itemName.substr(1) + '_' + (i + 1)
                        addClass($1(this.itemName)[i], name)
                    }
                },
                /* 记录当前焦点 */
                storeName: function (name) {
                    var _class = this.currentItem.getAttribute('class').split(' ');
                    for (var i = 0; i < _class.length; i++) {
                        if (_class[i].indexOf(this.itemName.substr(1) + '_') > -1) {
                            setCookie(name, _class[i]);
                        }
                    }
                },
                /* 恢复上一个焦点 */
                setLastFocus: function () {
                    var _class = getCookie('onKeyFocus');
                    this.currentItem = $1('.' + _class)[0];
                    this._removeClass();
                    addClass(this.currentItem, this.itemFocusName)
                },
                /* 设置当前焦点元素 */
                setCurrentItem: function (dom) {
                    this.currentItem = dom;
                    this._removeClass();
                    addClass(this.currentItem, this.itemFocusName)
                    this.storeName("onKeyFocus");
                },
                /* 获取当前组中元素 */
                _getCurrentGroupNodes: function (currentItem) {
                    var nodesParent = getParents(currentItem, this.groupName.substr(1));
                    var nodes = nodesParent.getElementsByClassName(this.itemName.substr(1))
                    var showNodes = [];
                    for (var i = 0; i < nodes.length; i++) {
                        if (!(hasClass(nodes[i], this.hiddenName) || hasClass(getParents(nodes[i], this.groupName.substr(1)), this.hiddenName))) {
                            showNodes.push(nodes[i])
                        }
                    }
                    return nodes;
                },
                /* 获取元素组子元素 */
                _getGroupNodes: function (dom) {
                    var nodes = dom.getElementsByClassName(this.itemName.substr(1))
                    var showNodes = [];
                    for (var i = 0; i < nodes.length; i++) {
                        if (!hasClass(nodes[i], this.hiddenName)) {
                            showNodes.push(nodes[i])
                        }
                    }
                    return showNodes;
                },
                /* 获取所有组元素 */
                _getGroups: function () {
                    var nodes = $1(this.groupName);
                    var showNodes = [];
                    for (var i = 0; i < nodes.length; i++) {
                        if (!hasClass(nodes[i], this.hiddenName)) {
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
                            minTop = offsetTop(minDom);
                            minLeft = offsetLeft(minDom);
                        } else {
                            if (minTop > offsetTop(doms[i]) || minLeft > offsetLeft(doms[i])) {
                                minDom = doms[i];
                                minTop = offsetTop(minDom);
                                minLeft = offsetLeft(minDom);
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

                    var left = offsetLeft(dom);
                    var top = offsetTop(dom);
                    for (var i = 0; i < doms.length; i++) {
                        if (offsetTop(doms[i]) == top && offsetLeft(doms[i]) == left) {
                            var arr1 = (dom.id).split("_")[(dom.id).split("_").length - 1];
                            var arr2 = (doms[i].id).split("_")[(doms[i].id).split("_").length - 1];
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
                                var ulSmallDistance = this._getSmallDistance(left, top, offsetLeft(doms[i]), offsetTop(doms[i])); // 左上
                                var blSmallDistance = this._getSmallDistance(left, top, offsetLeft(doms[i]), offsetTop(doms[i]) + doms[i].clientHeight); // 左下
                                var urSmallDistance = this._getSmallDistance(left, top, offsetLeft(doms[i]) + doms[i].clientWidth, offsetTop(doms[i])); // 右上
                                var brSmallDistance = this._getSmallDistance(left, top, offsetLeft(doms[i]) + doms[i].clientWidth, offsetTop(doms[i]) + doms[i].clientHeight); // 右下
                                smallDistance = Math.min(ulSmallDistance, blSmallDistance, urSmallDistance, brSmallDistance);
                            } else {
                                var ulSmallDistance = this._getSmallDistance(left, top, offsetLeft(doms[i]), offsetTop(doms[i])); // 左上
                                var blSmallDistance = this._getSmallDistance(left, top, offsetLeft(doms[i]), offsetTop(doms[i]) + doms[i].clientHeight); // 左下
                                var urSmallDistance = this._getSmallDistance(left, top, offsetLeft(doms[i]) + doms[i].clientWidth, offsetTop(doms[i])); // 右上
                                var brSmallDistance = this._getSmallDistance(left, top, offsetLeft(doms[i]) + doms[i].clientWidth, offsetTop(doms[i]) + doms[i].clientHeight); // 右下
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
                    var left = offsetLeft(dom);
                    var top = offsetTop(dom);
                    var width = dom.clientWidth;
                    var height = dom.clientHeight;
                    for (var i = 0; i < doms.length; i++) {
                        if (direction == this.KEY_UP) {
                            if (hasClass(dom, this.isPrior) && hasClass(doms[i].parentNode, "tab-menu")) {
                                nearbyDoms = [doms[i]];
                                break;
                            }
                            if (top > offsetTop(doms[i])) {
                                //这里条件写死了写死了
                                if (hasClass(dom.parentNode.parentNode, "menu_item") && (offsetTop(dom.parentNode.parentNode) <= offsetTop(doms[i])) && (dom.parentNode != doms[i].parentNode)) {} else {
                                    nearbyDoms.push(doms[i]);
                                }
                            }
                        }
                        if (direction == this.KEY_DOWN) {
                            if (hasClass(doms[i], this.isPrior) && hasClass(dom.parentNode, "tab-menu")) {
                                nearbyDoms = [doms[i]];
                                break;
                            }
                            if ((top + height) <= offsetTop(doms[i])) {
                                nearbyDoms.push(doms[i]);
                            }
                        }
                        if (direction == this.KEY_LEFT) {
                            if (hasClass(doms[i], this.isPrior)) {
                                nearbyDoms = [doms[i]];
                                break;
                            }
                            if (left > offsetLeft(doms[i])) {
                                nearbyDoms.push(doms[i]);
                            } else if (left == offsetLeft(doms[i]) && top == offsetTop(doms[i])) {
                                if (doms[i] == dom) {} else {
                                    nearbyDoms.push(doms[i]);
                                }
                            }
                        }
                        if (direction == this.KEY_RIGHT) {
                            if (hasClass(dom, this.isPrior)) {
                                nearbyDoms.push(doms[i]);
                            }
                            if (Math.ceil(left + width) <= Math.ceil(offsetLeft(doms[i]))) {
                                nearbyDoms.push(doms[i]);
                            } else if (left == offsetLeft(doms[i]) && top == offsetTop(doms[i])) {
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
                    classsOpt($1(this.itemName), this.itemFocusName)
                    classsOpt($1(this.itemName), this.itemPressName)
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
                        //addClass(this.currentItem,this.itemPressName)
                        return fun(this, direction, this.currentItem, false);
                    }
                    var dom = this._getDirectionDom(direction, this._getCurrentGroupNodes(this.currentItem), this.currentItem);
                    if (dom != null) {
                        this.setCurrentItem(dom);
                    } else {
                        if (direction == "KEY_DOWN" || direction == "KEY_UP") {
                            var group = this._getDirectionDom(direction, this._getGroups(), getParents(this.currentItem, this.groupName.substr(1)));
                            if (group != null) {
                                var nodes = this._getGroupNodes(group);
                                if (nodes.length > 0) {
                                    this.setCurrentItem(this._getMinPositionNode(nodes));
                                    return fun(this, direction, this.currentItem, true);
                                }
                            }
                        }
                        if (direction == "KEY_LEFT" || direction == "KEY_RIGHT") {
                            //如下条件是在有优先isPrior跳转元素(首页动态栏目列表)的时候，但是条件所涉及的层级都写死了

                            if ((direction == "KEY_RIGHT" && hasClass(this.currentItem.parentNode, this.isPrior)) || (direction == "KEY_LEFT" && $1("." + this.isPrior)[0] && hasChildren($1("." + this.isPrior)[0].parentNode, this.currentItem))) {
                                var group = this._getDirectionDom(direction, this._getGroups(), getParents(this.currentItem, this.groupName.substr(1)));
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
