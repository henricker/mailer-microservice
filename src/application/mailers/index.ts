import WelcomeUserMailer from "./users/welcome-user"
import ForgotPasswordUserMailer from "./users/forgot-password-user"
import NewBetUserMailer from "./users/new-bet-user"
import RememberUserToBetMailer from "./users/remember-user-to-bet"
import DailyReportsAdminMailer from "./admins/daily-reports"
import WeeklyReportsAdminMailer from "./admins/weekly-reports"
import MonthlyReportsAdminMailer from "./admins/monthly-reports"

export default {
	'welcome-user': WelcomeUserMailer,
	'forgot-password-user': ForgotPasswordUserMailer,
	'new-bet-user': NewBetUserMailer,
	'remember-user-to-bet': RememberUserToBetMailer,
	'daily-reports-admin': DailyReportsAdminMailer,
	'weekly-reports-admin': WeeklyReportsAdminMailer,
	'monthly-reports-admin': MonthlyReportsAdminMailer,
}