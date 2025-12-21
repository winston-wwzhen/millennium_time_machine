require('dotenv').config();

module.exports = {
  // 🔑 从环境变量中读取 Key
  API_KEY: process.env.GLM_API_KEY, 

  API_URL: "https://open.bigmodel.cn/api/paas/v4/chat/completions",
  MODEL_NAME: "GLM-4-FlashX-250414",
  TIMEOUT: 15000 
};