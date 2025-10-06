import { createServer } from "./server.js";

const port = process.env.PORT || 8080;
const app = createServer();
app.listen(port, () => {
  console.log(`issuance-api listening on :${port}`);
});
