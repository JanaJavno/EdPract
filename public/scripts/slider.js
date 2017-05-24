let slideIndex = 1;

showSlides(slideIndex);

function plusSlides(n) {
    showSlides(slideIndex += n);
    clearInterval(timer);
    timer = setInterval(slideTime, 8000);
}

function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {
    const slides = document.getElementsByClassName('slides');
    if (n > slides.length) {
        slideIndex = 1;
    }
    if (n < 1) {
        slideIndex = slides.length;
    }
    for (let i = 0; i < slides.length; i += 1) {
        slides[i].style.display = 'none';
    }
    slides[slideIndex - 1].style.display = 'block';
}

function slideTime(n) {
    n = 1;
    showSlides(slideIndex += n);
}

let timer = setInterval(slideTime, 8000);

function sliderInit(articles) {
    const slider = document.getElementById('slider');
    const image = slider.getElementsByTagName('img');
    const tag = slider.querySelectorAll('.tag-slider');
    const header = slider.querySelectorAll('.header-slider');
    const description = slider.querySelectorAll('.description-slider');
    for (let i = 0; i < articles.length; i += 1) {
        image[i].src = articles[i].picture;
        tag[i].innerHTML = articles[i].tags[0];
        header[i].innerHTML = `<p> ${articles[i].title} </p>`;
        description[i].innerHTML = `<p> ${articles[i].summary} </p>`;
    }
}
