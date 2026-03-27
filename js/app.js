// T PAVILIONS - JavaScript Principal

// Slider functionality - Sistema cíclico profesional
let sliderPositions = {
    slider1: 0,
    slider2: 0
};

function moveSlider(sliderId, direction) {
    const slider = document.getElementById(sliderId);
    const allProducts = JSON.parse(localStorage.getItem('pavilions_products') || '[]');
    
    if (allProducts.length === 0) return;
    
    // Filtrar productos según el slider
    let filteredProducts;
    if (sliderId === 'slider1') {
        // Slider 1: Solo productos nuevos
        filteredProducts = allProducts.filter(product => {
            const categorias = product.categoriasSliders || {};
            return categorias.nuevo === true;
        });
    } else if (sliderId === 'slider2') {
        // Slider 2: Solo productos de temporada
        filteredProducts = allProducts.filter(product => {
            const categorias = product.categoriasSliders || {};
            return categorias.temporada === true;
        });
    }
    
    if (filteredProducts.length === 0) return;
    
    // Actualizar posición actual (solo dentro de productos filtrados)
    if (direction > 0) {
        sliderPositions[sliderId] = (sliderPositions[sliderId] + 1) % filteredProducts.length;
    } else {
        sliderPositions[sliderId] = (sliderPositions[sliderId] - 1 + filteredProducts.length) % filteredProducts.length;
    }
    
    // Obtener 3 productos desde la posición actual (solo de productos filtrados)
    const startIndex = sliderPositions[sliderId];
    const productosAMostrar = [];
    
    for (let i = 0; i < 3; i++) {
        const index = (startIndex + i) % filteredProducts.length;
        productosAMostrar.push(filteredProducts[index]);
    }
    
    // Animación profesional: fade out/in
    const cards = slider.querySelectorAll('.product-card');
    
    // Fade out de los productos actuales
    cards.forEach(card => {
        card.style.transition = 'opacity 0.2s ease';
        card.style.opacity = '0';
    });
    
    setTimeout(() => {
        // Cambiar productos con fade in
        slider.innerHTML = productosAMostrar.map((product) => {
            const primeraFoto = product.foto || (product.fotos && product.fotos.length > 0 ? product.fotos[0].data : '');
            const segundaFoto = product.fotos && product.fotos.length > 1 ? product.fotos[1].data : primeraFoto;
            return `
                <div class="product-card fade-in" data-product-id="${product.id}" onclick="openProduct('${product.id}')">
                    <div class="product-image-container">
                        <img src="${primeraFoto}" alt="${product.nombre}" class="product-img primary-img">
                        <img src="${segundaFoto}" alt="${product.nombre}" class="product-img secondary-img">
                    </div>
                    <h3 onclick="event.stopPropagation(); openProduct('${product.id}')">${product.nombre}</h3>
                </div>
            `;
        }).join('');
    }, 200);
}

