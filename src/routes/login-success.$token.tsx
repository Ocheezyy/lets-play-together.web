import {createFileRoute, useNavigate} from '@tanstack/react-router'
import {useEffect} from "react";
import {useMainStore} from "@/stores/main.ts";


export const Route = createFileRoute('/login-success/$token')({
  component: LoginSuccess,
})

function LoginSuccess() {
  const { token } = Route.useParams();
  const navigate = useNavigate();
  const { clearAuth, setToken } = useMainStore()

  useEffect(() => {
    if (token) {
      localStorage.setItem("authToken", token);
      setToken(token);
      navigate({ to: '/' });
    } else {
      clearAuth();
      navigate({ to: '/login-failed' });
    }
  }, [navigate, token]);

  return <p>Logging you in...</p>;
}
