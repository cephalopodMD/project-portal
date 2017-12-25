"use strict";

class Project
{
  constructor(name)
  {
    var local = localStorage.getItem('project_portal:'+this.name);
    if ( local === null )
      this.init(name);
    else
    {
      try {
        this.list = JSON.parse(local);
      } catch (e) {
        this.init(name);
      }
    }
  }

  save()
  {
    localStorage.setItem('project_portal:'+this.name, JSON.stringify(this.list));
  }

  init(name)
  {
    this.name = name;
    this.file_list = [];
    this.folder_list = [];
    this.todos = new TodoList();

    this.save()
  }

  addFile( file_name )
  {
    if ( !this.file_list.includes(file_name) )
      this.file_list.push( file_name );
  }

  addFolder( folder_name )
  {
    if ( !this.folder_list.includes(file_name) )
      this.folder_list.push( file_name );
  }
}

class ToDos
{
  constructor()
  {
    this.list = [];
  }

  add( item )
  {
    this.list.push(item);
  }
}

class TodoItem
{
  constructor(name)
  {
    this.name = name;
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
