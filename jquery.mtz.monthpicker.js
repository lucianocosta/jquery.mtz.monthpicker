/*
 * jQuery UI Monthpicker 1.0.0
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
(function ($){
	
  function Monthpicker(pattern){
    
    if (!pattern || !pattern.match){
      pattern = 'mm/yyyy'
    }

    var
			_element = null,
      _left = 0,
      _right = 0,
      _top = 0,
      _bottom = 0,
		  _monthNamesShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      _container = $('<div id="" class="ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all"></div>').css({
        position:'absolute',
        zIndex:999999,
        whiteSpace:'no-wrap',
        top:'0px',
        left:'0px',
        width:'250px',
        overflow:'hidden',
        textAlign:'center'
      }),
      _header = $('<div class="ui-datepicker-header ui-widget-header ui-helper-clearfix ui-corner-all monttez-monthpicker"></div>'),
      _table = $('<table class="monttez-monthpicker"></table>'),
      initialized = false,
			year = (new Date()).getFullYear()

      function mountYearsCombo(){
        var combo = $('<select class="monttez-monthpicker"></select>')
				combo.bind('change', function () {
					$.monthpicker.year = $(this).children(':selected').val()
				})
        for(var i=(year-10); i<=(year+10); i++){
          combo.append('<option class="monttez-monthpicker" value="'+ i +'">' + i + '</option>')
        }
        _header.append(combo)
      }

      function mountMonthsTable(){
        var 
          tbody = $('<tbody class="monttez-monthpicker"></tbody>').appendTo(_table),
          tr = $('<tr class="monttez-monthpicker"></tr>'),
          td = ''
        for(var i=1; i<=12; i++){
          td = $('<td class="monttez-monthpicker" data-month="'+i+'"></td>')
					td.append('<a class="ui-state-default monttez-monthpicker" style="text-align:center" href="#">' + _monthNamesShort[i-1] + '</a>')
					td.bind('click', function () {
						_element.val( formatedValue( $(this).attr('data-month')) )
          	$.monthpicker.initialized = false
          	$.monthpicker.hide()				
					})
          tr.append(td).appendTo(tbody)
          if(i%3==0) tr = $('<tr class="monttez-monthpicker"></tr>')
        }
      }

			function formatedValue(month){
				if(pattern.indexOf('mm') >=0 && month < 10)
				  month = '0' + month
				return month + '/' + $.monthpicker.year
			}

      this.show = function (){
        _container.appendTo('body').css({
          display:'block'
        })
      }

      this.hide = function (){
        _container.css({display:'none'})
      }

      this.setElement = function (el){
				_element = el
        _top = el.offset().top
        _bottom = el.offset().top + el.outerHeight()
        _left = el.offset().left
        _right = el.offset().left + el.outerWidth()
        _container.css({
          top: _bottom,
          left: _left
        })
      }

      mountYearsCombo()
      mountMonthsTable()
      _container.append(_header)
      _container.append(_table)

  }

  $.fn.monthpicker = function (){
    $(this).live({
      click: function (el){
        $.monthpicker.setElement($(this))
        $.monthpicker.show()
        $.monthpicker.initialized = true
        $(document).mousedown(function (el2){
	      	if(!el2.target.className || el2.target.className.indexOf('monttez-monthpicker') < 0){
          	$.monthpicker.initialized = false
          	$.monthpicker.hide()				
					}
        })
      }
    })
  }

  $.monthpicker = new Monthpicker('')
  $.monthpicker.initialized = false
  $.monthpicker.initializede = 'falsed'
  $.monthpicker.year = (new Date()).getFullYear()

})(jQuery)
