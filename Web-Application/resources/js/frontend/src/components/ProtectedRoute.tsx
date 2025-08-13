import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

interface Props {
  children: JSX.Element;
  requiredRole?: "admin" | "user";
}

const ProtectedRoute = ({ children, requiredRole }: Props) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;

  if (requiredRole && user.role !== requiredRole) {
    return (
      <div className="flex items-center justify-center min-h-screen text-2xl font-semibold text-red-600">
        Unauthorized
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;

