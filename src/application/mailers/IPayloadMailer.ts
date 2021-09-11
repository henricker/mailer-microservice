import mailers from ".";
import IBet from "../models/bet";
import IContact from "../models/contact";

export default interface IPayloadMailer {
  contact: IContact,
  bets?: {
    totalPrice: number,
    arrayBets: IBet[]
  },
  handleMailer: keyof typeof mailers
}