const Spokes = ({ spokeLength }) => {
  return Array.from({ length: 100 }).map((_, index) => {
    const angle = (360 / 100) * index;
    return (
      <div
        key={index}
        className="spoke"
        style={{
          transform: `rotate(${angle}deg) translate(${30}px)`, // Translate by 30px to create a gap at the center
          height: `${spokeLength}px`,
        }}
      />
    );
  });
};

export default Spokes;
