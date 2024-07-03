// Create a draggable modal box with message sending functionality
function createModal() {
  const modal = document.createElement('div');
  modal.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 400px;
    background-color: #87ceeb; /* Sky blue */
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    cursor: move;
  `;

  const header = document.createElement('div');
  header.style.cssText = `
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    cursor: move; /* Make header draggable */
  `;

  const title = document.createElement('div');
  title.textContent = 'WTF! Cheats (drag from the top)';
  title.style.fontSize = '20px';
  title.style.color = '#fff'; // Text color for the title

  const closeButton = document.createElement('span');
  closeButton.textContent = '✖';
  closeButton.style.cursor = 'pointer';
  closeButton.style.color = '#fff'; // Color for close button text
  closeButton.addEventListener('click', () => {
    document.body.removeChild(modal);
  });

  header.appendChild(title);
  header.appendChild(closeButton);
  modal.appendChild(header);

  const content = document.createElement('div');
  const webhookInput = createInput('text', 'Enter your Discord webhook URL');
  const messageInput = createTextarea('Enter your message');
  const speedInput = createInput('number', 'Messages per second (max 100)');
  const sendButton = document.createElement('button');
  sendButton.textContent = 'Send';
  sendButton.style.cssText = `
    padding: 8px 16px;
    font-size: 16px;
    cursor: pointer;
    background-color: #28a745; /* Green for initial state */
    color: #fff;
    border: none;
    border-radius: 4px;
    margin-top: 10px;
  `;
  
  let intervalId = null; // Track the interval ID for sending messages
  let sendingMessages = false; // Track if messages are currently being sent

  sendButton.addEventListener('click', async () => {
    const webhookUrl = webhookInput.value.trim();
    const message = messageInput.value.trim();
    const messagesPerSecond = parseInt(speedInput.value.trim());

    if (!webhookUrl || !message || !messagesPerSecond) {
      alert('Please enter webhook URL, message, and messages per second.');
      return;
    }

    if (messagesPerSecond < 1 || messagesPerSecond > 100) {
      alert('Messages per second must be between 1 and 100.');
      return;
    }

    if (!sendingMessages) {
      // Start sending messages
      try {
        sendingMessages = true;
        sendButton.textContent = 'End'; // Change button text to 'End'
        sendButton.style.backgroundColor = '#dc3545'; // Change background color to red
        
        intervalId = setInterval(async () => {
          const requestOptions = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ content: message })
          };

          const response = await fetch(webhookUrl, requestOptions);
          if (!response.ok) {
            throw new Error('Failed to send message.');
          }
          console.log('Message sent to Discord:', message);
        }, 1000 / messagesPerSecond);
        
        alert(`Messages started sending at ${messagesPerSecond} messages per second!`);
      } catch (error) {
        console.error('Error sending messages to Discord:', error);
        alert('Failed to start sending messages. Check console for details.');
        sendingMessages = false;
        clearInterval(intervalId);
        sendButton.textContent = 'Send';
        sendButton.style.backgroundColor = '#28a745'; // Reset background color to green
      }
    } else {
      // Stop sending messages
      sendingMessages = false;
      clearInterval(intervalId);
      sendButton.textContent = 'Send'; // Change button text back to 'Send'
      sendButton.style.backgroundColor = '#28a745'; // Reset background color to green
      alert('Message sending stopped.');
    }
  });

  content.appendChild(webhookInput);
  content.appendChild(messageInput);
  content.appendChild(speedInput);
  content.appendChild(sendButton);
  modal.appendChild(content);

  document.body.appendChild(modal);

  // Function to create input field
  function createInput(type, placeholder) {
    const input = document.createElement('input');
    input.type = type;
    input.placeholder = placeholder;
    input.style.cssText = `
      width: 100%;
      padding: 8px;
      margin-bottom: 10px;
      border: 1px solid #ccc;
      border-radius: 4px;
      font-size: 16px;
    `;
    return input;
  }

  // Function to create textarea
  function createTextarea(placeholder) {
    const textarea = document.createElement('textarea');
    textarea.placeholder = placeholder;
    textarea.style.cssText = `
      width: 100%;
      height: 100px;
      padding: 8px;
      margin-bottom: 10px;
      border: 1px solid #ccc;
      border-radius: 4px;
      font-size: 16px;
    `;
    return textarea;
  }

  // Make the modal draggable
  let isDragging = false;
  let modalX, modalY, mouseX, mouseY;

  modal.addEventListener('mousedown', startDrag);

  function startDrag(e) {
    if (e.target === header || e.target === title || e.target === closeButton) {
      isDragging = true;
      modalX = modal.offsetLeft - e.clientX;
      modalY = modal.offsetTop - e.clientY;
      document.addEventListener('mousemove', dragModal);
      document.addEventListener('mouseup', () => {
        isDragging = false;
      });
    }
  }

  function dragModal(e) {
    if (isDragging) {
      modal.style.left = e.clientX + modalX + 'px';
      modal.style.top = e.clientY + modalY + 'px';
    }
  }
}

// Call the function to create the modal
createModal();

