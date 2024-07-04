
//this is for testing purposes only
//do not use this for malicious purpose, we do not condome that
//this is for testing discord anti-spam bots for discord

//code starts here

function createModal() {
  const modal = document.createElement('div');
  modal.style.cssText = `
    position: fixed;
    top: 50px; /* Changed to top 50px for top-left corner */
    left: 50px; /* Changed to left 50px for top-left corner */
    width: 300px; /* Adjusted the width for smaller size */
    height: auto; /* Auto height for vertical adjustment */
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
  `;

  const title = document.createElement('div');
  title.textContent = 'WTF! (Discord webhook spammer!)';
  title.style.fontSize = '16px'; /* Adjusted the font size */
  title.style.color = '#fff'; // Text color for the title

  const closeButton = document.createElement('span');
  closeButton.textContent = '✖';
  closeButton.style.cssText = `
    cursor: pointer;
    color: #ff0000; /* Red color for close button text */
    font-size: 24px; /* Larger font size for the close button */
  `;
  closeButton.addEventListener('click', () => {
    document.body.removeChild(modal);
  });

  header.appendChild(title);
  header.appendChild(closeButton);
  modal.appendChild(header);

  const content = document.createElement('div');
  content.style.cssText = `
    display: flex;
    flex-direction: column;
    align-items: center; /* Center content vertically */
  `;

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

  const buttonsContainer = document.createElement('div');
  buttonsContainer.style.cssText = `
    display: flex;
    justify-content: space-between;
    position: absolute;
    bottom: 10px;
    right: 10px;
  `;

  const discordButton = createImageButton(
    'https://cdn.discordapp.com/attachments/1257026628916215840/1258223757902741574/discord-logo-icon-editorial-free-vector.png?ex=668743b0&is=6685f230&hm=cb953f291746e4daea36b6e3a2abca465a38d97e2fa15b8346a8982456c03132&',
    'https://discord.gg/kg5kCTqVYQ'
  );
  const githubButton = createImageButton(
    'https://cdn.discordapp.com/attachments/1257026628916215840/1258223808209358879/images.png?ex=668743bc&is=6685f23c&hm=bd0c604e018147e1c7f23d8a25087b41809ba2aa77078f230f5eda49b7e3716e&',
    'https://github.com/sytsytdispatch'
  );

  buttonsContainer.appendChild(discordButton);
  buttonsContainer.appendChild(githubButton);
  modal.appendChild(buttonsContainer);

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

  // Function to create image button
  function createImageButton(imageSrc, linkUrl) {
    const link = document.createElement('a');
    link.href = linkUrl;
    link.target = '_blank';

    const image = document.createElement('img');
    image.src = imageSrc;
    image.style.cssText = `
      width: 30px;
      height: 30px;
      margin-left: 5px;
    `;

    link.appendChild(image);
    return link;
  }

  // Make the modal draggable
  let isDragging = false;
  let modalX, modalY, mouseX, mouseY;

  modal.addEventListener('mousedown', startDrag);

  function startDrag(e) {
    if (e.target !== webhookInput && e.target !== messageInput && e.target !== speedInput && e.target !== sendButton && e.target.tagName !== 'IMG') {
      isDragging = true;
      modalX = modal.offsetLeft - e.clientX;
      modalY = modal.offsetTop - e.clientY;
      document.addEventListener('mousemove', dragModal);
      document.addEventListener('mouseup', stopDrag);
    }
  }

  function dragModal(e) {
    if (isDragging) {
      modal.style.left = e.clientX + modalX + 'px';
      modal.style.top = e.clientY + modalY + 'px';
    }
  }

  function stopDrag() {
    isDragging = false;
    document.removeEventListener('mousemove', dragModal);
  }
}

// Call the function to create the modal
createModal();
