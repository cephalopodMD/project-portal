'use strict';

var todo_item_html = function(todo_item)
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
            <span class="title">'+todo_item.title+'</span>\
            </br>\
            '+todo_item.description+'\
          </p>\
          <i class="material-icons secondary-content scale-transition scale-out edit">mode_edit</i>\
        </li>'
}

var project_html = function(project)
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
