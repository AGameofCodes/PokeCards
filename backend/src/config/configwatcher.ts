import filewatcher, {type FileWatcher} from 'filewatcher';
import type {PathLike, Stats} from 'fs';

export default class ConfigWatcher {
  private readonly files: PathLike[];
  private readonly callback: (file: PathLike) => void;

  //runtime
  private watcher!: FileWatcher;

  constructor(files: PathLike[], callback: (file: PathLike) => {}) {
    this.files = files;
    this.callback = callback;

    //init
    this.watcher = filewatcher();
    this.files.forEach(f => this.watcher.add(f));

    this.watcher.on('fallback', (limit: number) => {
      console.log('Ran out of file handles after watching %s files.', limit);
      console.log('Falling back to polling which uses more CPU.');
      console.log('Run ulimit -n 10000 to increase the limit for open files.');
    });

    this.watcher.on('change', (file: PathLike, stat: Stats | { deleted?: boolean | undefined }) => {
      this.callback(file);
    });
  }
}
