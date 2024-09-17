// Загрузка данных из файла и добавление товаров на страницу
fetch('http://server:8002/products/list')
    .then(response => response.json())
    .then((data) => {
        // Создание массива для отображения товаров
        const block = document.querySelector('.shop');
        for (let i = 0; i < data.length; i++) {
            const item = data[i];
            const div = document.createElement('div');
            div.setAttribute('class', 'shop__block');
            div.setAttribute('id', `product_${item.id}`);
            div.innerHTML = `
                    <div class="shop__block_image" onclick="openDialog('${item.id}')">
                        <img src="${item.icon_url}" alt="imageProduct" class="shop__block_image">
                    </div>
                    <div class="shop__block_content">
                        <div class="shop__price">
                            <p class="shop__price_new"><span>${item.price}</span> ₽</p>
                        </div>
                        <div class="shop__block_content-inner">
                            <p class="shop__block_name">${item.name}</p>
                            <button class="shop__block_btn" onclick="addToBasket('${item.id}')">В корзину</button>
                        </div>
                    </div>
            `;
            block.appendChild(div);
        }

        openProductFromUrl();
    });

const basket = [];

fetch("http://server:8002/baskets/robot")
    .then(response => response.json())
    .then(data => {
        for (const pos of data.positions) {
            basket.push(pos.product_id);
        }
        updateBuyButtons();
    });


function addToBasket(id) {
    fetch("http://server:8002/baskets/robot/update",{
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "product_id": id,
            "amount": 1
        })
    })
        .then(response => response.json())
        .then(data => {
            setBuyButton(id);
        })
}


function openDialog(id) {
    document.querySelector('#dialog').innerHTML = '';
    fetch(`http://server:8002/products/${id}`)
        .then(response => response.json())
        .then(data => {
            const elemTitle = document.querySelector('.shop__dialog_content-text');
            elemTitle.querySelector("h1").innerText = data.name;
            elemTitle.querySelector("h2").innerText = data.description;

            document.querySelector(".shop__dialog_image img").src = data.image_url;

            document.querySelector(".shop__dialog_content-priceBtn .shop__price_new").innerText = `${data.price} ₽`;
        });

    let dialogHTML = `
         <div class="shop__dialog">
            <div class="shop__dialog_image">
                <img src="" alt="cookie">
            </div>
            <div class="shop__dialog_content">
                <div class="shop__dialog_content-text">
                    <h1></h1>
                    <h2></h2>
                </div>
                <div class="shop__dialog_content-priceBtn">
                    <div class="shop__price">
                        <h3 class="shop__price_new">₽</h3>
                    </div>
                    <button type="button" onclick="addToBasket('${id}'); window.dialog.close();">Купить</button>
                </div>
            </div>
        </div>
        <button onclick="window.dialog.close();" aria-label="close" class="x">❌</button>
    `;
    document.querySelector('#dialog').innerHTML += dialogHTML;
    window.dialog.showModal();
}

function updateBuyButtons() {
    for (const id of basket) {
        setBuyButton(id);
    }
}

function setBuyButton(id) {
    const btn = document.querySelector(`#product_${id} .shop__block_btn`);
    btn.innerText = "В корзине";
    btn.onclick = () => goToBasket();
}

function goToBasket() {
    console.log("Go to basket");
    window.location.href = "cart.html";
}

function openProductFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("product_id");

    if (productId == null) {
        return;
    }

    openDialog(productId);
}
