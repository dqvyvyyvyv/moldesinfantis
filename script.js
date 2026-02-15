document.addEventListener('DOMContentLoaded', function () {

    // Elements
    const btnBasic = document.getElementById('btn-basic');
    const popupOverlay = document.getElementById('offer-popup');
    const closePopupBtn = document.getElementById('close-popup');

    // Functions
    function openPopup() {
        popupOverlay.classList.remove('hidden');
        // Small timeout to allow display:block to apply before adding opacity class for transition
        setTimeout(() => {
            popupOverlay.classList.add('show');
        }, 10);
    }

    function closePopup() {
        popupOverlay.classList.remove('show');
        setTimeout(() => {
            popupOverlay.classList.add('hidden');
        }, 300); // Match transition duration in CSS
    }

    // Event Listeners
    if (btnBasic) {
        btnBasic.addEventListener('click', function (e) {
            e.preventDefault();
            openPopup();
        });
    }

    if (closePopupBtn) {
        closePopupBtn.addEventListener('click', closePopup);
    }

    // Close on click outside
    if (popupOverlay) {
        popupOverlay.addEventListener('click', function (e) {
            if (e.target === popupOverlay) {
                closePopup();
            }
        });
    }

    // Optional: Smooth Scroll for internal links (already supported by CSS scroll-behavior usually, but good for JS control if needed)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Video Player Logic
    const video = document.getElementById('vsl-video');
    const playOverlay = document.getElementById('play-overlay');
    const pauseOverlay = document.getElementById('pause-overlay');
    const progressBar = document.getElementById('video-progress');
    const videoContainer = document.querySelector('.video-container');

    if (video) {
        // Toggle Play/Pause on container click
        function togglePlay() {
            if (video.paused) {
                video.play();
                playOverlay.style.opacity = '0';
                setTimeout(() => {
                    playOverlay.classList.add('hidden'); // allow click through
                    playOverlay.style.display = 'none'; // fully remove from flow if needed, or use pointer-events
                }, 300);
                pauseOverlay.style.display = 'none';
            } else {
                video.pause();
                pauseOverlay.style.display = 'flex';
            }
        }

        // Click anywhere on the custom container (overlays or video)
        // We attach click to playOverlay and pauseOverlay specifically to handle the logic

        playOverlay.addEventListener('click', togglePlay);

        // When video is playing, clicking it (or the invisible mask) should pause
        video.addEventListener('click', togglePlay);

        pauseOverlay.addEventListener('click', togglePlay);

        // Hide overlays when playing
        video.addEventListener('play', () => {
            playOverlay.classList.add('hidden');
            playOverlay.style.display = 'none';
            pauseOverlay.style.display = 'none';
        });

        // Show pause overlay when paused
        video.addEventListener('pause', () => {
            // Note: we handle the overlay display manually in the toggle function for better UX,
            // but native pause events (like from keyboard) should also trigger it.
            if (!video.ended) {
                pauseOverlay.style.display = 'flex';
            }
        });

        // Update progress bar
        video.addEventListener('timeupdate', () => {
            const percentage = (video.currentTime / video.duration) * 100;
            progressBar.style.width = percentage + '%';
        });

        // Reset on end
        video.addEventListener('ended', () => {
            playOverlay.style.display = 'flex';
            setTimeout(() => playOverlay.style.opacity = '1', 10);
            playOverlay.classList.remove('hidden');
            progressBar.style.width = '0%';
        });
    }

    // UTM/URL Parameter Persistence
    function preserveUrlParams() {
        const queryParams = new URLSearchParams(window.location.search);

        if (Array.from(queryParams).length === 0) return; // No params to persist

        document.querySelectorAll('a').forEach(anchor => {
            const href = anchor.getAttribute('href');

            // Skip invalid, internal hashtags (only), or javascript links
            if (!href || href.startsWith('#') || href.startsWith('javascript:')) return;

            try {
                const url = new URL(anchor.href, window.location.origin); // persistent absolute URL

                // Append current params to the link
                queryParams.forEach((value, key) => {
                    url.searchParams.set(key, value);
                });

                anchor.href = url.toString();
            } catch (e) {
                console.warn('Could not update link:', href, e);
            }
        });
    }

    preserveUrlParams();
});
