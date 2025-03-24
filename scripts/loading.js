// NEW
let loadedItems = 0;
let totalItems = 0;
let currentPercent = 0;

const apiFetches = [
  `${ENDPOINT_DATA}/platform_obj.json`,
  `${ENDPOINT_DATA}/profile.json`,
  // Add more API URLs here
];

// Smooth progress update with easing towards the end
const updateLoadingProgressSmoothly = (targetPercent, delay = 50) => {
  targetPercent = Math.min(targetPercent, 100); // Cap at 100%
  const step = (targetPercent - currentPercent) / 100; // Smaller step for smoother progress
  log(`Updating loading progress to ${targetPercent}%, step: ${step}`);

  const interval = setInterval(() => {
    if (currentPercent < targetPercent) {
      currentPercent += step;
      currentPercent = Math.min(currentPercent, targetPercent); // Ensure it doesn't overshoot
      document.getElementById('loading-bar').style.width = `${currentPercent}%`;
      document.getElementById('loading-text').innerText = `${Math.floor(currentPercent)}%`;
    } else {
      clearInterval(interval);

      // Only hide the loading screen when 100% is reached
      if (currentPercent >= 100) {
        setTimeout(() => {
          document.getElementById('loading-screen').style.opacity = "0";
          document.getElementById('loading-screen').style.zIndex = "-999";
        }, 300);
      }
    }
  }, delay);
};

// Function to update loading progress
const updateLoadingProgress = () => {
  const percent = (loadedItems / totalItems) * 100;

  // Slow down the earlier progress increments
  const delay = percent < 50 ? 1000 : percent < 90 ? 500 : 300; // Adjust delay based on current progress

  log(`${loadedItems}/${totalItems} - Loading progress: ${percent}%, delay: ${delay}ms`);

  updateLoadingProgressSmoothly(percent, delay);
};

// Dynamically fetch all images from the DOM
const getAllImages = () => {
  const images = [...document.querySelectorAll('img')].map(img => img.src);
  totalItems += images.length; // Increment totalItems dynamically
  return images;
};

// Track image loading with promises
const trackImageLoading = (src) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = src;
    img.onload = img.onerror = () => {
      loadedItems++;
      log(`${loadedItems}/${totalItems} - Image loaded: ${src}`);

      updateLoadingProgress();
      resolve();
    };
  });
};

// Track API loading and fetch
const trackedFetch = async (url) => {
  totalItems++; // Increment totalItems dynamically
  const apiPromise = fetch(url);
  await apiPromise;
  loadedItems++;
  log(`[DEBUG] ${loadedItems}/${totalItems} - API loaded: ${url}`);
  updateLoadingProgress();
  return apiPromise;
};

// Start tracking resources (images and API calls)
const startTrackingResources = async () => {
  const images = getAllImages(); // Automatically fetch all images from the DOM

  log(`[DEBUG] Total initial resources to load: ${totalItems} (Images: ${images.length}, APIs: ${apiFetches.length})`);

  const imagePromises = images.map(trackImageLoading);
  const fetchPromises = apiFetches.map(trackedFetch);

  await Promise.all([...imagePromises, ...fetchPromises]);
  updateLoadingProgress(); // Final call to ensure progress reaches 100%
};

// Start tracking resources when DOM is ready
document.addEventListener('DOMContentLoaded', startTrackingResources);
