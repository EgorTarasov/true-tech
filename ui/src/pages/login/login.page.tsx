import React from "react";
import { observer } from "mobx-react-lite";
import { startAuthentication } from "@simplewebauthn/browser";
import { AuthService } from "../../stores/auth.store";

const App = observer(() => {
  const handleLogin = async () => {
    // Normally you'd fetch these options from the server
    const options = {
      challenge: "randomly-generated-challenge",
      rpId: "example.com",
      allowCredentials: [
        {
          id: "credential-id",
          type: "public-key"
        }
      ],
      userVerification: "preferred"
    };

    try {
      const assertion = await startAuthentication(options);
      console.log(assertion);
      AuthService.login(); // Set state to logged in
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = () => {
    AuthService.logout();
  };

  return (
    <div>
      <h1>{AuthService.item.state === "authenticated" ? "Logged In" : "Logged Out"}</h1>
      <button onClick={AuthService.item.state === "authenticated" ? handleLogout : handleLogin}>
        {AuthService.item.state === "authenticated" ? "Logout" : "Login"}
      </button>
    </div>
  );
});

export default App;
