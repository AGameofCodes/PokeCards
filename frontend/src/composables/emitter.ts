import mitt from 'mitt';

const emitter = mitt();
export default function getEmitter() {
  return emitter;
}