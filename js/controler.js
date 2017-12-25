'use strict';

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
  var local_list = localStorage.getItem('project_portal_list'),
      project_name_list = [],
      project_list = [],
      project = null;
  if ( local_list === null ) {
    localStorage.setItem('project_portal_list', project_name_list);
  } else {
    try {
      project_name_list = JSON.parse(local_list);
    } catch (e) {
      localStorage.setItem('project_portal_list', project_name_list);
    }
  }
  for ( project_name of project_name_list ) {
    project = new Project(project_name);
    $('#project_list').append( project_html(project) )
  }
  if ( project_list.length > 0 )
    project = project_list[0];

  $('.collapsible').collapsible(
  {
    accordion: false,
    onOpen: function(el)
    {
      $(el).find('#expand').addClass('scale-out');
      //$(el).find('#expand').text('expand_less');
    },
    onClose: function(el)
    {
      $(el).find('#expand').removeClass('scale-out');
      //$(el).find('#expand').text('expand_more');
    }
  });

  $('#todo').on('click', '.todo', function()
  {
    var status = $(this).find('.status');
    if ( status.hasClass('grey') ) {
      status.removeClass('grey')
      status.addClass('blue');
      status.text('radio_button_checked')
    } else if ( status.hasClass('blue') ) {
      status.removeClass('blue')
      status.addClass('green');
      status.text('check')
    } else if ( status.hasClass('green') ) {
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

  $('#project_modal').modal({
    ready: function(modal, trigger)
    { // Callback for Modal open. Modal and trigger parameters available.
      console.log("Ready");
    },
    complete: function()
    { // Callback for Modal close
      console.log('Closed');
    }
  });

  $('#file_modal').modal({
    ready: function(modal, trigger)
    { // Callback for Modal open. Modal and trigger parameters available.
      console.log("Ready");
    },
    complete: function()
    { // Callback for Modal close
      console.log('Closed');
    }
  });

  $('#folder_modal').modal({
    ready: function(modal, trigger)
    { // Callback for Modal open. Modal and trigger parameters available.
      console.log("Ready");
    },
    complete: function()
    { // Callback for Modal close
      console.log('Closed');
    }
  });

  $('#todo_modal').modal({
    ready: function(modal, trigger)
    { // Callback for Modal open. Modal and trigger parameters available.
      console.log("Ready");
    },
    complete: function()
    { // Callback for Modal close
      var title = $('#todo_title').val(),
          description = $('#todo_description').val(),
          new_todo_item = new TodoItem(title, description);
      if ( project && project.todos )
        project.todos.add(new_todo_item)
      $('#todo').append( todo_item_html( new_todo_item ) );
      console.log('Closed');
    }
  });
});
