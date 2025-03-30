export default interface IJob<T> {
  get scheduleAtStartup(): boolean;
  get schedule(): Date | string;
  execute(): Promise<T>;
}