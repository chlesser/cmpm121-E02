export {};

const canvas = document.querySelector<HTMLCanvasElement>("#allocation-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>(
  "#allocation-readout",
)!;
let numColonists = 2;
type AllocationState = {
  numColonists: number;
  production: number;
  consumption: number;
  balance: number;
};

const allocationState: AllocationState = {
  numColonists: numColonists,
  production: numColonists * 3,
  consumption: 6,
  balance: numColonists * 3 - 6,
};

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < 6; i++) {
    ctx.fillStyle = i < numColonists ? "#27766b" : "#c9d2c9";
    ctx.fillRect(18 + i * 45, 16, 36, 36);
    ctx.fillStyle = i < numColonists ? "#ffffff" : "#233e43";
    ctx.font = "16px system-ui";
    ctx.fillText(String(i + 1), 31 + i * 45, 40);
  }
  ctx.fillStyle = "#233e43";
  ctx.font = "14px system-ui";
  ctx.fillText(`Colonists: ${numColonists} / 6`, 18, 76);
  ctx.fillText(`Production: ${allocationState.production}`, 18, 102);
  ctx.fillStyle = "#27766b";
  ctx.fillRect(18, 110, allocationState.production * 14, 20);
  ctx.fillStyle = "#233e43";
  ctx.fillText(`Consumption: ${allocationState.consumption}`, 18, 154);
  ctx.fillStyle = "#a44d23";
  ctx.fillRect(18, 162, allocationState.consumption * 14, 20);
  setReadoutText();
}
function setReadoutText() {
  readout.textContent =
    `Assigned: ${allocationState.numColonists}/6 · Production: ${allocationState.production} · Consumption: ${allocationState.consumption} · Surplus Supplies: ${
      allocationState.balance > 0 ? "+" : ""
    }${allocationState.balance}`;
}
function updateAllocationState() {
  allocationState.production = numColonists * 3,
    allocationState.balance = numColonists * 3 - allocationState.consumption;
}

document.querySelector<HTMLButtonElement>("#allocation-less")!.onclick = () => {
  numColonists = Math.max(0, numColonists - 1);
  updateAllocationState();
  update();
};
document.querySelector<HTMLButtonElement>("#allocation-more")!.onclick = () => {
  numColonists = Math.min(6, numColonists + 1);
  updateAllocationState();
  update();
};
document.querySelector<HTMLButtonElement>("#allocation-reset")!.onclick =
  () => {
    numColonists = 2;
    update();
  };
update();
