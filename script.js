document.addEventListener('DOMContentLoaded', () => {
    const button = document.getElementById('clickMe');
    let clickCount = 0;

    button.addEventListener('click', () => {
        clickCount++;
        button.textContent = `Clicked ${clickCount} times`;
        
        // Add a simple animation effect
        button.style.transform = 'scale(1.1)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 100);
    });
}); 