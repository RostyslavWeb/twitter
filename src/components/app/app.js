import React, { Component } from "react";

import AppHeader from "../app-header";
import SearchPanel from "../search-panel";
import PostStatusFilter from "../post-status-filter";
import PostList from "../post-list";
import PostAddForm from "../post-add-form";

import './app.css';

export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: [
        { label: 'First post', important: true, like: false, id: 1 },
        { label: 'Second post', important: false, like: false, id: 2 },
        { label: 'Third post', important: false, like: false, id: 3 }
      ],
      term: '',
      filter: 'all'
    };
    this.deleteItem = this.deleteItem.bind(this);
    this.addItem = this.addItem.bind(this);
    this.onToggleImportant = this.onToggleImportant.bind(this);
    this.onToggleLiked = this.onToggleLiked.bind(this);
    this.onUpdateSearch = this.onUpdateSearch.bind(this);
    this.onFilterSelect = this.onFilterSelect.bind(this);
    this.onChangeState = this.onChangeState.bind(this);

    this.maxId = 4;
  }

  deleteItem(id) {
    this.setState(({ data }) => {
      const index = data.findIndex(elem => elem.id === id)

      const newArr = [...data.slice(0, index), ...data.slice(index + 1)];

      return {
        data: newArr
      }
    });
  }

  addItem(body) {
    const newItem = {
      label: body,
      important: false,
      id: this.maxId++
    }
    this.setState(({ data }) => {
      const newArr = [...data, newItem];
      return {
        data: newArr
      }
    });
  }

  onChangeState(id, property) {
    this.setState(({ data }) => {
      return {
        data: data.map((item) => {
          const newItem = { ...item }; //клонируем item в локальной области вид-ти
          if (item.id === id) {
            newItem[property] = !newItem[property]; //меняем property на противоположное
          }
          return newItem; //обязательно вернуть новый item
        }),
      };
    });
  }

  onToggleImportant(id) {
    this.onChangeState(id, 'important');
  }

  onToggleLiked(id) {
    this.onChangeState(id, 'like');
  }

  searchPost(items, term) { //returns array posts
    if (term.length === 0) {
      return items
    }

    return items.filter((item) => item.label.includes(term));
  }


  filterPost(items, filter) {
    if (filter === 'like') {
      return items.filter(item => item.like)
    } else {
      return items
    }
  }

  onUpdateSearch(term) {
    this.setState({ term })
  }

  onFilterSelect(filter) {
    this.setState({ filter })
  }

  render() {
    const { data, term, filter } = this.state;

    const liked = data.filter(item => item.like).length;
    const allPosts = data.length;

    const visiblePosts = this.filterPost(this.searchPost(data, term), filter);

    return (
      <div className="app">
        <AppHeader
          liked={liked}
          allPosts={allPosts} />
        <div className="search-panel d-flex">
          <SearchPanel
            onUpdateSearch={this.onUpdateSearch} />
          <PostStatusFilter
            filter={filter}
            onFilterSelect={this.onFilterSelect} />
        </div>
        <PostList
          posts={visiblePosts}
          onDelete={this.deleteItem}
          onToggleImportant={this.onToggleImportant}
          onToggleLiked={this.onToggleLiked} />
        <PostAddForm
          onAdd={this.addItem} />
      </div>
    )
  }
}
