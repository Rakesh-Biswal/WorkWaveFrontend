
const mobileHamburger = document.getElementById('mobile-hamburger');
const mobileMenuSlider = document.getElementById('mobile-menu-slider');
const menuOverlay = document.getElementById('menu-overlay');
const closeSlider = document.getElementById('close-slider');

// Open the mobile slider and overlay
mobileHamburger.addEventListener('click', () => {
    document.getElementById('location-container').style.display = 'block';
    mobileMenuSlider.classList.add('mobile-menu-open');
    menuOverlay.classList.add('overlay-active');
});

// Close the slider with the close button or overlay click
closeSlider.addEventListener('click', () => {
    mobileMenuSlider.classList.remove('mobile-menu-open');
    menuOverlay.classList.remove('overlay-active');
});

// Close slider by clicking on the overlay
menuOverlay.addEventListener('click', () => {
    mobileMenuSlider.classList.remove('mobile-menu-open');
    menuOverlay.classList.remove('overlay-active');
});


const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

// Function to check if any part of the element is in the viewport
function isPartiallyInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top < (window.innerHeight || document.documentElement.clientHeight) &&
        rect.bottom >= 0
    );
}

// Function to trigger animation on partial visibility
function checkVisibility() {
    const servicesSection = document.querySelector('.services');

    // Check if any part of the section is visible
    if (isPartiallyInViewport(servicesSection)) {
        servicesSection.classList.add('in-view');
        // Remove the event listener after animation to prevent it from running multiple times
        window.removeEventListener('scroll', checkVisibility);
    }
}

// Add the scroll event listener to trigger the checkVisibility function
window.addEventListener('scroll', checkVisibility);

// Run the function once on page load to account for users who might already be scrolled down
checkVisibility();

document.getElementById('showMoreBtn').addEventListener('click', function () {
    const extraServices = document.querySelector('.extra-services');
    extraServices.style.display = 'grid';
    this.style.display = 'none';
});






