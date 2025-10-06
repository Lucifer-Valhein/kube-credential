import { createServer } from "./server.js";

const port = process.env.PORT || 8081;
const app = createServer();
app.listen(port, () => console.log(`verification-api listening on :${port}`));
