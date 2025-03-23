declare module 'filewatcher' {
  import {EventEmitter} from 'events';
  import {PathLike, Stats, WatchFileOptions} from 'fs';

  export type Opts = WatchFileOptions & {
    fallback?: boolean | undefined,
    debounce?: number | undefined,
    forcePolling?: boolean | undefined
  };

  export class FileWatcher extends EventEmitter {
    constructor(opts?: Opts | undefined);

    /**
     * Start watching the given file.
     */
    add: (file: PathLike) => void;

    /**
     * Switch to polling mode. This method is invoked internally if the system
     * runs out of file handles.
     */
    poll: () => number;

    /**
     * Lists all watched files.
     */
    list: () => PathLike[];

    /**
     * Stop watching the given file.
     */
    remove: (file: PathLike) => void;

    /**
     * Stop watching all currently watched files.
     */
    removeAll: () => void;

    on(eventName: 'fallback', listener: (limit: number) => void);
    on(eventName: 'change', listener: (file: PathLike, stat: Stats | { deleted?: boolean }) => void);
    on(eventName: 'error', listener: (error: any) => void);
  }

  export default function FileWatcher(opts?: Opts | undefined);
}

