import React, { Component } from "react";
import { Router, Route, hashHistory } from "react-router";

import "../ToDoList.css";
import New from "./New";
import List from "./List";
import LeftItems from "./LeftItems";
import ListSelector from "./ListSelector";
import GlobalAction from "./GlobalAction";
import { storeGet, storeSave } from "../utils/Store";
import { Search } from "../utils/Search";
import { removeSpaces } from "../utils/IsBlank";
import checkList from "../assets/checklist.gif";
import everyDay from "../assets/everyday.gif";
import success from "../assets/success.gif";

let reloadCounter = 0;

const routeComponent = function(type, context) {
  return (
    <div className="panel panel-default">
      <div className="panel-body">
        <List
          type={type}
          items={Search(context.state.items, context.state.search)}
          checkItem={context.checkItem}
          deleteItem={context.deleteItem}
          editItem={context.editItem}
        />
      </div>

      <div className="panel-footer">
        <LeftItems value={context.state.leftCount} />
        <ListSelector active={type} />

        <GlobalAction
          deleteCompleted={context.deleteCompleted}
          checkAll={context.checkAll}
        />
      </div>
    </div>
  );
};

class ToDoList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: "",
      items: storeGet() === null ? [] : storeGet(),
      leftCount: this.countLeft(storeGet())
    };

    this.checkItem = this.checkItem.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
    this.editItem = this.editItem.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
    this.deleteCompleted = this.deleteCompleted.bind(this);
    this.checkAll = this.checkAll.bind(this);
  }

  countLeft(items) {
    let count = 0;

    if (items === undefined || items === null) {
      count = 0;
    } else {
      for (let i = 0; i < items.length; i++) {
        if (!items[i].checked) {
          count++;
        }
      }
    }
    return count;
  }

  handleAdd(item) {
    function listItem(num, text) {
      return {
        id: num,
        value: removeSpaces(text),
        checked: false
      };
    }

    let newId = 0;
    let itemsList = this.state.items;

    if (itemsList[itemsList.length - 1] !== undefined) {
      newId = itemsList[itemsList.length - 1].id + 1;
    } else {
      newId = 1;
    }

    var newItem = new listItem(newId, item);
    itemsList.push(newItem);

    this.setState({ items: itemsList });
    this.setState({ leftCount: this.countLeft(itemsList) });
    storeSave(this.state.items);
    reloadCounter++;
  }

  checkItem(id) {
    let itemsList = this.state.items;
    for (let i = 0; i < itemsList.length; i++) {
      if (itemsList[i].id === id) {
        itemsList[i].checked = !itemsList[i].checked;
      }
    }
    this.setState({ items: itemsList });
    this.setState({ leftCount: this.countLeft(this.state.items) });
    storeSave(this.state.items);
    reloadCounter++;
  }

  deleteItem(id) {
    let itemsList = this.state.items;

    for (let i = 0; i < itemsList.length; i++) {
      if (itemsList[i].id === id) {
        itemsList.splice(i, 1);
      }
    }

    this.setState({ items: itemsList });
    this.setState({ leftCount: this.countLeft(this.state.items) });
    storeSave(this.state.items);
    reloadCounter++;
  }

  editItem(id, value) {
    let itemsList = this.state.items;

    for (let i = 0; i < itemsList.length; i++) {
      if (itemsList[i].id === id) {
        itemsList[i].value = value;
      }
    }

    this.setState({ items: itemsList });
    storeSave(this.state.items);
    reloadCounter++;
  }

  deleteCompleted() {
    let itemsList = this.state.items;

    for (let i = 0; i < itemsList.length; i++) {
      if (itemsList[i].checked) {
        itemsList.splice(i, 1);
        i -= 1;
      }
    }

    this.setState({ items: itemsList });
    this.setState({ leftCount: this.countLeft(itemsList) });
    storeSave(this.state.items);
    reloadCounter++;
  }

  checkAll() {
    let itemsList = this.state.items;

    for (let i = 0; i < itemsList.length; i++) {
      itemsList[i].checked = true;
    }

    this.setState({ items: itemsList });
    this.setState({ leftCount: this.countLeft(itemsList) });
    storeSave(this.state.items);
    reloadCounter++;
  }

  render() {
    return (
      <section>
        <img src={checkList} alt="" width="150" height="150" />
        <img src={everyDay} alt="" width="150" height="150" />
        <img src={success} alt="" width="150" height="150" />
        <New handleAdd={this.handleAdd} />

        <Router history={hashHistory} key={reloadCounter}>
          <Route path="/" component={() => routeComponent("all", this)} />
          <Route
            path="/active"
            component={() => routeComponent("active", this)}
          />
          <Route
            path="/completed"
            component={() => routeComponent("completed", this)}
          />
        </Router>
      </section>
    );
  }
}

export default ToDoList;
