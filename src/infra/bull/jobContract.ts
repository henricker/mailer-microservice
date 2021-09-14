export interface IJobContractDataHandler<T> {
  data: T
}

export default interface jobContract<T> {
  key: string
  handle({ data }: IJobContractDataHandler<T>): Promise<void>
}
