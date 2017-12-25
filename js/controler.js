'use strict';


var todo_item_html = function(state, title, description)
{
  var color = 'red';
  var icon = '';
  if ( state == TodoItem.NEW ) {
    var color = 'grey';
    var icon = 'radio_button_unchecked';
  } else if ( state == TodoItem.ACTIVE ) {
    var color = 'blue';
    var icon = 'radio_button_checked';
  } else if ( state == TodoItem.COMPLETE ) {
    var color = 'green';
    var icon = 'check';
  }
  return '\
    <li class="collection-item avatar todo waves-effect">\
      <i class="material-icons circle '+color+' status">'+icon+'</i>\
      <p>\
      <span class="title">'+title+'</span>\
      </br>\
      '+description+'</p>\
      <i class="material-icons secondary-content scale-transition scale-out edit">mode_edit</i>\
    </li>'
}

var todo_click_handler = function()
{
  var status = $(this).find('.status');
  if ( status.hasClass('grey') )
  {
    status.removeClass('grey')
    status.addClass('blue');
    status.text('radio_button_checked')
  }
  else if ( status.hasClass('blue') )
  {
    status.removeClass('blue')
    status.addClass('green');
    status.text('check')
  }
  else if ( status.hasClass('green') )
  {
    status.removeClass('green')
    status.addClass('grey');
    status.text('radio_button_unchecked')
  }
}

$(document).ready(function()
{
  var local_list = localStorage.getItem('project_portal_list');
  var project_name_list = [];
  if ( local_list === null )
    localStorage.setItem('project_portal_list', project_name_list);
  else
  {
    try {
      project_name_list = JSON.parse(local_list);
    } catch (e) {
      localStorage.setItem('project_portal_list', project_name_list);
    }
  }

  $('.collapsible').collapsible(
  {
    accordion: false,
    onOpen: function(el) {
      $(el).find('#expand').addClass('scale-out');
      //$(el).find('#expand').text('expand_less');
    },
    onClose: function(el) {
      $(el).find('#expand').removeClass('scale-out');
      //$(el).find('#expand').text('expand_more');
    }
  });

  $('#todo').on('click', '.todo', function()
  {
    var status = $(this).find('.status');
    if ( status.hasClass('grey') )
    {
      status.removeClass('grey')
      status.addClass('blue');
      status.text('radio_button_checked')
    }
    else if ( status.hasClass('blue') )
    {
      status.removeClass('blue')
      status.addClass('green');
      status.text('check')
    }
    else if ( status.hasClass('green') )
    {
      status.removeClass('green')
      status.addClass('grey');
      status.text('radio_button_unchecked')
    }
  })
  .on('mouseenter', '.todo', function()
  {
    $(this).find('.edit').removeClass('scale-out');
  })
  .on('mouseleave', '.todo', function()
  {
    $(this).find('.edit').addClass('scale-out');
  });

  $('#add_todo').click( function()
  {
    $('#todo').append( todo_item_html(TodoItem.NEW, 'New', 'Description goes here') );
  });
});
