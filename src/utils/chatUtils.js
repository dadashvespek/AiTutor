export const generateUniqueId = () => {
  const timestamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);
  return `id-${timestamp}-${hexadecimalString}`;
};

export const typingEffect = (text, callback) => {
  let index = 0;
  let message = "";
  let timerID = setInterval(() => {
    if (index < text.length) {
      message += text.charAt(index);
      callback(message);
      index++;
    } else {
      clearInterval(timerID);
    }
  }, 15); // Speed of typing effect
};

export const loadingEffect = (callback) => {
  let dotCount = 0;
  let timerID = setInterval(() => {
    let dots = ".".repeat(dotCount);
    callback(`${dots}`);
    dotCount = (dotCount + 1) % 4;
  }, 200); // Speed of loading effect
  return timerID;
};

export const generateCodeMessage = (message) => {
  return {
    isAI: false,
    message: message,
    id: generateUniqueId(),
  };
};
