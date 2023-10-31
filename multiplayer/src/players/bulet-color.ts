export const colors = [
  'red',
  'blue',
  'amber',
  '#3A5311',
  '#601A35',
  'yellow',
  'green',
  '#FE7D6A',
];
let counter = 0;
export const getBulletColor = () => colors[counter++ % colors.length];
//TODO(write test)
