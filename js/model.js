"use strict";

class Project
{
  constructor(title)
  {
    var local = localStorage.getItem('project_portal:'+title);
    if ( local === null )
      this.init(title);
    else
    {
      try {
        local = JSON.parse(local);
        this.title = local.title;
        this.file_list = local.file_list;
        this.folder_list = local.folder_list;
        this.todos = local.todos;
      } catch (e) {
        this.init(title);
      }
    }
  }

  save()
  {
    localStorage.setItem( 'project_portal:'+this.title, JSON.stringify(this) );
  }

  init(title)
  {
    this.title = title;
    this.file_list = [];
    this.folder_list = [];
    this.todos = [];

    this.save()
  }

  addTodo( todo )
  {
    this.todos.push(todo);
    this.save();
  }

  addFile( file_name )
  {
    if ( !this.file_list.includes(file_name) )
      this.file_list.push( file_name );
    this.save();
  }

  addFolder( folder_name )
  {
    if ( !this.folder_list.includes(file_name) )
      this.folder_list.push( file_name );
    this.save();
  }
}

class TodoItem
{
  constructor(title, description)
  {
    this.title = title;
    this.description = description;
    this.status = TodoItem.NEW;
  }

  /***************************
  * Methods for changing state
  */
  setState(newState)
  {
    this.state = newState;
  }

  reset()
  {
    this.setState(TodoItem.NEW);
  }

  makeActive()
  {
    this.setState(TodoItem.ACTIVE);
  }

  complete()
  {
    this.setState(TodoItem.COMPLETE);
  }
}
TodoItem.NEW = 'NEW';
TodoItem.ACTIVE = 'ACTIVE';
TodoItem.COMPLETE = 'COMPLETE';
