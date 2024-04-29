import { useAuth0 } from "@auth0/auth0-react";
import { protectedApi } from "../../services/protectedApi";
import { useEffect, useState } from "react";
import {
  Alert,
  AlertTitle,
  Box,
  Container,
  LinearProgress,
  Typography,
} from "@mui/material";

export function Protected() {
  const { getAccessTokenSilently } = useAuth0();
  const [response, setResponse] = useState("");

  useEffect(() => {
    const getMessages = async () => {
      const accessToken = await getAccessTokenSilently();
      const messages = await protectedApi.getMessages(accessToken);
      setResponse(JSON.stringify(messages, null, 2));
    };

    getMessages();
  }, [getAccessTokenSilently]);

  return (
    <Container sx={{ p: 2 }}>
      <Alert severity="info">
        <AlertTitle>Info</AlertTitle>
        This page calls external API protected by JWT token.
      </Alert>
      {!response && <LinearProgress />}
      <Box sx={{ mt: 2 }}>
        <Typography variant="button">Response:</Typography>
        <pre>
          <code>{response}</code>
        </pre>
      </Box>
    </Container>
  );
}
