import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes agregar validación si lo deseas
    navigate('/main');
  };

  return (
    <div className="font-display bg-background-light dark:bg-background-dark">
      <div className="relative flex min-h-screen w-full flex-col">
        <div className="flex h-full min-h-screen grow flex-col">
          <div className="flex flex-1">
            {/* Lado izquierdo (imagen) */}
            <div className="relative hidden h-full w-full flex-col justify-end bg-slate-900 p-8 lg:flex">
              <div
                className="absolute inset-0 z-0 h-full w-full bg-cover bg-center"
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCvUDj7bJtwo5-F3MACfP7xIc_C_tfssrDxIgcPhZ568fSmgSP3ZP6gCiLLc28ZflPWszYw6gXv9M7ENV8WDPNq33Jle7qt9kBibdTPwcdcXBc4Bsu858-qr-wpsrJqRVIiSeaByMpA13JLrb4fZHEY_ZuEWKJuYrvLPKi7tYE30cDpIuvWU9W2PLbDCxw5Kh73zU8eMTNT6TVXQBGNUA341Ij9oNCyOHpUyGvUaBq2eSoYnRxtw_DIKB8SKRzHgxnu4lem7RIRE4G6')",
                }}
              />
              <div className="absolute inset-0 z-10 h-full w-full bg-primary/70 dark:bg-primary/80" />
              <div className="relative z-20 flex flex-col gap-4 text-white">
                <h1 className="text-4xl font-bold leading-tight">
                  Empowering Your Enterprise
                </h1>
                <p className="text-base font-normal text-white/80">
                  Secure, reliable, and built for the modern workforce.
                </p>
              </div>
            </div>
            {/* Lado derecho (formulario) */}
            <div className="flex w-full flex-col items-center justify-center bg-background-light px-4 py-12 dark:bg-background-dark sm:px-6 lg:px-8">
              <div className="flex w-full max-w-md flex-col items-center gap-10">
                {/* Logo y texto */}
                <div className="flex flex-col items-center gap-4 text-center">
                  <svg
                    className="text-primary"
                    fill="none"
                    height="48"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="48"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold text-[#101922] dark:text-white">
                      Welcome Back
                    </h1>
                    <p className="text-base font-normal text-slate-600 dark:text-slate-400">
                      Sign in to access your corporate account.
                    </p>
                  </div>
                </div>
                {/* Formulario */}
                <form className="flex w-full flex-col gap-6" onSubmit={handleSubmit}>
                  {/* Employee ID */}
                  <label className="flex w-full flex-col">
                    <p className="pb-2 text-sm font-medium leading-normal text-[#101922] dark:text-slate-300">
                      Employee ID
                    </p>
                    <div className="flex w-full flex-1 items-stretch rounded-lg">
                      <div className="flex items-center justify-center rounded-l-lg border border-r-0 border-slate-300 bg-background-light pl-4 text-slate-500 dark:border-slate-700 dark:bg-background-dark">
                        <span className="material-symbols-outlined text-base">person</span>
                      </div>
                      <input
                        className="form-input h-12 w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg rounded-l-none border border-l-0 border-slate-300 bg-background-light p-3 text-base font-normal leading-normal text-[#101922] focus:border-primary focus:outline-0 focus:ring-2 focus:ring-primary/50 dark:border-slate-700 dark:bg-background-dark dark:text-white dark:placeholder:text-slate-500"
                        placeholder="Enter your Employee ID"
                        name="employeeId"
                      />
                    </div>
                  </label>
                  {/* Password */}
                  <label className="flex w-full flex-col">
                    <p className="pb-2 text-sm font-medium leading-normal text-[#101922] dark:text-slate-300">
                      Password
                    </p>
                    <div className="flex w-full flex-1 items-stretch rounded-lg">
                      <div className="flex items-center justify-center rounded-l-lg border border-r-0 border-slate-300 bg-background-light pl-4 text-slate-500 dark:border-slate-700 dark:bg-background-dark">
                        <span className="material-symbols-outlined text-base">lock</span>
                      </div>
                      <input
                        type="password"
                        className="form-input h-12 w-full min-w-0 flex-1 resize-none overflow-hidden rounded-r-none border border-r-0 border-slate-300 bg-background-light p-3 pr-2 text-base font-normal leading-normal text-[#101922] focus:border-primary focus:outline-0 focus:ring-2 focus:ring-primary/50 dark:border-slate-700 dark:bg-background-dark dark:text-white dark:placeholder:text-slate-500"
                        placeholder="Enter your password"
                        name="password"
                      />
                      <button
                        type="button"
                        className="flex cursor-pointer items-center justify-center rounded-r-lg border border-l-0 border-slate-300 bg-background-light pr-4 text-slate-500 dark:border-slate-700 dark:bg-background-dark"
                      >
                        <span className="material-symbols-outlined text-base">visibility</span>
                      </button>
                    </div>
                  </label>
                  <button
                    type="submit"
                    className="flex h-12 w-full min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-primary px-5 text-base font-bold leading-normal tracking-[0.015em] text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 dark:focus:ring-offset-background-dark"
                  >
                    <span className="truncate">Sign In</span>
                  </button>
                  <p className="cursor-pointer text-center text-sm font-normal leading-normal text-slate-600 underline hover:text-primary dark:text-slate-400">
                    Forgot Password?
                  </p>
                </form>
                {/* Footer */}
                <div className="w-full text-center text-xs text-slate-500 dark:text-slate-500">
                  <p>© 2024 Corporate Inc. All Rights Reserved.</p>
                  <p>
                    This is a private system for authorized users only.{' '}
                    <a href="#" className="underline hover:text-primary">
                      Contact Support
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}