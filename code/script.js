document.getElementById('askButton').addEventListener('click', () => {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = 'en-US';

  recognition.onstart = () => {
      console.log('Voice recognition started. Speak into the microphone.');
  };

  recognition.onspeechend = () => {
      console.log('Voice recognition stopped.');
      recognition.stop();
  };

  recognition.onresult = async (event) => {
      const transcript = event.results[0][0].transcript;
      console.log('You said:', transcript);
      const questionElement = document.getElementById('question');
      const responseElement = document.getElementById('response');
      
      questionElement.textContent = transcript;
      
      try {
          const response = await fetch('/api/openai', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ prompt: transcript }),
          });

          if (!response.ok) {
              throw new Error('Network response was not ok');
          }

          const data = await response.json();
          const answer = data.choices[0].message.content;
          responseElement.textContent = answer;
          speakResponse(answer);
      } catch (error) {
          console.error('Error:', error);
          responseElement.textContent = 'An error occurred. Please try again.';
      }
  };

  recognition.onerror = (event) => {
      console.error('Recognition error:', event.error);
  };

  recognition.start();
});

function speakResponse(text) {
  const synth = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance(text);
  synth.speak(utterance);
}
