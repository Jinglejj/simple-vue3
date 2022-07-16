
type FunctionComponent = ({ ...args }: unknown = {}) => VNode;

type VNode = {
    tag: string | FunctionComponent;
    props?: { [key: Key]: unknown };
    children?: string | VNode[]
}