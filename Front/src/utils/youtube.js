/**
 * Utilidades de YouTube.
 *
 * `VideosLibrary` y `VideoView` tenian cada una su propia copia del parseo de
 * URLs y de la carga del iframe API; ahora comparten este modulo.
 */

export const FALLBACK_THUMBNAIL =
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop";

export const getYouTubeVideoId = (url) => {
  if (!url) return null;

  try {
    const parsedUrl = new URL(url);
    const host = parsedUrl.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      return parsedUrl.pathname.split("/").filter(Boolean)[0] || null;
    }

    if (host === "youtube.com" || host === "m.youtube.com" || host === "music.youtube.com") {
      if (parsedUrl.pathname === "/watch") {
        return parsedUrl.searchParams.get("v");
      }

      const parts = parsedUrl.pathname.split("/").filter(Boolean);
      if (["embed", "shorts", "live"].includes(parts[0])) {
        return parts[1] || null;
      }
    }
  } catch {
    const match = String(url).match(
      /(?:youtu\.be\/|v=|embed\/|shorts\/|live\/)([a-zA-Z0-9_-]{11})/
    );
    return match?.[1] || null;
  }

  return null;
};

export const getYouTubeThumbnail = (url) => {
  const videoId = getYouTubeVideoId(url);
  return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : FALLBACK_THUMBNAIL;
};

let youTubeApiPromise;

export const loadYouTubeApi = () => {
  if (window.YT?.Player) {
    return Promise.resolve(window.YT);
  }

  if (youTubeApiPromise) {
    return youTubeApiPromise;
  }

  youTubeApiPromise = new Promise((resolve) => {
    const previousCallback = window.onYouTubeIframeAPIReady;

    window.onYouTubeIframeAPIReady = () => {
      previousCallback?.();
      resolve(window.YT);
    };

    if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(script);
    }
  });

  return youTubeApiPromise;
};

/** Duracion via API oculta; devuelve null si no se puede determinar. */
export const getYouTubeDuration = async (videoId) => {
  if (!videoId) return null;

  try {
    const YT = await loadYouTubeApi();
    const container = document.createElement("div");
    container.style.position = "fixed";
    container.style.left = "-9999px";
    container.style.top = "-9999px";
    document.body.appendChild(container);

    return await new Promise((resolve) => {
      const timeout = setTimeout(() => {
        player?.destroy();
        container.remove();
        resolve(null);
      }, 8000);

      let player = new YT.Player(container, {
        width: "1",
        height: "1",
        videoId,
        events: {
          onReady: (event) => {
            const duration = event.target.getDuration();
            clearTimeout(timeout);
            event.target.destroy();
            container.remove();
            resolve(duration);
          },
          onError: () => {
            clearTimeout(timeout);
            player?.destroy();
            container.remove();
            resolve(null);
          },
        },
      });
    });
  } catch {
    return null;
  }
};
