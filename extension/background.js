// Listen for messages from popup or content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  chrome.storage.local.get(['skillmapBaseUrl'], (result) => {
    const baseUrl = result.skillmapBaseUrl || "http://localhost:3000";
    const apiBaseUrl = `${baseUrl}/api/extension`;

    if (request.action === "GET_PROFILE") {
      const userId = request.userId || "demo_user";
      fetch(`${apiBaseUrl}/profile?user_id=${userId}`)
        .then(response => response.json())
        .then(data => sendResponse({ success: true, data }))
        .catch(error => sendResponse({ success: false, error: error.message }));
    }

    else if (request.action === "ANALYZE_PAGE") {
      const userId = request.userId || "demo_user";
      fetch(`${apiBaseUrl}/analyze-job?user_id=${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ page_text: request.pageText, page_url: request.pageUrl })
      })
        .then(response => response.json())
        .then(data => sendResponse({ success: true, data }))
        .catch(error => sendResponse({ success: false, error: error.message }));
    }

    else if (request.action === "FIND_BEST_MATCH") {
      const userId = request.userId || "demo_user";
      fetch(`${apiBaseUrl}/find-match`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ links: request.links, userId: userId })
      })
        .then(response => response.json())
        .then(data => sendResponse(data))
        .catch(error => sendResponse({ success: false, error: error.message }));
    }
  });

  return true; // Indicates async response
});
