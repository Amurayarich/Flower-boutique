document.addEventListener('DOMContentLoaded', () => {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const basketCounter = document.querySelector('.basket-count');
    const basketItemsContainer = document.getElementById('basket-items');
    const basketTotalElement = document.getElementById('basket-total');
    const basketSummary = document.querySelector('.basket__summary');
    const checkoutButton = document.getElementById('checkout-button');
    const orderForm = document.getElementById('order-form');
    
    let basketCount = localStorage.getItem('basketCount') ? parseInt(localStorage.getItem('basketCount')) : 0;
    let basketItems = localStorage.getItem('basketItems') ? JSON.parse(localStorage.getItem('basketItems')) : {};
    let totalPrice = 0;

    // Инициализация отображения количества товаров в корзине
    function updateBasketDisplay() {
        basketCounter.textContent = basketCount;
        basketCounter.style.display = basketCount > 0 ? 'block' : 'none';
        if (basketItemsContainer && basketSummary) {
            basketSummary.style.display = Object.keys(basketItems).length > 0 ? 'block' : 'none';
        }
    }
    updateBasketDisplay();

    // Добавление товара в корзину
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const itemElement = event.target.closest('.catalog__item');
            const itemId = itemElement.getAttribute('data-id');
            const itemTitle = itemElement.querySelector('.catalog__item-title').textContent;
            const itemPrice = parseInt(itemElement.querySelector('.catalog__item-price').textContent.replace(' руб.', ''));

            if (basketItems[itemId]) {
                basketItems[itemId].quantity++;
            } else {
                basketItems[itemId] = {
                    title: itemTitle,
                    price: itemPrice,
                    quantity: 1
                };
            }

            basketCount++;
            localStorage.setItem('basketCount', basketCount);
            localStorage.setItem('basketItems', JSON.stringify(basketItems));
            updateBasketDisplay();

            const originalText = event.target.textContent;
            event.target.textContent = 'Добавлено!';
            event.target.disabled = true;
            setTimeout(() => {
                event.target.textContent = originalText;
                event.target.disabled = false;
            }, 1500);
        });
    });

    // Обновление итоговой цены
    function updateTotalPrice() {
        totalPrice = Object.values(basketItems).reduce((sum, item) => sum + item.price * item.quantity, 0);
        if (basketTotalElement) {
            basketTotalElement.textContent = `Итоговая цена: ${totalPrice} руб.`;
        }
    }
    updateTotalPrice();

    // Отображение товаров в корзине
    if (basketItemsContainer) {
        basketItemsContainer.innerHTML = '';
        for (const itemId in basketItems) {
            const item = basketItems[itemId];
            const itemElement = document.createElement('div');
            itemElement.classList.add('basket__item');
            itemElement.setAttribute('data-id', itemId);

            const itemInfo = `
                <div class="basket__item-info">
                    <img class="basket__item-image" src="/img/${itemId}.png" alt="${item.title}">
                    <div class="basket__item-title">${item.title}</div>
                </div>`;
            
            const itemQuantity = `
                <div class="basket__item-quantity">
                    <input type="number" value="${item.quantity}" min="1">
                    <button class="basket__item-remove">Удалить</button>
                </div>`;
            
            itemElement.innerHTML = itemInfo + itemQuantity;
            basketItemsContainer.appendChild(itemElement);

            const quantityInput = itemElement.querySelector('input');
            const removeButton = itemElement.querySelector('.basket__item-remove');

            // Обработчик изменения количества
            quantityInput.addEventListener('change', (event) => {
                const newQuantity = parseInt(event.target.value);
                const quantityDifference = newQuantity - basketItems[itemId].quantity;
                basketItems[itemId].quantity = newQuantity;
                localStorage.setItem('basketItems', JSON.stringify(basketItems));
                updateBasketDisplay();
                updateTotalPrice();
                basketCount += quantityDifference;
                localStorage.setItem('basketCount', basketCount);
            });

            // Обработчик удаления товара
            removeButton.addEventListener('click', () => {
                const quantityToRemove = basketItems[itemId].quantity;
                delete basketItems[itemId];
                localStorage.setItem('basketItems', JSON.stringify(basketItems));
                itemElement.remove();
                basketCount -= quantityToRemove;
                localStorage.setItem('basketCount', basketCount);
                updateBasketDisplay();
                updateTotalPrice();
            });
        }
    }

    // Переход к оформлению заказа
    if (checkoutButton) {
        checkoutButton.addEventListener('click', () => {
            window.location.href = '/html/form.html';
        });
    }

    if (orderForm) {
        orderForm.addEventListener('submit', async (event) => {
            event.preventDefault();
    
            const formData = new FormData(orderForm);
            const formObject = Object.fromEntries(formData.entries());
            formObject.bouquetItems = JSON.stringify(Object.values(basketItems).map(item => ({
                title: item.title,
                price: item.price,
                quantity: item.quantity
            })));
    
            try {
                const response = await fetch(orderForm.action, {
                    method: orderForm.method,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formObject)
                });
    
                if (response.ok) {
                    alert('Заказ успешно оформлен!');
                    localStorage.removeItem('basketCount');
                    localStorage.removeItem('basketItems');
                    window.location.href = '/index.html';
                } else {
                    alert('Ошибка при оформлении заказа');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Ошибка при оформлении заказа');
            }
        });
    }
});


//-----------------slider-------------------\\
// Получаем элементы слайдера
const slider = document.querySelector('.slider');
const prevButton = document.querySelector('.prev-button');
const nextButton = document.querySelector('.next-button');
const slides = Array.from(slider.querySelectorAll('img'));
const slideCount = slides.length;
let slideIndex = 0;

// Устанавливаем обработчики событий для кнопок
prevButton.addEventListener('click', showPreviousSlide);
nextButton.addEventListener('click', showNextSlide);

// Функция для показа предыдущего слайда
function showPreviousSlide() {
    slideIndex = (slideIndex - 1 + slideCount) % slideCount;
    updateSlider();
}

// Функция для показа следующего слайда
function showNextSlide() {
    slideIndex = (slideIndex + 1) % slideCount;
    updateSlider();
}

// Функция для обновления отображения слайдера
function updateSlider() {
    slides.forEach((slide, index) => {
        if (index === slideIndex) {
            slide.style.display = 'block';
        } else {
            slide.style.display = 'none';
        }
    });
}

// Инициализация слайдера
updateSlider();