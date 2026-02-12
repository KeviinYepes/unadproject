import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

export default function Forum() {
  return (
    <div className="relative flex min-h-screen w-full font-display bg-background-light text-[#0d141b] dark:bg-background-dark dark:text-slate-200">
      <Sidebar />
      <main className="flex-1 p-6 lg:p-10">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Left Column: Thread */}
            <div className="flex flex-col gap-6 lg:col-span-2">
              {/* Breadcrumbs */}
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  to="#"
                  className="text-sm font-medium text-slate-500 hover:text-primary dark:text-slate-400"
                >
                  Forum
                </Link>
                <span className="material-symbols-outlined text-base text-slate-400">chevron_right</span>
                <Link
                  to="#"
                  className="text-sm font-medium text-slate-500 hover:text-primary dark:text-slate-400"
                >
                  Document Support
                </Link>
                <span className="material-symbols-outlined text-base text-slate-400">chevron_right</span>
                <span className="text-sm font-medium text-[#0d141b] dark:text-slate-200">
                  How to export a report?
                </span>
              </div>
              {/* PageHeading & Chips */}
              <div className="flex flex-col gap-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <h1 className="text-3xl font-bold tracking-tight text-[#0d141b] dark:text-white">
                    How to export a final report as a PDF?
                  </h1>
                  <div className="flex h-7 shrink-0 items-center justify-center gap-x-2 rounded-full bg-amber-100 px-3 dark:bg-amber-900/50">
                    <p className="text-xs font-medium text-amber-700 dark:text-amber-300">Open</p>
                  </div>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Asked by Jane Doe 2 days ago</p>
                <div className="flex flex-wrap gap-2">
                  <div className="flex h-7 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-slate-200/60 px-3 dark:bg-slate-800">
                    <p className="text-xs font-medium text-slate-600 dark:text-slate-300">Reporting</p>
                  </div>
                  <div className="flex h-7 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-slate-200/60 px-3 dark:bg-slate-800">
                    <p className="text-xs font-medium text-slate-600 dark:text-slate-300">PDF Export</p>
                  </div>
                </div>
              </div>
              <hr className="border-slate-200 dark:border-slate-800" />
              {/* Main Question Post */}
              <div className="flex w-full flex-row items-start justify-start gap-4">
                <div
                  className="aspect-square w-10 shrink-0 rounded-full bg-cover bg-center bg-no-repeat"
                  style={{
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAit0CNrvT0w-YbMgObiJop2nib-n6eE3CUrd2Bn7QNGrHrgD7ZawMTN3ie2R1l64ElBXaYist8z9t4O9gM2SPe9XD6G9cWlX7wfmyPShtozn-TBKx2DkZV5ZCMlJxbXdjXEnFgz8i6WaxrJsvRH_ta9oax0alFZN69NMGPe6IMrRWmXNgNMrVkX1cuOrNId1Ieyb9NnVpHveHbXUBXR9WrGGg3o1AqxtvuQ-ttmGS64xMyFLfJzXjdbNtp8_qFgUgcPGd0p-Xx4PuZ')",
                  }}
                />
                <div className="flex h-full flex-1 flex-col items-start justify-start">
                  <div className="flex w-full flex-row items-center justify-start gap-x-3">
                    <p className="text-sm font-bold text-[#0d141b] dark:text-white">Jane Doe</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">2 days ago</p>
                  </div>
                  <div className="prose prose-sm dark:prose-invert mt-2 max-w-none text-slate-700 dark:text-slate-300">
                    <p>
                      I'm having trouble finding the option to export my final report as a PDF. I've looked through the
                      documentation under the 'Exports' section, but I can only see options for CSV and Excel.
                    </p>
                    <p>
                      Can someone point me in the right direction? I need this for a client presentation tomorrow.
                      Thanks!
                    </p>
                  </div>
                  <div className="flex w-full flex-row items-center justify-start gap-6 pt-3">
                    <button className="flex items-center gap-1.5 text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-primary-400">
                      <span className="material-symbols-outlined text-base">thumb_up</span>
                      <p className="text-sm font-medium">3</p>
                    </button>
                    <button className="flex items-center gap-1.5 text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-primary-400">
                      <span className="material-symbols-outlined text-base">reply</span>
                      <p className="text-sm font-medium">Reply</p>
                    </button>
                  </div>
                </div>
              </div>
              {/* Replies */}
              <div className="mt-4 flex flex-col gap-6 border-l border-slate-200 pl-8 dark:border-slate-800">
                {/* Support Staff Reply */}
                <div className="flex w-full flex-row items-start justify-start gap-4 rounded-xl border border-primary/20 bg-primary/5 p-4 dark:border-primary/30 dark:bg-primary/10">
                  <div className="relative shrink-0">
                    <div
                      className="aspect-square w-10 rounded-full bg-cover bg-center bg-no-repeat"
                      style={{
                        backgroundImage:
                          "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB-iovT-lYMRoNXU-vAEksSD92OZ75L6Juk1wJjxASsnTJEtarl_cVhy3fG4WnJbyXDEDPXvwaBlrqnnDxp8vvffQ1w-HtGR0YiPudepCO36vQz_CiG4yZnGFkYWfMyucBPFQSEjvubCarcO-Dsyce3e_3A9xE56Il1siaOR7irQyUAWaDrejS_LKrT72jyrZM5N0fxkymwmhvS-xZTEYVkOdEeLp-990PCWyG85g48zPFJqs75cxYgdVpt9esC50fJgiiItNThK3At')",
                      }}
                    />
                    <div className="absolute -bottom-1 -right-1 flex size-5 items-center justify-center rounded-full bg-primary border-2 border-white dark:border-background-dark">
                      <span className="material-symbols-outfill material-symbols-outlined fill text-[10px] text-white">
                        shield
                      </span>
                    </div>
                  </div>
                  <div className="flex h-full flex-1 flex-col items-start justify-start">
                    <div className="flex w-full flex-row items-center justify-start gap-x-3">
                      <p className="text-sm font-bold text-[#0d141b] dark:text-white">John Smith</p>
                      <div className="flex items-center gap-1.5 rounded-md bg-primary/10 px-2 py-0.5 text-primary dark:bg-primary/20 dark:text-primary-300">
                        <span className="material-symbols-outlined text-xs">support_agent</span>
                        <p className="text-xs font-medium">Support Staff</p>
                      </div>
                      <p className="ml-auto text-sm text-slate-500 dark:text-slate-400">1 day ago</p>
                    </div>
                    <div className="prose prose-sm dark:prose-invert mt-2 max-w-none text-slate-700 dark:text-slate-300">
                      <p>
                        Hi Jane, I can help with that! The PDF export option is located under the "Share" menu, not
                        "Exports".
                      </p>
                      <p>
                        Click on the "Share" button at the top right of the report view, and you'll see an option for
                        "Download as PDF". We're working on making this more intuitive in a future update.
                      </p>
                      <p>Let me know if that works for you!</p>
                    </div>
                    <div className="flex w-full flex-row items-center justify-start gap-6 pt-3">
                      <button className="flex items-center gap-1.5 text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-primary-400">
                        <span className="material-symbols-outlined text-base">thumb_up</span>
                        <p className="text-sm font-medium">12</p>
                      </button>
                      <button className="flex items-center gap-1.5 text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-primary-400">
                        <span className="material-symbols-outlined text-base">reply</span>
                        <p className="text-sm font-medium">Reply</p>
                      </button>
                    </div>
                  </div>
                </div>
                {/* User Reply to Staff */}
                <div className="ml-8 flex w-full flex-row items-start justify-start gap-4 border-l border-slate-200 pl-8 dark:border-slate-800">
                  <div
                    className="aspect-square w-10 shrink-0 rounded-full bg-cover bg-center bg-no-repeat"
                    style={{
                      backgroundImage:
                        "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC6Wu-ByowAt9uTkdi565ijCB29-Q2iJvgt9MeC7FspPPzjgnzJcuA6_Z3cvz7jga8aVQ4KI-z9HjkmuhUWmB_DH5gfKeyq-RNct_7HbWHl6INnxgCEdZLsy-hdEikrVbkum83AT2HmS3ruprikriMCQJ0FbjtGW-Odbp9qSxqMkD7BAEuBustrzYxQJql2vU7rKgCgjUkF6uCd_JcaKykYh13D5oxdshXEPerm7z7ebev59fuPz8C4RZo94z94sRGNStpe8Qz-tToG')",
                    }}
                  />
                  <div className="flex h-full flex-1 flex-col items-start justify-start">
                    <div className="flex w-full flex-row items-center justify-start gap-x-3">
                      <p className="text-sm font-bold text-[#0d141b] dark:text-white">Jane Doe</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">1 day ago</p>
                    </div>
                    <div className="prose prose-sm dark:prose-invert mt-2 max-w-none text-slate-700 dark:text-slate-300">
                      <p>That worked perfectly, thank you so much John! Saved me a lot of stress.</p>
                    </div>
                    <div className="flex w-full flex-row items-center justify-start gap-6 pt-3">
                      <button className="flex items-center gap-1.5 text-primary dark:text-primary-400">
                        <span className="material-symbols-outlined fill text-base">thumb_up</span>
                        <p className="text-sm font-medium">1</p>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              {/* Rich Text Editor */}
              <div className="mt-8 flex flex-col gap-4 border-t border-slate-200 pt-6 dark:border-slate-800">
                <h3 className="text-base font-bold text-[#0d141b] dark:text-white">Add your reply</h3>
                <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/50">
                  <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 p-2 dark:border-slate-800">
                    <button className="rounded-md p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800">
                      <span className="material-symbols-outlined text-base">format_bold</span>
                    </button>
                    <button className="rounded-md p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800">
                      <span className="material-symbols-outlined text-base">format_italic</span>
                    </button>
                    <button className="rounded-md p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800">
                      <span className="material-symbols-outlined text-base">format_list_bulleted</span>
                    </button>
                    <button className="rounded-md p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800">
                      <span className="material-symbols-outlined text-base">link</span>
                    </button>
                    <button className="rounded-md p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800">
                      <span className="material-symbols-outlined text-base">code</span>
                    </button>
                  </div>
                  <textarea
                    className="w-full border-0 bg-transparent p-4 text-sm text-slate-700 placeholder:text-slate-400 focus:ring-0 dark:text-slate-300 dark:placeholder:text-slate-500"
                    placeholder="Join the conversation..."
                    rows="5"
                  />
                  <div className="flex items-center justify-between border-t border-slate-200 p-3 dark:border-slate-800">
                    <button className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-primary-400">
                      <span className="material-symbols-outlined text-base">attach_file</span>
                      Attach File
                    </button>
                    <button className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
                      Post Reply
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {/* Right Column: Sidebar */}
            <aside className="flex flex-col gap-6 lg:col-span-1">
              <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900/50">
                <h4 className="mb-4 text-base font-bold text-[#0d141b] dark:text-white">Thread Details</h4>
                <div className="flex flex-col gap-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Author</span>
                    <span className="font-medium text-[#0d141b] dark:text-slate-200">Jane Doe</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Created</span>
                    <span className="font-medium text-[#0d141b] dark:text-slate-200">2 days ago</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Replies</span>
                    <span className="font-medium text-[#0d141b] dark:text-slate-200">2</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Last Reply</span>
                    <span className="font-medium text-[#0d141b] dark:text-slate-200">1 day ago</span>
                  </div>
                </div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900/50">
                <h4 className="mb-4 text-base font-bold text-[#0d141b] dark:text-white">Related Document</h4>
                <Link
                  to="#"
                  className="group flex items-center gap-3 rounded-lg p-3 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-300">
                    <span className="material-symbols-outlined">description</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#0d141b] group-hover:text-primary dark:text-white dark:group-hover:text-primary-300">
                      Q4 Financials Report
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">View Document</p>
                  </div>
                </Link>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900/50">
                <h4 className="mb-4 text-base font-bold text-[#0d141b] dark:text-white">Participants</h4>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="aspect-square size-9 rounded-full bg-cover bg-center bg-no-repeat"
                      style={{
                        backgroundImage:
                          "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBlxP1x084vRi5mOYL3mlmvJXDpH2AsVFjs-9EUiSfgLOqy8HKyVDxPoHsEduTJFOw6h-s4fOfNg6utM-KkQBzjdedElvkH1HZlFMNKFhlPH0a2WeQvRyIDGGe_JnLGYXGMyn_0Gq-JgVqkVh6HUqrl3zV0zFCjLmUSuPZHshLEInuUOPWh6nKQMf16JujhthkXh678ob1SyG-KINDltkHCiiYVHkBh9U8D41X4YA0l3qVfE6Do_9ZGmZV52XvwZk_X6BcrlOqzBNYr')",
                      }}
                    />
                    <div>
                      <p className="text-sm font-medium text-[#0d141b] dark:text-white">Jane Doe</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Author</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div
                      className="aspect-square size-9 rounded-full bg-cover bg-center bg-no-repeat"
                      style={{
                        backgroundImage:
                          "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDR3kDZlQ-eNu5Ku_S7UQl8_1HSgS1FeMW0Mh1IMPuBSFwb2RHu-izlZEiKYp4TBDcd004NwDeoYMGZMubeSt3lIine1FZb3LhwrtX28FYmgg2XdbUAqL_7BZP3NN1X4FtXnZggHqWOD8GtojVFO8A2IHHvH9Zyq0cIcWBzVyKml6Y41bkrnzxkDpw1v78H069DWtlGAekkqcS5gut8CiAJZwuDWa5Ur2VcZYJ0rRgqwM6Pmn1-kZutm1DW_CEX527D1siV3Ulf07J4')",
                      }}
                    />
                    <div>
                      <p className="text-sm font-medium text-[#0d141b] dark:text-white">John Smith</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Support Staff</p>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}