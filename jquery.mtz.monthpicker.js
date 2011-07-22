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

  function Monthpicker(settings){
    var
			_element = null,
      _container = $('<div id="" class="ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all"></div>').css({
        position:'absolute',
        zIndex:999999,
        whiteSpace:'no-wrap',
        width:'250px',
        overflow:'hidden',
        textAlign:'center'
      }),
      _header = $('<div class="ui-datepicker-header ui-widget-header ui-helper-clearfix ui-corner-all mtz-monthpicker" />'),
      _table = $('<table class="mtz-monthpicker" />'),
      initialized = false,
			year = settings.year

      function mountYearsCombo(){
        var 
          combo = $('<select id="mtz-monthpicker-year" class="mtz-monthpicker" />'),
          option = null
        combo.bind('change', function () {
          $.monthpicker.year = $(this).children(':selected').val()
        })
        for(var i=$.monthpicker.year-10; i<=$.monthpicker.year+10; i++){
          option = $('<option class="mtz-monthpicker" />').attr('value',i).append(i)
          combo.append(option)
        }
        selectYear()
        _header.append(combo)
      }
      
      function selectYear(){
        var y = inputData().year ? inputData().year : $.monthpicker.year
        $('#mtz-monthpicker-year option:selected').removeAttr('selected')
        $('#mtz-monthpicker-year').find("option[value="+ y +']').attr('selected','selected')
      }
      
      function inputData(){
        var data = _element.val().split('/')
        if(data && data.length===2) return {'month':data[0], 'year':data[1]}
        return {'month':null, 'year':null}
      }

      function mountMonthsTable(){
        var 
          tbody = $('<tbody class="mtz-monthpicker" />').appendTo(_table),
          tr = $('<tr class="mtz-monthpicker" />'),
          td = ''
        for(var i=1; i<=12; i++){
          td = $('<td class="ui-state-default mtz-monthpicker" style="padding:5px;cursor:default;" />').attr('data-month',i)
					td.append(settings.monthNames[i-1])
					td.bind('click', function () {
						_element.val( formatedValue( $(this).attr('data-month')) )
          	$.monthpicker.hide()				
					})
          tr.append(td).appendTo(tbody)
          if(i%3===0) tr = $('<tr class="mtz-monthpicker" />')
        }
      }

      function formatedValue(month){
      	if(settings.pattern.indexOf('mm') >=0 && month < 10) month = '0' + month
      	return month + '/' + $.monthpicker.year
      }

      this.show = function (){
        if(!$.monthpicker.initialized){
          $.monthpicker.year = year
          mountYearsCombo()
          mountMonthsTable()
          _container.append(_header)
          _container.append(_table)          
        }
        selectYear()
        _container.appendTo('body').css({
          display:'block'
        })
        $.monthpicker.initialized = true
      }

      this.hide = function (){
        _container.css({display:'none'})
      }

      this.applyTo = function (el){
				_element = el
        _container.css({
          top: el.offset().top + el.outerHeight(),
          left: el.offset().left
        })
      }

  }

  $.fn.monthpicker = function (options){
    var
      settings = {
  		  pattern: 'mm/yyyy',
  		  monthNames: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  		  year: (new Date()).getFullYear()
  		}
		
		if(options){ 
      $.extend(settings, options)
    }
		
    $.monthpicker = new Monthpicker(settings)

    this.live({
      click: function (el){
        $.monthpicker.applyTo($(this))
        $.monthpicker.show()
        $(document).mousedown(function (e){
	      	if(!e.target.className || e.target.className.indexOf('mtz-monthpicker') < 0){
	      	  $.monthpicker.hide()				
					}
        })
      }
    })
    
    return this
  }

})(jQuery)
