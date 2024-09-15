positions = []

fetch("http://127.0.0.1:8000/baskets/robot")
    .then(response => response.json())
    .then(data => {
        positions = data.positions;
        const cart = document.querySelector('.cart');
        for (const pos of data.positions) {
            cart.innerHTML += `<div id="pos_${pos.product_id}" class="cart__block">
                        <div class="cart__block_image">
                                <img src="" alt="imageProductCart" class="cart__block_image">
                        </div>
                        <div class="cart__block_block1">
                            <p class="cart__block_text"></p>
                            <div class="cart__block_block2">
                                <p class="cart__block_price">${Math.round(pos.total_price)} ₽</p>
                                <div class="cart__block_quantity">
                                    <button class="cart__block_quantity-btn cart__block_quantity-minus" 
                                    onclick="updateAmount('${pos.product_id}', -1)">-</button>
                                    <p class="cart__block_quantity-text">${pos.amount}</p>
                                    <button class="cart__block_quantity-btn cart__block_quantity-plus" 
                                    onclick="updateAmount('${pos.product_id}', 1)">+</button>
                                </div>
                            </div>
                        </div>
                     </div>`;
            fetch(`http://127.0.0.1:8000/products/${pos.product_id}`)
                .then(response => response.json())
                .then(product => {
                    const pos = document.querySelector(`#pos_${product.id}`);
                    pos.querySelector("img").src = product.icon_url;
                    pos.querySelector(".cart__block_text").innerText = product.name;
                });
        }

        cart.innerHTML += `<div class="cart__total">
                    <div class="cart__total_line"></div>
                    <div class="cart__total_inner">
                        <p class="cart__total_inner-price">Итого: <span>${data.total_price}₽</span></p>
                        <button class="cart__total_inner-btn">Оформить заказ</button>
                    </div>
                 </div>
                 <button class="cart__btnClear">Очистить корзину</button>`;

        const btnClear = document.querySelector('.cart__btnClear');
        btnClear.addEventListener('click', function ()  {
            if (positions.length === 0) {
                return;
            }

            // document.querySelector('.cart').innerHTML = ``;


            for (const pos of positions) {
                updateAmount(pos.product_id, 0, true);
            }
        });
    });

// let arrayOfProducts = JSON.parse(localStorage.getItem('products'));
// if (arrayOfProducts) {
//     let dataHTML = '';
//     let totalPrice = 0;
//
//     for (let i = 0; i < arrayOfProducts.length; i++) {
//         const product = arrayOfProducts[i];
//
//         dataHTML += `<div class="cart__block">
//                         <div class="cart__block_image">
//                                 <img src="${product.image}" alt="imageProductCart" class="cart__block_image">
//                         </div>
//                         <div class="cart__block_block1">
//                             <p class="cart__block_text">${product.name}</p>
//                             <div class="cart__block_block2">
//                                 <p class="cart__block_price">${product.price} ₽</p>
//                                 <div class="cart__block_quantity">
//                                     <button class="cart__block_quantity-btn cart__block_quantity-minus"
//                                     onclick="addToCart(this, ${product.count}, ${i}, 'remove')">-</button>
//                                     <p class="cart__block_quantity-text">${product.count}</p>
//                                     <button class="cart__block_quantity-btn cart__block_quantity-plus"
//                                     onclick="addToCart(this, ${product.count}, ${i}, 'add')">+</button>
//                                 </div>
//                             </div>
//                         </div>
//                      </div>`;
//         totalPrice += parseFloat(product.price) * parseFloat(product.count);
//     }
//
//     dataHTML += `<div class="cart__total">
//                     <div class="cart__total_line"></div>
//                     <div class="cart__total_inner">
//                         <p class="cart__total_inner-price">Итого: <span>${totalPrice} ₽</span></p>
//                         <button class="cart__total_inner-btn">Оформить заказ</button>
//                     </div>
//                  </div>
//                  <button class="cart__btnClear">Очистить корзину</button>`;
//
//     document.querySelector('.cart').innerHTML += dataHTML;
//     // addAndRemoveToCart(arrayOfProducts);
// }



function updateAmount(id, amount, updateElement = true) {
    const pos = positions.find(p => p.product_id === id);
    if (pos === undefined) {
        return;
    }

    const newAmount = amount === 0 ? 0 : pos.amount + amount;
    fetch ("http://127.0.0.1:8000/baskets/robot/update", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "product_id": id,
            "amount": newAmount
        }),
    })
        .then(response => response.json())
        .then(data => {
            if (typeof data?.detail === 'string' ) {
                return;
            }

            if (updateElement) {
                const element = document.querySelector(`#pos_${id}`);
                if (newAmount === 0) {
                    element.remove();
                    positions.splice(positions.indexOf(pos), 1);
                }
                else {
                    element.querySelector(".cart__block_quantity-text").innerText = newAmount;
                    element.querySelector(".cart__block_price").innerText = `${data.position_price}  ₽`;
                    pos.amount = newAmount;
                }

                document.querySelector(".cart__total_inner-price").innerHTML = `Итого: <span>${data.total_price} ₽</span>`;
            }
        });
}

const btnCheck = document.querySelectorAll('.cart__total_inner-btn');
for (const itemCheck of btnCheck) {
    itemCheck.addEventListener('click', function () {
        console.log('Вы почти купили это товары');
        console.log(JSON.parse(localStorage.getItem('products')));
    });
}


function addToCart(btn, count, index, type) {
    // console.log(count);
    const productCounter = btn.closest('.cart__block_quantity');
    const quantity = productCounter.querySelector('.cart__block_quantity-text');

    if (type === 'add') count++;
    else count--;

    arrayOfProducts[index].count = count;
    let products = JSON.parse(localStorage.getItem('products'));
    products[index].count = count;

    // Удаление объекта если значение '0' (надо будет поправить, херня потому что)
    if (count === 0) {
        console.log(products);
        removeObjectWithId(products, index+1);
    }

    console.log(products[index]);
    localStorage.setItem('products', JSON.stringify(products));
    location.reload();

    quantity.textContent = quantity.textContent.replace(quantity.textContent, count.toString());
}

function removeObjectWithId(arr, id) {
    const objWithIdIndex = arr.findIndex((obj) => obj.id === id);

    if (objWithIdIndex > -1) {
        arr.splice(objWithIdIndex, 1);
    }

    return arr;
}