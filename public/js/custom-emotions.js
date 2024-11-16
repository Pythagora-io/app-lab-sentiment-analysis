document.addEventListener('DOMContentLoaded', function() {
  console.log('DOMContentLoaded event fired for emotions');
  console.log('Predefined emotions:', window.predefinedEmotions);
  console.log('Custom emotions:', window.customEmotions);
  const customEmotionInput = document.getElementById('customEmotion');
  const addCustomEmotionBtn = document.getElementById('addCustomEmotion');
  const emotionsSelect = document.getElementById('emotionsSelect');
  let isSubmitting = false;

  function updateEmotionsSelect(predefinedEmotions, customEmotions) {
    emotionsSelect.innerHTML = '';

    const predefinedOptgroup = document.createElement('optgroup');
    predefinedOptgroup.label = 'Predefined Emotions';
    predefinedEmotions.forEach(emotion => {
      const option = new Option(emotion, emotion);
      predefinedOptgroup.appendChild(option);
    });
    emotionsSelect.appendChild(predefinedOptgroup);

    const customOptgroup = document.createElement('optgroup');
    customOptgroup.label = 'Custom Emotions';
    customEmotions.forEach(emotion => {
      const option = new Option(emotion, emotion);
      customOptgroup.appendChild(option);
    });
    emotionsSelect.appendChild(customOptgroup);
  }

  // Initialize the emotions select
  updateEmotionsSelect(window.predefinedEmotions, window.customEmotions);

  addCustomEmotionBtn.addEventListener('click', async function() {
    if (isSubmitting) return;
    isSubmitting = true;

    const customEmotion = customEmotionInput.value.trim();
    console.log('Custom emotion input value:', customEmotion);
    if (customEmotion) {
      try {
        console.log('Sending request to add custom emotion');
        const response = await fetch('/feedback/add-custom-emotion', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ emotion: customEmotion }),
        });

        console.log('Response status:', response.status);
        if (response.ok) {
          const data = await response.json();
          console.log('Response data:', data);
          window.customEmotions = data.emotions;
          updateEmotionsSelect(window.predefinedEmotions, window.customEmotions);
          customEmotionInput.value = '';
          console.log('Custom emotion added successfully:', customEmotion);
          alert('Custom emotion added successfully!');
        } else {
          throw new Error('Failed to add custom emotion');
        }
      } catch (error) {
        console.error('Error adding custom emotion:', error);
        alert('Failed to add custom emotion. Please try again.');
      } finally {
        isSubmitting = false;
      }
    } else {
      isSubmitting = false;
    }
  });
});