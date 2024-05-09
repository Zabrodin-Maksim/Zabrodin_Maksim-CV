// License
// Creative Commons Attribution-NonCommercial-NoDerivs 4.0 International License

// This work is licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License. To view a copy of this license, visit http://creativecommons.org/licenses/by-nc-nd/4.0/ or send a letter to Creative Commons, PO Box 1866, Mountain View, CA 94042, USA.
// You are free to:
// - Share — copy and redistribute the material in any medium or format
// Under the following terms:
// - Attribution — You must give appropriate credit, provide a link to the license, and indicate if changes were made. You may do so in any reasonable manner, but not in any way that suggests the licensor endorses you or your use.
// - NonCommercial — You may not use the material for commercial purposes.
// - NoDerivatives — If you remix, transform, or build upon the material, you may not distribute the modified material.
// You are not allowed to apply legal terms or technological measures that legally restrict others from doing anything the license permits.


const swiperText = new Swiper('.swiper', {
	speed: 1600,
    slidesPerView: 3,
    spaceBetween: 30,
	mousewheel: {  },
	pagination: {
		el: '.swiper-pagination',
		clickable: true
	},
	navigation: {
		prevEl: '.swiper-button-prev',
		nextEl: '.swiper-button-next'
	}
})

function scrollToElement(elementId, offset) {
    const targetElement = document.getElementById(elementId);
    if (targetElement) {
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset + offset;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
    }
}

document.querySelector('a[href="#Info"]').addEventListener('click', function(e) {
    e.preventDefault();
    scrollToElement('Info', -200);
});

document.querySelector('a[href="#Education"]').addEventListener('click', function(e) {
    e.preventDefault();
    scrollToElement('Education', -280);
});

document.querySelector('a[href="#Courses"]').addEventListener('click', function(e) {
    e.preventDefault();
    scrollToElement('Courses', -300);
});

document.querySelector('a[href="#projects"]').addEventListener('click', function(e) {
    e.preventDefault();
    scrollToElement('projects', -130);
});