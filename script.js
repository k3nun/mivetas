document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. STICKY NAVBAR & MOBILE MENU
       ========================================================================== */
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Sticky Navbar on Scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile Hamburger Menu Toggle
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('open');
        const icon = navToggle.querySelector('i');
        if (navMenu.classList.contains('open')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-xmark');
        } else {
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
        }
    });

    // Close Menu on Link Click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('open');
            const icon = navToggle.querySelector('i');
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
        });
    });

    /* ==========================================================================
       2. SCROLL REVEAL ANIMATIONS (Intersection Observer)
       ========================================================================== */
    const revealElements = document.querySelectorAll('.scroll-reveal');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Reveal once
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    /* ==========================================================================
       3. ACTIVE LINK ON SCROLL
       ========================================================================== */
    const sections = document.querySelectorAll('section');
    
    const navActiveObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, {
        threshold: 0.4,
        rootMargin: '-20% 0px -60% 0px' // Focus on center viewport
    });

    sections.forEach(sec => navActiveObserver.observe(sec));

    /* ==========================================================================
       4. HERO PARALLAX ENGINE
       ========================================================================== */
    const heroBg = document.querySelector('.hero-bg');
    
    if (heroBg) {
        window.addEventListener('scroll', () => {
            const scrollOffset = window.scrollY;
            // Limit parallax to viewport height
            if (scrollOffset <= window.innerHeight) {
                heroBg.style.transform = `translateY(${scrollOffset * 0.4}px)`;
            }
        });
    }

    /* ==========================================================================
       5. LEAFLET INTERACTIVE MAP
       ========================================================================== */
    // Coordenadas aproximadas del municipio de Vetas, Santander
    const vetasCoords = [7.30793, -72.86306];
    
    try {
        const map = L.map('map', {
            scrollWheelZoom: false // Avoid accidental zoom when scrolling
        }).setView(vetasCoords, 13);

        // Load open street map tiles
        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 20
        }).addTo(map);

        // Gold-like custom icon accent
        const goldIcon = L.divIcon({
            html: '<div style="background-color: #C9A84C; width: 14px; height: 14px; border-radius: 50%; border: 3px solid #FFF; box-shadow: 0 0 10px rgba(0,0,0,0.4);"></div>',
            className: 'custom-map-marker',
            iconSize: [14, 14],
            iconAnchor: [7, 7]
        });

        // Add Marker
        L.marker(vetasCoords, { icon: goldIcon }).addTo(map)
            .bindPopup(`
                <div style="font-family: 'Inter', sans-serif; text-align: center; padding: 5px;">
                    <h4 style="margin: 0 0 5px; font-family: 'Playfair Display', serif; color: #1B5E3B; font-size: 1.1rem;">Municipio de Vetas</h4>
                    <p style="margin: 0; color: #5A6572; font-size: 0.85rem;">El Techo de Colombia<br><strong>3.350 m.s.n.m.</strong></p>
                </div>
            `)
            .openPopup();
            
        // Enable map drag zoom when clicking on map
        map.on('click', () => {
            if (!map.scrollWheelZoom.enabled()) {
                map.scrollWheelZoom.enable();
            }
        });

    } catch (error) {
        console.error("Leaflet.js could not initialize. Check internet connection or CDN availability.", error);
    }

    /* ==========================================================================
       6. LIGHTBOX GALLERY SYSTEM
       ========================================================================== */
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const prevBtn = document.getElementById('lightbox-prev');
    const nextBtn = document.getElementById('lightbox-next');
    
    let activeImageIndex = 0;
    const imagesList = [];

    // Build the images data array
    galleryItems.forEach((item, index) => {
        const imgSrc = item.getAttribute('data-src');
        const captionText = item.querySelector('.gallery-overlay span').textContent;
        imagesList.push({ src: imgSrc, caption: captionText });

        item.addEventListener('click', () => {
            openLightbox(index);
        });
    });

    function openLightbox(index) {
        activeImageIndex = index;
        updateLightboxContent();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Stop page scroll
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = ''; // Restore page scroll
    }

    function updateLightboxContent() {
        const currentData = imagesList[activeImageIndex];
        lightboxImg.setAttribute('src', currentData.src);
        lightboxCaption.textContent = currentData.caption;
    }

    function showNextImage() {
        activeImageIndex = (activeImageIndex + 1) % imagesList.length;
        updateLightboxContent();
    }

    function showPrevImage() {
        activeImageIndex = (activeImageIndex - 1 + imagesList.length) % imagesList.length;
        updateLightboxContent();
    }

    // Lightbox Event Listeners
    lightboxClose.addEventListener('click', closeLightbox);
    nextBtn.addEventListener('click', showNextImage);
    prevBtn.addEventListener('click', showPrevImage);

    // Close when clicking outside image
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Keyboard Navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        
        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowRight') {
            showNextImage();
        } else if (e.key === 'ArrowLeft') {
            showPrevImage();
        }
    });
});
