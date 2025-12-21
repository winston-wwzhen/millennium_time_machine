// cloudfunctions/chat/glm.js
const axios = require("axios");
const config = require("./config");

const callGLM = async (messages, temperature) => {
  // 🔍 LOG: 打印请求的关键参数（便于确认发了什么给 AI）
  console.log(
    "🚀 [GLM请求开始] 参数快照:",
    JSON.stringify({
      model: config.MODEL_NAME,
      messages: messages,
      temperature: temperature,
      key: config.API_KEY ? "已配置" : "未配置",
    })
  );

  try {
    const response = await axios.post(
      config.API_URL,
      {
        model: config.MODEL_NAME,
        messages: messages,
        temperature: temperature || 0.9,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.API_KEY}`,
        },
        timeout: config.TIMEOUT,
      }
    );

    // ✅ LOG: 成功时的简要信息
    console.log("✅ [GLM调用成功] 用量:", JSON.stringify(response.data.usage));

    return {
      success: true,
      content: response.data.choices[0].message.content,
    };
  } catch (error) {
    // ❌ LOG: 错误详情分析
    console.error("❌ [GLM调用异常] 错误简述:", error.message);

    if (error.response) {
      // 服务器返回了状态码，但不在 2xx 范围内 (最常见的错误来源)
      console.error("🔥 [API响应状态码]:", error.response.status);
      console.error("🔥 [API响应详情]:", JSON.stringify(error.response.data));
    } else if (error.request) {
      // 请求已发出但无响应 (超时等)
      console.error("⏳ [网络无响应] 请求已发出，未收到回包");
    } else {
      // 设置请求时发生错误
      console.error("⚠️ [配置错误]:", error.config);
    }

    return {
      success: false,
      error: error,
    };
  }
};

module.exports = { callGLM };
