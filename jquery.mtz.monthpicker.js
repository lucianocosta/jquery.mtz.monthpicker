/*
 * jQuery UI Monthpicker 2.0.0
 *
 * @licensed MIT <see below>
 * @licensed GPL <see below>
 *
 * @author Luciano Costa
 *
 * Depends:
 *	jquery.ui.core.js
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

     $.fn.monthpicker = function (method) {

         // public methods
         var methods = {

             init : function (options) {
                 $.fn.monthpicker.settings = $.extend({}, this.monthpicker.defaults, options);
                 $.fn.monthpicker.widget = helpers.mount_widget(this.monthpicker.settings);
                 $.fn.monthpicker.widget.appendTo('body');
                 $.fn.monthpicker.settings.separator = $.fn.monthpicker.settings.pattern.replace(/(mm|m|yyyy|yy|y)/ig,'');                
                 return this.each(function () {
                     var $el = $(this), // ref to the jQuery version of the current DOM element
                         el = this;     // ref to the actual DOM element

                     $el.bind('click', function () {
                       $.fn.monthpicker('apply_to', $(this));
                       $.fn.monthpicker('show');
                     });

                 });
             },

             show: function () {
               $.fn.monthpicker.widget.css({display:'block'});
               $(document).mousedown(function (e){
       	      	if(!e.target.className || e.target.className.indexOf('mtz-monthpicker') < 0){
       	      	  $.fn.monthpicker('hide');
       					}
               });              
             },

             hide: function () {
               $.fn.monthpicker.widget.css({display:'none'});
             },

             // tell the widget what input element to interact with
             apply_to: function (el) {
               $.fn.monthpicker.widget.css({
                 top: el.offset().top + el.outerHeight(),
                 left: el.offset().left
               });
               helpers.select_year(el);
               helpers.handle_month_click(el);              
             }
         };

         // private methods
         var helpers = {

             mount_widget: function (settings) {
               var
                 container = $('<div id="mtz-monthpicker" class="ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all" />'),
                 header = $('<div class="ui-datepicker-header ui-widget-header ui-helper-clearfix ui-corner-all mtz-monthpicker" />'),
                 combo = $('<select id="mtz-monthpicker-year" class="mtz-monthpicker" />'),
                 table = $('<table class="mtz-monthpicker" />'),
                 tbody = $('<tbody class="mtz-monthpicker" />'),
                 tr = $('<tr class="mtz-monthpicker" />'),
                 td = '';
                 year = $.fn.monthpicker.settings.year,
                 option = null;

               container.css({
                 position:'absolute',
                 zIndex:999999,
                 whiteSpace:'no-wrap',
                 width:'250px',
                 overflow:'hidden',
                 textAlign:'center',
                 display:'none'
               });

               // mount years combo
               for (var i = year-10; i <= year+10; i++) {
                 var option = $('<option class="mtz-monthpicker" />').attr('value',i).append(i);
                 if (year === i) {
                   option.attr('selected', 'selected');
                 }
                 combo.append(option);
               }
               header.append(combo).appendTo(container);

               // mount months table
               for(var i=1; i<=12; i++){
                 td = $('<td class="ui-state-default mtz-monthpicker" style="padding:5px;cursor:default;" />').attr('data-month',i)
       					td.append(settings.monthNames[i-1]);
                 tr.append(td).appendTo(tbody);
                 if (i % 3 === 0) {
                   tr = $('<tr class="mtz-monthpicker" />'); 
                 }
               }
               table.append(tbody).appendTo(container)

               return container;
             },

             apply_pattern: function (month, year) {
               var 
                 m = month,
                 settings = $.fn.monthpicker.settings;
               if(settings.pattern.indexOf('mm') >= 0 && month < 10) {
                 m = '0' + m;
               }
               if (settings.pattern.indexOf('y') > settings.pattern.indexOf(settings.separator)){
                 return m + settings.separator + year;  
               } else {
                 return  year + settings.separator + m;
               }

             },

             extract_input_data: function (el) {
               var 
                 val = $(el).val(),
                 settings = $.fn.monthpicker.settings;
               if (val) {
                 val = val.split(settings.separator);
                 if(settings.pattern.indexOf('y') > settings.pattern.indexOf(settings.separator)) {
                   return { month: val[0], year: val[1] };
                 } else {
                   return { month: val[1], year: val[0] };
                 }                
               } else {
                 return null;
               }
             },

             handle_month_click: function (el){
               $.fn.monthpicker.widget.find('td').unbind('click').bind('click', function () {
                 var 
                   month = $(this).attr('data-month'),
                   year = $.fn.monthpicker.widget.find('option:selected').val();
                 $(el).val( helpers.apply_pattern(month, year) );
                 $.fn.monthpicker('hide');
               });
             },

             // mark an year as selected in the years combo
             // try #1: data on input
             // try #2: settings.year
             select_year: function (el) {
               var 
                 year = $.fn.monthpicker.settings.year,
                 input_data = helpers.extract_input_data(el);
               if (input_data !== null) {
                 year = input_data.year; 
               }
               $('#mtz-monthpicker-year option:selected').removeAttr('selected');
               $('#mtz-monthpicker-year option[value='+ year +']').attr('selected','selected');
             }

         };

         // method calling
         if (methods[method]) {
             return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
         } else if (typeof method === 'object' || !method) {
             return methods.init.apply(this, arguments);
         } else {
             $.error( 'Method "' +  method + '" does not exist in monthpicker plugin!');
         }

     };

     $.fn.monthpicker.widget = {}; // our widget is a singleton

     $.fn.monthpicker.settings = {}; // will hold a merge of default settings and user provided ones

     $.fn.monthpicker.defaults = {
     	  pattern: 'mm/yyyy',
     	  monthNames: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
     	  year: (new Date()).getFullYear()
     };

 })(jQuery);