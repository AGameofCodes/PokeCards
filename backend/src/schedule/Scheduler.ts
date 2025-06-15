import SetsUpdateJob from './SetsUpdateJob';
import {gracefulShutdown, scheduleJob} from 'node-schedule';
import type IJob from './IJob';
import type {ConfigType} from '../config/confighelper';
import SetMappingUpdateJob from './SetMappingUpdateJob';

export default class Scheduler {
  private readonly jobs: IJob<any>[] = [];

  constructor(config: ConfigType) {
    this.jobs.push(
      new SetsUpdateJob(),
      new SetMappingUpdateJob(),
    );
  }

  registerJobs(): void {
    this.jobs.forEach(e => scheduleJob(e.schedule, e.execute.bind(e)));
  }

  startUp(): void {
    this.jobs.filter(e => e.scheduleAtStartup).forEach(e => e.execute.bind(e)());
  }

  cancelJobs(): Promise<void> {
    return gracefulShutdown();
  }
}