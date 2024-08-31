type Props = {
  children?: React.ReactNode;

  style?: React.CSSProperties;
};

export const Tag: React.FC<Props> = ({ children, style }) => (
  <div style={{ ...style, padding: 4 }}>{children}</div>
);
