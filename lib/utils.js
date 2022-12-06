const isOvsxEnabled = () => {
  return 'OVSX_PAT' in process.env;
};

const isTargetEnabled = () => {
  return (
    'VSCE_TARGET' in process.env && process.env.VSCE_TARGET !== 'universal'
  );
};

module.exports = {
  isTargetEnabled,
  isOvsxEnabled,
};
