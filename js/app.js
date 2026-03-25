// T PAVILIONS - JavaScript Principal

// Slider functionality
let sliderPositions = {
    slider1: 0,
    slider2: 0
};

function moveSlider(sliderId, direction) {
    const slider = document.getElementById(sliderId);
    const cards = Array.from(slider.querySelectorAll('.product-card'));
    
    // Agregar clase para animación
    slider.style.transition = 'transform 0.3s ease';
    
    // Animación de salida
    if (direction > 0) {
        slider.style.transform = 'translateX(-330px)';
        setTimeout(() => {
            // Mover primera card al final
            const firstCard = cards.shift();
            slider.appendChild(firstCard);
            slider.style.transition = 'none';
            slider.style.transform = 'translateX(0)';
            setTimeout(() => {
                slider.style.transition = 'transform 0.3s ease';
            }, 50);
        }, 300);
    } else {
        slider.style.transform = 'translateX(330px)';
        setTimeout(() => {
            // Mover última card al inicio
            const lastCard = cards.pop();
            slider.insertBefore(lastCard, slider.firstChild);
            slider.style.transition = 'none';
            slider.style.transform = 'translateX(0)';
            setTimeout(() => {
                slider.style.transition = 'transform 0.3s ease';
            }, 50);
        }, 300);
    }
}

// Touch/swipe support for mobile
let touchStartX = 0;
let touchEndX = 0;

function handleTouchStart(e) {
    touchStartX = e.touches[0].clientX;
}

function handleTouchEnd(e, sliderId) {
    touchEndX = e.changedTouches[0].clientX;
    handleSwipe(sliderId);
}

function handleSwipe(sliderId) {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swipe left - next
            moveSlider(sliderId, 1);
        } else {
            // Swipe right - prev
            moveSlider(sliderId, -1);
        }
    }
}

// Initialize touch events
document.addEventListener('DOMContentLoaded', function() {
    const sliders = document.querySelectorAll('.products-slider');
    
    sliders.forEach(slider => {
        slider.addEventListener('touchstart', handleTouchStart, { passive: true });
        slider.addEventListener('touchend', (e) => handleTouchEnd(e, slider.id), { passive: true });
    });
});

// Product click handler
function openProduct(productId) {
    console.log('Clicked product ID:', productId);
    console.log('Redirecting to:', `producto.html?id=${productId}`);
    
    // Guardar ID en sessionStorage como fallback
    sessionStorage.setItem('selectedProductId', productId);
    
    // Usar ruta relativa para funcionar con file://
    const relativeUrl = `producto.html?id=${productId}`;
    console.log('Relative URL:', relativeUrl);
    
    window.location.href = relativeUrl;
}

// WhatsApp integration
function openWhatsApp(productName, size) {
    const phoneNumber = '5491127641124'; // Número real del usuario
    const message = `Hola, quiero consultar por este producto:\n\nNombre: ${productName}\nTalle: ${size}`;
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}
