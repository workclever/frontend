import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { selectAuthToken } from "../slices/authSlice";

type Props = {
  children?: React.ReactNode;
};

export const RequireAnonym: React.FC<Props> = ({ children }) => {
  const token = useSelector(selectAuthToken);
  const location = useLocation();

  if (!token) {
    return <>{children}</>;
  }

  return <Navigate to="/" state={{ from: location }} replace />;
};
