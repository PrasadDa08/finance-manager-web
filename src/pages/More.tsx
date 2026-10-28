import { Link, useNavigate } from "react-router-dom"
import { useAuthStore } from "../store/authStore"
import { logout as logoutRequest } from "../api/auth"

function More() {
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await logoutRequest()
    } catch (error) {
      console.log(error)
    } finally {
      logout()
      navigate("/login")
    }
  }

  return (
    <div className="p-4 md:p-6 bg-[#EEFCF8] min-h-[calc(100vh-4rem)]">
      <h1 className="text-2xl font-bold text-[#134E4A] mb-1">More</h1>
      <p className="text-sm text-[#5B7A76] mb-5">
        {user?.name || "User"}
        {user?.email ? ` · ${user.email}` : ""}
      </p>

      <div className="bg-white border border-[#99F6E4] rounded-2xl overflow-hidden divide-y divide-[#CCFBF1] max-w-md">
        <MenuLink
          to="/categories"
          title="Categories"
          subtitle="Manage income & expense labels"
          icon={<CategoriesIcon />}
        />

        <MenuLink
          to="/accounts"
          title="Accounts"
          subtitle="Banks, cash, cards & wallets"
          icon={<AccountsIcon />}
        />

        {/* Future items:
        <MenuLink to="/budgets" title="Budgets" ... />
        <MenuLink to="/settings" title="Settings" ... />
        */}

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-rose-50 transition"
        >
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-[#E11D48] flex items-center justify-center shrink-0">
            <LogoutIcon />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#E11D48]">Logout</p>
            <p className="text-xs text-[#5B7A76]">Sign out of your account</p>
          </div>
        </button>
      </div>
    </div>
  )
}

function MenuLink({
  to,
  title,
  subtitle,
  icon,
}: {
  to: string
  title: string
  subtitle: string
  icon: React.ReactNode
}) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 px-4 py-3.5 hover:bg-[#F0FDFA] transition"
    >
      <div className="w-10 h-10 rounded-xl bg-[#F0FDFA] text-[#0D9488] flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-[#134E4A]">{title}</p>
        <p className="text-xs text-[#5B7A76]">{subtitle}</p>
      </div>
    </Link>
  )
}

function CategoriesIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 6h16M4 12h16M4 18h10" />
    </svg>
  )
}

function AccountsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20" />
    </svg>
  )
}

function LogoutIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  )
}

export default More