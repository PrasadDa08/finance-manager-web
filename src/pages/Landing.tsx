import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

function Landing() {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="min-h-screen bg-[#EEFCF8] text-[#134E4A]">
      {/* Navbar */}
      <header className="border-b border-[#99F6E4] bg-white/90 backdrop-blur sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-[#7C3AED] text-white flex items-center justify-center text-sm font-bold">
              FM
            </div>
            <span className="font-bold text-[#134E4A]">Finance Manager</span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {user ? (
              <Link
                to="/dashboard"
                className="bg-[#7C3AED] text-white text-sm px-3 py-2 rounded-lg hover:bg-[#6D28D9]"
              >
                Open app
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium text-[#134E4A] px-2 py-2 hover:text-[#7C3AED]"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-[#7C3AED] text-white text-sm px-3 py-2 rounded-lg hover:bg-[#6D28D9]"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-4 pt-8 pb-8 md:pt-10 md:pb-10">
        <div className="max-w-2xl">
          <p className="inline-block text-xs font-medium text-[#0D9488] bg-[#CCFBF1] px-3 py-1 rounded-full mb-4">
            Private · No ads · No loan spam
          </p>
          <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-3">
            Simple money tracking for everyday life
          </h1>
          <p className="text-base text-[#5B7A76] mb-5 max-w-xl">
            Add accounts, record income and expenses, and see your balance
            clearly — on web and mobile.
          </p>

          <div className="flex flex-wrap gap-3">
            {user ? (
              <Link
                to="/dashboard"
                className="bg-[#7C3AED] text-white px-5 py-3 rounded-xl font-medium hover:bg-[#6D28D9]"
              >
                Go to dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="bg-[#7C3AED] text-white px-5 py-3 rounded-xl font-medium hover:bg-[#6D28D9]"
                >
                  Get Started Free
                </Link>
                <Link
                  to="/login"
                  className="bg-white border border-[#99F6E4] text-[#134E4A] px-5 py-3 rounded-xl font-medium hover:bg-[#F0FDFA]"
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-5xl mx-auto px-4 pb-8">
        <h2 className="text-xl md:text-2xl font-bold mb-4">How it works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <StepCard
            step="1"
            title="Add accounts"
            text="Bank, cash, wallet, or credit card — wherever your money lives."
          />
          <StepCard
            step="2"
            title="Create categories"
            text="Label income and expenses like Salary, Food, Rent, Shopping."
          />
          <StepCard
            step="3"
            title="Track daily"
            text="Record transactions and watch your dashboard update instantly."
          />
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-4 pb-8">
        <h2 className="text-xl md:text-2xl font-bold mb-4">What you get</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FeatureCard
            title="Multiple accounts"
            text="Track bank, cash, cards, and wallets in one place."
          />
          <FeatureCard
            title="Clear categories"
            text="Organize money in and money out with simple labels."
          />
          <FeatureCard
            title="Fast transactions"
            text="Add income or expense in seconds, not minutes."
          />
          <FeatureCard
            title="Smart dashboard"
            text="Balance, income, expense, and filters that make sense."
          />
          <FeatureCard
            title="Mobile friendly"
            text="Use it comfortably on your phone browser."
          />
          <FeatureCard
            title="Clean & private"
            text="No SMS reading, no loan push, no clutter."
          />
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-5xl mx-auto px-4 pb-8">
        <div className="bg-white border border-[#99F6E4] rounded-2xl p-6 md:p-8 text-center">
          <h2 className="text-xl md:text-2xl font-bold mb-2">
            Start tracking in minutes
          </h2>
          <p className="text-sm md:text-base text-[#5B7A76] mb-5">
            Create your free account and add your first transaction today.
          </p>
          <Link
            to={user ? "/dashboard" : "/register"}
            className="inline-block bg-[#0D9488] text-white px-5 py-3 rounded-xl font-medium hover:bg-[#0F766E]"
          >
            {user ? "Open dashboard" : "Create free account"}
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#99F6E4] bg-white">
        <div className="max-w-5xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-2 text-sm text-[#5B7A76]">
          <span>Finance Manager</span>
          <span>Built for personal use and friends</span>
        </div>
      </footer>
    </div>
  );
}

function StepCard({
  step,
  title,
  text,
}: {
  step: string;
  title: string;
  text: string;
}) {
  return (
    <div className="bg-white border border-[#99F6E4] rounded-2xl p-4">
      <div className="w-8 h-8 rounded-full bg-[#7C3AED] text-white text-sm font-bold flex items-center justify-center mb-3">
        {step}
      </div>
      <h3 className="font-semibold mb-1">{title}</h3>
      <p className="text-sm text-[#5B7A76]">{text}</p>
    </div>
  );
}

function FeatureCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="bg-white border border-[#99F6E4] rounded-2xl p-4">
      <h3 className="font-semibold mb-1">{title}</h3>
      <p className="text-sm text-[#5B7A76]">{text}</p>
    </div>
  );
}

export default Landing;
