import WelcomeUserMailer from "./welcome-user"
import ForgotPasswordUserMailer from "./forgot-password-user"
import NewBetUserMailer from "./new-bet-user"
import RememberUserToBetMailer from "./remember-user-to-bet"

export default {
  'welcome-user': WelcomeUserMailer,
  'forgot-password-user': ForgotPasswordUserMailer,
  'new-bet-user': NewBetUserMailer,
  'remember-user-to-bet': RememberUserToBetMailer
}