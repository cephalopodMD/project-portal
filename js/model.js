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
        this.title              = local.title;
        this.file_list          = local.file_list;
        this.asset_folder_list  = local.asset_folder_list;
        this.todo_id_count      = local.todo_id_count;
        this.todos              = {}
        for ( var id in local.todos )
          this.todos[id] = new TodoItem(local.todos[id]);
      } catch (e) {
        this.init(title);
      }
    }
  }

  init(title)
  {
    this.title              = title;
    this.file_list          = [];
    this.asset_folder_list  = [];
    this.todos              = {};
    this.todo_id_count      = 0;

    this.save()
  }

  save()
  {
    localStorage.setItem( 'project_portal:'+this.title, JSON.stringify(this) );
  }

  remove()
  {
    localStorage.removeItem( 'project_portal:'+this.title );
  }

  addTodo( todo )
  {
    if ( todo.id == 0 || !this.todos.hasOwnProperty(todo.id) )
    {
      todo.id = ++this.todo_id_count;
      this.todos[todo.id] = todo;
    }
    else
    {
      var old_todo = this.todos[todo.id];
      old_todo.title = todo.title;
      old_todo.description = todo.description;
    }
    this.save();
  }

  removeTodoByID( id )
  {
    delete this.todos[id];
  }

  addFile( file_name )
  {
    if ( !this.file_list.includes(file_name) )
    {
      this.file_list.push( file_name );
      this.save();
      return true;
    }
    return false;
  }

  removeFile( file_name )
  {
    this.file_list = this.file_list.filter(e => e !== file_name);
    this.save();
  }

  addFolder( folder_name )
  {
    if ( !this.asset_folder_list.includes(folder_name) )
    {
      this.asset_folder_list.push( folder_name );
      this.save();
      return true;
    }
    return false;
  }

  removeFolder( folder_name )
  {
    this.asset_folder_list = this.asset_folder_list.filter(e => e !== folder_name);
    this.save();
  }
}

class TodoItem
{
  constructor(id, title, description)
  {
    if( id !== null && title === undefined && description === undefined )
    {
      this.id = id.id;
      this.title = id.title;
      this.description = id.description;
      this.status = id.status;
    }
    else
    {
      this.id = id;
      this.title = title;
      this.description = description;
      this.status = TodoItem.NEW;
    }
  }

  /***************************
  * Methods for managing state
  */
  setState(newState)
  {
    this.status = newState;
  }

  makeNew()
  {
    this.setState(TodoItem.NEW);
  }

  makeActive()
  {
    this.setState(TodoItem.ACTIVE);
  }

  makeComplete()
  {
    this.setState(TodoItem.COMPLETE);
  }
}
TodoItem.NEW = 'NEW';
TodoItem.ACTIVE = 'ACTIVE';
TodoItem.COMPLETE = 'COMPLETE';
