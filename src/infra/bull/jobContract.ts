export interface IJobContract<T> {
  data: {
    options: T
  }
}

export default abstract class JobContract<T> {
  constructor(public key: string){}
  public abstract handle({ data }: IJobContract<T>): Promise<Object>
}
