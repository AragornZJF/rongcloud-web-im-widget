/// <reference path="../../../typings/tsd.d.ts"/>

var conversationDirective = angular.module("RongWebIMWidget.conversationDirective", ["RongWebIMWidget.conversationController"]);

conversationDirective.directive("rongConversation", [function() {

    return {
        restrict: "E",
        templateUrl: "./src/ts/conversation/template.tpl.html",
        controller: "conversationController",
        link: function(scope: any, ele: angular.IRootElementService) {
            if (window["jQuery"] && window["jQuery"].nicescroll) {
                $("#Messages").niceScroll({
                    'cursorcolor': "#0099ff",
                    'cursoropacitymax': 1,
                    'touchbehavior': false,
                    'cursorwidth': "8px",
                    'cursorborder': "0",
                    'cursorborderradius': "5px"
                });
            }
        }
    }
}]);

conversationDirective.directive("emoji", [function() {
    return {
        restrict: "E",
        scope: {
            item: "=",
            content: "="
        },
        template: '<div style="display:inline-block"></div>',
        link: function(scope: any, ele: angular.IRootElementService, attr: angular.IAttributes) {

            ele.find("div").append(scope.item);
            ele.on("click", function() {
                scope.$parent.currentConversation.messageContent = scope.$parent.currentConversation.messageContent || "";
                scope.$parent.currentConversation.messageContent = scope.$parent.currentConversation.messageContent.replace(/\n$/, "");
                scope.$parent.currentConversation.messageContent = scope.$parent.currentConversation.messageContent + scope.item.children[0].getAttribute("name");
                scope.$parent.$apply();
                var obj = document.getElementById("inputMsg");
                WidgetModule.Helper.getFocus(obj);
            })
        }
    }
}]);

conversationDirective.directive('contenteditableDire', function() {
    return {
        restrict: 'A',
        require: '?ngModel',
        link: function(scope: any, element: angular.IRootElementService, attrs: angular.IAttributes, ngModel: angular.INgModelController) {
            function replacemy(e: string) {
                return e.replace(new RegExp("<[\\s\\S.]*?>", "ig"), "");
            }
            var domElement = <any>element[0];

            scope.$watch(function() {
                return ngModel.$modelValue;
            }, function(newVal: string) {
                if (document.activeElement === domElement) {
                    return;
                }
                if (newVal === '' || newVal === attrs["placeholder"]) {
                    domElement.innerHTML = attrs["placeholder"];
                    domElement.style.color = "#a9a9a9";
                }
            });
            element.bind('focus', function() {
                if (domElement.innerHTML == attrs["placeholder"]) {
                    domElement.innerHTML = '';
                }
                domElement.style.color = '';
            });
            element.bind('blur', function() {
                if (domElement.innerHTML === '') {
                    domElement.innerHTML = attrs["placeholder"];
                    domElement.style.color = "#a9a9a9";
                }
            });


            if (!ngModel) return;

            element.bind("paste", function(e: any) {
                var that = this, ohtml = that.innerHTML;
                timeoutid && clearTimeout(timeoutid);
                var timeoutid = setTimeout(function() {
                    that.innerHTML = replacemy(that.innerHTML);
                    ngModel.$setViewValue(that.innerHTML);
                    timeoutid = null;
                }, 50);
            });

            ngModel.$render = function() {
                element.html(ngModel.$viewValue || '');
            };

            element.bind("keyup paste", read);
            // element.bind("input", read);

            function read() {
                var html = element.html();
                html = html.replace(/^<br>$/i, "");
                html = html.replace(/<br>/gi, "\n");
                if (attrs["stripBr"] && html == '<br>') {
                    html = '';
                }
                ngModel.$setViewValue(html);
            }
        }
    };
});

conversationDirective.directive("ctrlEnterKeys", ["$timeout", function($timeout: angular.ITimeoutService) {
    return {
        restrict: "A",
        require: '?ngModel',
        scope: {
            fun: "&",
            ctrlenter: "=",
            content: "="
        },
        link: function(scope: any, element: angular.IRootElementService, attrs: angular.IAttributes, ngModel: angular.INgModelController) {
            scope.ctrlenter = scope.ctrlenter || false;
            element.bind("keypress", function(e: any) {
                if (scope.ctrlenter) {
                    if (e.ctrlKey === true && e.keyCode === 13 || e.keyCode === 10) {
                        scope.fun();
                        scope.$parent.$apply();
                        e.preventDefault();
                    }
                } else {
                    if (e.ctrlKey === false && e.shiftKey === false && (e.keyCode === 13 || e.keyCode === 10)) {
                        scope.fun();
                        scope.$parent.$apply();
                        e.preventDefault();
                    } else if (e.ctrlKey === true && e.keyCode === 13 || e.keyCode === 10) {
                        //ctrl+enter 换行
                    }
                }
            })
        }
    }
}]);

conversationDirective.directive("textmessage", [function() {
    return {
        restrict: "E",
        scope: { msg: "=" },
        template: '<div class="">' +
        '<div class="rongcloud-Message-text"><pre class="rongcloud-Message-entry" ng-bind-html="msg.content|trustHtml"><br></pre></div>' +
        '</div>'
    }
}]);

