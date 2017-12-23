"use strict";

class TodoList
{
  constructor(name)
  {
    this.name = name
    this.list = [];
  }
}

class TodoItem
{
  constructor(name)
  {
    this.name = name;
    this.status = TodoItem.NEW;
  }

  //Methods for changing state
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
var TodoItem.NEW = 'NEW';
var TodoItem.ACTIVE = 'ACTIVE';
var TodoItem.COMPLETE = 'COMPLETE';
