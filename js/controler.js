'use strict';

$(document).ready(function()
{
  var local_list = localStorage.getItem('project_portal_list'),
      project_name_list = [],
      project_dict = {},
      selected_project = null;
  if ( local_list === null ) {
    localStorage.setItem( 'project_portal_list', JSON.stringify( project_name_list) );
  } else {
    try {
      project_name_list = JSON.parse(local_list);
    } catch (e) {
      localStorage.setItem( 'project_portal_list', JSON.stringify( project_name_list ) );
    }
  }
  for ( var project_name of project_name_list ) {
    var project = new Project(project_name);
    project_dict[project_name] = project;
    $('#project_list').append( project_html(project) )
  }
  if ( project_list.length > 0 )
    selected_project = project_list[0];

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

  $('#todo_list').on('click', '.todo', function()
  {
    var title = $(this).find('.title'),
        status = $(this).find('.status'),
        todo_item;
    for ( var t of selected_project.todos )
      if ( t.title = title.text() )
        todo_item = t;
    if ( todo_item.status == TodoItem.NEW ) {
      status.removeClass('grey');
      status.addClass('blue');
      status.text('radio_button_checked');
      todo_item.status = TodoItem.ACTIVE;
    } else if ( todo_item.status == TodoItem.ACTIVE ) {
      status.removeClass('blue');
      status.addClass('green');
      status.text('check');
      todo_item.status = TodoItem.COMPLETE;
    } else if ( todo_item.status == TodoItem.COMPLETE ) {
      status.removeClass('green');
      status.addClass('grey');
      status.text('radio_button_unchecked');
      todo_item.status = TodoItem.NEW;
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

  $('#project_list').on('click', '.project', function()
  {
    if ( selected_project != null )
      selected_project.save();
    var selected_project_title = $(this).find('.title').text();
    selected_project = project_dict[selected_project_title];
    $('#selected_project_title').text(selected_project_title)
    $('#todo_list').empty()
    for ( var todo_item of selected_project.todos ) {
      $('#todo_list').append( todo_item_html(todo_item) );
    }
  })

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
      if ( selected_project && selected_project.todos )
        selected_project.addTodo(new_todo_item);
      $('#todo_list').append( todo_item_html(new_todo_item) );
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

  $('#project_modal').modal({
    ready: function(modal, trigger)
    { // Callback for Modal open. Modal and trigger parameters available.
      console.log("Ready");
    },
    complete: function()
    { // Callback for Modal close
      var title = $('#project_title').val();
      if ( !project_dict.hasOwnProperty(title) ) {
        var new_project = new Project(title);
        project_dict[title] = new_project;
        localStorage.setItem( 'project_portal_list', JSON.stringify( Object.keys(project_dict) ) );
        $('#project_list').append( project_html(new_project) );
      }
      console.log('Closed');
    }
  });
});
