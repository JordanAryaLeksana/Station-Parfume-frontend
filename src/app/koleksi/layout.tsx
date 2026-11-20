export default function KoleksiLayout({ children }: LayoutProps<"/koleksi">) {
  return (
    <div className="mx-auto w-full max-w-330 px-5 pt-14 pb-24 min-[980px]:px-10 min-[980px]:pt-20 min-[980px]:pb-32">
      <div aria-hidden className="mb-8 takar h-2 w-30" />
      <h1 className="font-primary text-[clamp(2.375rem,4.3vw,4rem)] leading-[1.02]">
        Koleksi <em className="font-light text-gold-accent-soft">wangi</em>
      </h1>
      <p className="mt-5 max-w-[46ch] text-muted-foreground">
        Setiap wangi diracik per ml setelah kamu memesan, dalam ukuran 20, 30,
        atau 50 ml.
      </p>
      {children}
    </div>
  );
}
