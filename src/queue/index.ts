export const jobQueue = new Set<Function>();

let p = Promise.resolve();
let isFlushing = false;
export const flushJob = () => {
    if (isFlushing) return;
    isFlushing = true;
    p.then(() => {
        jobQueue.forEach(job => job());
    }).finally(() => {
        isFlushing = false;
    })
}