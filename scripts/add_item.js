// Загрузка данных из файла и добавление товаров на страницу
fetch('./scripts/data.json')
    .then(response => response.json())
    .then((data) => {
        data = data.data;
        // Создание массива для отображения товаров
        const block = document.querySelector('.shop');
        for (let i = 0; i < data.length; i++) {
            const item = data[i];
            let textButton = 'В корзину';
            const div = document.createElement('div');
            div.setAttribute('class', 'shop__block');
            div.setAttribute('id', `${item.id}`);
            if (localStorage.getItem(`product${item.id}`) !== null) textButton = 'В корзине';
            div.innerHTML = `
                    <div class="shop__block_image" onclick="openDialog('${item.name}', '${item.price}', '${item.image}')">
                        <img src="${item.image}" alt="imageProduct" class="shop__block_image">
                    </div>
                    <div class="shop__block_content">
                        <div class="shop__price">
                            <p class="shop__price_new"><span>${item.price}</span> ₽</p>
                        </div>
                        <div class="shop__block_content-inner">
                            <p class="shop__block_name">${item.name}</p>
                            <button class="shop__block_btn">${textButton}</button>
                        </div>
                    </div>
            `;
            block.appendChild(div);
        }
        addToCart(data);
    });

let products;
if (localStorage.getItem('products')) products = JSON.parse(localStorage.getItem('products'));
else products = [];

function addToCart(data) {
    const buyButtons = document.querySelectorAll('.shop__block_btn');

    for (const buyButton of buyButtons) {
        buyButton.addEventListener('click', function() {
            buyButton.textContent = buyButton.textContent.replace(buyButton.textContent, 'в корзине');
            // Получить данные о товаре
            const product = this.closest('.shop__block');
            const productID = product.getAttribute('id');

            let counter;
            if (parseInt(localStorage.getItem(`product${productID}`))) {
                counter = parseInt(localStorage.getItem(`product${productID}`));
                counter++;
                localStorage.setItem(`product${productID}`, counter.toString());
            } else {
                counter = 1;
                localStorage.setItem(`product${productID}`, counter.toString());
            }


            for (const idProduct of data) {
                if (idProduct.id.toString() === productID.toString()) {
                    console.log(idProduct.name, idProduct.price);
                    idProduct.quantity -= 1;
                    if (idProduct.quantity <= -1) {
                        console.log('product not found');
                        return;
                    }
                    else {
                        console.log(idProduct.quantity, counter);
                        // Добавить товар в корзину
                        if (counter === 1) {
                            console.log('создаем новый товар');
                            const productData = {
                                id: idProduct.id,
                                name: idProduct.name,
                                price: idProduct.price,
                                image: idProduct.image,
                                count: counter,
                            };
                            console.log(products);
                            products.push(productData);
                            localStorage.setItem('products', JSON.stringify(products));
                        }
                    }
                }
            }
        });
    }
}

function openDialog(name, price, image) {
    document.querySelector('#dialog').innerHTML = '';
    console.log(name, price, image);
    let dialogHTML = `
         <div class="shop__dialog">
            <div class="shop__dialog_image">
                <img src="${image}" alt="cookie">
            </div>
            <div class="shop__dialog_content">
                <div class="shop__dialog_content-text">
                    <h1>${name}</h1>
                    <h2>вай конфетка</h2>
                </div>
                <div class="shop__dialog_content-priceBtn">
                    <div class="shop__price">
                        <h3 class="shop__price_new">${price} ₽</h3>
                    </div>
                    <button type="button">Купить</button>
                </div>
            </div>
        </div>
        <button onclick="window.dialog.close();" aria-label="close" class="x">❌</button>
    `;
    document.querySelector('#dialog').innerHTML += dialogHTML;
    window.dialog.showModal();
}