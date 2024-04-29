import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "@mui/material";
import { UserSettingsMenu } from "./UserSettingsMenu";
import { useNavigate } from "react-router-dom";

export function AuthSection() {
  const navigate = useNavigate();
  const { loginWithRedirect, isAuthenticated, user, logout } = useAuth0();

  const handleLogin = async () => {
    await loginWithRedirect({
      appState: {
        returnTo: "/",
      },
    });
  };

  const handleLogout = () => {
    logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });
  };

  return isAuthenticated && user ? (
    <UserSettingsMenu
      user={user}
      onLogout={handleLogout}
      onOpenProfile={() => navigate("/profile")}
    />
  ) : (
    <Button color="inherit" onClick={handleLogin}>
      Log in
    </Button>
  );
}
