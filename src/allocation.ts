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
type OrderedCollectionUnit = {
  text: string;
  stat: () => number;
  offset: number;
  color: string;
};

const statList: OrderedCollectionUnit[] = [];
const productionStat: OrderedCollectionUnit = {
  text: "Production",
  stat: () => allocationState.production,
  offset: 0,
  color: "#27766b",
};
statList.push(productionStat);

const consumptionStat: OrderedCollectionUnit = {
  text: "Consumption",
  stat: () => allocationState.consumption,
  offset: 52,
  color: "#a44d23",
};
statList.push(consumptionStat);

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

  drawBars();
  setReadoutText();
}
function drawBars() {
  for (const unit of statList) {
    ctx.fillStyle = "#233e43";
    ctx.font = "14px system-ui";
    ctx.fillText(unit.text + `: ${unit.stat()}`, 18, 102 + unit.offset);
    ctx.fillStyle = unit.color;
    ctx.fillRect(18, 110 + unit.offset, unit.stat() * 14, 20);
  }
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
