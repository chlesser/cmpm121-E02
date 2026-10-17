export {};

const canvas = document.querySelector<HTMLCanvasElement>("#rover-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>("#rover-readout")!;
let x = 2;
let y = 2;
let direction = 0;
const headings: Direction[] = [
  { name: "North", dx: 0, dy: -1 },
  { name: "East", dx: 1, dy: 0 },
  { name: "South", dx: 0, dy: 1 },
  { name: "West", dx: -1, dy: 0 },
];
const commandList: Command[] = [];

interface Direction {
  name: string;
  dx: number;
  dy: number;
}

interface Command {
  execute: () => void;
}
const forwardCommand: Command = {
  execute: () => {
    x += headings[direction].dx;
    y += headings[direction].dy;
    x = clamp(x, 0, 4);
    y = clamp(y, 0, 4);
  },
};
const rotateRightCommand: Command = {
  execute: () => {
    direction = (direction + 1) % 4;
  },
};

const resetCommand: Command = {
  execute: () => {
    x = 2;
    y = 2;
    direction = 0;
  },
};

function drawRover() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#718881";
  for (let row = 0; row < 5; row++) {
    for (let column = 0; column < 5; column++) {
      ctx.strokeRect(10 + column * 56, 10 + row * 56, 56, 56);
    }
  }
  ctx.save();
  ctx.translate(38 + x * 56, 38 + y * 56);
  ctx.rotate(direction * Math.PI / 2);
  ctx.fillStyle = "#27766b";
  ctx.beginPath();
  ctx.moveTo(0, -20);
  ctx.lineTo(17, 16);
  ctx.lineTo(-17, 16);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
  readout.textContent = `Position: (${x}, ${y}) · Facing: ${
    headings[direction].name
  }`;
}

function commandHandler() {
  for (const command of commandList) {
    command.execute();
  }
  commandList.length = 0;
}
function clamp(val: number, min: number, max: number): number {
  return Math.min(Math.max(val, min), max);
}

document.querySelector<HTMLButtonElement>("#rover-forward")!.onclick = () => {
  commandList.push(forwardCommand);
  commandHandler();
  drawRover();
};
document.querySelector<HTMLButtonElement>("#rover-right")!.onclick = () => {
  commandList.push(rotateRightCommand);
  commandHandler();
  drawRover();
};
document.querySelector<HTMLButtonElement>("#rover-reset")!.onclick = () => {
  commandList.push(resetCommand);
  commandHandler();
  drawRover();
};
drawRover();
