export default function VideoCard({ title, category, duration, imageUrl }) {
  return (
    <div className="flex flex-col gap-3 rounded-xl bg-card-light p-3 transition-shadow hover:shadow-lg dark:bg-card-dark dark:hover:shadow-primary/10">
      <div className="group relative aspect-video w-full">
        <div
          className="h-full w-full rounded-lg bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
        <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/30 opacity-0 transition-opacity group-hover:opacity-100">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm">
            <span
              className="material-symbols-outlined text-3xl text-primary"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              play_arrow
            </span>
          </div>
        </div>
      </div>
      <div>
        <p className="font-semibold leading-normal text-text-light-primary dark:text-text-dark-primary">
          {title}
        </p>
        <p className="text-sm font-normal leading-normal text-text-light-secondary dark:text-text-dark-secondary">
          {category} | {duration} min
        </p>
      </div>
    </div>
  );
}