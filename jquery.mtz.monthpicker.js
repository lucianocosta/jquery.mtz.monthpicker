/*
 * jQuery UI Monthpicker
 *
 * @licensed MIT <see below>
 * @licensed GPL <see below>
 *
 * @author Luciano Costa
 * http://lucianocosta.info/jquery.mtz.monthpicker/
 *
 * Depends:
 *  jquery.ui.core.js
 */

/**
 * MIT License
 * Copyright (c) 2011, Luciano Costa
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
/**
 * GPL LIcense
 * Copyright (c) 2011, Luciano Costa
 *
 * This program is free software: you can redistribute it and/or modify it
 * under the terms of the GNU General Public License as published by the
 * Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
 * or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License
 * for more details.
 *
 * You should have received a copy of the GNU General Public License along
 * with this program. If not, see <http://www.gnu.org/licenses/>.
 */

(function ($) {

    // These functions are pulled out so unbind can be used to easily remove
    // the added events.
    var _clickMonthPicker =  function() {
            $(this).monthpicker('setValue');
            $(this).monthpicker('hide');
        },

        _changeMonthPckerYear = function() {
            $this.monthpicker('setValue');
        },

        _blurMonthPicker = function (e) {
            if (!e.target.className || e.target.className.toString().indexOf('mtz-monthpicker') < 0) {
                $(".mtz-monthpicker-widgetcontainer").each(function () {
                    if (typeof($(this).data("monthpicker"))!="undefined") {
                        $(this).monthpicker('hide');
                    }
                });
            }
        },

        _showMonthPicker = function(e) {
            $(this).monthpicker('show');
        };

    var methods = {
        init : function (options) {
            return this.each(function () {
                var
                    $this = $(this),
                    data = $this.data('monthpicker'),
                    year = (options && options.year) ? options.year : (new Date()).getFullYear(),
                    settings = $.extend({
                        pattern: 'mm/yyyy',
                        selectedMonth: null,
                        selectedMonthName: '',
                        selectedYear: year,
                        startYear: year - 10,
                        endYear: year + 10,
                        monthNames: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                        id: "monthpicker_" + (Math.random() * Math.random()).toString().replace('.', ''),
                        openOnFocus: true,
                        disabledMonths: []
                    }, options);

                settings.dateSeparator = settings.pattern.replace(/(mmm|mm|m|yyyy|yy|y)/ig,'');

                // If the plugin hasn't been initialized yet for this element
                if (!data) {
                    $(this).data('monthpicker', {
                        'target': $this,
                        'settings': settings
                    });

                    if (settings.openOnFocus === true) {
                        $this.bind('focus', _showMonthPicker);
                    }

                    $this.monthpicker('mountWidget', settings);

                    // If the default month has not been set.  Set that value randomly to a
                    // none disabled month.
                    if (settings.selectedMonth === null) {
                        var validMonths = [];

                        for (var k = 1; k <= 12; k++ ) {
                            if ($.inArray(k, settings.disabledMonths) < 0) {
                                validMonths.push(k);
                            }
                        }
                        settings.selectedMonth = validMonths[Math.floor(Math.random() * validMonths.length)];
                    }


                    // Set the values and hide the monthpicker when a month is selectd.
                    $this.bind('monthpicker-click-month', _clickMonthPicker);

                    // Set the year whenever the year is changed.
                    $this.bind('monthpicker-change-year', _changeMonthPckerYear);

                    // hide widget when user clicks elsewhere on page
                    $this.addClass("mtz-monthpicker-widgetcontainer");
                    $(document).unbind("mousedown.mtzmonthpicker").bind("mousedown.mtzmonthpicker", _blurMonthPicker);
                }

            });
        },

        show: function (n) {
            var widget = $('#' + this.data('monthpicker').settings.id);
            var monthpicker = $('#' + this.data('monthpicker').target.attr("id") + ':eq(0)');
            widget.css("top", monthpicker.offset().top  + monthpicker.outerHeight());
            widget.css("left", monthpicker.offset().left);
            widget.show();
            widget.find('select').focus();
            this.trigger('monthpicker-show');
        },

        hide: function () {
            var widget = $('#' + this.data('monthpicker').settings.id);
            if (widget.is(':visible')) {
                widget.hide();
                this.trigger('monthpicker-hide');
            }
        },

        setValue: function (settings) {
            // If settings are undefined use this object's monthpicker settings.
            settings = (settings !== undefined) ? settings : $(this).data().monthpicker.settings;

            var
                // If no month name is present, get it from the existing month.
                month = settings.selectedMonth,
                year = settings.selectedYear,
                monthName = Boolean(settings.selectedMonthName) ? settings.selectedMonthName : settings.monthNames[month - 1];

            // Word format month (i.e. Jan, Feb, etc.)
            if(settings.pattern.indexOf('mmm') >= 0) {
                month = monthName;
            // Number format month (i.e. 01, 11, etc.)
            } else if(settings.pattern.indexOf('mm') >= 0 && month < 10) {
                month = '0' + month;
            }

            // If format is not set as four number year, set the hear to 2 digits.
            if(settings.pattern.indexOf('yyyy') < 0) {
                year = year.toString().substr(2,2);
            }

            // If the year is formatted to come after the month.
            if (settings.pattern.indexOf('y') > settings.pattern.indexOf(settings.dateSeparator)) {
                this.val(month + settings.dateSeparator + year);
            // Year is formated to come before the month.
            } else {
                this.val(year + settings.dateSeparator + month);
            }
        },

        disableMonths: function (months) {
            var
                settings = this.data('monthpicker').settings,
                container = $('#' + settings.id);

            settings.disabledMonths = months;

            container.find('.mtz-monthpicker-month').each(function () {
                var m = parseInt($(this).data('month'), 10);
                if ($.inArray(m, months) >= 0) {
                    $(this).addClass('ui-state-disabled');
                } else {
                    $(this).removeClass('ui-state-disabled');
                }
            });
        },

        mountWidget: function (settings) {
            var
                monthpicker = this,
                container = $('<div id="'+ settings.id +'" class="ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all" />'),
                header = $('<div class="ui-datepicker-header ui-widget-header ui-helper-clearfix ui-corner-all mtz-monthpicker" />'),
                combo = $('<select class="mtz-monthpicker mtz-monthpicker-year" />'),
                table = $('<table class="mtz-monthpicker" />'),
                tbody = $('<tbody class="mtz-monthpicker" />'),
                tr = $('<tr class="mtz-monthpicker" />'),
                td = '',
                selectedYear = settings.selectedYear,
                option = null,
                attrSelectedYear = $(this).data('selected-year'),
                attrStartYear = $(this).data('start-year'),
                attrEndYear = $(this).data('end-year'),
                attrStartMonth = $(this).data('start-month'),
                attrEndMonth = $(this).data('end-month'),
                attrSelectedMonth = $(this).data('selected-month');

            // Populate settings with the values in the data attributes
            // if they exist for the month and year of the monthpicker.
            if (attrSelectedYear) {
                settings.selectedYear = attrSelectedYear;
            }

            if (attrStartYear) {
                settings.startYear = attrStartYear;
            }

            if (attrEndYear) {
                settings.endYear = attrEndYear;
            }

            if (attrStartMonth) {
                settings.startMonth = attrStartMonth;
            }

            if (attrEndMonth) {
                settings.endMonth = attrEndMonth;
            }

            if (attrSelectedMonth) {
                settings.selectedMonth = attrSelectedMonth;
            }

            container.css({
                position:'absolute',
                zIndex:999999,
                whiteSpace:'nowrap',
                width:'250px',
                overflow:'hidden',
                textAlign:'center',
                display:'none',
                top: monthpicker.offset().top + monthpicker.outerHeight(),
                left: monthpicker.offset().left
            });

            // mount years combo
            for (var i = settings.startYear; i <= settings.endYear; i++) {
                option = $('<option class="mtz-monthpicker" />').attr('value', i).append(i);
                if (settings.selectedYear === i) {
                    option.attr('selected', 'selected');
                }
                combo.append(option);
            }
            header.append(combo).appendTo(container);

            // mount months table
            for (var j = 1; j <= 12; j++) {
                td = $('<td class="ui-state-default mtz-monthpicker mtz-monthpicker-month" />').attr('data-month', j);
                td.append(settings.monthNames[j - 1]);
                if (j == settings.selectedMonth) {td.addClass('mtz-monthpicker-month-selected');}
                tr.append(td).appendTo(tbody);
                if (j % 3 === 0) {
                    tr = $('<tr class="mtz-monthpicker" />');
                }
            }

            table.append(tbody).appendTo(container);

            container.find('.mtz-monthpicker-month').bind('click', function () {
                var m = parseInt($(this).data('month'), 10);
                if ($.inArray(m, settings.disabledMonths) < 0 ) {
                    settings.selectedMonth = $(this).data('month');
                    settings.selectedMonthName = $(this).text();
                    monthpicker.trigger('monthpicker-click-month', $(this).data('month'));

                    // Remove selected class from selected months and add selected class to current selection.
                    $(this).parent().siblings().children().removeClass('mtz-monthpicker-month-selected');
                    $(this).siblings().removeClass('mtz-monthpicker-month-selected');
                    $(this).addClass("mtz-monthpicker-month-selected");
                }
            });

            container.find('.mtz-monthpicker-year').bind('change', function () {
                settings.selectedYear = $(this).val();
                monthpicker.trigger('monthpicker-change-year', $(this).val());
            });

            // Disable all disabledMonths on creation.
            container.find('.mtz-monthpicker-month').each(function () {
                var m = parseInt($(this).data('month'), 10);
                if ($.inArray(m, settings.disabledMonths) >= 0) {
                    $(this).addClass('ui-state-disabled');
                } else {
                    $(this).removeClass('ui-state-disabled');
                }
            });

            container.appendTo('body');
        },

        destroy: function () {
            return this.each(function () {
                // First remove the events we added
                $(this).unbind('focus', _showMonthPicker);  // Removes event from object monthpicker was added to.
                $(this).removeData('monthpicker'); // Removes all the individual evetns of the monthpicker itself.
            });
        }

    };

    $.fn.monthpicker = function (method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call( arguments, 1 ));
        } else if (typeof method === 'object' || ! method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.mtz.monthpicker');
        }
    };

})(jQuery);