// 云环境配置列表
// 请在部署前替换为你的云环境ID
const envList = [
  // {
  //   envId: 'your-cloud-env-id', // 你的云环境ID
  //   name: '正式环境'             // 环境名称（用于显示）
  // },
  // {
  //   envId: 'test-env-id',       // 测试环境ID
  //   name: '测试环境'             // 环境名称
  // }
];

// 检测是否为Mac系统（用于路径处理）
const isMac = false;

// 导出配置
module.exports = {
  envList,
  isMac,
  // 默认使用第一个环境
  envId: envList.length > 0 ? envList[0].envId : "",
};
