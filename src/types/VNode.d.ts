
declare type FunctionComponent = ({ ...args }: any = {}) => VNode;

declare type VNode = {
    tag: string | FunctionComponent;
    props?: any;
    children?: string | VNode[]
}