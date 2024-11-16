document.addEventListener('DOMContentLoaded', function() {
  console.log('DOMContentLoaded event fired');
  console.log('Predefined aspects:', window.predefinedAspects);
  console.log('Custom aspects:', window.customAspects);
  const customAspectInput = document.getElementById('customAspectInput');
  const addCustomAspectBtn = document.getElementById('addCustomAspectBtn');
  const customAspectSelect = document.getElementById('customAspectSelect');

  function updateCustomAspectSelect(predefinedAspects, customAspects) {
    customAspectSelect.innerHTML = '';

    const predefinedOptgroup = document.createElement('optgroup');
    predefinedOptgroup.label = 'Predefined Aspects';
    predefinedAspects.forEach(aspect => {
      const option = new Option(aspect, aspect);
      predefinedOptgroup.appendChild(option);
    });
    customAspectSelect.appendChild(predefinedOptgroup);

    const customOptgroup = document.createElement('optgroup');
    customOptgroup.label = 'Custom Aspects';
    customAspects.forEach(aspect => {
      const option = new Option(aspect, aspect);
      customOptgroup.appendChild(option);
    });
    customAspectSelect.appendChild(customOptgroup);
  }

  updateCustomAspectSelect(window.predefinedAspects, window.customAspects);

  addCustomAspectBtn.addEventListener('click', async function() {
    const customAspect = customAspectInput.value.trim();
    if (customAspect) {
      try {
        const response = await fetch('/feedback/add-custom-aspect', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ aspect: customAspect }),
        });

        if (response.ok) {
          const data = await response.json();
          window.customAspects = data.aspects;
          updateCustomAspectSelect(window.predefinedAspects, window.customAspects);
          customAspectInput.value = '';
          console.log('Custom aspect added successfully:', customAspect);
          alert('Custom aspect added successfully!');
        } else {
          throw new Error('Failed to add custom aspect');
        }
      } catch (error) {
        console.error('Error adding custom aspect:', error);
        alert('Failed to add custom aspect. Please try again.');
      }
    }
  });
});