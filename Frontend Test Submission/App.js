import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  TextField,
  Button,
  Box,
  Paper,
  Tabs,
  Tab,
} from "@mui/material";

function App() {
  const [tab, setTab] = useState(0);
  const [inputs, setInputs] = useState([{ url: "", validity: "", code: "" }]);
  const [urls, setUrls] = useState([]);
  const [logs, setLogs] = useState([]);

  // Handle tab switch
  const handleTab = (event, newValue) => setTab(newValue);

  // Add new input field
  const addField = () => {
    setInputs([...inputs, { url: "", validity: "", code: "" }]);
  };

  // Handle input changes
  const handleChange = (index, field, value) => {
    const newInputs = [...inputs];
    newInputs[index][field] = value;
    setInputs(newInputs);
  };

  // Shorten URLs (simulation only, no backend)
  const shorten = () => {
    const newUrls = inputs.map((inp) => {
      const expires = new Date();
      expires.setMinutes(expires.getMinutes() + Number(inp.validity || 10));
      return {
        original: inp.url.trim(),
        code: inp.code || Math.random().toString(36).substring(2, 7),
        expires,
      };
    });

    setUrls([...urls, ...newUrls]);

    // Log actions
    const newLogs = newUrls.map(
      (u) =>
        `Created short code "${u.code}" for ${u.original} (valid until ${u.expires.toLocaleString()})`
    );
    setLogs([...logs, ...newLogs]);

    // Reset inputs
    setInputs([{ url: "", validity: "", code: "" }]);
  };

  // Visit button handler with URL fix
  const handleVisit = (link) => {
    let fixed = link.trim();
    if (!fixed.startsWith("http://") && !fixed.startsWith("https://")) {
      fixed = "https://" + fixed;
    }
    window.open(fixed, "_blank");
  };

  return (
    <>
      {/* Header */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">URL Shortener</Typography>
        </Toolbar>
      </AppBar>

      {/* Tabs */}
      <Container>
        <Tabs
          value={tab}
          onChange={handleTab}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="Shortener" />
          <Tab label="Stats" />
          <Tab label="Logs" />
        </Tabs>

        {/* Shortener Tab */}
        {tab === 0 && (
          <Box p={3}>
            <Typography variant="h5" gutterBottom>
              Shorten URLs
            </Typography>
            {inputs.map((inp, i) => (
              <Box key={i} display="flex" gap={2} mb={2}>
                <TextField
                  label="Original URL"
                  fullWidth
                  value={inp.url}
                  onChange={(e) => handleChange(i, "url", e.target.value)}
                />
                <TextField
                  label="Validity (minutes)"
                  type="number"
                  value={inp.validity}
                  onChange={(e) => handleChange(i, "validity", e.target.value)}
                />
                <TextField
                  label="Custom code"
                  value={inp.code}
                  onChange={(e) => handleChange(i, "code", e.target.value)}
                />
              </Box>
            ))}
            <Button
              onClick={addField}
              variant="outlined"
              style={{ marginRight: "10px" }}
            >
              + Add More
            </Button>
            <Button onClick={shorten} variant="contained" color="success">
              Shorten
            </Button>

            {/* Generated links */}
            <Box mt={4}>
              <Typography variant="h6">Generated Links</Typography>
              {urls.map((u, i) => (
                <Paper key={i} style={{ padding: "10px", marginTop: "10px" }}>
                  <p>
                    <b>Original:</b> {u.original}
                  </p>
                  <p>
                    <b>Short Code:</b> {u.code}
                  </p>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() => handleVisit(u.original)}
                  >
                    Visit
                  </Button>
                  <p style={{ fontSize: "12px", color: "gray" }}>
                    Expires: {u.expires.toLocaleString()}
                  </p>
                </Paper>
              ))}
            </Box>
          </Box>
        )}

        {/* Stats Tab */}
        {tab === 1 && (
          <Box p={3}>
            <Typography variant="h5">Stats</Typography>
            <p>Total Links Created: {urls.length}</p>
          </Box>
        )}

        {/* Logs Tab */}
        {tab === 2 && (
          <Box p={3}>
            <Typography variant="h5">Logs</Typography>
            {logs.map((l, i) => (
              <Paper key={i} style={{ padding: "5px", marginTop: "5px" }}>
                {l}
              </Paper>
            ))}
          </Box>
        )}
      </Container>
    </>
  );
}

export default App;
