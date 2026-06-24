declare module "vanilla-tilt" {
  interface TiltOptions {
    max?: number;
    speed?: number;
    glare?: boolean;
    "max-glare"?: number;
    reverse?: boolean;
    perspective?: number;
  }
  const VanillaTilt: {
    init(elements: NodeList | HTMLElement | HTMLElement[], options?: TiltOptions): void;
  };
  export default VanillaTilt;
}