function renderSlider1() {
                console.log('=== CARGANDO SLIDER 1 ==='); // Debug
                const slider1 = document.getElementById('slider1');
                if (!slider1) return;

                // Obtener TODOS los productos desde localStorage
                let todosLosProductos = JSON.parse(localStorage.getItem('pavilions_products') || '[]');
                console.log('Todos los productos:', todosLosProductos.length); // Debug
                console.log('Productos:', todosLosProductos.map(p => ({id: p.id, nombre: p.nombre, categorias: p.categoriasSliders}))); // Debug
                
                if (todosLosProductos.length === 0) {
                    slider1.innerHTML = '<p style="text-align: center; padding: 40px; color: #666;">No hay productos cargados. <a href="admin.html" style="color: #000; font-weight: bold;">Agregar productos</a></p>';
                    return;
                }

                // Filtrar SOLO productos marcados como "nuevo"
                let productosNuevos = todosLosProductos.filter(product => {
                    const categorias = product.categoriasSliders || {};
                    return categorias.nuevo === true;
                });
                
                console.log('Productos filtrados como "nuevo":', productosNuevos.length); // Debug
                console.log('Productos nuevos:', productosNuevos.map(p => ({id: p.id, nombre: p.nombre}))); // Debug
                
                if (productosNuevos.length === 0) {
                    slider1.innerHTML = '<p style="text-align: center; padding: 40px; color: #666;">No hay productos marcados como "Nuevos Ingresos". <a href="admin.html" style="color: #000; font-weight: bold;">Administrar productos</a></p>';
                    return;
                }

                // Mostrar solo los primeros 3 productos nuevos centrados
                const productosAMostrar = productosNuevos.slice(0, 3);
                console.log('Productos a mostrar (primeros 3):', productosAMostrar.length); // Debug
                console.log('Productos finales:', productosAMostrar.map(p => ({id: p.id, nombre: p.nombre}))); // Debug
                
                slider1.innerHTML = productosAMostrar.map((product) => {
                    const primeraFoto = product.foto || (product.fotos && product.fotos.length > 0 ? product.fotos[0].data : '');
                    const segundaFoto = product.fotos && product.fotos.length > 1 ? product.fotos[1].data : primeraFoto;
                    return `
                        <div class="product-card fade-in" data-product-id="${product.id}" onclick="openProduct('${product.id}')">
                            <div class="product-image-container">
                                <img src="${primeraFoto}" alt="${product.nombre}" class="product-img primary-img">
                                <img src="${segundaFoto}" alt="${product.nombre}" class="product-img secondary-img">
                            </div>
                            <h3 onclick="event.stopPropagation(); openProduct('${product.id}')">${product.nombre}</h3>
                        </div>
                    `;
                }).join('');
            }

