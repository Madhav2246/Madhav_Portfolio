declare module "typed.js" {
  interface TypedOptions {
    strings?: string[];
    typeSpeed?: number;
    backSpeed?: number;
    backDelay?: number;
    loop?: boolean;
    cursorChar?: string;
    showCursor?: boolean;
    onComplete?: (self: Typed) => void;
  }
  class Typed {
    constructor(elementId: string, options: TypedOptions);
    destroy(): void;
    reset(restart?: boolean): void;
  }
  export default Typed;
}
