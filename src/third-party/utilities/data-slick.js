(function ($) {
  "use strict";

  function dataSlick(elm) {
    // Call the element
    var $elm = $(elm);

    // Prefix
    var prefix = "slick";

    // Debug mode
    var $debug = false;
    var $log = {};

    // Helper functions
    var isDefined = function (val) {
      return typeof val != "undefined";
    };
    var isNumber = function (val) {
      return typeof val === "number";
    };
    var isValidNumber = function (val) {
      return isDefined(val) && isNumber(val);
    };

    // Options
    var options = {};

    // Attributes
    var autoplay = $elm.data(prefix + "-autoplay");
    var arrows = $elm.data(prefix + "-arrows");
    var centerMode = $elm.data(prefix + "-center-mode");
    var dots = $elm.data(prefix + "-dots");
    var draggable = $elm.data(prefix + "-draggable");
    var fade = $elm.data(prefix + "-fade");
    var infinite = $elm.data(prefix + "-infinite");
    var initialSlide = $elm.data(prefix + "-initial-slide");
    var rows = $elm.data(prefix + "-rows");
    var slidesPerRow = $elm.data(prefix + "-item-per-row");
    var items = $elm.data(prefix + "-items");
    var mobileItems = $elm.data(prefix + "-sm-items");
    var tabletItems = $elm.data(prefix + "-md-items");
    var desktopItems = $elm.data(prefix + "-lg-items");
    var widescreenItems = $elm.data(prefix + "-xl-items");
    var xlargescreenItems = $elm.data(prefix + "-xxl-items");
    var speed = $elm.data(prefix + "-speed");
    var vertical = $elm.data(prefix + "-vertical");
    var mobileVertical = $elm.data(prefix + "-sm-vertical");
    var tabletVertical = $elm.data(prefix + "-md-vertical");
    var desktopVertical = $elm.data(prefix + "-lg-vertical");
    var widescreenVertical = $elm.data(prefix + "-xl-vertical");
    var xlargescreenVertical = Boolean($elm.data(prefix + "-xxl-vertical"));

    /**
     * autoplay
     * autoplaySpeed
     *
     * 1. Enables Autoplay. (Default: false)
     * 2. Autoplay Speed in milliseconds. (Default: 3000ms)
     */
    if (isDefined(autoplay)) {
      options.autoplay = true;
      $log.autoplay = true;

      if (isNumber(autoplay)) {
        options.autoplaySpeed = autoplay;
        $log.autoplaySpeed = autoplay;
      } else {
        options.autoplaySpeed = 3000;
        $log.autoplaySpeed = 3000;
      }
    }

    /**
     * arrows
     * Prev/Next Arrows.
     * (Default: false)
     *
     * appendArrows
     * Change where the navigation arrows are attached (Selector, htmlString, Array, Element, jQuery object)
     * (Default: $(element))
     */
    if (isDefined(arrows)) {
      options.arrows = true;
      $log.arrows = true;

      if (arrows.length > 0) {
        var regex = /^#.*$/i;

        if (regex.test(arrows)) {
          options.appendArrows = $(arrows);
          $log.appendArrows = $(arrows);
        }
      }
    } else {
      options.arrows = false;
      $log.arrows = false;
    }

    /**
     * centerMode
     * centerPadding
     *
     * 1. Enables centered view with partial prev/next slides. Use with odd numbered slidesToShow counts. (Default: false)
     * 2. Side padding when in center mode (px or %). (Default: 50px)
     */
    if (isDefined(centerMode)) {
      options.centerMode = true;
      $log.centerMode = true;

      if (isNumber(autoplay)) {
        options.centerPadding = autoplay;
        $log.centerPadding = autoplay;
      } else {
        options.centerPadding = "50px";
        $log.centerPadding = "50px";
      }
    }

    /**
     * dots
     * Show dot indicators.
     * (Default: false)
     *
     * appendDots
     * Change where the navigation dots are attached (Selector, htmlString, Array, Element, jQuery object)
     * (Default: $(element))
     */
    if (isDefined(dots)) {
      options.dots = true;
      $log.dots = true;

      if (dots.length > 0) {
        var regex = /^#.*$/i;

        if (regex.test(dots)) {
          options.appendDots = $(dots);
          $log.appendDots = $(dots);
        }
      }
    } else {
      options.dots = false;
      $log.dots = false;
    }

    /**
     * draggable
     *
     * Enable mouse dragging. (Default: true)
     */
    if (isDefined(draggable)) {
      draggable = draggable.toString().toLowerCase();

      if (draggable == "false") {
        options.draggable = false;
        $log.draggable = false;
      } else {
        options.draggable = true;
        $log.draggable = true;
      }
    }

    /**
     * fade
     *
     * Enable fade. (Default: false)
     */
    if (isDefined(fade)) {
      fade = fade.toString().toLowerCase();

      if (fade == "true") {
        options.fade = true;
        $log.fade = true;
      } else {
        options.fade = false;
        $log.fade = false;
      }
    }

    /**
     * infinite
     *
     * Infinite loop sliding. (Default: true)
     */
    if (isDefined(infinite)) {
      infinite = infinite.toString().toLowerCase();

      if (infinite == "false") {
        options.infinite = false;
        $log.infinite = false;
      } else {
        options.infinite = true;
        $log.infinite = true;
      }
    }

    /**
     * initialSlide
     *
     * initialSlide loop sliding.
     *
     * (Default: true)
     */
    if (isDefined(initialSlide)) {
      if (isValidNumber(initialSlide)) {
        options.initialSlide = initialSlide;
        $log.initialSlide = initialSlide;
      } else {
        options.initialSlide = 0;
        $log.initialSlide = 0;
      }
    }

    /**
     * rows
     *
     * Setting this to more than 1 initializes grid mode.
     * Use slidesPerRow to set how many slides should be in each row.
     *
     * (Default: 1)
     */
    if (isDefined(rows)) {
      if (isValidNumber(rows)) {
        options.rows = rows;
        $log.rows = rows;
      } else {
        options.rows = 1;
        $log.rows = 1;
      }
    }

    /**
     * slidesPerRow
     *
     * With grid mode intialized via the rows option,
     * this sets how many slides are in each grid row. dver
     *
     * (Default: 1)
     */
    if (isDefined(slidesPerRow)) {
      if (isValidNumber(slidesPerRow)) {
        options.slidesPerRow = slidesPerRow;
        $log.slidesPerRow = slidesPerRow;
      } else {
        options.slidesPerRow = 1;
        $log.slidesPerRow = 1;
      }
    }

    /**
     * items
     *
     * The number of items you want to see on the screen.
     */
    if (isDefined(items)) {
      if (isValidNumber(items)) {
        options.slidesToShow = items;
        $log.slidesToShow = items;
        options.slidesToScroll = items;
        $log.slidesToScroll = items;
      }
    } else {
      options.slidesToShow = 1;
      $log.slidesToShow = 1;
      options.slidesToScroll = 1;
      $log.slidesToScroll = 1;
    }

    /**
     * responsive
     *
     * Object containing responsive options. Can be set to false to remove responsive capabilities.
     */
    if (
      isValidNumber(mobileItems) ||
      isValidNumber(tabletItems) ||
      isValidNumber(desktopItems) ||
      isValidNumber(widescreenItems) ||
      isValidNumber(xlargescreenItems)
    ) {
      var responsiveOptions = [];

      if (isValidNumber(xlargescreenItems)) {
        var xxlOptions = {
          breakpoint: 1440,
          settings: {
            slidesToShow: xlargescreenItems,
            slidesToScroll: xlargescreenItems,
          },
        };

        if (
          xlargescreenVertical == true ||
          widescreenVertical == true ||
          desktopVertical == true ||
          tabletVertical == true ||
          mobileVertical == true
        ) {
          xxlOptions.settings.vertical = true;
          xxlOptions.settings.rtl = false;
        }

        responsiveOptions.push(xxlOptions);
      }
      if (isValidNumber(widescreenItems)) {
        var xlOptions = {
          breakpoint: 1200,
          settings: {
            slidesToShow: widescreenItems,
            slidesToScroll: widescreenItems,
          },
        };

        if (widescreenVertical == true || desktopVertical == true || tabletVertical == true || mobileVertical == true) {
          xlOptions.settings.vertical = true;
          xlOptions.settings.rtl = false;
        }

        responsiveOptions.push(xlOptions);
      }
      if (isValidNumber(desktopItems)) {
        var lgOptions = {
          breakpoint: 992,
          settings: {
            slidesToShow: desktopItems,
            slidesToScroll: desktopItems,
          },
        };

        if (desktopVertical == true || tabletVertical == true || mobileVertical == true) {
          lgOptions.settings.vertical = true;
          lgOptions.settings.rtl = false;
        }

        responsiveOptions.push(lgOptions);
      }
      if (isValidNumber(tabletItems)) {
        var mdOptions = {
          breakpoint: 767,
          settings: {
            slidesToShow: tabletItems,
            slidesToScroll: tabletItems,
          },
        };

        if (tabletVertical == true || mobileVertical == true) {
          mdOptions.settings.vertical = true;
          mdOptions.settings.rtl = false;
        }

        responsiveOptions.push(mdOptions);
      }
      if (isValidNumber(mobileItems)) {
        var smOptions = {
          breakpoint: 576,
          settings: {
            slidesToShow: mobileItems,
            slidesToScroll: mobileItems,
          },
        };

        if (mobileVertical == true) {
          smOptions.settings.vertical = true;
          smOptions.settings.rtl = false;
        }

        responsiveOptions.push(smOptions);
      }

      options.mobileFirst = true;
      $log.mobileFirst = true;
      options.responsive = responsiveOptions;
      $log.responsive = responsiveOptions;
    }

    /**
     * speed
     *
     * Slide/Fade animation speed.
     *
     * (Default: 300)
     */
    if (isDefined(speed)) {
      if (isValidNumber(speed)) {
        options.speed = speed;
        $log.speed = speed;
      } else {
        options.speed = 300;
        $log.speed = 300;
      }
    }

    /**
     * vertical
     *
     * Vertical slide mode (Default: false)
     */
    if (isDefined(vertical)) {
      vertical = vertical.toString().toLowerCase();

      if (vertical == "true") {
        options.vertical = true;
        $log.vertical = true;
      } else {
        options.vertical = false;
        $log.vertical = false;
      }
    }

    /**
     * rtl
     *
     * Change the slider's direction to become right-to-left
     */
    var direction = $elm.closest("html").attr("dir");

    if (isDefined(direction) && direction == "rtl") {
      console.log(isDefined(vertical));

      if (isDefined(vertical) == "true") {
        options.rtl = false;
        $log.rtl = false;
      } else {
        options.rtl = true;
        $log.rtl = true;
      }
    }

    // Debug
    if ($debug) {
      $log.elmID = $elm.data("slick");
      console.log($log);
    }

    // Call the plugin
    var carousel = $elm.slick(options);

    return carousel;
  }

  $("[data-slick]").each(function () {
    dataSlick($(this));
  });
})(jQuery);
