import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { selectAuthToken } from "../slices/authSlice";

type Props = {
  children?: React.ReactNode;
};

export const RequireAuth: React.FC<Props> = ({ children }) => {
  const token = useSelector(selectAuthToken);
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