conversationDirective.directive("includinglinkmessage", [function() {
    return {
        restrict: "E",
        scope: { msg: "=" },
        template: '<div class="">' +
        '<div class="rongcloud-Message-text">' +
        '<pre class="rongcloud-Message-entry" style="">' +
        '维护中 由于我们的服务商出现故障，融云官网及相关服务也受到影响，给各位用户带来的不便，还请谅解。  您可以通过 <a href="#">【官方微博】</a>了解</pre>' +
        '</div>' +
        '</div>'
    }
}]);

conversationDirective.directive("imagemessage", [function() {
    return {
        restrict: "E",
        scope: { msg: "=" },
        template: '<div class="">' +
        '<div class="rongcloud-Message-img">' +
        '<span id="{{\'rebox_\'+$id}}"  class="rongcloud-Message-entry" style="">' +
        // '<p>发给您一张示意图</p>' +
        // '<img ng-src="{{msg.content}}" alt="">' +
        '<a href="{{msg.imageUri}}" target="_black"><img ng-src="{{msg.content}}"  data-image="{{msg.imageUri}}" alt=""/></a>' +
        '</span>' +
        '</div>' +
        '</div>',
        link: function(scope: any, ele: angular.IRootElementService, attr: any) {
            var img = new Image();
            img.src = scope.msg.imageUri;
            setTimeout(function() {
                if (window["jQuery"] && window["jQuery"].rebox) {
                    $('#rebox_' + scope.$id).rebox({ selector: 'a', zIndex: 999999,theme:"rongcloud-rebox" }).bind("rebox:open", function() {
                        //jQuery rebox 点击空白关闭
                        var rebox = <any>document.getElementsByClassName("rongcloud-rebox")[0];
                        rebox.onclick = function(e: any) {
                            if (e.target.tagName.toLowerCase() != "img") {
                                var rebox_close = <any>document.getElementsByClassName("rongcloud-rebox-close")[0];
                                rebox_close.click();
                                rebox = null; rebox_close = null;
                            }
                        }
                    });
                }
            })
            img.onload = function() {
                //scope.isLoaded = true;
                scope.$apply(function() {
                    scope.msg.content = scope.msg.imageUri
                });
            }
            // setTimeout(function() {
            //     Intense(ele.find("img")[0]);
            // }, 0);
            scope.showBigImage = function() {

            }
        }
    }
}]);

conversationDirective.directive("voicemessage", ["$timeout", function($timeout: angular.ITimeoutService) {
    return {
        restrict: "E",
        scope: { msg: "=" },
        template: '<div class="">' +
        '<div class="rongcloud-Message-audio">' +
        '<span class="rongcloud-Message-entry" style="">' +
        '<span class="rongcloud-audioBox rongcloud-clearfix " ng-click="play()" ng-class="{\'animate\':isplaying}" ><i></i><i></i><i></i></span>' +
        '<div style="display: inline-block;" ><span class="rongcloud-audioTimer">{{msg.duration}}”</span><span class="rongcloud-audioState" ng-show="msg.isUnReade"></span></div>' +
        '</span>' +
        '</div>' +
        '</div>',
        link: function(scope, ele, attr) {
            scope.msg.duration = parseInt(scope.msg.duration || scope.msg.content.length / 1024);

            RongIMLib.RongIMVoice.preLoaded(scope.msg.content);

            scope.play = function() {
                RongIMLib.RongIMVoice.stop(scope.msg.content);
                if (!scope.isplaying) {
                    scope.msg.isUnReade = false;
                    RongIMLib.RongIMVoice.play(scope.msg.content, scope.msg.duration);
                    scope.isplaying = true;
                    if (scope.timeoutid) {
                        $timeout.cancel(scope.timeoutid);
                    }
                    scope.timeoutid = $timeout(function() {
                        scope.isplaying = false;
                    }, scope.msg.duration * 1000);
                } else {
                    scope.isplaying = false;
                    $timeout.cancel(scope.timeoutid);
                }
            }

        }
    }
}]);

conversationDirective.directive("locationmessage", [function() {
    return {
        restrict: "E",
        scope: { msg: "=" },
        template: '<div class="">' +
        '<div class="rongcloud-Message-map">' +
        '<span class="rongcloud-Message-entry" style="">' +
        '<div class="rongcloud-mapBox">' +
        '<img ng-src="{{msg.content}}" alt="">' +
        '<span>{{msg.poi}}</span>' +
        '</div>' +
        '</span>' +
        '</div>' +
        '</div>'
    }
}]);

conversationDirective.directive("richcontentmessage", [function() {
    return {
        restrict: "E",
        scope: { msg: "=" },
        template: '<div class="">' +
        '<div class="rongcloud-Message-image-text">' +
        '<span class="rongcloud-Message-entry" style="">' +
        '<div class="rongcloud-image-textBox">' +
        '<h4>{{msg.title}}</h4>' +
        '<div class="rongcloud-cont rongcloud-clearfix">' +
        '<img ng-src="{{msg.imageUri}}" alt="">' +
        '<div>{{msg.content}}</div>' +
        '</div>' +
        '</div>' +
        '</span>' +
        '</div>' +
        '</div>'
    }
}]);
