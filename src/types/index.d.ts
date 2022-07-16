type Key = string | symbol;

type Obj = { [key: Key]: unknown };

type Fn = (...args: unknown[]) => unknown;
