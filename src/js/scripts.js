(function () {
  "use strict";
  var starter = {
    setBackgroundColor: function (elm) {
      $(elm).each(function () {
        $(this).css("background-color", $(this).data("bg-color"));
      });
    },
    setBackgroundImage: function (elm) {
      $(elm).each(function () {
        $(this).css("background-image", "url(" + $(this).data("bg-image") + ")");
      });
    },
    initTooltip: function (elm) {
      $(elm).tooltip({
        trigger: "hover",
      });
    },
    initBootNavbar: function () {
      $("body").bootnavbar({
        animation: false,
      });
    },
    dropdownAttr: function () {
      if ($(window).width() > 992) {
        $(".navbar .dropdown-toggle").removeAttr("data-toggle");

        $(".navbar .dropdown > a").click(function () {
          location.href = this.href;
        });
      } else {
        $(".navbar .dropdown-toggle").attr("data-toggle", "dropdown");
      }
    },
    init: function () {
      this.setBackgroundColor("[data-bg-color]");
      this.setBackgroundImage("[data-bg-image]");
      this.initTooltip('[data-toggle="tooltip"]');
      this.initBootNavbar();
      this.dropdownAttr();
    },
  };
  starter.init();
})();
