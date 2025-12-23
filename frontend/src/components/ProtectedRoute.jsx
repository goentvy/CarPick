import { Navigate, useLocation } from "react-router-dom";
import useUserStore from "../store/useUserStore";

function ProtectedRoute({ children }) {
    const { user } = useUserStore();
    const location = useLocation();

    if (!user) {
        return (
            <Navigate
                to="/login"
                replace
                state={{ from: location }}
            />
        );
    }

    return children;
}

export default ProtectedRoute;
