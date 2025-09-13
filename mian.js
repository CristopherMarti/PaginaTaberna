// Optimized JavaScript
        class TabernaApp {
            constructor() {
                this.navbar = document.getElementById('navbar');
                this.mobileMenu = document.getElementById('mobileMenu');
                this.navLinks = document.getElementById('navLinks');
                this.animatedElements = document.querySelectorAll('.fade-in, .slide-left, .slide-right, .zoom-in');
                
                this.init();
            }

            init() {
                this.setupScrollEffects();
                this.setupMobileMenu();
                this.setupAnimations();
            }

            setupScrollEffects() {
                let ticking = false;
                
                const handleScroll = () => {
                    if (!ticking) {
                        requestAnimationFrame(() => {
                            this.navbar.classList.toggle('scrolled', window.scrollY > 50);
                            ticking = false;
                        });
                        ticking = true;
                    }
                };

                window.addEventListener('scroll', handleScroll, { passive: true });
            }

            setupMobileMenu() {
                this.mobileMenu.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.navLinks.classList.toggle('active');
                });

                // Close mobile menu when clicking outside
                document.addEventListener('click', (e) => {
                    if (!this.mobileMenu.contains(e.target) && !this.navLinks.contains(e.target)) {
                        this.navLinks.classList.remove('active');
                    }
                });
            }

            setupAnimations() {
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('show');
                            observer.unobserve(entry.target);
                        }
                    });
                }, {
                    threshold: 0.2,
                    rootMargin: '0px 0px -50px 0px'
                });

                this.animatedElements.forEach(element => {
                    observer.observe(element);
                });
            }
        }

        // Initialize app when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => new TabernaApp());
        } else {
            new TabernaApp();
        }