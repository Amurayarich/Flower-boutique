document.addEventListener('DOMContentLoaded', () => {
  const addToCartButtons = document.querySelectorAll('.add-to-cart');
  const basketCounter = document.querySelector('.basket-count');
  let basketCount = localStorage.getItem('basketCount') ? parseInt(localStorage.getItem('basketCount')) : 0;
  let basketItems = localStorage.getItem('basketItems') ? JSON.parse(localStorage.getItem('basketItems')) : {};

  basketCounter.textContent = basketCount;
  if (basketCount === 0) {
      basketCounter.style.display = 'none';
  } else {
      basketCounter.style.display = 'block';
  }

  addToCartButtons.forEach(button => {
      button.addEventListener('click', addCart);
  });

  function addCart(event) {
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
      basketCounter.textContent = basketCount;
      basketCounter.style.display = 'block';
      localStorage.setItem('basketCount', basketCount);
      localStorage.setItem('basketItems', JSON.stringify(basketItems));

      const originalText = event.target.textContent;
      event.target.textContent = 'Добавлено!';
      event.target.disabled = true;

      setTimeout(() => {
          event.target.textContent = originalText;
          event.target.disabled = false;
      }, 1500);
  }

  // Отображение товаров в корзине
  const basketItemsContainer = document.getElementById('basket-items');
  const basketTotalElement = document.getElementById('basket-total');
  let totalPrice = 0;

  for (const itemId in basketItems) {
      const item = basketItems[itemId];
      const itemElement = document.createElement('div');
      itemElement.classList.add('basket__item');
      itemElement.setAttribute('data-id', itemId);

      const itemInfo = document.createElement('div');
      itemInfo.classList.add('basket__item-info');

      const itemImage = document.createElement('img');
      itemImage.classList.add('basket__item-image');
      itemImage.src = `/img/${itemId}.png`; 

      const itemTitle = document.createElement('div');
      itemTitle.classList.add('basket__item-title');
      itemTitle.textContent = item.title;

      itemInfo.appendChild(itemImage);
      itemInfo.appendChild(itemTitle);

      const itemQuantity = document.createElement('div');
      itemQuantity.classList.add('basket__item-quantity');

      const quantityInput = document.createElement('input');
      quantityInput.type = 'number';
      quantityInput.value = item.quantity;
      quantityInput.min = 1;
      quantityInput.addEventListener('change', (event) => {
          const newQuantity = parseInt(event.target.value);
          const quantityDifference = newQuantity - basketItems[itemId].quantity;
          basketItems[itemId].quantity = newQuantity;
          localStorage.setItem('basketItems', JSON.stringify(basketItems));
          updateTotalPrice();
          updateBasketCount(quantityDifference);
      });

      const removeButton = document.createElement('button');
      removeButton.classList.add('basket__item-remove');
      removeButton.textContent = 'Удалить';
      removeButton.addEventListener('click', () => {
          const quantityToRemove = basketItems[itemId].quantity;
          delete basketItems[itemId];
          localStorage.setItem('basketItems', JSON.stringify(basketItems));
          itemElement.remove();
          updateTotalPrice();
          updateBasketCount(-quantityToRemove);
      });

      itemQuantity.appendChild(quantityInput);
      itemQuantity.appendChild(removeButton);

      itemElement.appendChild(itemInfo);
      itemElement.appendChild(itemQuantity);

      basketItemsContainer.appendChild(itemElement);

      totalPrice += item.quantity * item.price;
  }

  function updateTotalPrice() {
      totalPrice = 0;
      for (const itemId in basketItems) {
          totalPrice += basketItems[itemId].quantity * basketItems[itemId].price;
      }
      basketTotalElement.textContent = `Итоговая цена: ${totalPrice} руб.`;
  }

  function updateBasketCount(quantityDifference) {
      basketCount += quantityDifference;
      basketCounter.textContent = basketCount;
      localStorage.setItem('basketCount', basketCount);
      if (basketCount === 0) {
          basketCounter.style.display = 'none';
      } else {
          basketCounter.style.display = 'block';
      }
  }

  updateTotalPrice();

  const checkoutButton = document.getElementById('checkout-button');
  checkoutButton.addEventListener('click', () => {
      alert('Заказ оформлен!');
      localStorage.removeItem('basketCount');
      localStorage.removeItem('basketItems');
      basketItemsContainer.innerHTML = '';
      basketTotalElement.textContent = 'Итоговая цена: 0 руб.';
      basketCounter.textContent = '0';
      basketCounter.style.display = 'none';
  });
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
