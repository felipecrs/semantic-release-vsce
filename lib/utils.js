const isOvsxEnabled = () => {
  return 'OVSX_PAT' in process.env;
};

const isTargetEnabled = () => {
  return 'VSCE_TARGET' in process.env;
};

module.exports = {
  isTargetEnabled,
  isOvsxEnabled,
};
