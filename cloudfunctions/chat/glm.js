// cloudfunctions/chat/glm.js
const axios = require("axios");
const config = require("./config");

const callGLM = async (messages, temperature) => {
  try {
    const response = await axios.post(
      config.API_URL,
      {
        model: config.MODEL_NAME,
        messages: messages,
        temperature: temperature || 0.9,
        top_p: 0.7
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${config.API_KEY}`,
        },
        timeout: config.TIMEOUT 
      }
    );

    return {
      success: true,
      content: response.data.choices[0].message.content
    };

  } catch (error) {
    console.error("GLM API Error:", error.message);
    return {
      success: false,
      error: error
    };
  }
};

module.exports = { callGLM };