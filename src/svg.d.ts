/// <reference types="vite-plugin-svgr/client" />

declare module "*.svg" {
  const content: React.FC<HTMLProps<SVGElement>>;
  export default content;
}

declare module "*.css" {
  const content: { [className: string]: string };
  export default content;
}
