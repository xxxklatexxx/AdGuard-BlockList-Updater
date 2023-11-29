// Define the URL to fetch JSON data
const jsonUrl = "https://adguardteam.github.io/HostlistsRegistry/assets/filters.json";

// Define the API endpoint
const apiUrl = "http://<update endpoint>/control/filtering/add_url";

// Function to fetch JSON data
async function fetchJsonData(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  return response.json();
}

// Function to send data to the API
async function sendDataToApi(filter) {
  const requestData = {
    name: filter.name,
    url: filter.downloadUrl,
    whitelist: false // You can adjust this value as needed
  };

  // Make the API call using fetch
  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // Include any additional headers or cookies as needed
    },
    body: JSON.stringify(requestData)
  });

  if (response.ok) {
    const responseData = response.statusText;
    console.log(`Data sent for filter ${filter.filterId}. API response:`, responseData);
  } else {
    const errorResponse = {
      type: response.type,
      url: response.url,
      redirected: response.redirected,
      status: response.status,
      ok: response.ok,
      statusText: response.statusText,
      headers: response.headers,
      // You may need to adjust the property based on the actual response structure
      body: await response.text(),
      bodyUsed: response.bodyUsed
    };
    console.error(`Error sending data for filter ${filter.filterId}. API response:`, errorResponse);
  }
}

// Fetch JSON data and process filters
fetchJsonData(jsonUrl)
  .then(data => {
    const filters = data.filters || [];
    filters.forEach(filter => {
      sendDataToApi(filter);
    });
  })
  .catch(error => {
    console.error("Error fetching or processing JSON data:", error);
  });
