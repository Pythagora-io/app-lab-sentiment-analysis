document.addEventListener('DOMContentLoaded', () => {
  // Add animation classes to elements when they enter the viewport
  const animateOnScroll = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate__animated', 'animate__fadeInUp');
      }
    });
  });

  // Apply the animation to all sections and important elements
  document.querySelectorAll('section, .card, .list-group-item').forEach(el => {
    animateOnScroll.observe(el);
  });
});