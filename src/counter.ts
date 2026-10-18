export {};

const canvas = document.querySelector<HTMLCanvasElement>("#counter-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>(
  "#counter-readout",
)!;
const host = document.querySelector<HTMLDivElement>("#counter-panel-host")!;
const diagnostic = document.querySelector<HTMLParagraphElement>(
  "#counter-diagnostic",
)!;
let panel: HTMLParagraphElement | null = null;
let panelUpdates = 0;
let charge = 0;
const CAP = 10;

type ShieldState = {
  charge: number;
  capacity: number;
  missing: number;
};
const modelChange = new EventTarget();

const displayModelChange = () => {
  drawMeter();
};
const inspectorModelChange = () => {
  updateStats();
};
modelChange.addEventListener("change", displayModelChange);
function drawMeter() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const s: ShieldState = getShieldState();
  for (let i = 0; i < CAP; i++) {
    ctx.fillStyle = i < s.charge ? "#27766b" : "#c9d2c9";
    ctx.fillRect(12 + i * 28, 24, 24, 48);
  }
  ctx.fillStyle = "#233e43";
  ctx.font = "16px system-ui";
  ctx.fillText(`${s.charge} / ${CAP} shield`, 12, 100);
  readout.textContent = `Shield charge: ${s.charge} / ${CAP}`;
}

function updateStats() {
  panelUpdates++;
  diagnostic.textContent = `Inspector deliveries: ${panelUpdates}`;
  renderStats();
}

function renderStats() {
  if (!panel) return;
  const s: ShieldState = getShieldState();
  panel.textContent =
    `Shield charge: ${s.charge} · Missing charge: ${s.missing}`;
}

function setCount(next: number) {
  const bounded = Math.max(0, Math.min(CAP, next));
  if (bounded === charge) return;
  charge = bounded;
  modelChange.dispatchEvent(new Event("change"));
}
function getShieldState(): ShieldState {
  return { charge, capacity: CAP, missing: CAP - charge };
}
document.querySelector<HTMLButtonElement>("#counter-less")!.onclick = () => {
  setCount(charge - 1);
};
document.querySelector<HTMLButtonElement>("#counter-more")!.onclick = () => {
  setCount(charge + 1);
};
document.querySelector<HTMLButtonElement>("#counter-reset")!.onclick = () => {
  setCount(0);
};
document.querySelector<HTMLButtonElement>("#counter-open")!.onclick = () => {
  if (panel) return;
  panel = document.createElement("p");
  host.append(panel);
  renderStats();
  modelChange.addEventListener("change", inspectorModelChange);
};
document.querySelector<HTMLButtonElement>("#counter-close")!.onclick = () => {
  if (!panel) return;
  panel.remove();
  panel = null;
  modelChange.removeEventListener("change", inspectorModelChange);
};
drawMeter();
