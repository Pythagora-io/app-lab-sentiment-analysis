document.addEventListener('DOMContentLoaded', function() {
  const analyzeBtn = document.getElementById('analyzeBtn');
  const selectAllBtn = document.getElementById('selectAllBtn');
  const deselectAllBtn = document.getElementById('deselectAllBtn');
  const startDateInput = document.getElementById('startDate');
  const endDateInput = document.getElementById('endDate');
  const productFilterInput = document.getElementById('productFilter');
  const sortOrderSelect = document.getElementById('sortOrder');
  const appliedFiltersDiv = document.getElementById('appliedFilters');
  const feedbackTableBody = document.getElementById('feedbackTableBody');
  const loadingSpinner = document.getElementById('loadingSpinner');
  const noResultsMessage = document.getElementById('noResultsMessage');
  const analysisResults = document.getElementById('analysisResults');
  const errorMessage = document.getElementById('errorMessage');
  const checkboxes = document.querySelectorAll('input[name="selectedFeedback"]');
  const emotionsSelect = document.getElementById('emotionsSelect');
  const customEmotionInput = document.getElementById('customEmotion');
  let analysisPerformed = false;

  function updateAnalyzeButton() {
    const checkedBoxes = document.querySelectorAll('input[name="selectedFeedback"]:checked');
    analyzeBtn.disabled = checkedBoxes.length === 0;
  }

  function toggleAllCheckboxes(checked) {
    checkboxes.forEach(checkbox => {
      checkbox.checked = checked;
    });
    updateAnalyzeButton();
  }

  function applySelectors() {
    const startDate = startDateInput.value ? new Date(startDateInput.value) : null;
    const endDate = endDateInput.value ? new Date(endDateInput.value) : null;
    if (endDate) {
      endDate.setHours(23, 59, 59, 999);
    }
    const productFilter = productFilterInput.value.toLowerCase();

    checkboxes.forEach(checkbox => {
      const row = checkbox.closest('tr');
      const feedbackDate = new Date(checkbox.dataset.date);
      const product = row.querySelector('td:nth-child(4)').textContent.toLowerCase();

      const isDateInRange = (!startDate || feedbackDate >= startDate) && (!endDate || feedbackDate <= endDate);
      const isProductMatch = !productFilter || product.includes(productFilter);

      checkbox.checked = isDateInRange && isProductMatch;
      row.style.display = 'table-row'; // Always display the row
    });

    updateAppliedSelectors();
    updateAnalyzeButton();
  }

  function sortFeedback() {
    const rows = Array.from(feedbackTableBody.querySelectorAll('tr'));
    const sortOrder = sortOrderSelect.value;

    rows.sort((a, b) => {
      const dateA = new Date(a.querySelector('input[type="checkbox"]').dataset.date);
      const dateB = new Date(b.querySelector('input[type="checkbox"]').dataset.date);
      const productA = a.querySelector('td:nth-child(4)').textContent.toLowerCase();
      const productB = b.querySelector('td:nth-child(4)').textContent.toLowerCase();

      switch (sortOrder) {
        case 'dateAsc':
          return dateA - dateB;
        case 'dateDesc':
          return dateB - dateA;
        case 'productAsc':
          return productA.localeCompare(productB);
        case 'productDesc':
          return productB.localeCompare(productA);
        default:
          return 0;
      }
    });

    rows.forEach(row => feedbackTableBody.appendChild(row));
  }

  function updateAppliedSelectors() {
    let selectors = [];

    if (startDateInput.value) selectors.push(`Start Date: ${startDateInput.value}`);
    if (endDateInput.value) selectors.push(`End Date: ${endDateInput.value}`);
    if (productFilterInput.value) selectors.push(`Product: ${productFilterInput.value}`);

    appliedFiltersDiv.innerHTML = selectors.length > 0 ?
      `<strong>Applied Selectors:</strong> ${selectors.join(', ')}` : '';
  }

  function displayError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
  }

  function hideError() {
    errorMessage.style.display = 'none';
  }

  function showLoading() {
    loadingSpinner.style.display = 'flex';
    loadingSpinner.style.position = 'fixed';
    loadingSpinner.style.top = '0';
    loadingSpinner.style.left = '0';
    loadingSpinner.style.width = '100%';
    loadingSpinner.style.height = '100%';
    loadingSpinner.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    loadingSpinner.style.zIndex = '9999';
    analyzeBtn.disabled = true;
  }

  function hideLoading() {
    loadingSpinner.style.display = 'none';
    analyzeBtn.disabled = false;
  }

  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', updateAnalyzeButton);
  });

  selectAllBtn.addEventListener('click', () => toggleAllCheckboxes(true));
  deselectAllBtn.addEventListener('click', () => toggleAllCheckboxes(false));
  startDateInput.addEventListener('change', applySelectors);
  endDateInput.addEventListener('change', applySelectors);
  productFilterInput.addEventListener('input', applySelectors);
  sortOrderSelect.addEventListener('change', sortFeedback);

  analyzeBtn.addEventListener('click', async function() {
    const selectedIds = Array.from(document.querySelectorAll('input[name="selectedFeedback"]:checked'))
      .map(checkbox => checkbox.value);
    const selectedEmotions = Array.from(emotionsSelect.selectedOptions).map(option => option.value);
    const selectedAspects = Array.from(document.getElementById('customAspectSelect').selectedOptions).map(option => option.value);

    if (selectedIds.length === 0) {
      displayError('Please select at least one feedback to analyze.');
      return;
    }

    hideError();
    showLoading();

    try {
      const response = await fetch('/feedback/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ selectedFeedbackIds: selectedIds, selectedEmotions, selectedAspects }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Analysis request failed');
      }

      displayAnalysisResults(data.results);
      analysisPerformed = true;
      switchToResultsTab();
    } catch (error) {
      console.error('Error during analysis:', error);
      displayError(error.message);
      switchToResultsTab();
    } finally {
      hideLoading();
    }
  });

  function displayAnalysisResults(results) {
    console.log('Entering displayAnalysisResults with:', JSON.stringify(results, null, 2));
    noResultsMessage.style.display = 'none';
    analysisResults.style.display = 'block';
    const resultsSummary = document.getElementById('resultsSummary');
    const detailedResults = document.getElementById('detailedResults');
    resultsSummary.innerHTML = '';
    detailedResults.innerHTML = '';

    // Display summary
    if (results.summary) {
      const summaryList = document.createElement('ul');
      Object.entries(results.summary).forEach(([category, content]) => {
        if (category !== 'emotion_analysis' && category !== 'aspect_sentiment_analysis') {
          const li = document.createElement('li');
          const formattedContent = Array.isArray(content) ? content.join(', ') : content;
          li.innerHTML = `<strong>${category.charAt(0).toUpperCase() + category.slice(1)}:</strong> ${formattedContent}`;
          summaryList.appendChild(li);
        }
      });
      resultsSummary.appendChild(summaryList);
    }

    // Add emotion analysis to the summary
    if (results.summary.emotion_analysis) {
      const emotionList = document.createElement('ul');
      Object.entries(results.summary.emotion_analysis).forEach(([emotion, intensity]) => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${emotion}:</strong> ${intensity}`;
        emotionList.appendChild(li);
      });
      const emotionHeader = document.createElement('h4');
      emotionHeader.textContent = 'Emotion Analysis';
      resultsSummary.appendChild(emotionHeader);
      resultsSummary.appendChild(emotionList);
    }

    // Add aspect-based sentiment analysis to the summary
    if (results.summary.aspect_sentiment_analysis) {
      const aspectSentimentList = document.createElement('ul');
      results.summary.aspect_sentiment_analysis.forEach(aspect => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${aspect.aspect}:</strong> Sentiment: ${aspect.sentiment_score.toFixed(2)}, ${aspect.explanation}`;
        aspectSentimentList.appendChild(li);
      });
      const aspectHeader = document.createElement('h4');
      aspectHeader.textContent = 'Aspect-based Sentiment Analysis';
      resultsSummary.appendChild(aspectHeader);
      resultsSummary.appendChild(aspectSentimentList);
    }

    // Display detailed results
    results.detailedAnalysis.forEach(result => {
      const resultElement = document.createElement('div');
      resultElement.className = 'analysis-result mb-4';
      resultElement.innerHTML = `
        <h4>${result.customerName} - ${new Date(result.date).toLocaleDateString()}</h4>
        <p><strong>Feedback:</strong> ${result.feedbackText}</p>
        <p><strong>Analysis:</strong></p>
        <ul>
          ${Object.entries(result.analysis).map(([key, value]) => `
            <li>
              <strong>${key.charAt(0).toUpperCase() + key.slice(1)}:</strong>
              ${Array.isArray(value) ? value.join(', ') : value}
            </li>
          `).join('')}
        </ul>
      `;
      detailedResults.appendChild(resultElement);
    });
  }

  function switchToResultsTab() {
    document.getElementById('feedbacks-tab').classList.remove('active');
    document.getElementById('results-tab').classList.add('active');
    document.getElementById('feedbacks').classList.remove('show', 'active');
    document.getElementById('results').classList.add('show', 'active');

    if (!analysisPerformed) {
      noResultsMessage.style.display = 'block';
      analysisResults.style.display = 'none';
    } else {
      noResultsMessage.style.display = 'none';
      analysisResults.style.display = 'block';
    }
  }

  const resultTab = document.getElementById('results-tab');
  resultTab.addEventListener('click', switchToResultsTab);
});