import { context } from "./render";

export enum status {
  active = 1,
  inactive = 0,
}

type plots = [number, number];

export class Cell {
  status: status = status.inactive;

  constructor(public plots: plots, public offset: number) {}

  get x() {
    return this.plots[0] * this.offset;
  }

  get y() {
    return this.plots[1] * this.offset;
  }

  fill(ctx: context, style = "white") {
    ctx.fillStyle = style;
    ctx.fillRect(this.x, this.y, this.offset, this.offset);
    return this;
  }

  revive() {
    this.status = status.active;
    return this;
  }

  exterminate() {
    this.status = status.inactive;
    return this;
  }

  clone(): Cell {
    const cloned = new Cell(this.plots, this.offset);
    cloned.status = this.status;
    return cloned;
  }
}

export default Cell;
