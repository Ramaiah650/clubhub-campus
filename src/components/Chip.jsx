/** Reusable chip — demonstrates component reuse + props */
function Chip({ label, tone = 'neutral', active = false, onClick }) {
  const Tag = onClick ? 'button' : 'span';
  return (
    <Tag
      type={onClick ? 'button' : undefined}
      className={`chip chip-${tone}${active ? ' is-active' : ''}${onClick ? ' chip-btn' : ''}`}
      onClick={onClick}
    >
      {label}
    </Tag>
  );
}

export default Chip;
