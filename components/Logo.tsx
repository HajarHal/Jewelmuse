// Logo Jewel Muse — affiche le visuel de la marque (public/logo.png).
// Réglez la taille via la prop `className`, ex : <Logo className="h-14 w-auto" />.

export default function Logo({
  className = "h-14 w-auto",
  alt = "Jewel Muse",
}: {
  className?: string;
  alt?: string;
}) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src="/logo.png" alt={alt} className={className} />;
}
