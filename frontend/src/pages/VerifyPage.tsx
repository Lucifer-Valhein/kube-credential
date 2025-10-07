import { useState } from "react";

function VerifyPage() {
  const [credentialId, setCredentialId] = useState("");
  const [subject, setSubject] = useState("");
  const [role, setRole] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [response, setResponse] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setResponse(null);

    try {
      const res = await fetch("http://localhost:8081/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          credentialId,
          subject,
          data: { role },
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Credential verified successfully!");
        setResponse(data); // <-- Show full verification response
      } else {
        setError(data.error || "Verification failed.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="container">
      <h1>Verify Credential</h1>
      <form onSubmit={handleSubmit}>
        <label>Credential ID</label>
        <input
          type="text"
          placeholder="e.g., cred-001"
          value={credentialId}
          onChange={(e) => setCredentialId(e.target.value)}
          required
        />

        <label>Subject</label>
        <input
          type="text"
          placeholder="e.g., alice"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
        />

        <label>Role</label>
        <input
          type="text"
          placeholder="e.g., admin"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
        />

        <button type="submit">Verify Credential</button>
      </form>

      {message && <div className="message success">{message}</div>}
      {error && <div className="message error">{error}</div>}

      {response && (
        <pre className="response-box">
          {JSON.stringify(response, null, 2)}
        </pre>
      )}
    </div>
  );
}

export default VerifyPage;
