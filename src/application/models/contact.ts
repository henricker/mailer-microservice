export default interface IContact {
  name: string
  email: string | string[]
  remember_me_token?: string
}