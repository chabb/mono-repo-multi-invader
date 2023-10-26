export function keyboard(keyCode: number) {
  const key: Key = {
    keyCode: keyCode,
    isDown: false,
    isUp: true,
    press: undefined,
    release: undefined,
    downHandler: (event) => {
      if (event.keyCode === key.keyCode) {
        if (key.isUp && key.press) {
          key.press();
        }
        key.isDown = true;
        key.isUp = false;
      }
      event.preventDefault()
    }, upHandler: (event) => {
      if (event.keyCode === key.keyCode) {
        if (key.isDown && key.release) {
          key.release();
        }
        key.isDown = false;
        key.isUp = true;

      }
    }
  };
  window.addEventListener('keydown', key.downHandler.bind(key), false);
  window.addEventListener('keyup', key.upHandler.bind(key), false);
  return key;
}

export interface Key {
  isDown: boolean;
  isUp: boolean;
  keyCode: number;
  downHandler: (event: KeyboardEvent) => void;
  upHandler: (event: KeyboardEvent) => void;
  press?: () => void;
  release?: () => void;
}
