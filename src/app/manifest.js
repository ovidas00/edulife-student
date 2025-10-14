export default function manifest() {
  return {
    name: "Edulife IT - Student Portal",
    short_name: "Edulife Student",
    description:
      "Nurturing young minds through innovative learning experiences since 2015",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
