import { produce } from "immer";
import { Cell } from "./cell";
import offset from "./utils/offset";

export type context = CanvasRenderingContext2D;

type canvas = HTMLCanvasElement;

export default function render(ctx: context, canvas: canvas, cells: Cell[]) {
  const { width, height } = canvas;

  ctx.clearRect(0, 0, width, height);

  ctx.strokeStyle = "white";

  const _offset = offset(width);

  for (let x = 0; x < width + _offset; x += _offset) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
  }

  for (let y = 0; y < height; y += _offset) {
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
  }

  ctx.stroke();

  for (const cell of cells) !!cell.status && cell.fill(ctx);

  const copied = produce(cells, (draft) => {
    // find and count every cell's neighbors
    for (let index in draft) {
      let cell = (draft[index] = draft[index].clone());

      let neighborhood = 0;

      // for loop for x
      let x = cell.plots[0] - 1;
      for (; x <= cell.plots[0] + 1; x++) {
        // for loop for y
        let y = cell.plots[1] - 1;
        for (; y <= cell.plots[1] + 1; y++) {
          if (cell.plots[0] == x && cell.plots[1] == y) {
            continue;
          }

          const neighbor = cells.find(
            (c) => c.plots[0] == x && c.plots[1] == y
          );

          if (!neighbor) continue;

          neighborhood += neighbor.status;
        }
      }

      // apply conway's rules

      // 1. Any live cell with two or three live neighbours survives.
      if (cell.status && (neighborhood == 2 || neighborhood == 3)) continue;

      // 2. Any dead cell with three live neighbours becomes a live cell.
      if (!cell.status && neighborhood == 3) {
        cell.revive();
        continue;
      }

      // 3. All other live cells die in the next generation. Similarly, all other dead cells stay dead.
      if (cell.status) cell.exterminate();
    }
  });

  // call next generation
  setTimeout(() => {
    render(ctx, canvas, copied);
  }, 300);
}
