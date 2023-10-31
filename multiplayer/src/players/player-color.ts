export const colors = ['gray', '#457745', '#754068', '#7a707a'];
let counter = 0;
export const getPlayerColor = () => colors[counter++ % colors.length];
//TODO(write test)
