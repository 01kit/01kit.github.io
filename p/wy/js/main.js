(function () {
  "use strict";

  /**
   * Easy selector helper function
   */
  const select = (el, all = false) => {
    el = el.trim()
    if (all) {
      return [...document.querySelectorAll(el)]
    } else {
      return document.querySelector(el)
    }
  }

  /**
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all)
    if (selectEl) {
      if (all) {
        selectEl.forEach(e => e.addEventListener(type, listener))
      } else {
        selectEl.addEventListener(type, listener)
      }
    }
  }

  /**
   * Page init function
   */
  const pagesInit = {
    'page-home': async function () {
      const carts = await _http.fetchCarts();
      select('#carts-count').textContent = carts.length;

      on('click', '#btn-show-popup-contact-qr', function () {
        select('#popup-contact-qr').classList.remove('invisible');
      });
      on('click', '#btn-hide-popup-contact-qr', function () {
        select('#popup-contact-qr').classList.add('invisible');
      });

      const itemsElement = select('#items');

      if (!itemsElement) {
        return;
      }

      const items = await _http.fetchItems();

      let html = '';

      for (let i = 0, len = items.length; i < len; i += 1) {
        const item = items[i];
        html += `<a href="/p/wy/item?id=${item.id}">`;
        html += ` <div class="p-2 rounded-2xl shadow-lg bg-white relative">`;
        if ([17, 18].indexOf(item.id) > -1) {
          html += ` <img src="/p/wy/img/icon-jingxuan-1.png" class="w-8 absolute z-10 right-4 top-4" />`;
        }
        html += `   <img src="/p/wy/img/nopic.png" class="item-image w-2/3 mx-auto rounded-2xl" alt="loading..."  data-src="${item.image_thumbnail}" />`;
        html += `   <p class="mt-4 text-sm font-bold text-center">${item.short_name}</p>`;
        html += `   <p class="mt-2 text-sm text-center"><span class="text-xs pr-1">¥</span>${item.price}</p>`;
        html += ` </div>`;
        html += `</a>`;
      }

      if (!html) {
        return;
      }

      itemsElement.innerHTML = html;

      const observer = new IntersectionObserver((entries) => {
        for (let i of entries) {
          if (i.isIntersecting) {
            let img = i.target;
            let trueSrc = img.getAttribute("data-src");
            img.setAttribute("src", trueSrc);
            observer.unobserve(img);
          }
        }
      });
      select(".item-image", true).forEach(i => {
        observer.observe(i);
      })

      on('click', '#btn-show-popup-filter', function () {
        select('#popup-filter').classList.remove('invisible');
      });
      on('click', '#btn-hide-popup-filter', function () {
        select('#popup-filter').classList.add('invisible');
      });
      on('click', '.filter-item', function () {
        const sort = this.dataset.sort;

        let sortItems = [...items];

        if (sort === 'price-asc') {
          sortItems = sortItems.sort(function (prev, next) {
            return prev.price - next.price
          });
        } else if (sort === 'price-desc') {
          sortItems = sortItems.sort(function (prev, next) {
            return next.price - prev.price
          });
        }

        let html = '';

        for (let i = 0, len = sortItems.length; i < len; i += 1) {
          const sortItem = sortItems[i];
          html += `<a href="/p/wy/item?id=${sortItem.id}">`;
          html += ` <div class="p-2 rounded-2xl shadow-lg bg-white relative">`;
          if ([17, 18].indexOf(sortItem.id) > -1) {
            html += ` <img src="/p/wy/img/icon-jingxuan-1.png" class="w-8 absolute z-10 right-4 top-4" />`;
          }
          html += `   <img src="${sortItem.image_thumbnail}" class="w-2/3 mx-auto" />`;
          html += `   <p class="mt-4 text-sm font-bold text-center">${sortItem.short_name}</p>`;
          html += `   <p class="mt-2 text-sm text-center"><span class="text-xs pr-1">¥</span>${sortItem.price}</p>`;
          html += ` </div>`;
          html += `</a>`;
        }

        itemsElement.innerHTML = html;

        select('.filter-item', true).forEach(o => o.classList.remove('!bg-rose-500', 'text-white', 'font-bold'));
        this.classList.add('!bg-rose-500', 'text-white', 'font-bold');

        select('#popup-filter').classList.add('invisible');
      }, true);


    },
    'page-item': async function () {
      on('click', '#btn-show-popup-contact-qr', async function () {
        select('#popup-contact-qr').classList.remove('invisible');
      });
      on('click', '#btn-hide-popup-contact-qr', function () {
        select('#popup-contact-qr').classList.add('invisible');
      });

      const query = new URLSearchParams(window.location.href.split('?')[1]);

      const id = Number(query.get('id'));

      const item = await _http.fetchItem(id);

      if (!item) {
        return
      }

      select('#item-image').src = item.image;
      select('#item-name').textContent = item.name;
      select('#item-name-en').textContent = item.name_en;
      select('#item-price').textContent = item.price;
      select('#item-desc').textContent = item.desc;
      select('#item-country').textContent = item.country;
      select('#item-regions').textContent = item.regions;
      select('#item-cate').textContent = item.cate;
      select('#item-grapes').textContent = item.grapes;
      select('#item-vol').textContent = item.vol;
      select('#item-temperature').textContent = item.temperature;
      select('#item-volume').textContent = item.volume;

      const carts = await _http.fetchCarts();
      select('#carts-count').textContent = carts.length;

      let buyNum = 1;
      let totalPrice = item.price * buyNum;
      on('click', '#btn-show-popup-buy', function () {
        select('#popup-buy').classList.remove('invisible');
        select('#popup-buy-item-name').textContent = item.name;
        select('#popup-buy-num').textContent = buyNum;
        select('#popup-buy-total-price').textContent = totalPrice;
      });
      on('click', '#btn-hide-popup-buy', function () {
        select('#popup-buy').classList.add('invisible');
      });
      on('click', '#btn-minus-buy-num', function () {
        if (buyNum <= 1) {
          return
        }

        --buyNum;
        totalPrice = item.price * buyNum;

        select('#popup-buy-num').textContent = buyNum;
        select('#popup-buy-total-price').textContent = item.price * buyNum;
      });
      on('click', '#btn-plus-buy-num', function () {
        ++buyNum;
        totalPrice = item.price * buyNum;

        select('#popup-buy-num').textContent = buyNum;
        select('#popup-buy-total-price').textContent = totalPrice;
      });

      if (ClipboardJS.isSupported()) {
        on('click', '#btn-copy-buy-info', function () {
          let clipboard = new ClipboardJS('#btn-copy-buy-info', {
            text: function () {
              return `购买：${item.name}（${buyNum}瓶）；合计：${totalPrice}元`;
            },
          });

          clipboard.on("success", () => {
            clipboard.destroy();

            select('#toast-text').textContent = '复制成功！马上发给店长下单吧～';
            select('#toast').classList.remove('invisible');

            setTimeout(() => {
              select('#toast').classList.add('invisible');
              select('#toast-text').textContent = '';
            }, 2000);
          });
          clipboard.on("error", () => {
            // console.log('当前客户端暂不支持复制');

            clipboard.destroy();
          });
        });
      } else {
        select('#btn-copy-buy-info').classList.add('hidden');
      }

      on('click', '#btn-add-cart', async function () {
        await _http.addCart({ id: item.id, num: buyNum })
        const carts = await _http.fetchCarts();
        select('#carts-count').textContent = carts.length;

        select('#toast-text').textContent = '加入成功';
        select('#toast').classList.remove('invisible');

        setTimeout(() => {
          select('#toast').classList.add('invisible');
          select('#toast-text').textContent = '';
        }, 2000);
      });
    },
    'page-cart': async function () {
      on('click', '#btn-show-popup-contact-qr', async function () {
        select('#popup-contact-qr').classList.remove('invisible');
      });
      on('click', '#btn-hide-popup-contact-qr', function () {
        select('#popup-contact-qr').classList.add('invisible');
      });

      const carts = await _http.fetchCarts();

      if (!carts.length) {
        return;
      }

      const itemsElement = select('#carts');

      if (!itemsElement) {
        return;
      }

      let items = await _http.fetchItems();

      const cartItems = carts.map(o => {
        const item = items.filter(item => item.id === o.id)[0];

        o.name = item.name;
        o.short_name = item.short_name;
        o.image_thumbnail = item.image_thumbnail;
        o.price = item.price;

        return o;
      });

      let html = '';

      for (let i = 0, len = cartItems.length; i < len; i += 1) {
        const item = cartItems[i];
        html += `<div id="item-${item.id}" class="p-4 mb-4 rounded-2xl shadow-lg bg-white flex items-center justify-between">`;
        html += ` <div>`;
        html += `  <p class="checkbox text-neutral-200" data-id="${item.id}"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6"><path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clip-rule="evenodd" /></svg></p>`;
        html += ` </div>`;
        html += ` <div>`;
        html += `  <img src="${item.image_thumbnail}" class="item w-20 mx-auto" data-id="${item.id}" />`;
        html += ` </div>`;
        html += ` <div class="flex-1 text-left px-2">`;
        html += `  <p class="text-md font-bold">${item.short_name}</p>`
        html += `  <p class="mt-2 text-sm"><span class="pr-1 text-xs">¥</span>${item.price} × ${item.num}</p>`;
        html += ` </div>`;
        html += ` <div>`;
        html += `  <p class="btn-remove text-neutral-400" data-id="${item.id}"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4"><path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg></p>`;
        html += ` </div>`;
        html += `</div>`;
      }

      if (!html) {
        return;
      }

      itemsElement.innerHTML = html;


      select('#items-container').classList.remove('hidden');
      select('#empty-container').classList.add('hidden');

      on('click', '.item', function () {
        window.location.href = `/p/wy/item?id=${this.dataset.id}`;
      }, true);
      on('click', '.checkbox', function () {
        this.dataset.checked = this.dataset.checked === 'checked' ? '' : 'checked';

        this.classList.toggle('!text-rose-500');

        select('#total-price').textContent = computeTotalPrice();
      }, true);
      on('click', '.btn-remove', async function () {
        await _http.removeCart({ id: Number(this.dataset.id) });

        select(`#item-${this.dataset.id}`).remove();

        select('#total-price').textContent = computeTotalPrice();

        if (!select('.item')) {
          select('#items-container').classList.add('hidden');
          select('#empty-container').classList.remove('hidden');
        }
      }, true);

      on('click', '#btn-show-popup-settle', async function () {
        let html = '';

        select('.checkbox', true).forEach((element) => {
          if (Boolean(element.dataset.checked === 'checked')) {
            const item = cartItems.filter(o => o.id === Number(element.dataset.id))[0]

            html += `<p>${item.name}（${item.num}瓶）</p>`;
          }
        })

        if (!html) {
          showToast('请选择要结算的商品')

          return
        }

        select('#popup-settle-item-name').innerHTML = html;

        select('#popup-settle-total-price').textContent = computeTotalPrice();

        select('#popup-settle').classList.remove('invisible');
      });
      on('click', '#btn-hide-popup-settle', function () {
        select('#popup-settle').classList.add('invisible');
      });

      if (ClipboardJS.isSupported()) {
        on('click', '#btn-copy-settle-info', function () {
          let clipboard = new ClipboardJS('#btn-copy-settle-info', {
            text: function () {
              let arr = [];

              select('.checkbox', true).forEach((element) => {
                if (Boolean(element.dataset.checked === 'checked')) {
                  const item = cartItems.filter(o => o.id === Number(element.dataset.id))[0]

                  arr.push(`${item.name}（${item.num}瓶）`);
                }
              })

              return `购买：${arr.join('，')}；合计：${computeTotalPrice()}元`;
            },
          });

          clipboard.on("success", () => {
            clipboard.destroy();

            showToast('复制成功！马上发给店长下单吧～')
          });
          clipboard.on("error", () => {
            // console.log('当前客户端暂不支持复制');

            clipboard.destroy();
          });
        });
      } else {
        select('#btn-copy-settle-info').classList.add('hidden');
      }

      function computeTotalPrice() {
        let totalPrice = 0;

        select('.checkbox', true).forEach((element) => {
          if (Boolean(element.dataset.checked === 'checked')) {
            const item = cartItems.filter(o => o.id === Number(element.dataset.id))[0]
            totalPrice += item.price * item.num;
          }
        })

        return totalPrice;
      }

      function showToast(msg, delay = 1000) {
        select('#toast-text').textContent = msg;
        select('#toast').classList.remove('invisible');

        setTimeout(() => {
          select('#toast').classList.add('invisible');
          select('#toast-text').textContent = '';
        }, delay);
      }
    }
  }

  const page = select('body');
  (page && pagesInit[page.id]) ? pagesInit[page.id]() : console.log('can not init page');
})();