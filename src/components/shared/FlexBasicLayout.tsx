type Props = {
  left?: React.ReactElement;
  right?: React.ReactElement;
};

export const FlexBasicLayout: React.FC<Props> = ({ left, right }) => {
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      {left}
      {right && <div style={{ flex: 1 }} />}
      {right}
    </div>
  );
};