function renderSlider2() {
                console.log('=== CARGANDO SLIDER 2 ==='); // Debug
                const slider2 = document.getElementById('slider2');
                if (!slider2) return;

                // Obtener TODOS los productos desde localStorage
                let todosLosProductos = JSON.parse(localStorage.getItem('pavilions_products') || '[]');
                console.log('Todos los productos:', todosLosProductos.length); // Debug
                console.log('Productos:', todosLosProductos.map(p => ({id: p.id, nombre: p.nombre, categorias: p.categoriasSliders}))); // Debug
                
                if (todosLosProductos.length === 0) {
                    slider2.innerHTML = '<p style="text-align: center; padding: 40px; color: #666;">No hay productos cargados para la colección.</p>';
                    return;
                }

                // Filtrar SOLO productos marcados como "temporada"
                let productosTemporada = todosLosProductos.filter(product => {
                    const categorias = product.categoriasSliders || {};
                    return categorias.temporada === true;
                });
                
                console.log('Productos filtrados como "temporada":', productosTemporada.length); // Debug
                console.log('Productos de temporada:', productosTemporada.map(p => ({id: p.id, nombre: p.nombre}))); // Debug
                
                if (productosTemporada.length === 0) {
                    slider2.innerHTML = '<p style="text-align: center; padding: 40px; color: #666;">No hay productos marcados como "Colección Temporada". <a href="admin.html" style="color: #000; font-weight: bold;">Administrar productos</a></p>';
                    return;
                }

                // Mostrar solo los primeros 3 productos de temporada centrados
                const productosAMostrar = productosTemporada.slice(0, 3);
                console.log('Productos a mostrar (primeros 3):', productosAMostrar.length); // Debug
                console.log('Productos finales:', productosAMostrar.map(p => ({id: p.id, nombre: p.nombre}))); // Debug
                
                slider2.innerHTML = productosAMostrar.map((product) => {
                    const primeraFoto = product.foto || (product.fotos && product.fotos.length > 0 ? product.fotos[0].data : '');
                    const segundaFoto = product.fotos && product.fotos.length > 1 ? product.fotos[1].data : primeraFoto;
                    return `
                        <div class="product-card fade-in" data-product-id="${product.id}" onclick="openProduct('${product.id}')">
                            <div class="product-image-container">
                                <img src="${primeraFoto}" alt="${product.nombre}" class="product-img primary-img">
                                <img src="${segundaFoto}" alt="${product.nombre}" class="product-img secondary-img">
                            </div>
                            <h3 onclick="event.stopPropagation(); openProduct('${product.id}')">${product.nombre}</h3>
                        </div>
                    `;
                }).join('');
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

// Carousel functionality
let currentSlide = 0;
const slides = document.querySelectorAll('.carousel-slide');
const progressFill = document.querySelector('.progress-fill');
const slideDuration = 6000; // 6 segundos por slide (más lento)
let progressInterval;
let slideInterval;

function showSlide(index) {
    // Hide all slides
    slides.forEach(slide => slide.classList.remove('active'));
    
    // Show current slide
    slides[index].classList.add('active');
    
    // Reset and start progress
    resetProgress();
    startProgress();
}

function resetProgress() {
    progressFill.style.width = '0%';
    clearInterval(progressInterval);
}

function startProgress() {
    let progress = 0;
    const increment = 100 / (slideDuration / 50); // Actualizar cada 50ms
    
    progressInterval = setInterval(() => {
        progress += increment;
        if (progress >= 100) {
            progress = 100;
            clearInterval(progressInterval);
        }
        progressFill.style.width = progress + '%';
    }, 50);
}

function previousSlide() {
    currentSlide--;
    if (currentSlide < 0) {
        currentSlide = slides.length - 1;
    }
    showSlide(currentSlide);
}

function nextSlide() {
    currentSlide++;
    if (currentSlide >= slides.length) {
        currentSlide = 0;
    }
    showSlide(currentSlide);
}

// Auto-play carousel
function startAutoPlay() {
    slideInterval = setInterval(nextSlide, slideDuration);
}

// Initialize carousel
document.addEventListener('DOMContentLoaded', function() {
    if (slides.length > 0) {
        showSlide(0);
        startAutoPlay();
    }
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

// Sistema de Banners Dinámicos
class BannerManager {
    constructor() {
        this.banners = [];
        this.currentBannerIndex = 0;
        this.autoRotateInterval = null;
        this.init();
    }

    init() {
        this.loadBanners();
        this.setupEventListeners();
        this.startAutoRotation();
    }

    loadBanners() {
        const storedBanners = localStorage.getItem('pavilions_banners');
        console.log('=== CARGANDO BANNERS ==='); // Debug
        console.log('Banners en localStorage:', storedBanners); // Debug
        
        if (storedBanners) {
            this.banners = JSON.parse(storedBanners);
            console.log('Banners parseados:', this.banners); // Debug
            console.log('Cantidad de banners:', this.banners.length); // Debug
            
            // Filtrar solo banners activos
            this.banners = this.banners.filter(banner => banner.activo === true);
            console.log('Banners activos:', this.banners); // Debug
            console.log('Cantidad de banners activos:', this.banners.length); // Debug
            
            this.renderBanners();
        } else {
            console.log('No hay banners en localStorage'); // Debug
            this.showPlaceholder();
        }
    }

    renderBanners() {
        const container = document.getElementById('carouselContainer');
        
        if (!container) return;

        if (this.banners.length === 0) {
            this.showPlaceholder();
            return;
        }

        // Renderizar banners
        container.innerHTML = this.banners.map((banner, index) => `
            <div class="carousel-slide ${index === 0 ? 'active' : ''}" data-banner-index="${index}" onclick="bannerManager.handleBannerClick(${index})" style="cursor: pointer; width: 100%; height: 100%; overflow: hidden;">
                ${banner.imagen ? 
                    `<img src="${banner.imagen}" alt="Banner" style="width: 100%; height: 100%; object-fit: cover; display: block;">` : 
                    `<div style="width: 100%; height: 100%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; color: white;">
                        <div style="text-align: center; padding: 20px;">
                            <h2 style="font-size: 32px; margin-bottom: 10px;">Banner</h2>
                            <p style="font-size: 18px; opacity: 0.8;">Sin imagen</p>
                        </div>
                    </div>`
                }
            </div>
        `).join('');

        this.currentBannerIndex = 0;
        this.updateProgressBar();
    }

    showPlaceholder() {
        const container = document.getElementById('carouselContainer');
        
        if (container) {
            container.innerHTML = `
                <div class="carousel-slide active">
                    <div class="banner-placeholder">
                        <h2>No hay banners activos</h2>
                        <p>Configura tus banners en el panel de administración</p>
                        <a href="admin.html" style="display: inline-block; margin-top: 15px; padding: 12px 30px; background: white; color: #667eea; text-decoration: none; font-weight: 600; border-radius: 5px;">Ir al Admin</a>
                    </div>
                </div>
            `;
        }
    }

    setupEventListeners() {
        // Las flechas ya tienen onclick en el HTML
    }

    handleBannerClick(index) {
        console.log('🚨 === CLICK EN BANNER DEBUG COMPLETO ==='); // Debug
        console.log('Índice recibido:', index); // Debug
        console.log('Índice actual del bannerManager:', this.currentBannerIndex); // Debug
        console.log('Total de banners cargados:', this.banners.length); // Debug
        console.log('Todos los banners:', this.banners); // Debug
        
        const banner = this.banners[index];
        console.log('🎯 Banner que se va a usar:', banner); // Debug
        console.log('🎯 Enlace del banner:', banner.enlace); // Debug
        
        if (banner && banner.enlace && banner.enlace.trim() !== '') {
            console.log('✅ Enlace válido, procesando:', banner.enlace); // Debug
            
            // Si es un producto específico
            if (banner.enlace.startsWith('producto.html?id=')) {
                const productId = banner.enlace.split('id=')[1];
                console.log('🎯 PRODUCTO ESPECÍFICO - ID:', productId); // Debug
                console.log('🎯 URL completa:', banner.enlace); // Debug
                console.log('🎯 Redirigiendo AHORA a:', banner.enlace); // Debug
                window.location.href = banner.enlace;
                return;
            }
            
            // Si es una página HTML existente (pantalones.html, remeras.html, etc.)
            if (banner.enlace.includes('.html')) {
                console.log('📄 PÁGINA HTML - Redirigiendo a:', banner.enlace); // Debug
                window.location.href = banner.enlace;
                return;
            }
            
            // Si es un ancla (#), verificar si la sección existe
            if (banner.enlace.startsWith('#')) {
                const targetId = banner.enlace.substring(1); // Quitar el #
                console.log('🔍 ANCLA - Buscando sección:', targetId); // Debug
                
                const targetElement = document.getElementById(targetId);
                console.log('🔍 Elemento encontrado:', targetElement); // Debug
                
                if (targetElement) {
                    console.log('✅ Haciendo scroll a:', targetId); // Debug
                    targetElement.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                } else {
                    console.log(`⚠️ La sección con id="${targetId}" no existe`); // Debug
                    console.log('Secciones disponibles:', this.getAvailableSections()); // Debug
                    alert(`La sección "${targetId}" no existe. Secciones disponibles: ${this.getAvailableSections().join(', ')}`);
                }
            } else {
                console.log('🌐 URL NORMAL - Redirigiendo a:', banner.enlace); // Debug
                window.location.href = banner.enlace;
            }
        } else {
            console.log('❌ Banner sin enlace configurado'); // Debug
            console.log('❌ Valor de enlace:', banner.enlace); // Debug
        }
        
        console.log('🚨 === FIN DEBUG CLICK ==='); // Debug
    }

    getAvailableSections() {
        const sections = document.querySelectorAll('section[id], div[id]');
        return Array.from(sections).map(el => el.id).filter(id => id && id !== '');
    }

    changeBanner(direction) {
        if (this.banners.length === 0) return;

        console.log('=== CAMBIANDO BANNER ==='); // Debug
        console.log('Índice actual:', this.currentBannerIndex); // Debug
        console.log('Dirección:', direction); // Debug
        console.log('Banner actual:', this.banners[this.currentBannerIndex]); // Debug

        const slides = document.querySelectorAll('.carousel-slide');

        // Ocultar banner actual
        slides[this.currentBannerIndex].classList.remove('active');

        // Calcular nuevo índice
        this.currentBannerIndex = (this.currentBannerIndex + direction + this.banners.length) % this.banners.length;

        console.log('Nuevo índice:', this.currentBannerIndex); // Debug
        console.log('Nuevo banner:', this.banners[this.currentBannerIndex]); // Debug

        // Mostrar nuevo banner
        slides[this.currentBannerIndex].classList.add('active');

        // Reiniciar auto-rotación
        this.restartAutoRotation();
        this.updateProgressBar();
    }

    startAutoRotation() {
        if (this.banners.length === 0) return;

        // Obtener tiempo del banner actual
        const currentBanner = this.banners[this.currentBannerIndex];
        const tiempo = currentBanner?.tiempo || 5; // Default 5 segundos

        this.clearAutoRotation();
        this.autoRotateInterval = setInterval(() => {
            this.changeBanner(1);
        }, tiempo * 1000);

        this.updateProgressBar();
    }

    restartAutoRotation() {
        this.startAutoRotation();
    }

    clearAutoRotation() {
        if (this.autoRotateInterval) {
            clearInterval(this.autoRotateInterval);
            this.autoRotateInterval = null;
        }
    }

    updateProgressBar() {
        const progressFill = document.getElementById('progressFill');
        if (!progressFill || this.banners.length === 0) return;

        const currentBanner = this.banners[this.currentBannerIndex];
        const tiempo = currentBanner?.tiempo || 5; // Default 5 segundos

        // Resetear animación
        progressFill.style.transition = 'none';
        progressFill.style.width = '0%';

        // Forzar reflow
        progressFill.offsetHeight;

        // Iniciar animación
        progressFill.style.transition = `width ${tiempo}s linear`;
        progressFill.style.width = '100%';
    }
}

// Inicializar el sistema de banners
let bannerManager;
document.addEventListener('DOMContentLoaded', function() {
    bannerManager = new BannerManager();
    
    // Debug: Forzar limpieza de cache si es necesario
    if (window.location.search.includes('debug=true')) {
        console.log('🧹 Modo debug: Limpiando cache de banners...');
        localStorage.removeItem('pavilions_banners');
        location.reload();
    }
    
    // Inicializar carrito
    updateCartUI();
});

// SISTEMA DE CARRITO
class CartManager {
    constructor() {
        this.cart = this.loadCart();
    }

    loadCart() {
        const savedCart = localStorage.getItem('pavilions_cart');
        return savedCart ? JSON.parse(savedCart) : [];
    }

    saveCart() {
        localStorage.setItem('pavilions_cart', JSON.stringify(this.cart));
        updateCartUI();
    }

    addToCart(productId) {
        console.log('🛒 Agregando producto al carrito:', productId); // Debug
        
        // Obtener todos los productos
        const allProducts = JSON.parse(localStorage.getItem('pavilions_products') || '[]');
        const product = allProducts.find(p => p.id === productId);
        
        if (!product) {
            console.error('❌ Producto no encontrado:', productId);
            showToast('Producto no encontrado', 'error');
            return;
        }

        // Verificar si ya está en el carrito
        const existingItem = this.cart.find(item => item.productId === productId);
        
        if (existingItem) {
            // Si ya existe, incrementar cantidad
            existingItem.quantity += 1;
            console.log('📦 Producto ya en carrito, incrementando cantidad:', existingItem.quantity);
        } else {
            // Si no existe, agregar nuevo item
            const cartItem = {
                productId: product.id,
                nombre: product.nombre,
                precio: product.precio,
                foto: product.foto || (product.fotos && product.fotos.length > 0 ? product.fotos[0].data : ''),
                quantity: 1,
                categoria: product.categoria
            };
            this.cart.push(cartItem);
            console.log('🆕 Nuevo producto agregado al carrito:', cartItem);
        }

        this.saveCart();
        this.showAddToCartFeedback(product.nombre);
    }

    addToCartWithSize(productId, selectedSize) {
        console.log('🛒 Agregando producto con talla al carrito:', productId, 'talle:', selectedSize); // Debug
        
        // Obtener todos los productos
        const allProducts = JSON.parse(localStorage.getItem('pavilions_products') || '[]');
        const product = allProducts.find(p => p.id === productId);
        
        if (!product) {
            console.error('❌ Producto no encontrado:', productId);
            showToast('Producto no encontrado', 'error');
            return;
        }

        // Verificar stock disponible
        const stockDisponible = this.getStockForSize(product, selectedSize);
        if (stockDisponible <= 0) {
            console.error('❌ Sin stock disponible:', selectedSize);
            showToast('Sin stock disponible para este talle', 'error');
            return;
        }

        // Buscar si ya existe el mismo producto con el mismo talle
        const existingItem = this.cart.find(item => item.productId === productId && item.talleSeleccionado === selectedSize);
        
        if (existingItem) {
            // Verificar si podemos agregar más (no superar stock)
            const nuevaCantidad = existingItem.quantity + 1;
            if (nuevaCantidad > stockDisponible) {
                console.error('❌ Stock insuficiente:', nuevaCantidad, 'disponible:', stockDisponible);
                showToast(`Solo hay ${stockDisponible} unidades disponibles`, 'error');
                return;
            }
            
            // Si hay stock, incrementar cantidad
            existingItem.quantity = nuevaCantidad;
            console.log('📦 Producto con mismo talle ya en carrito, incrementando cantidad:', existingItem.quantity);
        } else {
            // Si no existe, agregar nuevo item con talla
            const cartItem = {
                productId: product.id,
                nombre: product.nombre,
                precio: product.precio,
                foto: product.foto || (product.fotos && product.fotos.length > 0 ? product.fotos[0].data : ''),
                quantity: 1,
                categoria: product.categoria,
                talleSeleccionado: selectedSize
            };
            this.cart.push(cartItem);
            console.log('🆕 Nuevo producto con talla agregado al carrito:', cartItem);
        }

        this.saveCart();
        this.showAddToCartFeedbackWithSize(product.nombre, selectedSize);
    }

    // Método auxiliar para obtener stock de un talle específico
    getStockForSize(product, selectedSize) {
        if (!product || !product.stock) return 0;
        
        if (product.tipoTalle === 'unico') {
            return product.stock.unico || 0;
        } else {
            return product.stock[selectedSize] || 0;
        }
    }

    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.productId !== productId);
        this.saveCart();
    }

    updateQuantity(productId, quantity) {
        const item = this.cart.find(item => item.productId === productId);
        if (item) {
            item.quantity = Math.max(1, quantity);
            this.saveCart();
        }
    }

    getTotalItems() {
        return this.cart.reduce((total, item) => total + item.quantity, 0);
    }

    getTotalPrice() {
        return this.cart.reduce((total, item) => total + (item.precio * item.quantity), 0);
    }

    showAddToCartFeedback(productName) {
        showToast(`${productName} agregado al carrito 🛒`, 'success');
    }

    showAddToCartFeedbackWithSize(productName, selectedSize) {
        showToast(`${productName} (${selectedSize}) agregado al carrito 🛒`, 'success');
    }
}

// Instancia global del carrito
const cartManager = new CartManager();

// Función global para agregar al carrito
function addToCart(productId) {
    console.log('🛒 Click en agregar al carrito:', productId); // Debug
    cartManager.addToCart(productId);
}

// Función para actualizar UI del carrito
function updateCartUI() {
    const totalItems = cartManager.getTotalItems();
    console.log('🛒 Actualizando UI del carrito, total items:', totalItems); // Debug
    
    // Actualizar contador en navbar
    const cartCounters = document.querySelectorAll('.cart-counter');
    cartCounters.forEach(counter => {
        counter.textContent = totalItems;
        counter.style.display = totalItems > 0 ? 'flex' : 'none';
    });
}

// Función para mostrar/ocultar mini-carrito
function toggleCart() {
    console.log('🛒 Toggle carrito clicked'); // Debug
    
    // Crear mini-carrito si no existe
    let miniCart = document.querySelector('.mini-cart');
    if (!miniCart) {
        miniCart = createMiniCart();
        document.body.appendChild(miniCart);
    }
    
    // Toggle visibility
    const isVisible = miniCart.style.display === 'block';
    miniCart.style.display = isVisible ? 'none' : 'block';
    
    if (!isVisible) {
        renderMiniCart();
    }
}

// Crear estructura del mini-carrito
function createMiniCart() {
    const miniCart = document.createElement('div');
    miniCart.className = 'mini-cart';
    miniCart.innerHTML = `
        <div class="mini-cart-header">
            <h3>Carrito 🛒</h3>
            <button class="close-cart" onclick="toggleCart()">×</button>
        </div>
        <div class="mini-cart-content" id="miniCartContent">
            <p class="empty-cart">Tu carrito está vacío</p>
        </div>
        <div class="mini-cart-footer" id="miniCartFooter" style="display: none;">
            <div class="cart-total">
                <span>Total:</span>
                <span id="cartTotal">$0</span>
            </div>
            <button class="checkout-btn" onclick="goToCheckout()">Finalizar compra</button>
        </div>
    `;
    return miniCart;
}

// Renderizar contenido del mini-carrito
function renderMiniCart() {
    const cart = cartManager.cart;
    const content = document.getElementById('miniCartContent');
    const footer = document.getElementById('miniCartFooter');
    const total = document.getElementById('cartTotal');
    
    if (!content || !footer || !total) return;
    
    if (cart.length === 0) {
        content.innerHTML = '<p class="empty-cart">Tu carrito está vacío</p>';
        footer.style.display = 'none';
        return;
    }
    
    // Renderizar productos
    content.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.foto}" alt="${item.nombre}" class="cart-item-img">
            <div class="cart-item-info">
                <h4>${item.nombre}</h4>
                <p class="cart-item-details">
                    ${item.talleSeleccionado ? `Talle: ${item.talleSeleccionado}` : ''}
                    <span>Cant: ${item.quantity}</span>
                </p>
                <p class="cart-item-price">$${(item.precio * item.quantity).toLocaleString('es-AR')}</p>
            </div>
            <button class="remove-item" onclick="removeFromCart('${item.productId}', '${item.talleSeleccionado || ''}')">×</button>
        </div>
    `).join('');
    
    // Mostrar footer con total
    const totalPrice = cartManager.getTotalPrice();
    total.textContent = `$${totalPrice.toLocaleString('es-AR')}`;
    footer.style.display = 'block';
}

// Eliminar del carrito
function removeFromCart(productId, selectedSize) {
    console.log('🗑️ Eliminando del carrito:', productId, 'talle:', selectedSize); // Debug
    
    if (selectedSize) {
        // Eliminar producto con talla específica
        cartManager.cart = cartManager.cart.filter(item => 
            !(item.productId === productId && item.talleSeleccionado === selectedSize)
        );
    } else {
        // Eliminar todos los productos con ese ID
        cartManager.cart = cartManager.cart.filter(item => item.productId !== productId);
    }
    
    cartManager.saveCart();
    
    // Actualizar UI si estamos en la página del carrito
    if (window.location.pathname.includes('carrito.html')) {
        if (typeof renderCartItems === 'function') {
            renderCartItems();
        }
        if (typeof updateCartSummary === 'function') {
            updateCartSummary();
        }
    } else {
        // Si estamos en otra página, actualizar mini-carrito
        if (typeof renderMiniCart === 'function') {
            renderMiniCart();
        }
    }
    
    updateCartUI();
}

// Ir a checkout (por ahora redirige a WhatsApp)
function goToCheckout() {
    const cart = cartManager.cart;
    if (cart.length === 0) return;
    
    // Crear mensaje para WhatsApp
    const message = cart.map(item => {
        const sizeText = item.talleSeleccionado ? ` (${item.talleSeleccionado})` : '';
        return `${item.nombre}${sizeText} - Cant: ${item.quantity} - $${(item.precio * item.quantity).toLocaleString('es-AR')}`;
    }).join('\n');
    
    const total = cartManager.getTotalPrice();
    const fullMessage = `¡Hola! Quiero realizar un pedido:\n\n${message}\n\nTOTAL: $${total.toLocaleString('es-AR')}\n\n¿Podrían confirmar disponibilidad y envío?`;
    
    const whatsappUrl = `https://wa.me/5491127641124?text=${encodeURIComponent(fullMessage)}`;
    window.open(whatsappUrl, '_blank');
    
    // Cerrar mini-carrito
    toggleCart();
}

// Sistema de notificaciones toast
function showToast(message, type = 'success') {
    // Crear elemento toast si no existe
    let toast = document.querySelector('.toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.className = 'toast';
        document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.className = `toast ${type}`;
    
    // Mostrar con animación
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);

    // Ocultar después de 3 segundos
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.style.display = 'none';
        }, 300);
    }, 3000);
}
