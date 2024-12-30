const addtoCartButtons = document.querySelectorAll('.add-to-cart');
const basketCounter = document.querySelector('.basket-count');
let basketCount = localStorage.getItem('basketCount') ? parseInt(localStorage.getItem('basketCount')) : 0;

basketCounter.textContent = basketCount;
if (basketCount === 0) {
  basketCounter.style.display = 'none';
} else {
  basketCounter.style.display = 'block';
}

addtoCartButtons.forEach(button => {
  button.addEventListener('click', addCart);
});

function addCart(event) {
  basketCount++;
  basketCounter.textContent = basketCount;
  basketCounter.style.display = 'block';
  localStorage.setItem('basketCount', basketCount);
  
  const originalText = event.target.textContent;
  event.target.textContent = 'Добавлено!';
  event.target.disabled = true;
  
  setTimeout(() => {
    event.target.textContent = originalText;
    event.target.disabled = false;
  }, 1500);
}

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
