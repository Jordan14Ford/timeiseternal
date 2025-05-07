document.addEventListener('DOMContentLoaded', () => {
    // Get all video boxes
    const videoBoxes = document.querySelectorAll('.video-box');
    
    // Initialize drag functionality for each video box
    videoBoxes.forEach(box => {
        const header = box.querySelector('.video-header');
        const iframe = box.querySelector('iframe');
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;
        let xOffset = 0;
        let yOffset = 0;

        // Add event listeners for drag functionality
        header.addEventListener('mousedown', dragStart);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', dragEnd);

        // Add click handler for video control
        header.addEventListener('click', (e) => {
            if (!isDragging) {
                toggleVideo(iframe);
            }
        });

        function dragStart(e) {
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;

            if (e.target === header) {
                isDragging = true;
            }
        }

        function drag(e) {
            if (isDragging) {
                e.preventDefault();
                
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;

                xOffset = currentX;
                yOffset = currentY;

                setTranslate(currentX, currentY, box);
            }
        }

        function dragEnd(e) {
            initialX = currentX;
            initialY = currentY;
            isDragging = false;
        }

        function setTranslate(xPos, yPos, el) {
            el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
        }
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