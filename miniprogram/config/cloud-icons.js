// 云存储图标URL配置
const CLOUD_BASE_URL = 'cloud://cloud1-4gvtpokae6f7dbab.636c-cloud1-4gvtpokae6f7dbab-1392774085';

function getCloudIconUrl(iconName) {
  return CLOUD_BASE_URL + '/icons/' + iconName;
}

module.exports = {
  getCloudIconUrl,
  CLOUD_BASE_URL
};
