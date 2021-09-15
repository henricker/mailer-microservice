import mailers from "../index";
import IContact from "../../models/contact";
import IGame from "../../models/game";
import IBet from "../../models/bet";

export default interface IPayloadMailer {
  contact: IContact,
  games?: {
    totalPrice: number,
    gamesRelatory: IGame[]
  },
  bets?: {
    totalPrice: number
    arrayBets: IBet[]
  }
  template: keyof typeof mailers
  kind: 'IPayloadMailerAdmin'
}