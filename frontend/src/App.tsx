import IssueCredential from "./components/IssueCredential";
import VerifyCredential from "./components/VerifyCredential";

export default function App() {
  return (
    <div style={{ padding: 20, fontFamily: "Arial", maxWidth: 800, margin: "0 auto" }}>
      <h1>Kube Credential</h1>

      <section style={{ padding: 16, border: "1px solid #ccc", borderRadius: 6, marginBottom: 20 }}>
        <IssueCredential />
      </section>

      <section style={{ padding: 16, border: "1px solid #ccc", borderRadius: 6 }}>
        <VerifyCredential />
      </section>
    </div>
  );
}
