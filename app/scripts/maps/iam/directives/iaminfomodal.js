'use strict';

/**
 * @ngdoc directive
 * @name mapventureApp.directive:maps/iam/iamInfo
 * @description
 * # maps/iam/iamInfo
 */
angular.module('mapventureApp')
  .directive('iamInfoModal', function () {
    return {
      templateUrl: 'scripts/maps/iam/views/iamInfoModal.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {

        // Hack to ensure the modal closes properly.
        jQuery('[data-dismiss="modal"]').on('click', function(){
             jQuery('.modal').hide();
             jQuery('.modal-backdrop').hide();
        });

        /* This code is used to support fullscreen modals. */
        // .modal-backdrop classes
        $(".modal-transparent").on('show.bs.modal', function () {
          setTimeout( function() {
            $(".modal-backdrop").addClass("modal-backdrop-transparent");
          }, 0);
        });
        $(".modal-transparent").on('hidden.bs.modal', function () {
          $(".modal-backdrop").addClass("modal-backdrop-transparent");
        });

        $(".modal-fullscreen").on('show.bs.modal', function () {
          setTimeout( function() {
            $(".modal-backdrop").addClass("modal-backdrop-fullscreen");
          }, 0);
        });
        $(".modal-fullscreen").on('hidden.bs.modal', function () {
          $(".modal-backdrop").addClass("modal-backdrop-fullscreen");
        });

      }
    };
  });
