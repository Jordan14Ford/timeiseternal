document.addEventListener('DOMContentLoaded', () => {
    // Get all video boxes
    const videoBoxes = document.querySelectorAll('.video-box');
    const videoButtons = document.querySelectorAll('.video-button');
    
    // Initialize drag functionality for each video box
    videoBoxes.forEach(box => {
        const header = box.querySelector('.video-header');
        const iframe = box.querySelector('iframe');
        let isDragging = false;
        let currentX = 0;
        let currentY = 0;
        let initialX = 0;
        let initialY = 0;
        let xOffset = 0;
        let yOffset = 0;
        let dragStartTime;
        let lastX = 0;
        let lastY = 0;
        let velocityX = 0;
        let velocityY = 0;
        let lastTime = 0;
        let animationFrame;

        // Initialize position
        const rect = box.getBoundingClientRect();
        xOffset = rect.left;
        yOffset = rect.top;

        function dragStart(e) {
            e.preventDefault();
            const clientX = e.clientX || e.touches[0].clientX;
            const clientY = e.clientY || e.touches[0].clientY;
            
            initialX = clientX - xOffset;
            initialY = clientY - yOffset;
            
            if (e.target === header) {
                isDragging = true;
                dragStartTime = Date.now();
                lastTime = dragStartTime;
                lastX = clientX;
                lastY = clientY;
                
                box.classList.add('dragging');
                document.body.style.cursor = 'grabbing';
                
                // Start animation loop
                requestAnimationFrame(updatePosition);
            }
        }

        function drag(e) {
            if (isDragging) {
                e.preventDefault();
                
                const clientX = e.clientX || e.touches[0].clientX;
                const clientY = e.clientY || e.touches[0].clientY;
                
                const currentTime = Date.now();
                const deltaTime = currentTime - lastTime;
                
                if (deltaTime > 0) {
                    // Calculate velocity (pixels per millisecond)
                    velocityX = (clientX - lastX) / deltaTime;
                    velocityY = (clientY - lastY) / deltaTime;
                    
                    lastX = clientX;
                    lastY = clientY;
                    lastTime = currentTime;
                }
                
                currentX = clientX - initialX;
                currentY = clientY - initialY;
                
                // Apply position with smooth easing
                setTranslate(currentX, currentY, box);
            }
        }

        function dragEnd(e) {
            if (isDragging) {
                isDragging = false;
                box.classList.remove('dragging');
                document.body.style.cursor = '';
                
                // Calculate final velocity
                const endTime = Date.now();
                const dragDuration = endTime - dragStartTime;
                
                // Apply momentum
                if (dragDuration < 300) { // Only apply momentum for quick drags
                    const momentumX = velocityX * 100;
                    const momentumY = velocityY * 100;
                    
                    // Animate to final position with momentum
                    animateWithMomentum(currentX, currentY, momentumX, momentumY);
                } else {
                    // Just snap to final position
                    setTranslate(currentX, currentY, box);
                }
                
                cancelAnimationFrame(animationFrame);
            }
        }

        function updatePosition() {
            if (isDragging) {
                setTranslate(currentX, currentY, box);
                animationFrame = requestAnimationFrame(updatePosition);
            }
        }

        function animateWithMomentum(startX, startY, momentumX, momentumY) {
            let currentMomentumX = momentumX;
            let currentMomentumY = momentumY;
            let currentPosX = startX;
            let currentPosY = startY;
            const friction = 0.95;
            
            function animate() {
                currentMomentumX *= friction;
                currentMomentumY *= friction;
                
                currentPosX += currentMomentumX;
                currentPosY += currentMomentumY;
                
                setTranslate(currentPosX, currentPosY, box);
                
                if (Math.abs(currentMomentumX) > 0.1 || Math.abs(currentMomentumY) > 0.1) {
                    requestAnimationFrame(animate);
                }
            }
            
            requestAnimationFrame(animate);
        }

        function setTranslate(xPos, yPos, el) {
            el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
        }

        // Event listeners
        header.addEventListener('mousedown', dragStart);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', dragEnd);
        
        // Touch events
        header.addEventListener('touchstart', dragStart, { passive: false });
        document.addEventListener('touchmove', drag, { passive: false });
        document.addEventListener('touchend', dragEnd);

        // Click handler for video control
        header.addEventListener('click', (e) => {
            if (!isDragging) {
                toggleVideo(iframe);
            }
        });
    });

    // Add click handlers for sidebar buttons
    videoButtons.forEach(button => {
        button.addEventListener('click', () => {
            const videoId = button.getAttribute('data-video');
            const videoBox = document.getElementById(videoId);
            const iframe = videoBox.querySelector('iframe');
            
            // Toggle video visibility
            if (videoBox.classList.contains('hidden')) {
                // Show video
                videoBox.classList.remove('hidden');
                button.classList.add('active');
                // Reset position to default
                videoBox.style.transform = 'translate3d(0px, 0px, 0)';
                // Play video
                toggleVideo(iframe);
            } else {
                // Hide video
                videoBox.classList.add('hidden');
                button.classList.remove('active');
                // Pause video
                const player = new YT.Player(iframe);
                player.pauseVideo();
            }
        });
    });
});

// Function to toggle video play/pause
function toggleVideo(iframe) {
    const videoId = iframe.src.split('/').pop().split('?')[0];
    const player = new YT.Player(iframe);
    
    if (player.getPlayerState() === YT.PlayerState.PLAYING) {
        player.pauseVideo();
    } else {
        player.playVideo();
    }
}

// Load YouTube API
function loadYouTubeAPI() {
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

loadYouTubeAPI(); 