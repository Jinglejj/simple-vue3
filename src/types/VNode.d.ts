
type FunctionComponent = ({ ...args }: any = {}) => VNode;

type VNode = {
    tag: string | FunctionComponent;
    props?: any;
    children?: string | VNode[]
}