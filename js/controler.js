'use strict';

var project_name_list = [],
projects = {},
selected_project = null;

const electron = nodeRequire('electron')
const remote = electron.remote

function selectDirectory() {
  return remote.dialog.showOpenDialog( {properties: ['openDirectory']} )
}

function selectFile() {
  return remote.dialog.showOpenDialog( {properties: ['openFile']} )
}

$(document).ready(function()
{
  project_name_list = localStorage.getItem('project_portal_list');
  if ( project_name_list === null ) {
    project_name_list = []
    localStorage.setItem( 'project_portal_list', JSON.stringify([]) );
  } else {
    try {
      project_name_list = JSON.parse(project_name_list);
    } catch (e) {
      project_name_list = []
      localStorage.setItem( 'project_portal_list', JSON.stringify([]) );
    }
  }
  for ( var project_name of project_name_list ) {
    var project = new Project(project_name);
    projects[project_name] = project;
    $('#project_list').append( projectHtml(project) )
  }
  if ( project_name_list.length > 0 )
    loadProject(project_name_list[0]);

  /**
   * Todo List
   */
  $('#todo_list')
  .on('click', '.todo', function()
  {
    var id = $(this).find('.todo_id').text(),
        status = $(this).find('.status'),
        todo_item = selected_project.todos[id];
    if ( todo_item.status == TodoItem.NEW ) {
      status.removeClass('grey').addClass('blue').text('radio_button_checked');
      todo_item.makeActive();
    } else if ( todo_item.status == TodoItem.ACTIVE ) {
      status.removeClass('blue').addClass('green').text('check');
      todo_item.makeComplete();
    } else if ( todo_item.status == TodoItem.COMPLETE ) {
      status.removeClass('green').addClass('grey').text('radio_button_unchecked');
      todo_item.makeNew();
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

  /**
   * Project List
   */
  $('#project_list')
  .on('click', '.project', function()
  {
    var selected_project_title = $(this).find('.title').text();
    loadProject(selected_project_title)
  })
  .on('click', '.project_remove', function(e)
  {
    e.stopPropagation();
    var title = $(this).parent().find('.title').text();
    $(this).parent().remove();
    projects[title].remove();
    delete projects[title];
    localStorage.setItem( 'project_portal_list', JSON.stringify( Object.keys(projects) ) );
  })
  .on('mouseenter', '.project', function()
  {
    $(this).find('.project_remove').removeClass('scale-out');
    $(this).removeClass('darken-3').addClass('darken-2');
  })
  .on('mouseleave', '.project', function()
  {
    $(this).find('.project_remove').addClass('scale-out');
    $(this).removeClass('darken-2').addClass('darken-3');
  });

  /**
   * File List
   */
  $('#file_list')
  .on('click', '.file_item', function() {
    var file_name = $(this).find('.full_name').text()
    remote.shell.openItem(file_name.replace(/\\/g, '/'))
  })
  .on('mouseenter', '.file_item', function()
  {
    $(this).find('.file_remove').removeClass('scale-out');
  })
  .on('mouseleave', '.file_item', function()
  {
    $(this).find('.file_remove').addClass('scale-out');
  })
  .on('click', '.file_remove', function(e)
  {
    e.stopPropagation();
    var file = $(this).parent().find('.full_name').text();
    selected_project.removeFile(file);
    $(this).parent().parent().remove();
  });

  /**
   * Asset Folder List
   */
  $('#asset_list')
  .on('click', '.asset_folder_item', function() {
    var asset_folder = $(this).find('.full_name').text()
    remote.shell.openItem(asset_folder.replace(/\\/g, '/'))
  })
  .on('mouseenter', '.asset_folder_item', function()
  {
    $(this).find('.asset_folder_remove').removeClass('scale-out');
  })
  .on('mouseleave', '.asset_folder_item', function()
  {
    $(this).find('.asset_folder_remove').addClass('scale-out');
  })
  .on('click', '.asset_folder_remove', function(e)
  {
    e.stopPropagation();
    var folder = $(this).parent().find('.full_name').text();
    selected_project.removeFolder(folder);
    $(this).parent().parent().remove();
  });

  /**
   * Fixed Action Button
   */
  $('.fixed-action-btn')
  .on('click', '#add_todo', function()
  {
    $('#todo_modal_title').val('');
    $('#todo_modal_description').val('');
    Materialize.updateTextFields();
    $('#todo_modal').modal('open');
  })
  .on('click', '#add_file', function()
  {
    var file = selectFile()[0];
    $('#file_list').append( fileHtml(file) );
    selected_project.addFile(file);
    selected_project.save();
  })
  .on('click', '#add_asset_folder', function()
  {
    var asset_folder = selectDirectory()[0];
    $('#asset_list').append( assetFolderHtml(asset_folder) );
    selected_project.addFolder(asset_folder);
    selected_project.save();
  })
  .on('click', '#add_project', function()
  {
    $('#project_modal_title').val('');
    Materialize.updateTextFields();
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
      // TODO: simplify to appending todo html
      loadProject( selected_project.title );
    }
  });

  $('#project_modal').modal({
    ready: function(modal, trigger)
    { // Callback for Modal open. Modal and trigger parameters available.
    },
    complete: function()
    { // Callback for Modal close
      var title = $('#project_modal_title').val();
      if ( !projects.hasOwnProperty(title) )
      {
        var new_project = new Project(title);
        projects[title] = new_project;
        localStorage.setItem( 'project_portal_list', JSON.stringify( Object.keys(projects) ) );
        $('#project_list').append( projectHtml(new_project) );
        loadProject( title );
      }
    }
  });

  /**
   * Collapsible Icon
   */
  $('.collapsible').collapsible(
  {
    accordion: false,
    onOpen: function(el)
    {
      $(el).find('#expand').addClass('scale-out');
      $(el).find('#contract').removeClass('scale-out');
    },
    onClose: function(el)
    {
      $(el).find('#expand').removeClass('scale-out');
      $(el).find('#contract').addClass('scale-out');
    }
  });
});

function loadProject(p_name)
{
  if ( selected_project !== null )
    selected_project.save();
  selected_project = projects[p_name];
  $('#selected_project_title').text(p_name)
  $('#todo_list').empty()
  for ( var t in selected_project.todos )
    $('#todo_list').append( todoItemHtml(selected_project.todos[t]) );
  $('#file_list').empty();
  for ( var f of selected_project.file_list )
    $('#file_list').append( fileHtml(f) );
  $('#asset_list').empty();
  for ( var f of selected_project.asset_folder_list )
    $('#asset_list').append( assetFolderHtml(f) );
}
