'use strict';

function todoItemHtml(todo_item)
{
  var color = 'red',
      icon = '';
  if ( todo_item.status == TodoItem.NEW ) {
    color = 'grey';
    icon = 'radio_button_unchecked';
  } else if ( todo_item.status == TodoItem.ACTIVE ) {
    color = 'blue';
    icon = 'radio_button_checked';
  } else if ( todo_item.status == TodoItem.COMPLETE ) {
    color = 'green';
    icon = 'check';
  }
  return '\
        <li class="collection-item avatar waves-effect todo">\
          <i class="material-icons circle '+color+' status">'+icon+'</i>\
          <p>\
            <span class="todo_id hide">'+todo_item.id+'</span>\
            <span class="title todo_title">'+todo_item.title+'</span>\
            </br>\
            <span class="todo_description grey-text">'+todo_item.description+'</span>\
          </p>\
          <i class="material-icons secondary-content scale-transition scale-out edit">mode_edit</i>\
        </li>'
}

function projectHtml(project)
{
  var result = '\
        <li class="collection-item grey darken-3 waves-effect waves-light project">';
  if ( project.icon )
    result += '\
          <i class="material-icons">'+project.icon+'</i>'
  result += '<span class="title">'+project.title+'</span>\
          <i class="material-icons white-text secondary-content scale-transition scale-out project_remove" style="margin-left: auto; margin-right: 0;">close</i>\
        </li>'
  return result;
}

function fileHtml(file_name)
{
  return '<li href="#" class="file_item collection-item avatar">\
    <i class="material-icons circle red">insert_drive_file</i>\
    <p>\
      <span class="title">'+file_name.split('\\').pop()+'</span>\
      </br>\
      <span class="grey-text full_name">'+file_name+'</span>\
      <i class="material-icons secondary-content scale-transition scale-out file_remove">close</i>\
    </p>\
  </li>'
}

function assetFolder_html(asset_folder_name)
{
  return '<li class="asset_folder_item collection-item avatar">\
    <i class="material-icons circle gree">folder_open</i>\
    <p>\
      <span class="title">'+asset_folder_name.split('\\').pop()+'</span>\
      </br>\
      <span class="grey-text full_name">'+asset_folder_name+'</span>\
      <i class="material-icons secondary-content scale-transition scale-out asset_folder_remove">close</i>\
    </p>\
  </li>'
}
