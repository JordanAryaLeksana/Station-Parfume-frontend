import Typography from "@/components/shared/typography";

export default function KoleksiLayout({ children }: LayoutProps<"/koleksi">) {
  return (
    <div className="mx-auto w-full max-w-330 px-5 pt-14 pb-24 min-[980px]:px-10 min-[980px]:pt-20 min-[980px]:pb-32">
      <div aria-hidden className="mb-8 takar h-2 w-30" />
      <Typography as="h1" variant="headline">
        Koleksi <em className="font-light text-gold-accent-soft">wangi</em>
      </Typography>
      <Typography
        variant="body"
        className="mt-5 max-w-[46ch] text-muted-foreground"
      >
        Setiap wangi diracik per ml setelah kamu memesan, dalam ukuran 20, 30,
        atau 50 ml.
      </Typography>
      {children}
    </div>
  );
}
