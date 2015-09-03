define(['components/chat/module'], function(module) {
  'use strict';

  module.registerFactory('ChatApi', ['$q', '$rootScope', 'CurrentUser', '$http', 
    function($q, $rootScope, CurrentUser, $http) {
      var dfd = $q.defer();
      var _user;
      var ChatSrv = {
        initialized: dfd.promise,
        users:[],
        messages: [],
        statuses: ['Online', 'Busy', 'Away', 'Log Off'],
        status: 'Online',
        setUser: function(user) {
          if (ChatSrv.users.indexOf(_user) != -1) 
            ChatSrv.users.splice(ChatSrv.users.indexOf(_user), 1);
          _user = user;
          ChatSrv.users.push(_user);
        },
        sendMessage: function(text) {
          var message = {
            user: _user,
            body: text,
            date: new Date()
          };
          this.messages.push(message);
        }
      }

      $http.get('api/chat.json').then(function(res) {
        ChatSrv.messages = res.data.messages;
        ChatSrv.users = res.data.users;
        dfd.resolve();
      });

      ChatSrv.initialized.then(function() {
        
        CurrentUser.initialized.then(function() {
          ChatSrv.setUser({
            username: CurrentUser.username,
            picture: CurrentUser.picture,
            status: ChatSrv.status
          });
        });

        $rootScope.$watch(function() {
          return CurrentUser.username;
        }, function(name, oldName) {
          if (name != oldName) {
            ChatSrv.setUser({
              username: CurrentUser.username,
              picture: CurrentUser.picture,
              status: ChatSrv.status
            });
          }
        });
      });

      return ChatSrv;
    }]);
})