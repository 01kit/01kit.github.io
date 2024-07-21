'use strict';

async function _fetchItems() {
  const response = await fetch("/p/wy/data/w.json")
  const data = await response.json();
  return data.items;
}

async function _fetchItem(id) {
  const items = await _fetchItems();
  const item = items.filter(o => o.id === id)[0];
  return item;
}

async function _fetchCarts() {
  try {
    const carts = JSON.parse(window.localStorage.getItem('carts'));

    if (!Array.isArray(carts)) {
      return []
    }

    return carts;
  } catch {
    return []
  }
}
async function _addCart(item) {
  let carts = await _fetchCarts();

  const itemIsExist = carts.filter(o => o.id === item.id)[0];
  if (itemIsExist) {
    carts = carts.map(o => {
      if (o.id === item.id) {
        o.num += item.num;
      }

      return o;
    })
  } else {
    carts.unshift(item);
  }

  window.localStorage.setItem('carts', JSON.stringify(carts));
}
async function _removeCart(item) {
  const carts = await _fetchCarts();

  window.localStorage.setItem('carts', JSON.stringify(carts.filter(o => o.id !== item.id)));
}


async function _fetchPointsItems() {
  const response = await fetch("/p/wy/data/jdecard.json")
  const data = await response.json();
  return data.items;
}

async function _fetchPointsItem(id) {
  const items = await _fetchPointsItems();
  const item = items.filter(o => o.id === id)[0];
  return item;
}


const _http = {
  fetchItems: _fetchItems,
  fetchItem: _fetchItem,
  fetchCarts: _fetchCarts,
  addCart: _addCart,
  removeCart: _removeCart,
  fetchPointsItems: _fetchPointsItems,
  fetchPointsItem: _fetchPointsItem,
}
