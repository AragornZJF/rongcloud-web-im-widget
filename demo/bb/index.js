var demo = angular.module("demo", ["RongWebIMWidget"]);

demo.controller("main", ["$scope", "WebIMWidget", function($scope,
  WebIMWidget) {

  $scope.show = function() {
    WebIMWidget.show();
  }

  $scope.hidden = function() {
    WebIMWidget.hidden();
  }

  $scope.server = WebIMWidget;
  $scope.targetType=1;

  $scope.setconversation=function(){
    WebIMWidget.setConversation(Number($scope.targetType), $scope.targetId, "自定义:"+$scope.targetId);
  }

  angular.element(document).ready(function() {

    WebIMWidget.init({
      appkey: "3argexb6r934e",
      // token: "AgbuB0f1xAujcvfW3YBazIT92+VsUe7ien9j+5OQOOCbT8ZLrGfdaG6Qj1UafWSqx3U4gSBapJG4lSO5xHmpaQ==",
      token:"9xDhJZzksCkfNMauOsGY5JUnU/cREmEFuMhOJuGv5bPlXUSQuAsZcadbAtTokV8HsrdYdBidE01Z0OWds4Y43w==",
      style:{
        width:600,
        left:100,
        top:100
      },
      displayConversationList:true,
      displayMinButton:true,
      voiceUrl:'../widget/images/sms-received.mp3',
      conversationListPosition:WebIMWidget.EnumConversationListPosition.left,
      onError:function(error){
        console.log("error:"+error);
      }
    });

    // WebIMWidget.show();

    WebIMWidget.setUserInfoProvider(function(targetId,obj){
        obj.onSuccess({name:"陌："+targetId});
    });

    // WebIMWidget.onCloseBefore=function(obj){
    //   console.log("关闭前");
    //   setTimeout(function(){
    //     obj.close();
    //   },1000)
    // }

    WebIMWidget.onClose=function(){
      console.log("已关闭");
    }



    //设置会话
    //WebimWidget.setConversation("4", "cc", "呵呵");


  });

}]);
