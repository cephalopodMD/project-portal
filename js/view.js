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
        <li class="collection-item grey darken-3 waves-effect waves-light project">\
          <i class="material-icons">'+randomIcon(project.title)+'</i>\
          <span class="title">'+project.title+'</span>\
          <i class="material-icons white-text secondary-content scale-transition scale-out project_remove" style="margin-left: auto; margin-right: 0;">close</i>\
        </li>'
  return result;
}

function fileHtml(file_name)
{
  return '<li href="#" class="file_item collection-item avatar">\
    <i class="material-icons circle '+randomColor(file_name)+'">'+randomIcon(file_name)+'</i>\
    <p>\
      <span class="title">'+file_name.split('\\').pop()+'</span>\
      </br>\
      <span class="grey-text full_name">'+file_name+'</span>\
      <i class="material-icons secondary-content scale-transition scale-out file_remove">close</i>\
    </p>\
  </li>'
}

function assetFolderHtml(asset_folder_name)
{
  return '<li class="asset_folder_item collection-item avatar">\
    <i class="material-icons circle '+randomColor(asset_folder_name)+'">'+randomIcon(asset_folder_name)+'</i>\
    <p>\
      <span class="title">'+asset_folder_name.split('\\').pop()+'</span>\
      </br>\
      <span class="grey-text full_name">'+asset_folder_name+'</span>\
      <i class="material-icons secondary-content scale-transition scale-out asset_folder_remove">close</i>\
    </p>\
  </li>'
}

const colors = [
  'red', 'green', 'pink', 'purple',
  'deep-purple', 'indigo', 'blue', 'lightblue',
  'cyan', 'teal', 'green', 'light-green',
  'lime', 'yellow', 'amber', 'orange', 'deep-orange'
]
function randomColor(seed)
// Generates a random material design color by hashing and modding a seed
{
  var hash = Math.abs( seed.hashCode() );
  var i = hash % colors.length
  return colors[i]
}

const icons = [
  'album', 'all_inclusive', 'beach_access', 'brightness_medium',
  'camera', 'explore', 'extension', 'filter_drama',
  'layers', 'palette', 'terrain', 'thumb_up',
  'toys', 'whatshot'
]
function randomIcon(seed)
// Generates a random material design color by hashing and modding a seed
{
  var hash = Math.abs( seed.hashCode() );
  var i = hash % icons.length
  return icons[i]
}

String.prototype.hashCode = function() {
  var hash = 0, i, chr;
  if (this.length === 0) return hash;
  for (i = 0; i < this.length; i++) {
    chr   = this.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};
