import { spawn } from "child_process";
import process from "process";

const isWin = process.platform === "win32";
if (isWin) {
  process.env.PATH = `${process.env.PATH};C:\\xampp\\php;C:\\xampp\\mysql\\bin`;
}

const child = spawn("php", ["yii", "serve", "127.0.0.1:8091"], {
  cwd: "./backend",
  stdio: "inherit",
  shell: true,
});

child.on("error", (err) => {
  console.warn("Backend server could not be started:", err.message);
});

child.on("exit", (code) => {
  if (code && code !== 0) {
    console.log(`Backend server stopped (code ${code})`);
  }
});
