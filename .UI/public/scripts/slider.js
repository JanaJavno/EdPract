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
    let slides = document.getElementsByClassName("slides");
    if (n > slides.length) {
        slideIndex = 1;
    }
    if (n < 1) {
        slideIndex = slides.length;
    }
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    slides[slideIndex - 1].style.display = "block";
}
function slideTime(n) {
    n = 1;
    showSlides(slideIndex += n);
}
let  timer = setInterval(slideTime, 8000);
function sliderInit(){
    const slider = document.getElementById('slider');

}