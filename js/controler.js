'use strict';

var local_list = [],
    project_name_list = [],
    projects = {},
    selected_project = null;

var select_project = function(p_name)
{
  if ( selected_project != null )
    selected_project.save();
  selected_project = projects[p_name];
  $('#selected_project_title').text(p_name)
  $('#todo_list').empty()
  for ( var t in selected_project.todos )
    $('#todo_list').append( todo_item_html(selected_project.todos[t]) );
}

$(document).ready(function()
{
  local_list = localStorage.getItem('project_portal_list');
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
    projects[project_name] = project;
    $('#project_list').append( project_html(project) )
  }
  if ( project_name_list.length > 0 )
    select_project(project_name_list[0]);

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

  $('#todo_list')
  .on('click', '.todo', function()
  {
    var title = $(this).find('.title'),
        status = $(this).find('.status'),
        todo_item;
    for ( var t in selected_project.todos )
      if ( selected_project.todos[t].title = title.text() )
        todo_item = selected_project.todos[t];
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
    selected_project.save()
  })
  .on('click', '.edit', function(e)
  {
    e.stopPropagation();
    $('#todo_modal_id').val( $(this).parent().find('.todo_id').text() );
    $('#todo_modal_title').val( $(this).parent().find('.todo_title').text() );
    $('#todo_modal_description').val( $(this).parent().find('.todo_description').text() );
    Materialize.updateTextFields();
    $('#todo_modal').modal('open');
  })
  .on('mouseenter', '.todo', function()
  {
    $(this).find('.edit').removeClass('scale-out');
  })
  .on('mouseleave', '.todo', function()
  {
    $(this).find('.edit').addClass('scale-out');
  });

  $('#project_list')
  .on('click', '.project', function()
  {
    var selected_project_title = $(this).find('.title').text();
    select_project(selected_project_title)
  })
  .on('mouseenter', '.project', function()
  {
    $(this).find('.project_remove').removeClass('scale-out');
  })
  .on('mouseleave', '.project', function()
  {
    $(this).find('.project_remove').addClass('scale-out');
  });

  $('.project')
  .on('click', '.project_remove', function()
  {
    var title = $(this).parent().find('.title').text();
    $(this).parent().remove();
    projects[title].remove();
    delete projects[title];
    localStorage.setItem( 'project_portal_list', JSON.stringify( Object.keys(projects) ) );
  });

  /**
   * Fixed ACtion Button
   */
  $('.fixed-action-btn').on('click', '#add_todo', function()
  {
    $('#todo_modal_title').val('');
    $('#todo_modal_description').val('');
    $('#todo_modal').modal('open');
  })
  .on('click', '#add_file', function()
  {
    $('#file_modal').modal('open');
  })
  .on('click', '#add_folder', function()
  {
    $('#folder_modal').modal('open');
  })
  .on('click', '#add_project', function()
  {
    $('#project_modal_title').val('');
    $('#project_modal').modal('open');
  })

  /**
   * Modals
   */
  $('#todo_modal').modal({
    ready: function(modal, trigger)
    { // Callback for Modal open. Modal and trigger parameters available.
    },
    complete: function()
    { // Callback for Modal close
      var id = $('#todo_modal_id').val(),
          title = $('#todo_modal_title').val(),
          description = $('#todo_modal_description').val(),
          new_todo_item = new TodoItem(id, title, description);
      if ( selected_project && selected_project.todos )
        selected_project.addTodo(new_todo_item);
      select_project( selected_project.title );
    }
  });

  $('#folder_modal').modal({
    ready: function(modal, trigger)
    { // Callback for Modal open. Modal and trigger parameters available.
    },
    complete: function()
    { // Callback for Modal close
    }
  });

  $('#file_modal').modal({
    ready: function(modal, trigger)
    { // Callback for Modal open. Modal and trigger parameters available.
    },
    complete: function()
    { // Callback for Modal close
    }
  });

  $('#project_modal').modal({
    ready: function(modal, trigger)
    { // Callback for Modal open. Modal and trigger parameters available.
    },
    complete: function()
    { // Callback for Modal close
      var title = $('#project_modal_title').val();
      if ( !projects.hasOwnProperty(title) ) {
        var new_project = new Project(title);
        projects[title] = new_project;
        localStorage.setItem( 'project_portal_list', JSON.stringify( Object.keys(projects) ) );
        $('#project_list').append( project_html(new_project) );
      }
    }
  });
});
