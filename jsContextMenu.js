;
(function(window) {
    var jsContextMenu = function() {
        for (var p in arguments[0]) {
            if (arguments[0].hasOwnProperty(p)) {
                this.setting[p] = arguments[0][p];
            } else {
                this.setting[p] = jsContextMenu.prototype.setting[p];
            }
        };
    };
    jsContextMenu.prototype.setting = {
        enable: true,
        enableMultiMenu: false,
        zIndex: 1e9,
        parent: document.body,
        items: null,
    };
    var extendFunc = {
            getRandomID: function(Length) {
                var _x = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
                var _tmp = "";
                var _timestamp = new Date().getTime();
                for (var i = 0; i < Length; i++) {
                    _tmp += _x.charAt(Math.ceil(Math.random() * 100000000) % _x.length);
                }
                return _timestamp + _tmp;
            },
            getElementsByClassName: function(node, classname) {
                if (node.getElementsByClassName) {
                    return node.getElementsByClassName(classname);
                } else {
                    return (function getElementsByClass(searchClass, node) {
                        if (node == null)
                            node = document;
                        var classElements = [],
                            els = node.getElementsByTagName("*"),
                            elsLen = els.length,
                            pattern = new RegExp("(^|\\s)" + searchClass + "(\\s|$)"),
                            i, j;
                        for (i = 0; i < elsLen; i++) {
                            if (pattern.test(els[i].className)) {
                                classElements.push(els[i]);
                            }
                        }
                        return classElements;
                    })(classname, node);
                }
            },
            deleteNode: function(obj) {
                obj.parentNode.removeChild(obj);
                return true;
            },
            closestNode: function(node, _cls) {
                while (node.className.split(" ").indexOf(_cls) < 0 && node !== document) {
                    node = node.parentNode;
                };
                return (node === document ? false : node);
            },
            cleanArray: function(_a) {
                for (var i = 0; i < _a.length; i++) {
                    if (_a[i] == "" || typeof _a[i] == "undefined") {
                        _a.splice(i, 1);
                        i = i - 1;
                    };
                };
                return _a;
            },
            removeClass: function(_str, _cls) {
                var _avg = _str.split(" ");
                for (var key = 0; key < _avg.length; key++) {
                    if (_avg[key] === _cls) {
                        delete _avg[key];
                    };
                };
                return extendFunc.cleanArray(_avg).join(" ");
            },
            addClass: function(_str, _cls) {
                var _avg = _str.split(" ");
                for (var key = 0; key < _avg.length; key++) {
                    if (_avg[key] === _cls) {
                        return false;
                    };
                };
                _avg.push(_cls);
                return extendFunc.cleanArray(_avg).join(" ");
            },
        },
        operation = {
            deleteAllMenu: function() {
                var nodes = extendFunc.getElementsByClassName(document, "jsContextMenu");
                for (var key = nodes.length - 1; key >= 0; key--) {
                    extendFunc.deleteNode(nodes[key]);
                };
            },
            bind: function(parent, id) {
                parent.jsContextMenu_id = id;
            },
            create: function(items, id, root, floor) {
                if (root === undefined) {
                    root = document.body;
                };
                if (items !== undefined && items !== null) {
                    var _brunch = document.createElement("div");
                    _brunch.className = "jsContextMenu-brunch";
                    _brunch.setAttribute("floor", floor || 0);
                    for (var key in items) {
                        var _node = document.createElement("div");
                        var _p = document.createElement("p");
                        var _name = document.createTextNode(items[key].name);
                        _p.appendChild(_name);
                        _node.appendChild(_p);
                        _node.className = "jsContextMenu-node";
                        _node.object = items[key];
                        operation.create.call(this, items[key].items, null, _node, (floor || 0) + 1);
                        _brunch.appendChild(_node);
                        handle.bind.call(this, _node);
                    };
                    _brunch.style.marginBottom = "-" + _brunch.style.height;
                    if (id !== undefined && id !== null) {
                        var _root = document.createElement("div");
                        _root.className = "jsContextMenu";
                        _root.appendChild(_brunch);
                        _root.id = id;
                        _root.style.zIndex = this.setting.zIndex;
                        operation.bind.call(this, root, id);
                        root.appendChild(_root);
                    } else {
                        root.appendChild(_brunch);
                    };
                    handle.bind.call(this, root);
                };
            },
            show: function(_id, _e) {
                if (jsContextMenu.prototype.setting.enableMultiMenu === false) {
                    var nodes = extendFunc.getElementsByClassName(document, "jsContextMenu");
                    for (var key = nodes.length - 1; key >= 0; key--) {
                        operation.hide(nodes[key].id);
                    };
                };
                var _node = document.getElementById(_id);
                if (_node) {
                    _node.style.top = _e.clientY - 0 + "px";
                    _node.style.left = _e.clientX - 0 + "px";
                    _node.firstChild.style.display = "block";
                };
            },
            hide: function(_id) {
                var _node = document.getElementById(_id);
                _node.firstChild.style.display = "none";
            },
            click: function(_t, _obj) {
                var _menu = extendFunc.closestNode(_t, "jsContextMenu");
                var _result = (_obj.callback ? _obj.callback.call(this) : true);
                if (_result === true) {
                    operation.hide(_menu.id);
                };
            },
            destroy:function (_id){
                var _node = document.getElementById(_id);
                extendFunc.deleteNode(_node);
            }
        },
        handle = {
            mousedown: function(e) {
                handle.mousedownEvent(e)
            },
            mousedownEvent: function(e) {
                e = handle.getEvent(e);
                t = handle.getTarget(e);
                var _target = e.toElement;
                while (_target.jsContextMenu_id === undefined && _target !== document) {
                    _target = _target.parentNode;
                };
                if (_target === e.currentTarget) {
                    if (t.parentNode.className.indexOf("jsContextMenu-node") >= 0) {
                        t = t.parentNode;
                    };
                    if (t.className.indexOf("jsContextMenu-node") >= 0) {
                        operation.click(t, t.object);
                    };
                    if (e.button == 2) {
                        if (t.className.indexOf("jsContextMenu") < 0) {
                            while (t.jsContextMenu_id === undefined && t !== document) {
                                t = t.parentNode;
                            };
                            operation.show(t.jsContextMenu_id, e);
                        }
                    } else {
                        if (t.className.indexOf("jsContextMenu") < 0) {
                            operation.hide(_target.jsContextMenu_id, e);
                        }
                    }
                };
            },
            mousemove: function(e) {
                e = handle.getEvent(e);
                t = handle.getTarget(e);
                if (t.className === undefined || t.className == "") {
                    t = t.parentNode;
                };
                if (t.className.indexOf("jsContextMenu-node") >= 0) {
                    if (t.className.indexOf("hover") < 0) {
                        t.className = extendFunc.addClass(t.className, "hover");
                    };
                };
            },
            mouseleave: function(e) {
                e = handle.getEvent(e);
                t = handle.getTarget(e);
                if (t.className.indexOf("jsContextMenu-node") >= 0) {
                    if (t.className.indexOf("hover") >= 0) {
                        t.className = extendFunc.removeClass(t.className, "hover")
                    };
                };
            },
            bind: function(obj) {
                if (obj !== this.setting.parent) {
                    handle.bindEvent(
                        obj,
                        "mousemove",
                        function() {
                            handle.mousemove()
                        }
                    );
                    handle.bindEvent(
                        obj,
                        "mouseleave",
                        function() {
                            handle.mouseleave()
                        }
                    );
                };
                if (obj.className.indexOf("jsContextMenu") >= 0 || obj === this.setting.parent) {
                    handle.bindEvent(
                        obj,
                        "mousedown",
                        function() {
                            handle.mousedown()
                        }
                    );
                }
            },
            bindEvent: function(node, type, func) {
                if (!node.att) {
                    node.att = [];
                };
                if (node.att[type] === undefined) {
                    node.att[type] = true;
                    if (node.addEventListener) {
                        node.addEventListener(type, func, false);
                    } else if (node.attachEvent) {
                        node.attachEvent("on" + type, func);
                    } else {
                        node["on" + type] = func;
                    }
                };
            },
            getEvent: function(event) {
                return event ? event : window.event;
            },
            getTarget: function(event) {
                return event.target || event.srcElement;
            }
        };
    jsContextMenu.prototype.render = function() {
        this.setting.id = "jsContextMenu" + extendFunc.getRandomID(10);
        operation.create.call(this, this.setting.items, this.setting.id, this.setting.parent);
    };
    jsContextMenu.prototype.destroy = function() {
        operation.destroy.call(this, this.setting.id);
    }
    window.jsContextMenu = jsContextMenu;
    document.oncontextmenu = function() {
        event.returnValue = false;
    }
})(window);
