/*! Max Mega Menu jQuery Plugin */
(function ($) {
  'use strict';
  $.maxmegamenu = function (menu, options) {
    var plugin = this;
    var $menu = $(menu);
    var $toggle_bar = $menu.siblings('.mega-menu-toggle');
    var html_body_class_timeout;
    var defaults = {
      event: $menu.attr('data-event'),
      effect: $menu.attr('data-effect'),
      effect_speed: parseInt($menu.attr('data-effect-speed')),
      effect_mobile: $menu.attr('data-effect-mobile'),
      effect_speed_mobile: parseInt($menu.attr('data-effect-speed-mobile')),
      panel_width: $menu.attr('data-panel-width'),
      panel_inner_width: $menu.attr('data-panel-inner-width'),
      mobile_force_width: $menu.attr('data-mobile-force-width'),
      mobile_overlay: $menu.attr('data-mobile-overlay'),
      mobile_state: $menu.attr('data-mobile-state'),
      second_click: $menu.attr('data-second-click'),
      vertical_behaviour: $menu.attr('data-vertical-behaviour'),
      document_click: $menu.attr('data-document-click'),
      breakpoint: $menu.attr('data-breakpoint'),
      unbind_events: $menu.attr('data-unbind'),
      hover_intent_timeout: $menu.attr('data-hover-intent-timeout'),
      hover_intent_interval: $menu.attr('data-hover-intent-interval'),
    };
    plugin.settings = {};
    var items_with_submenus = $(
      'li.mega-menu-megamenu.mega-menu-item-has-children,' +
        'li.mega-menu-flyout.mega-menu-item-has-children,' +
        'li.mega-menu-tabbed > ul.mega-sub-menu > li.mega-menu-item-has-children,' +
        'li.mega-menu-flyout li.mega-menu-item-has-children',
      menu
    );
    var collapse_children_parents = $('li.mega-menu-megamenu li.mega-menu-item-has-children.mega-collapse-children > a.mega-menu-link', menu);
    plugin.addAnimatingClass = function (element) {
      if (plugin.settings.effect === 'disabled') {
        return;
      }
      $('.mega-animating').removeClass('mega-animating');
      var timeout = plugin.settings.effect_speed + parseInt(megamenu.timeout, 10);
      element.addClass('mega-animating');
      setTimeout(function () {
        element.removeClass('mega-animating');
      }, timeout);
    };
    plugin.hideAllPanels = function () {
      $('.mega-toggle-on > a.mega-menu-link', $menu).each(function () {
        plugin.hidePanel($(this), false);
      });
    };
    plugin.expandMobileSubMenus = function () {
      $('.mega-menu-item-has-children.mega-expand-on-mobile > a.mega-menu-link', $menu).each(function () {
        plugin.showPanel($(this));
      });
      if (plugin.settings.mobile_state == 'expand_all') {
        $('.mega-menu-item-has-children > a.mega-menu-link', $menu).each(function () {
          plugin.showPanel($(this));
        });
      }
      if (plugin.settings.mobile_state == 'expand_active') {
        $(
          'li.mega-current-menu-ancestor.mega-menu-item-has-children > a.mega-menu-link,' +
            'li.mega-current-menu-item.mega-menu-item-has-children > a.mega-menu-link' +
            'li.mega-current-menu-parent.mega-menu-item-has-children > a.mega-menu-link' +
            'li.mega-current_page_ancestor.mega-menu-item-has-children > a.mega-menu-link' +
            'li.mega-current_page_item.mega-menu-item-has-children > a.mega-menu-link',
          $menu
        ).each(function () {
          plugin.showPanel($(this));
        });
      }
    };
    plugin.hideSiblingPanels = function (anchor, immediate) {
      anchor
        .parent()
        .parent()
        .find('.mega-toggle-on')
        .children('a.mega-menu-link')
        .each(function () {
          plugin.hidePanel($(this), immediate);
        });
    };
    plugin.isDesktopView = function () {
      var width = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
      return width > plugin.settings.breakpoint;
    };
    plugin.isMobileView = function () {
      return !plugin.isDesktopView();
    };
    plugin.showPanel = function (anchor) {
      if (anchor.is('li.mega-menu-item')) {
        anchor = anchor.find('a.mega-menu-link').first();
      }
      anchor.parent().triggerHandler('before_open_panel');
      anchor.parent().find('[aria-expanded]').first().attr('aria-expanded', 'true');
      $('.mega-animating').removeClass('mega-animating');
      if (plugin.isMobileView() && anchor.parent().hasClass('mega-hide-sub-menu-on-mobile')) {
        return;
      }
      if (
        plugin.isDesktopView() &&
        ($menu.hasClass('mega-menu-horizontal') || $menu.hasClass('mega-menu-vertical')) &&
        !anchor.parent().hasClass('mega-collapse-children')
      ) {
        plugin.hideSiblingPanels(anchor, true);
      }
      if ((plugin.isMobileView() && $menu.hasClass('mega-keyboard-navigation')) || plugin.settings.vertical_behaviour === 'accordion') {
        plugin.hideSiblingPanels(anchor, false);
      }
      plugin.calculateDynamicSubmenuWidths(anchor);
      if (
        anchor.parent().hasClass('mega-collapse-children') ||
        plugin.settings.effect === 'slide' ||
        (plugin.isMobileView() &&
          (plugin.settings.effect_mobile === 'slide' || plugin.settings.effect_mobile === 'slide_left' || plugin.settings.effect_mobile === 'slide_right'))
      ) {
        var speed = plugin.isMobileView() ? plugin.settings.effect_speed_mobile : plugin.settings.effect_speed;
        anchor
          .siblings('.mega-sub-menu')
          .css('display', 'none')
          .animate({ height: 'show', paddingTop: 'show', paddingBottom: 'show', minHeight: 'show' }, speed, function () {
            $(this).css('display', '');
          });
      }
      anchor.parent().addClass('mega-toggle-on').triggerHandler('open_panel');
    };
    plugin.hidePanel = function (anchor, immediate) {
      if (anchor.is('li.mega-menu-item')) {
        anchor = anchor.find('a.mega-menu-link').first();
      }
      anchor.parent().triggerHandler('before_close_panel');
      anchor.parent().find('[aria-expanded]').first().attr('aria-expanded', 'false');
      if (
        anchor.parent().hasClass('mega-collapse-children') ||
        (!immediate && plugin.settings.effect === 'slide') ||
        (plugin.isMobileView() &&
          (plugin.settings.effect_mobile === 'slide' || plugin.settings.effect_mobile === 'slide_left' || plugin.settings.effect_mobile === 'slide_right'))
      ) {
        var speed = plugin.isMobileView() ? plugin.settings.effect_speed_mobile : plugin.settings.effect_speed;
        anchor.siblings('.mega-sub-menu').animate({ height: 'hide', paddingTop: 'hide', paddingBottom: 'hide', minHeight: 'hide' }, speed, function () {
          anchor.siblings('.mega-sub-menu').css('display', '');
          anchor.parent().removeClass('mega-toggle-on').triggerHandler('close_panel');
        });
        return;
      }
      if (immediate) {
        anchor
          .siblings('.mega-sub-menu')
          .css('display', 'none')
          .delay(plugin.settings.effect_speed)
          .queue(function () {
            $(this).css('display', '').dequeue();
          });
      }
      anchor
        .siblings('.mega-sub-menu')
        .find('.widget_media_video video')
        .each(function () {
          this.player.pause();
        });
      anchor.parent().removeClass('mega-toggle-on').triggerHandler('close_panel');
      plugin.addAnimatingClass(anchor.parent());
    };
    plugin.calculateDynamicSubmenuWidths = function (anchor) {
      if (
        anchor.parent().hasClass('mega-menu-megamenu') &&
        anchor.parent().parent().hasClass('max-mega-menu') &&
        plugin.settings.panel_width &&
        $(plugin.settings.panel_width).length > 0
      ) {
        if (plugin.isDesktopView()) {
          var submenu_offset = $menu.offset();
          var target_offset = $(plugin.settings.panel_width).offset();
          anchor.siblings('.mega-sub-menu').css({ width: $(plugin.settings.panel_width).outerWidth(), left: target_offset.left - submenu_offset.left + 'px' });
        } else {
          anchor.siblings('.mega-sub-menu').css({ width: '', left: '' });
        }
      }
      if (
        anchor.parent().hasClass('mega-menu-megamenu') &&
        anchor.parent().parent().hasClass('max-mega-menu') &&
        plugin.settings.panel_inner_width &&
        $(plugin.settings.panel_inner_width).length > 0
      ) {
        var target_width = 0;
        if ($(plugin.settings.panel_inner_width).length) {
          target_width = parseInt($(plugin.settings.panel_inner_width).width(), 10);
        } else {
          target_width = parseInt(plugin.settings.panel_inner_width, 10);
        }
        var submenu_width = parseInt(anchor.siblings('.mega-sub-menu').innerWidth(), 10);
        if (plugin.isDesktopView() && target_width > 0 && target_width < submenu_width) {
          anchor
            .siblings('.mega-sub-menu')
            .css({ paddingLeft: (submenu_width - target_width) / 2 + 'px', paddingRight: (submenu_width - target_width) / 2 + 'px' });
        } else {
          anchor.siblings('.mega-sub-menu').css({ paddingLeft: '', paddingRight: '' });
        }
      }
    };
    plugin.bindClickEvents = function () {
      var dragging = false;
      $(document).on({
        touchmove: function (e) {
          dragging = true;
        },
        touchstart: function (e) {
          dragging = false;
        },
      });
      $(document).on('click touchend', function (e) {
        if (
          !dragging &&
          plugin.settings.document_click === 'collapse' &&
          !$(e.target).closest('.max-mega-menu li').length &&
          !$(e.target).closest('.mega-menu-toggle').length
        ) {
          plugin.hideAllPanels();
          plugin.hideMobileMenu();
        }
        dragging = false;
      });
      var clickable_parents = $('> a.mega-menu-link', items_with_submenus).add(collapse_children_parents);
      clickable_parents.on('touchend.megamenu', function (e) {
        if (plugin.settings.event === 'hover_intent') {
          plugin.unbindHoverIntentEvents();
        }
        if (plugin.settings.event === 'hover') {
          plugin.unbindHoverEvents();
        }
      });
      clickable_parents.not('[data-has-click-event]').on('click.megamenu', function (e) {
        if (
          plugin.isDesktopView() &&
          $(this).parent().hasClass('mega-toggle-on') &&
          $(this).closest('ul.mega-sub-menu').parent().hasClass('mega-menu-tabbed')
        ) {
          if (plugin.settings.second_click === 'go') {
            return;
          } else {
            e.preventDefault();
            return;
          }
        }
        if (dragging) {
          return;
        }
        if (plugin.isMobileView() && $(this).parent().hasClass('mega-hide-sub-menu-on-mobile')) {
          return;
        }
        if ((plugin.settings.second_click === 'go' || $(this).parent().hasClass('mega-click-click-go')) && $(this).attr('href') !== undefined) {
          if (!$(this).parent().hasClass('mega-toggle-on')) {
            e.preventDefault();
            plugin.showPanel($(this));
          }
        } else {
          e.preventDefault();
          if ($(this).parent().hasClass('mega-toggle-on')) {
            plugin.hidePanel($(this), false);
          } else {
            plugin.showPanel($(this));
          }
        }
      });
      collapse_children_parents.each(function () {
        $(this).attr('data-has-click-event', 'true');
      });
      if (plugin.settings.second_click === 'disabled') {
        clickable_parents.off('click.megamenu');
      }
      $('.mega-close-after-click:not(.mega-menu-item-has-children) > a.mega-menu-link', menu).on('click', function () {
        plugin.hideAllPanels();
        plugin.hideMobileMenu();
      });
    };
    plugin.bindHoverEvents = function () {
      items_with_submenus.on({
        'mouseenter.megamenu': function () {
          plugin.unbindClickEvents();
          if (!$(this).hasClass('mega-toggle-on')) {
            plugin.showPanel($(this).children('a.mega-menu-link'));
          }
        },
        'mouseleave.megamenu': function () {
          if ($(this).hasClass('mega-toggle-on') && !$(this).hasClass('mega-disable-collapse') && !$(this).parent().parent().hasClass('mega-menu-tabbed')) {
            plugin.hidePanel($(this).children('a.mega-menu-link'), false);
          }
        },
      });
    };
    plugin.bindHoverIntentEvents = function () {
      items_with_submenus.hoverIntent({
        over: function () {
          plugin.unbindClickEvents();
          if (!$(this).hasClass('mega-toggle-on')) {
            plugin.showPanel($(this).children('a.mega-menu-link'));
          }
        },
        out: function () {
          if ($(this).hasClass('mega-toggle-on') && !$(this).hasClass('mega-disable-collapse') && !$(this).parent().parent().hasClass('mega-menu-tabbed')) {
            plugin.hidePanel($(this).children('a.mega-menu-link'), false);
          }
        },
        timeout: plugin.settings.hover_intent_timeout,
        interval: plugin.settings.hover_intent_interval,
      });
    };
    plugin.bindKeyboardEvents = function () {
      var tab_key = 9;
      var escape_key = 27;
      var enter_key = 13;
      var left_arrow_key = 37;
      var up_arrow_key = 38;
      var right_arrow_key = 39;
      var down_arrow_key = 40;
      var space_key = 32;
      $menu.parent().on('keyup.megamenu', '.max-mega-menu, .mega-menu-toggle', function (e) {
        var keyCode = e.keyCode || e.which;
        var active_link = $(e.target);
        if (keyCode === tab_key) {
          $menu.parent().addClass('mega-keyboard-navigation');
        }
      });
      $menu
        .parent()
        .on('keydown.megamenu', 'a.mega-menu-link, .mega-indicator, .mega-menu-toggle-block, .mega-menu-toggle-animated-block button', function (e) {
          if (!$menu.parent().hasClass('mega-keyboard-navigation')) {
            return;
          }
          var keyCode = e.keyCode || e.which;
          var active_link = $(e.target);
          if (keyCode === space_key && active_link.is('.mega-menu-link')) {
            e.preventDefault();
            if (active_link.parent().is(items_with_submenus)) {
              if (active_link.parent().hasClass('mega-toggle-on') && !active_link.closest('ul.mega-sub-menu').parent().hasClass('mega-menu-tabbed')) {
                plugin.hidePanel(active_link);
              } else {
                plugin.showPanel(active_link);
              }
            }
          }
          if (keyCode === space_key && active_link.is('mega-indicator')) {
            e.preventDefault();
            if (active_link.parent().parent().hasClass('mega-toggle-on') && !active_link.closest('ul.mega-sub-menu').parent().hasClass('mega-menu-tabbed')) {
              plugin.hidePanel(active_link.parent());
            } else {
              plugin.showPanel(active_link.parent());
            }
          }
          if (keyCode === escape_key) {
            var submenu_open = $('> .mega-toggle-on', $menu).length !== 0;
            $('> .mega-toggle-on', $menu).find('[tabindex]:visible').first().focus();
            plugin.hideAllPanels();
            if (plugin.isMobileView() && !submenu_open) {
              plugin.hideMobileMenu();
              $('.mega-menu-toggle-block, button.mega-toggle-animated', $toggle_bar).first().focus();
            }
          }
          if (keyCode === space_key) {
            e.preventDefault();
            if (active_link.is('.mega-menu-toggle-block, .mega-menu-toggle-animated-block button')) {
              if ($toggle_bar.hasClass('mega-menu-open')) {
                plugin.hideMobileMenu();
              } else {
                plugin.showMobileMenu();
              }
            }
          }
          if (keyCode === enter_key) {
            if (active_link.is('.mega-menu-toggle-block')) {
              if ($toggle_bar.hasClass('mega-menu-open')) {
                plugin.hideMobileMenu();
              } else {
                plugin.showMobileMenu();
              }
            }
            if (active_link.is('.mega-indicator')) {
              if (
                active_link.closest('li.mega-menu-item').hasClass('mega-toggle-on') &&
                !active_link.closest('ul.mega-sub-menu').parent().hasClass('mega-menu-tabbed')
              ) {
                plugin.hidePanel(active_link.parent());
              } else {
                plugin.showPanel(active_link.parent());
              }
              return;
            }
            if (active_link.parent().is(items_with_submenus)) {
              if (active_link.is('[href]') && active_link.siblings('.mega-indicator[tabindex]:visible').length !== 0) {
                return;
              }
              if (active_link.is('[href]') === false) {
                if (active_link.parent().hasClass('mega-toggle-on') && !active_link.closest('ul.mega-sub-menu').parent().hasClass('mega-menu-tabbed')) {
                  plugin.hidePanel(active_link);
                } else {
                  plugin.showPanel(active_link);
                }
                return;
              }
              if (active_link.parent().hasClass('mega-toggle-on') && !active_link.closest('ul.mega-sub-menu').parent().hasClass('mega-menu-tabbed')) {
                return;
              } else {
                e.preventDefault();
                plugin.showPanel(active_link);
              }
            }
          }
          if (
            ((keyCode === right_arrow_key && plugin.isDesktopView()) || (keyCode === down_arrow_key && plugin.isMobileView())) &&
            $menu.hasClass('mega-menu-horizontal')
          ) {
            e.preventDefault();
            var next_top_level_item = $('> .mega-toggle-on', $menu)
              .nextAll('li.mega-menu-item:visible')
              .find('> a.mega-menu-link, .mega-search span[role=button]')
              .first();
            if (next_top_level_item.length === 0) {
              next_top_level_item = $(':focus', $menu)
                .parent()
                .nextAll('li.mega-menu-item:visible')
                .find('> a.mega-menu-link, .mega-search span[role=button]')
                .first();
            }
            if (next_top_level_item.length === 0) {
              next_top_level_item = $(':focus', $menu)
                .parent()
                .parent()
                .parent()
                .nextAll('li.mega-menu-item:visible')
                .find('> a.mega-menu-link, .mega-search span[role=button]')
                .first();
            }
            plugin.hideAllPanels();
            next_top_level_item.focus();
          }
          if (
            ((keyCode === left_arrow_key && plugin.isDesktopView()) || (keyCode === up_arrow_key && plugin.isMobileView())) &&
            $menu.hasClass('mega-menu-horizontal')
          ) {
            e.preventDefault();
            var prev_top_level_item = $('> .mega-toggle-on', $menu)
              .prevAll('li.mega-menu-item:visible')
              .find('> a.mega-menu-link, .mega-search span[role=button]')
              .last();
            if (prev_top_level_item.length === 0) {
              prev_top_level_item = $(':focus', $menu)
                .parent()
                .prevAll('li.mega-menu-item:visible')
                .find('> a.mega-menu-link, .mega-search span[role=button]')
                .last();
            }
            if (prev_top_level_item.length === 0) {
              prev_top_level_item = $(':focus', $menu)
                .parent()
                .parent()
                .parent()
                .prevAll('li.mega-menu-item:visible')
                .find('> a.mega-menu-link, .mega-search span[role=button]')
                .last();
            }
            plugin.hideAllPanels();
            prev_top_level_item.focus();
          }
        });
      $menu.parent().on('focusout.megamenu', function (e) {
        if ($menu.parent().hasClass('mega-keyboard-navigation')) {
          setTimeout(function () {
            var menu_has_focus = $menu.parent().find(':focus').length > 0;
            if (!menu_has_focus) {
              $menu.parent().removeClass('mega-keyboard-navigation');
              plugin.hideAllPanels();
              plugin.hideMobileMenu();
            }
          }, 10);
        }
      });
    };
    plugin.unbindAllEvents = function () {
      $('ul.mega-sub-menu, li.mega-menu-item, li.mega-menu-row, li.mega-menu-column, a.mega-menu-link, .mega-indicator', menu).off();
    };
    plugin.unbindClickEvents = function () {
      $('> a.mega-menu-link', items_with_submenus).not(collapse_children_parents).off('click.megamenu touchend.megamenu');
    };
    plugin.unbindHoverEvents = function () {
      items_with_submenus.unbind('mouseenter.megamenu mouseleave.megamenu');
    };
    plugin.unbindHoverIntentEvents = function () {
      items_with_submenus.unbind('mouseenter mouseleave').removeProp('hoverIntent_t').removeProp('hoverIntent_s');
    };
    plugin.unbindKeyboardEvents = function () {
      $menu.parent().off('keyup.megamenu keydown.megamenu focusout.megamenu');
    };
    plugin.unbindMegaMenuEvents = function () {
      if (plugin.settings.event === 'hover_intent') {
        plugin.unbindHoverIntentEvents();
      }
      if (plugin.settings.event === 'hover') {
        plugin.unbindHoverEvents();
      }
      plugin.unbindClickEvents();
      plugin.unbindKeyboardEvents();
    };
    plugin.bindMegaMenuEvents = function () {
      plugin.unbindMegaMenuEvents();
      if (plugin.isDesktopView() && plugin.settings.event === 'hover_intent') {
        plugin.bindHoverIntentEvents();
      }
      if (plugin.isDesktopView() && plugin.settings.event === 'hover') {
        plugin.bindHoverEvents();
      }
      plugin.bindClickEvents();
      plugin.bindKeyboardEvents();
    };
    plugin.checkWidth = function () {
      if (plugin.isMobileView() && $menu.data('view') === 'desktop') {
        plugin.switchToMobile();
      }
      if (plugin.isDesktopView() && $menu.data('view') === 'mobile') {
        plugin.switchToDesktop();
      }
      plugin.calculateDynamicSubmenuWidths($('> li.mega-menu-megamenu > a.mega-menu-link', $menu));
    };
    plugin.reverseRightAlignedItems = function () {
      if (!$('body').hasClass('rtl') && $menu.hasClass('mega-menu-horizontal')) {
        $menu.append($menu.children('li.mega-item-align-right').get().reverse());
      }
    };
    plugin.addClearClassesToMobileItems = function () {
      $('.mega-menu-row', $menu).each(function () {
        $('> .mega-sub-menu > .mega-menu-column:not(.mega-hide-on-mobile)', $(this)).filter(':even').addClass('mega-menu-clear');
      });
    };
    plugin.initDesktop = function () {
      $menu.data('view', 'desktop');
      plugin.bindMegaMenuEvents();
      plugin.initIndicators();
    };
    plugin.switchToDesktop = function () {
      $menu.data('view', 'desktop');
      plugin.bindMegaMenuEvents();
      plugin.reverseRightAlignedItems();
      plugin.hideAllPanels();
      plugin.hideMobileMenu(true);
    };
    plugin.initMobile = function () {
      plugin.switchToMobile();
    };
    plugin.switchToMobile = function () {
      $menu.data('view', 'mobile');
      plugin.bindMegaMenuEvents();
      plugin.initIndicators();
      plugin.reverseRightAlignedItems();
      plugin.addClearClassesToMobileItems();
      plugin.hideAllPanels();
      plugin.expandMobileSubMenus();
    };
    plugin.initToggleBar = function () {
      $toggle_bar.on('click', function (e) {
        if (
          $(e.target).is(
            '.mega-menu-toggle, .mega-menu-toggle-custom-block *, .mega-menu-toggle-block, .mega-menu-toggle-animated-block, .mega-menu-toggle-animated-block *, .mega-toggle-blocks-left, .mega-toggle-blocks-center, .mega-toggle-blocks-right, .mega-toggle-label, .mega-toggle-label span'
          )
        ) {
          e.preventDefault();
          if ($(this).hasClass('mega-menu-open')) {
            plugin.hideMobileMenu();
          } else {
            plugin.showMobileMenu();
          }
        }
      });
    };
    plugin.initIndicators = function () {
      $('.mega-indicator', $menu)
        .not('[data-has-click-event]')
        .on('click.megamenu', function (e) {
          e.preventDefault();
          e.stopPropagation();
          if ($(this).closest('.mega-menu-item').hasClass('mega-toggle-on')) {
            if (!$(this).closest('ul.mega-sub-menu').parent().hasClass('mega-menu-tabbed') || plugin.isMobileView()) {
              plugin.hidePanel($(this).parent(), false);
            }
          } else {
            plugin.showPanel($(this).parent(), false);
          }
        });
      $('.mega-indicator', $menu).each(function () {
        $(this).attr('data-has-click-event', 'true');
      });
    };
    plugin.hideMobileMenu = function (force) {
      force = force || false;
      if (!$toggle_bar.is(':visible') && !force) {
        return;
      }
      html_body_class_timeout = setTimeout(function () {
        $('body').removeClass($menu.attr('id') + '-mobile-open');
        $('html').removeClass($menu.attr('id') + '-off-canvas-open');
      }, plugin.settings.effect_speed_mobile);
      $('.mega-toggle-label, .mega-toggle-animated', $toggle_bar).attr('aria-expanded', 'false');
      if (plugin.settings.effect_mobile === 'slide' && !force) {
        $menu.animate({ height: 'hide' }, plugin.settings.effect_speed_mobile, function () {
          $menu.css({ width: '', left: '', display: '' });
          $toggle_bar.removeClass('mega-menu-open');
        });
      } else {
        $menu.css({ width: '', left: '', display: '' });
        $toggle_bar.removeClass('mega-menu-open');
      }
      $menu.triggerHandler('mmm:hideMobileMenu');
    };
    plugin.showMobileMenu = function () {
      if (!$toggle_bar.is(':visible')) {
        return;
      }
      clearTimeout(html_body_class_timeout);
      $('body').addClass($menu.attr('id') + '-mobile-open');
      plugin.expandMobileSubMenus();
      if (plugin.settings.effect_mobile === 'slide_left' || plugin.settings.effect_mobile === 'slide_right') {
        $('html').addClass($menu.attr('id') + '-off-canvas-open');
      }
      $('.mega-toggle-label, .mega-toggle-animated', $toggle_bar).attr('aria-expanded', 'true');
      if (plugin.settings.effect_mobile === 'slide') {
        $menu.animate({ height: 'show' }, plugin.settings.effect_speed_mobile, function () {
          $(this).css('display', '');
        });
      }
      $toggle_bar.addClass('mega-menu-open');
      plugin.toggleBarForceWidth();
      $menu.triggerHandler('mmm:showMobileMenu');
    };
    plugin.toggleBarForceWidth = function () {
      if ($(plugin.settings.mobile_force_width).length && (plugin.settings.effect_mobile === 'slide' || plugin.settings.effect_mobile === 'disabled')) {
        var submenu_offset = $toggle_bar.offset();
        var target_offset = $(plugin.settings.mobile_force_width).offset();
        $menu.css({ width: $(plugin.settings.mobile_force_width).outerWidth(), left: target_offset.left - submenu_offset.left + 'px' });
      }
    };
    plugin.init = function () {
      $menu.triggerHandler('before_mega_menu_init');
      plugin.settings = $.extend({}, defaults, options);
      $menu.removeClass('mega-no-js');
      plugin.initToggleBar();
      if (plugin.settings.unbind_events === 'true') {
        plugin.unbindAllEvents();
      }
      $(window).on('load', function () {
        plugin.calculateDynamicSubmenuWidths($('> li.mega-menu-megamenu > a.mega-menu-link', $menu));
      });
      if (plugin.isDesktopView()) {
        plugin.initDesktop();
      } else {
        plugin.initMobile();
      }
      $(window).on('resize', function () {
        plugin.checkWidth();
      });
      $menu.triggerHandler('after_mega_menu_init');
    };
    plugin.init();
  };
  $.fn.maxmegamenu = function (options) {
    return this.each(function () {
      if (undefined === $(this).data('maxmegamenu')) {
        var plugin = new $.maxmegamenu(this, options);
        $(this).data('maxmegamenu', plugin);
      }
    });
  };
  $(function () {
    $('.max-mega-menu').maxmegamenu();
  });
})(jQuery);
