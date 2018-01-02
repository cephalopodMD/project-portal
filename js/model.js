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
        this.todo_id_count = local.todo_id_count;
      } catch (e) {
        this.init(title);
      }
    }
  }

  save()
  {
    localStorage.setItem( 'project_portal:'+this.title, JSON.stringify(this) );
  }

  remove()
  {
    localStorage.removeItem( 'project_portal:'+this.title );
  }

  init(title)
  {
    this.title = title;
    this.file_list = [];
    this.folder_list = [];
    this.todos = {};
    this.todo_id_count = 0;

    this.save()
  }

  addTodo( todo )
  {
    if ( todo.id == 0 || !this.todos.hasOwnProperty(todo.id) )
    {
      todo.id = ++this.todo_id_count;
      this.todos[todo.id] = todo;
    }
    else {
      var old_todo = this.todos[todo.id];
      old_todo.title = todo.title;
      old_todo.description = todo.description;
    }
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
  constructor(id, title, description)
  {
    this.id = id;
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
