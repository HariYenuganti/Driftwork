export default function Logo() {
  return (
    <a href="." className="logo">
      {/* SVG logo — next/image adds no benefit for vector assets. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo.svg" alt="Driftwork" className="logo__img" />
    </a>
  );
}
