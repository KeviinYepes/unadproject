import { Link, useLocation } from 'react-router-dom';
import TopNavBar from '../components/TopNavBar';

export default function VideoView() {
  const location = useLocation();
  const tutorial = location.state || {};

  return (
    <div className="font-display bg-background-light text-text-primary-light dark:bg-background-dark dark:text-text-primary-dark">
      <div className="relative flex min-h-screen w-full flex-col">
        <TopNavBar />
        <main className="w-full grow">
          <div className="mx-auto max-w-7xl px-6 py-8">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              {/* Main Content */}
              <div className="flex flex-col gap-6 lg:col-span-2">
                {/* Breadcrumbs */}
                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    to="#"
                    className="text-sm font-medium text-text-secondary-light hover:text-primary dark:text-text-secondary-dark dark:hover:text-primary"
                  >
                    Training
                  </Link>
                  <span className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">
                    /
                  </span>
                  <Link
                    to="#"
                    className="text-sm font-medium text-text-secondary-light hover:text-primary dark:text-text-secondary-dark dark:hover:text-primary"
                  >
                    New Hire Onboarding
                  </Link>
                  <span className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">
                    /
                  </span>
                  <span className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark">
                    {tutorial.title || 'Mastering the New CRM'}
                  </span>
                </div>
                {/* Page Heading */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <h1 className="text-4xl font-black leading-tight tracking-[-0.033em] text-text-primary-light dark:text-text-primary-dark">
                    Video Training: {tutorial.title || 'Mastering the New CRM'}
                  </h1>
                  <button className="flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-primary/90">
                    <span className="material-symbols-outlined text-lg">check_circle</span>
                    <span>Mark as Complete</span>
                  </button>
                </div>
                {/* Media Player */}
                <div>
                  <div
                    className="relative flex aspect-video items-center justify-center rounded-xl bg-gray-900 bg-cover bg-center"
                    style={{
                      backgroundImage: tutorial.imageUrl
                        ? `url(${tutorial.imageUrl})`
                        : "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAV5PDpOEhRBiPG1WXQ686HFqdHRPRUW6mZszDxuK_NoDYgNxyDt0xPqCZ78sty9W0SOCALE4kfnEuu2K-LE0G5fBc6ebiPj7gXgywka8J64YWyL6kMOhVt2nshsBJpkskjFUQSs8iDhyqN9vKJwmuhN6_iep6vWTMAIac_GFT2Wz1eagNaKiX-b3TuKNUm02GHB6_mUbBm6G8got6QmWCPy5-ZS7pu1tl_7iX_C4xwsFlvfwxXIAumAluH13LS2biAVaYqfjx-Jh0q')",
                    }}
                  >
                    <button className="flex size-16 shrink-0 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-transform hover:scale-105">
                      <span
                        className="material-symbols-outlined !text-4xl"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        play_arrow
                      </span>
                    </button>
                    <div className="absolute inset-x-0 bottom-0 px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-1.5 flex-1 rounded-full bg-white/30">
                          <div className="h-full w-1/4 rounded-full bg-white"></div>
                        </div>
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-medium text-white">0:37</p>
                          <span className="text-xs font-medium text-white/70">/</span>
                          <p className="text-xs font-medium text-white/70">2:23</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Content Section */}
                <div className="rounded-xl border border-border-light bg-surface-light p-6 shadow-sm dark:border-border-dark dark:bg-surface-dark">
                  <h2 className="pb-4 text-[22px] font-bold leading-tight tracking-[-0.015em] text-text-primary-light dark:text-text-primary-dark">
                    About This Training
                  </h2>
                  <div className="prose prose-base dark:prose-invert max-w-none text-text-secondary-light dark:text-text-secondary-dark">
                    <p>
                      This session provides a comprehensive walkthrough of our new Customer Relationship Management
                      (CRM) platform. We will cover the essential features you need to manage your client interactions
                      effectively, from initial contact to ongoing support. Understanding this tool is crucial for
                      streamlining our sales process and improving customer satisfaction.
                    </p>
                    <h3 className="dark:text-text-primary-dark">Key Takeaways:</h3>
                    <ul>
                      <li>
                        <strong>Dashboard Navigation:</strong> Learn how to customize your dashboard to see the most
                        relevant information at a glance.
                      </li>
                      <li>
                        <strong>Contact Management:</strong> Master the process of adding, updating, and segmenting your
                        contacts for targeted communication.
                      </li>
                      <li>
                        <strong>Pipeline Tracking:</strong> Understand how to track deals through every stage of the
                        sales pipeline, ensuring no opportunity is missed.
                      </li>
                      <li>
                        <strong>Reporting &amp; Analytics:</strong> Discover how to generate reports to analyze your
                        performance and identify areas for improvement.
                      </li>
                    </ul>
                  </div>
                </div>
                {/* Discussion Section */}
                <div className="rounded-xl border border-border-light bg-surface-light p-6 shadow-sm dark:border-border-dark dark:bg-surface-dark">
                  <h2 className="pb-4 text-[22px] font-bold leading-tight tracking-[-0.015em] text-text-primary-light dark:text-text-primary-dark">
                    Questions &amp; Discussion
                  </h2>
                  <div className="flex flex-col gap-6">
                    {/* New Comment Form */}
                    <div className="flex items-start gap-4">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-border-light dark:bg-border-dark">
                        <span className="material-symbols-outlined text-text-secondary-light dark:text-text-secondary-dark">
                          person
                        </span>
                      </div>
                      <div className="w-full">
                        <textarea
                          className="w-full rounded-lg border-border-light bg-background-light text-sm placeholder:text-text-secondary-light focus:border-primary focus:ring-primary dark:border-border-dark dark:bg-background-dark dark:placeholder:text-text-secondary-dark"
                          placeholder="Have a question? Post it here."
                          rows="3"
                        />
                        <button className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-primary/90">
                          <span>Submit Question</span>
                        </button>
                      </div>
                    </div>
                    {/* Separator */}
                    <hr className="border-border-light dark:border-border-dark" />
                    {/* Comment Thread */}
                    <div className="flex flex-col gap-6">
                      {/* Comment 1 */}
                      <div className="flex items-start gap-4">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-border-light dark:bg-border-dark">
                          <img
                            alt="Avatar of Jane Doe"
                            className="rounded-full"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAug_LwuG7lf0E25iFZrPCeS2iOvCNDpEvtMeuiE2Z3gOckVwCZIy2Ojh-f7j4yhnkVFaRSMq69XCjccOJ1Q2b1HqGHJWy8mZM1dZ6diKCeKOidb6qIQMRS-IhGpc4lf1300Gpl6tk5oiXAhpL4Pb96MY4WRsFBntvK20echA81aub3LRU4xnMKxzRJasSV_BnhG-mBG4wN2cD_KsbnpcviVPmro9EhSZFqCD1MvEhLTiMWiT8p6YG--PE3p4WP1gCOwuPV-UJf7hhB"
                          />
                        </div>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-bold">Jane Doe</p>
                            <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                              2 hours ago
                            </p>
                          </div>
                          <p className="mt-1 text-sm text-text-secondary-light dark:text-text-secondary-dark">
                            Is it possible to integrate this CRM with our existing email marketing tool? Great training,
                            by the way!
                          </p>
                        </div>
                      </div>
                      {/* Comment 2 */}
                      <div className="flex items-start gap-4">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-border-light dark:bg-border-dark">
                          <img
                            alt="Avatar of John Smith"
                            className="rounded-full"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCq7Qg9IKyMzLqEVpxhLWghLYQX5AWTHAYeOPKCzJyTqmdDKwJ0VEl7lOWIRy8HT4T67KhOJChMeARkcIhAJX--uDVkvAPklZEedEOPanBTmH2koppJxETHxqEnH38mZ1sAgi2-lTws8uVNwjMnLqaU-ZxY-e9bk-7uCgRnyAvOgdaADVgPYlf7FijINRFMClWmiIMnIAx36zAmQmIcnBsE9zVzRIeKJT334_5lUeh5lfAWyptyrbcn--_LjiF4BBg-a35epU48kD95"
                          />
                        </div>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-bold">John Smith</p>
                            <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                              1 hour ago
                            </p>
                          </div>
                          <p className="mt-1 text-sm text-text-secondary-light dark:text-text-secondary-dark">
                            How do we handle duplicate contacts? Is there an automatic merge feature?
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Sidebar */}
              <aside className="lg:col-span-1">
                <div className="sticky top-24 rounded-xl border border-border-light bg-surface-light p-6 shadow-sm dark:border-border-dark dark:bg-surface-dark">
                  <h3 className="pb-4 text-lg font-bold leading-tight tracking-[-0.015em] text-text-primary-light dark:text-text-primary-dark">
                    Related Forms &amp; Documents
                  </h3>
                  <div className="flex flex-col gap-2">
                    <Link
                      to="#"
                      className="group flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-primary/10 dark:hover:bg-primary/20"
                    >
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/20 text-primary">
                        <span className="material-symbols-outlined text-base">description</span>
                      </div>
                      <span className="text-sm font-medium text-text-primary-light group-hover:text-primary dark:text-text-primary-dark dark:group-hover:text-primary">
                        CRM Usage Policy.pdf
                      </span>
                    </Link>
                    <Link
                      to="#"
                      className="group flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-primary/10 dark:hover:bg-primary/20"
                    >
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/20 text-primary">
                        <span className="material-symbols-outlined text-base">description</span>
                      </div>
                      <span className="text-sm font-medium text-text-primary-light group-hover:text-primary dark:text-text-primary-dark dark:group-hover:text-primary">
                        Data Entry Guidelines.docx
                      </span>
                    </Link>
                    <Link
                      to="#"
                      className="group flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-primary/10 dark:hover:bg-primary/20"
                    >
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/20 text-primary">
                        <span className="material-symbols-outlined text-base">description</span>
                      </div>
                      <span className="text-sm font-medium text-text-primary-light group-hover:text-primary dark:text-text-primary-dark dark:group-hover:text-primary">
                        Support Request Form
                      </span>
                    </Link>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}