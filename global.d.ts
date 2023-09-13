declare module "*.module.css";
declare module "*.module.scss";
declare module "*.png" {
    const value: any;
    export default value;
}
declare module '*.svg' {
    const content: string;
    export default content;
}