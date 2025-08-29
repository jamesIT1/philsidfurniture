document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const dropdowns = document.querySelectorAll('.nav-menu .dropdown');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');

            // When closing the main menu, also close any open dropdowns
            if (!navMenu.classList.contains('active')) {
                dropdowns.forEach(d => d.classList.remove('active'));
            }
        });
    }

    // Dropdown logic for mobile
    if (hamburger && dropdowns.length > 0) {
        dropdowns.forEach(dropdown => {
            const link = dropdown.querySelector('.nav-link');
            link.addEventListener('click', (event) => {
                const isMobileView = getComputedStyle(hamburger).display !== 'none';
                if (isMobileView) {
                    event.preventDefault();
                    
                    // If the clicked dropdown is not active, close others first.
                    if (!dropdown.classList.contains('active')) {
                        dropdowns.forEach(d => d.classList.remove('active'));
                    }
                    
                    // Then toggle the clicked one.
                    dropdown.classList.toggle('active');
                }
            });
        });
    }

    // Close mobile menu when a navigation link is clicked
    if (hamburger && navMenu) {
        const allNavLinks = document.querySelectorAll('.nav-menu a');
        allNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                const isMobileView = getComputedStyle(hamburger).display !== 'none';
                if (isMobileView && navMenu.classList.contains('active')) {
                    const isDropdownToggle = link.classList.contains('nav-link') && link.closest('.nav-item.dropdown');

                    if (!isDropdownToggle) {
                        hamburger.classList.remove('active');
                        navMenu.classList.remove('active');
                        // Ensure any open sub-menus are also closed
                        dropdowns.forEach(d => d.classList.remove('active'));
                    }
                }
            });
        });
    }

    // Carousel
    const carouselContainer = document.querySelector('.carousel-container');
    if (carouselContainer) {
        const slides = document.getElementById('slides');
        const totalSlides = slides.children.length;
        let slideWidth = carouselContainer.clientWidth;
        let currentIndex = 0;

        function updateSlidePosition() {
            slideWidth = carouselContainer.clientWidth;
            slides.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
            slides.style.width = `${slideWidth * totalSlides}px`;
            Array.from(slides.children).forEach(slide => {
                slide.style.width = `${slideWidth}px`;
            });
        }

        function nextSlide() {
            currentIndex = (currentIndex + 1) % totalSlides;
            updateSlidePosition();
        }

        let autoSlideInterval = setInterval(nextSlide, 3000);

        carouselContainer.addEventListener('mouseenter', () => clearInterval(autoSlideInterval));
        carouselContainer.addEventListener('mouseleave', () => {
            autoSlideInterval = setInterval(nextSlide, 3000);
        });

        window.addEventListener('resize', updateSlidePosition);
        updateSlidePosition();
    }

    // "Contact Us" scroll
    const contactLinks = Array.from(document.querySelectorAll('a, button'))
        .filter(el => el.textContent.trim().toLowerCase() === 'contact us');
    const contactForm = document.getElementById('contactForm');

    if (contactForm && contactLinks.length > 0) {
        contactLinks.forEach(link => {
            link.addEventListener('click', function(event) {
                event.preventDefault();
                contactForm.scrollIntoView({ behavior: 'smooth' });
            });
        });
    }

    // Search functionality with highlighting & smooth scroll
    const searchBtn = document.querySelector('.search-btn');
    const searchInput = document.querySelector('.search-input');

    if (searchBtn && searchInput) {
        const searchArea = document.querySelector('main') || document.body;

        function removeSearchHighlights() {
            const marks = searchArea.querySelectorAll('mark');
            marks.forEach(mark => {
                mark.replaceWith(mark.textContent);
            });
            searchArea.normalize();
        }

        const performSearch = () => {
            const query = searchInput.value.trim();
            removeSearchHighlights();

            if (!query) {
                searchInput.blur();
                return;
            }

            const regex = new RegExp(query, 'gi');
            let firstMatch = null;

            const treeWalker = document.createTreeWalker(searchArea, NodeFilter.SHOW_TEXT, {
                acceptNode(node) {
                    if (node.parentElement.closest('script, style, .search-bar-container')) {
                        return NodeFilter.FILTER_REJECT;
                    }
                    if (regex.test(node.nodeValue)) {
                        regex.lastIndex = 0;
                        return NodeFilter.FILTER_ACCEPT;
                    }
                    return NodeFilter.FILTER_REJECT;
                }
            });

            const nodesToHighlight = [];
            while (treeWalker.nextNode()) {
                nodesToHighlight.push(treeWalker.currentNode);
            }

            nodesToHighlight.forEach(node => {
                const parent = node.parentNode;
                const parts = node.nodeValue.split(regex);
                const matches = node.nodeValue.match(regex);

                if (matches) {
                    const fragment = document.createDocumentFragment();
                    parts.forEach((part, index) => {
                        fragment.appendChild(document.createTextNode(part));
                        if (index < matches.length) {
                            const mark = document.createElement('mark');
                            mark.textContent = matches[index];
                            fragment.appendChild(mark);
                            if (!firstMatch) {
                                firstMatch = mark;
                            }
                        }
                    });
                    parent.replaceChild(fragment, node);
                }
            });

            if (firstMatch) {
                setTimeout(() => {
                    const headerOffset = 70;
                    const elementPosition = firstMatch.getBoundingClientRect().top;
                    const pageYOffset = window.pageYOffset;
                    const offsetPosition = elementPosition + pageYOffset - headerOffset - 20;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: "smooth"
                    });
                }, 50);
            } else {
                alert(`The text "${query}" was not found on this page.`);
            }
            searchInput.blur();
        };

        searchBtn.addEventListener('click', e => {
            e.preventDefault();
            performSearch();
        });

        searchInput.addEventListener('keyup', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                performSearch();
            }
            if (searchInput.value.trim() === '') {
                removeSearchHighlights();
            }
        });
    }

    // Scroll-to-top button
    const scrollTopBtn = document.getElementById('scrollTopBtn');

    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                scrollTopBtn.classList.add('show');
            } else {
                scrollTopBtn.classList.remove('show');
            }
        });

        scrollTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Google Sheet Form Submission
    const googleForm = document.getElementById('contact-google-form');
    
    if (googleForm) {
        const statusDiv = document.getElementById('form-status');

        googleForm.addEventListener('submit', e => {
            e.preventDefault();
            
            const submitBtn = googleForm.querySelector('.submit-btn');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Submitting...';

            const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby1BVIKVz1sXHY99CoFCMvlYlgGJgz-bON5jiiiupGSWbYbbhwJukok1IRfWCgGNVKJ/exec';

            fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                body: new FormData(googleForm)
            })
            .then(response => response.json())
            .then(data => {
                if (data.result === 'success') {
                    statusDiv.textContent = 'Thank you! Your message has been sent successfully.';
                    statusDiv.className = 'success';
                    googleForm.reset();
                } else {
                    throw new Error(data.message || 'An unknown error occurred.');
                }
            })
            .catch(error => {
                statusDiv.textContent = `An error occurred: ${error.message}`;
                statusDiv.className = 'error';
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Submit';
                setTimeout(() => {
                    statusDiv.style.display = 'none';
                    statusDiv.className = '';
                }, 6000);
            });
        });
    }
});
