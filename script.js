/* ===================================================
   GELATERIA BELLA – Interactive JavaScript
   =================================================== */

// ---- Scroll-triggered Animations (IntersectionObserver) ----
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger the animation delay based on the element's position within its sibling group
                const siblings = entry.target.parentElement.querySelectorAll('.animate-on-scroll');
                let siblingIndex = 0;
                siblings.forEach((sib, i) => {
                    if (sib === entry.target) siblingIndex = i;
                });
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, siblingIndex * 100);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(el => observer.observe(el));

    // ---- Navbar scroll effect ----
    const navbar = document.getElementById('navbar');
    const handleScroll = () => {
        if (window.scrollY > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // ---- Mobile menu toggle ----
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
        });

        // Close menu on link click
        document.querySelectorAll('.nav-links li a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
            });
        });
    }

    // ---- Shopping Cart ----
    let cart = [];

    const cartFloat = document.getElementById('cartFloat');
    const cartCount = document.getElementById('cartCount');
    const cartModal = document.getElementById('cartModal');
    const cartClose = document.getElementById('cartClose');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const checkoutBtn = document.getElementById('checkoutBtn');
    const toast = document.getElementById('toast');
    const toastText = document.getElementById('toastText');

    // Show cart button on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 600) {
            cartFloat.classList.add('visible');
        } else {
            cartFloat.classList.remove('visible');
        }
    }, { passive: true });

    // Add to cart buttons
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const flavor = btn.closest('.flavor-card').dataset.name;
            const price = parseInt(btn.closest('.flavor-card').dataset.price);

            const existing = cart.find(item => item.flavor === flavor);
            if (existing) {
                existing.qty++;
            } else {
                cart.push({ flavor, price, qty: 1 });
            }

            updateCart();
            showToast(`${flavor} tillagd i varukorgen!`);

            // Button animation
            btn.style.transform = 'scale(1.3)';
            btn.style.background = 'var(--terracotta)';
            btn.style.color = 'var(--white)';
            setTimeout(() => {
                btn.style.transform = '';
                btn.style.background = '';
                btn.style.color = '';
            }, 300);
        });
    });

    // Open/close cart modal
    cartFloat.addEventListener('click', () => {
        cartModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    cartClose.addEventListener('click', closeCartModal);

    cartModal.addEventListener('click', (e) => {
        if (e.target === cartModal) closeCartModal();
    });

    function closeCartModal() {
        cartModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    function updateCart() {
        const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
        const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

        cartCount.textContent = totalItems;

        if (cart.length === 0) {
            cartItems.innerHTML = '<p class="cart-empty">Din varukorg är tom</p>';
        } else {
            cartItems.innerHTML = cart.map((item, index) => `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <span class="cart-item-name">${item.flavor}</span>
                    </div>
                    <div class="cart-item-qty">
                        <button class="qty-btn" onclick="changeQty(${index}, -1)">−</button>
                        <span>${item.qty}</span>
                        <button class="qty-btn" onclick="changeQty(${index}, 1)">+</button>
                    </div>
                    <span class="cart-item-price">${item.price * item.qty} kr</span>
                </div>
            `).join('');
        }

        cartTotal.textContent = `${totalPrice} kr`;
    }

    // Make changeQty globally accessible
    window.changeQty = (index, delta) => {
        cart[index].qty += delta;
        if (cart[index].qty <= 0) {
            cart.splice(index, 1);
        }
        updateCart();
    };

    // Checkout button
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            showToast('Varukorgen är tom!');
            return;
        }
        const orderSection = document.getElementById('bestall');
        closeCartModal();
        orderSection.scrollIntoView({ behavior: 'smooth' });
        showToast('Fyll i formuläret för att slutföra beställningen!');
    });

    // Toast notification
    function showToast(message) {
        toastText.textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 2500);
    }

    // ---- Form handling ----
    const orderForm = document.getElementById('orderForm');
    orderForm.addEventListener('submit', (e) => {
        e.preventDefault();
        showToast('Tack för din beställning! Vi bekräftar via e-post.');
        orderForm.reset();
        cart = [];
        updateCart();
    });

    const newsletterForm = document.getElementById('newsletterForm');
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        showToast('Tack! Du kommer få 10% rabattkod i din inbox.');
        newsletterForm.reset();
    });

    // ---- Smooth scroll for all anchor links ----
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const navbarHeight = navbar.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - navbarHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ---- Parallax effect on hero ----
    const heroBg = document.querySelector('.hero-bg');
    if (heroBg) {
        window.addEventListener('scroll', () => {
            if (window.scrollY < window.innerHeight) {
                const offset = window.scrollY * 0.3;
                heroBg.style.transform = `translateY(${offset}px)`;
            }
        }, { passive: true });
    }
});
