import React from "react";

type Props = {
  defaultComponent: React.ReactNode;
  toggledComponent: React.ReactNode;
};

export const ToggleOnClick: React.FC<Props> = ({
  defaultComponent,
  toggledComponent,
}) => {
  const [toggled, setToggled] = React.useState(false);
  const onBlur = () => {
    if (toggled) {
      setToggled(false);
    }
  };

  React.useEffect(() => {
    const onBlur = () => {
      setToggled(false);
    };
    window.addEventListener("blur", () => onBlur);
    window.addEventListener("click", () => onBlur);
    return () => {
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("click", onBlur);
    };
  }, []);

  return (
    <div onClick={() => setToggled(true)} onBlur={onBlur}>
      {!toggled && defaultComponent}
      {toggled && toggledComponent}
    </div>
  );
};
