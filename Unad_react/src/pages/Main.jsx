import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import VideoCard from '../components/VideoCard';

export default function Main() {
  const tutorials = [
    {
      title: 'How to Submit Expense Reports',
      category: 'Finance',
      duration: 5,
      imageUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCc0MMTxcGk5N0sudqWLFCS5aaUfi4g0gTtpYOaFfZ2iVqcX65lMEwfIvf7DM0kpp1iSPl15juNCw-a1dK8Ghn_Dr13RuBnI4tysppwRZqiHzD07XpVSeQL-bn8N3Cce-Qj7X7XBJs4IGzr5XcKFDiVBpU_nNosZI6YhAS-3NbqQ86xtoCmCtBPrhSZq-orqqizlQ-uPPGMzRfVwM1w2D-Eptgs9UIr4RkkgyP6YzKIf17N4eTiE8AyHKxCPBa6wSGZ5WFbX-4DV8dy',
    },
    {
      title: 'Completing Your W-4 Form',
      category: 'HR',
      duration: 8,
      imageUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuD7I1bRfsTh9KmZuZJ6k9fLJU6khuwXlw12rNrL62wlYytDA72CJp5SUdDiw9V1GFi3uomnVAnh1h3LVZEhKPiF634qeW4JJ7h0ZdtZzz0Mrf6i_oLbRiomM2nYpD-CzRs2fWBPVugKjoqKH7rqYSOHWUuQDe3GhvKvp1B3AVSZyoTeNlM1woa7dJMDSHwzoyHcKeupMRxf9CHLtIuR9gHCW6SLww97ZCf4nLRg1Kx6dWD8fxZMQSfgVMn4gKRddSSoSOMYUdL70rBX',
    },
    {
      title: 'Requesting Paid Time Off',
      category: 'HR',
      duration: 3,
      imageUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAfv3aZ2kQ_noaXidoJQkfd309ewVcVvBtQZ96Foct8PGlPFcusp21i4voO9bOJCVg79C2mcEHNfoLUERlUZvXjt7adXIia0xaSuqj3BKOm_K_DJIbKUozKzT2ihIzXnvPBvuI3nXRjEEKLjfCEiThzCiXc38aK06Osn7pcNJ_jVt5tEv_2vSAOyEm9lPDwttIXTVRh6zZrBpwH-jvkifQYFoirByV0VgdNEIa4-mA1S0gByb_JqUhok5QpYcDBohzLa0XM_g-Wt8B8',
    },
    {
      title: 'Understanding Your Benefits',
      category: 'HR',
      duration: 12,
      imageUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCp2lXB1SZPK-5j-Ap0bc8rPYnOv7Mcb_f7hKTH_tFICoXQKz7Dq-J2PaPMHwMDaE7sdZfCs5PatV5tDpFqjIhJeCZI9ZIUHbJmPboFFd07ivRYuHlPqGxBZLKvGptFRphHYzWpT-RV2NweEgqEY10uirH7kExqWbu_NeOkZ5BcgC5lYmaE89iiW-crUXzzgQmatjmX86x4mujULXFM-K-pDh6pl5uPRV7NPaG2AP2MY2cqqcef1V8tC4-Q8g9elo_cqM_xKD7u4QPW',
    },
    {
      title: 'IT Security Best Practices',
      category: 'IT Support',
      duration: 15,
      imageUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCo7grw-ptWPrYzaGF27QMxAgZ5YCiwdeL3wUEPVGsWKrm0b191UinlNpDoXEQIkaWToqh8wk1DcmlLNjWrJkUUBBDAvkXCuPNnWePFMBvCGCCk36yzuahF-ASI9N-4Gpw5uyNM4wzdn6j9Q23WNRRElo-RG7TgxRQMgDP33cBmesofOpW9GTtLWtulvr3oxU6x0D0PYYDqqapAoPTfR-cx4qhkLN4PkE6Di2NUID-t4sY8OnmTGez9B7t8K96gO9TNItv0Rv1eTcj_',
    },
    {
      title: 'Using the New CRM',
      category: 'Operations',
      duration: 20,
      imageUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCeNa5JR0OJ0luGOdiH20Lz10iy4HPNjdCO5e0xT90Io3yWbHAJ_waxPYf95NTiDDckJjVUoaRUveHgoeUh-aeBzHGjiy9JPDsGQAX9owGbcKYWTdKUNu8uaC8wsZCHfh8_pP8FW52ttuCitRlCguuj3ciPjFP9cFDVjymp01oUFnZthdoAhiZoIxIkoe5pilDlab5acLKIRckjTq1hN1_7D61llgUvdCvz8OzrUfZFBt9PIJ2UjLA3nwUIQTQfW7D-vqFoJVGuW-YQ',
    },
    {
      title: 'Code of Conduct Overview',
      category: 'Legal',
      duration: 10,
      imageUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDWNvZvjcF2M_U4bypWzpYaWUgxa8FZGUfaRVksOAn3FfD3cMPzUL9Jqq1LMp3HYYnkcH11Qat6HelQ4HtQn9eYNRw0mok_3IbOmWc8hz0g-Q6d7Ye-ZgufFddQ33gUg0su9C1Xoz-Jf4b88EjF3pTb2ULiKpT3LFzm9kk-89wedaQZhEE7kXt72E2Jdftr3SwwX5AzwxzpYJTFLCiQS8uuNwUv02DOV0pNkjxmGGIvkInFjA6eo4sP4zmVbsMFjyaqu1Sa0_TgBSbU',
    },
    {
      title: 'Annual Performance Review Guide',
      category: 'HR',
      duration: 7,
      imageUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCLSNbpAOqHGUBU-W40KnwxBYj0AOTjRskBxiKKqYDqTOtzPo2InMtCbX2n1GFzFKBiJzDsd2NGnR1UScwd0HmysQPg_kkBrMaJWwcbpP9KR7eDoEwpv0ntS1q4CIKuy4wK8FVggGIbuufsrzjdhp6c1b68HsYDDlcdc_V2uLdpd5nProfcxtnkAmwXboyyI0nhY9tG_5L4-Xaq_0N7rFl0b3rIm93HgyNpOM5FBPdgbpsIpniTWPppEOVBroe_g9RvbSU5IGPjW4c2',
    },
  ];

  return (
    <div className="flex h-screen w-full font-display bg-background-light text-text-light-primary dark:bg-background-dark dark:text-text-dark-primary">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-y-auto">
        <Header />
        <main className="flex-1 p-8">
          <div className="flex flex-col gap-6">
            {/* PageHeading */}
            <div>
              <p className="text-3xl font-bold leading-tight tracking-tight text-text-light-primary dark:text-text-dark-primary">
                All Tutorials
              </p>
            </div>
            {/* Chips/Filters */}
            <div className="flex gap-2">
              <button className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-lg border border-border-light bg-card-light px-3 transition-colors hover:border-primary/50 dark:border-border-dark dark:bg-card-dark">
                <p className="text-sm font-medium leading-normal text-text-light-primary dark:text-text-dark-primary">
                  Sort by: Latest
                </p>
                <span className="material-symbols-outlined text-lg text-text-light-secondary dark:text-text-dark-secondary">
                  expand_more
                </span>
              </button>
              <button className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-lg border border-border-light bg-card-light px-3 transition-colors hover:border-primary/50 dark:border-border-dark dark:bg-card-dark">
                <p className="text-sm font-medium leading-normal text-text-light-primary dark:text-text-dark-primary">
                  HR
                </p>
                <span className="material-symbols-outlined text-lg text-text-light-secondary dark:text-text-dark-secondary">
                  expand_more
                </span>
              </button>
              <button className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-lg border border-border-light bg-card-light px-3 transition-colors hover:border-primary/50 dark:border-border-dark dark:bg-card-dark">
                <p className="text-sm font-medium leading-normal text-text-light-primary dark:text-text-dark-primary">
                  Finance
                </p>
                <span className="material-symbols-outlined text-lg text-text-light-secondary dark:text-text-dark-secondary">
                  expand_more
                </span>
              </button>
              <button className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-lg border border-border-light bg-card-light px-3 transition-colors hover:border-primary/50 dark:border-border-dark dark:bg-card-dark">
                <p className="text-sm font-medium leading-normal text-text-light-primary dark:text-text-dark-primary">
                  Legal
                </p>
                <span className="material-symbols-outlined text-lg text-text-light-secondary dark:text-text-dark-secondary">
                  expand_more
                </span>
              </button>
            </div>
            {/* ImageGrid */}
            <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6">
              {tutorials.map((tutorial, index) => (
                <Link
                  key={index}
                  to="/video"
                  state={tutorial} // ✅ Pasamos la información del tutorial
                  className="block transition-transform hover:scale-[1.02]"
                >
                  <VideoCard
                    title={tutorial.title}
                    category={tutorial.category}
                    duration={tutorial.duration}
                    imageUrl={tutorial.imageUrl}
                  />
                </Link>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}