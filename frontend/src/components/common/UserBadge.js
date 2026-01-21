const getBadge = (count) => {
  if (count >= 20) return { label: 'Scholar', icon: '💎', color: '#9c27b0' };
  if (count >= 10) return { label: 'Expert', icon: '🤓', color: '#2196f3' };
  if (count >= 5) return { label: 'Brainiac', icon: '🧠', color: '#ff9800' };
  return null;
};

const UserBadge = ({ count }) => {
  const badge = getBadge(count);
  if (!badge) return null;

  return (
    <span title={badge.label} style={{ marginRight: '5px', cursor: 'help' }}>
      {badge.icon}
    </span>
  );
};

export default UserBadge;