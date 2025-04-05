let timer;
let totalSeconds = 0;
let isRunning = false;

const hoursInput = document.getElementById('hours');
const minutesInput = document.getElementById('minutes');
const secondsInput = document.getElementById('seconds');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const modeToggle = document.getElementById('modeToggle');
const completionEffect = document.getElementById('completionEffect');
const timerDisplay = document.getElementById('timer');

// Fullscreen functionality
const fullscreenBtn = document.getElementById('fullscreenBtn');
const container = document.querySelector('.container');

// Dark mode toggle
function toggleDarkMode() {
    const isDark = document.body.getAttribute('data-theme') === 'dark';
    document.body.setAttribute('data-theme', isDark ? 'light' : 'dark');
    localStorage.setItem('theme', isDark ? 'light' : 'dark');
    modeToggle.innerHTML = isDark ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
}

// Initialize theme based on system preference
function initializeTheme() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme');
    const systemTheme = prefersDark ? 'dark' : 'light';
    const theme = savedTheme || systemTheme;
    document.body.setAttribute('data-theme', theme);
    modeToggle.innerHTML = theme === 'light' ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
}

// Listen for system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (!localStorage.getItem('theme')) {
        const newTheme = e.matches ? 'dark' : 'light';
        document.body.setAttribute('data-theme', newTheme);
        modeToggle.innerHTML = newTheme === 'light' ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
    }
});

// Initialize theme on page load
initializeTheme();

// Event Listeners
modeToggle.addEventListener('click', toggleDarkMode);

function updateDisplay() {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    timerDisplay.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function startTimer() {
    if (!isRunning) {
        if (totalSeconds === 0) {
            const hours = parseInt(hoursInput.value) || 0;
            const minutes = parseInt(minutesInput.value) || 0;
            const seconds = parseInt(secondsInput.value) || 0;
            totalSeconds = hours * 3600 + minutes * 60 + seconds;
            
            if (totalSeconds === 0) {
                alert('Please set a valid time!');
                return;
            }
        }
        
        isRunning = true;
        startBtn.textContent = 'Pause';
        startBtn.style.background = 'var(--hover-color)';
        
        timer = setInterval(() => {
            if (totalSeconds > 0) {
                totalSeconds--;
                updateDisplay();
            } else {
                clearInterval(timer);
                isRunning = false;
                startBtn.textContent = 'Start';
                startBtn.style.background = '';
                showCompletionEffect();
            }
        }, 1000);
    } else {
        clearInterval(timer);
        isRunning = false;
        startBtn.textContent = 'Start';
        startBtn.style.background = '';
    }
}

function resetTimer() {
    clearInterval(timer);
    isRunning = false;
    totalSeconds = 0;
    hoursInput.value = '';
    minutesInput.value = '';
    secondsInput.value = '';
    updateDisplay();
    startBtn.textContent = 'Start';
    startBtn.style.background = '';
    hideCelebration();
}

// Fullscreen functionality
fullscreenBtn.addEventListener('click', toggleFullscreen);

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        container.requestFullscreen().catch(err => {
            console.log(`Error attempting to enable fullscreen: ${err.message}`);
        });
    } else {
        document.exitFullscreen();
    }
}

// Input validation
[hoursInput, minutesInput, secondsInput].forEach(input => {
    input.addEventListener('input', () => {
        let value = parseInt(input.value);
        const max = parseInt(input.max);
        const min = parseInt(input.min);
        
        if (isNaN(value)) {
            input.value = '';
        } else if (value > max) {
            input.value = max;
        } else if (value < min) {
            input.value = min;
        }
    });
});

// Keyboard shortcuts
document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        event.preventDefault();
        startTimer();
    } else if (event.code === 'Escape') {
        resetTimer();
    }
});

// Event Listeners
startBtn.addEventListener('click', startTimer);
resetBtn.addEventListener('click', resetTimer);

// Initialize display
updateDisplay();

function showCompletionEffect() {
    completionEffect.style.display = 'block';
    completionEffect.innerHTML = '';
    
    // Create celebration text
    const text = document.createElement('div');
    text.className = 'celebration-text';
    text.textContent = 'Time\'s Up!';
    completionEffect.appendChild(text);
    
    // Create confetti
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = `${Math.random() * 100}%`;
        confetti.style.animationDelay = `${Math.random() * 2}s`;
        confetti.style.setProperty('--confetti-color', `hsl(${Math.random() * 360}, 100%, 50%)`);
        completionEffect.appendChild(confetti);
    }
    
    // Play completion sound
    const audio = new Audio('data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU');
    audio.play().catch(e => console.log('Audio playback failed:', e));
    
    // Show notification if permission granted
    if (Notification.permission === 'granted') {
        new Notification('Timer Complete!', {
            body: 'Your countdown timer has finished!',
            icon: '/timer-icon.png'
        });
    }
    
    setTimeout(() => {
        completionEffect.style.display = 'none';
    }, 3000);
}

function hideCelebration() {
    completionEffect.style.display = 'none';
    completionEffect.innerHTML = '';
}

// Request notification permission
if ('Notification' in window) {
    Notification.requestPermission();
} 