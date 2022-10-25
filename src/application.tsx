import { LegacyRef, useEffect, useRef } from "react";
import Cell from "./cell";
import render from "./render";
import offset from "./utils/offset";

export function Application() {
  const reference = useRef<HTMLCanvasElement>();

  const cells = useRef<Cell[]>([]);

  useEffect(() => {
    const canvas = reference.current;

    if (!canvas) return;

    const width = (canvas.width = innerWidth);
    const height = (canvas.height = innerHeight);

    const context = canvas.getContext("2d");

    if (!context) return;

    // the width and height of the cell
    const _offset = offset(width);

    // fill cells array with cells
    for (let x = 1; x <= width / _offset - 1; x++) {
      for (let y = 1; y <= height / _offset - 1; y++) {
        cells.current.push(new Cell([x, y], _offset));
      }
    }

    // randomize cells
    for (const cell of cells.current) Math.random() < 0.5 && cell.revive();

    render(context, canvas, cells.current);
  }, []);

  return (
    <>
      <main>
        <canvas ref={reference as LegacyRef<HTMLCanvasElement>} />
      </main>
    </>
  );
}

export default Application;
