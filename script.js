document.addEventListener('DOMContentLoaded', () => {
    const urlInput = document.getElementById('urlInput');
    const extractButton = document.getElementById('extractButton');
    const loadingDiv = document.getElementById('loading');
    const resultDiv = document.getElementById('result');
    const sourceCodeOutput = document.getElementById('sourceCodeOutput');

    // This is a placeholder for actual backend integration.
    // In a real scenario, you'd send the URL to a server-side script
    // which would then fetch and return the source code.
    extractButton.addEventListener('click', async () => {
        const url = urlInput.value.trim();
        if (!url) {
            alert("Please enter a URL to extract its source code.");
            return;
        }

        loadingDiv.classList.remove('hidden');
        resultDiv.classList.add('hidden');
        sourceCodeOutput.textContent = ''; // Clear previous results

        try {
            // Placeholder: Simulate a network request
            // In a real application, replace this with an actual fetch to your backend:
            // const response = await fetch(`/api/extract?url=${encodeURIComponent(url)}`);
            // const data = await response.json();
            // sourceCodeOutput.textContent = data.sourceCode;

            // For demonstration, let's just show a simple fake response after a delay
            await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate loading time

            // A very basic client-side fetch, this will likely hit CORS issues
            // if trying to fetch arbitrary domains directly from the browser.
            // This is purely for local testing visualization.
            // A server-side proxy is HIGHLY recommended for production.
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const html = await response.text();
            sourceCodeOutput.textContent = html;


            resultDiv.classList.remove('hidden');
        } catch (error) {
            console.error('Extraction failed:', error);
            sourceCodeOutput.textContent = `Error: Could not retrieve source code. This might be due to CORS policy, invalid URL, or server issues. Please ensure the URL is correct and try again. For live websites, a backend proxy is usually required for extraction. \n\nDetails: ${error.message}`;
            resultDiv.classList.remove('hidden');
        } finally {
            loadingDiv.classList.add('hidden');
        }
    });
});

function copyToClipboard() {
    const sourceCodeElement = document.getElementById('sourceCodeOutput');
    const textToCopy = sourceCodeElement.textContent;

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(textToCopy)
            .then(() => {
                alert("Source code copied to clipboard!");
            })
            .catch(err => {
                console.error('Failed to copy text: ', err);
                fallbackCopyToClipboard(textToCopy); // Fallback for older browsers
            });
    } else {
        fallbackCopyToClipboard(textToCopy);
    }
}

function fallbackCopyToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        const successful = document.execCommand('copy');
        const msg = successful ? 'successful' : 'unsuccessful';
        alert(`Source code copied to clipboard! (Fallback method ${msg})`);
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
        alert('Failed to copy text using fallback method.');
    }

    document.body.removeChild(textArea);
}