import WelcomeUserMailer from "./users/welcome-user"
import ForgotPasswordUserMailer from "./users/forgot-password-user"
import NewBetUserMailer from "./users/new-bet-user"
import RememberUserToBetMailer from "./users/remember-user-to-bet"
import NewBetAdminMailer from "./admins/new-bet-admin"

export default {
	'welcome-user': WelcomeUserMailer,
	'forgot-password-user': ForgotPasswordUserMailer,
	'new-bet-user': NewBetUserMailer,
	'remember-user-to-bet': RememberUserToBetMailer,
	'new-bets-admin': NewBetAdminMailer
}