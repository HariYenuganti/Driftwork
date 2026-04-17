import Container from '@/components/Container';

/**
 * Layout for the main "dashboard" routes (/, /jobs/[id]).
 * These render a sidebar (children) alongside a detail pane (@detail slot).
 * Auxiliary routes like /submit live outside this group and render full-width.
 */
export default function MainLayout({
  children,
  detail,
}: {
  children: React.ReactNode;
  detail: React.ReactNode;
}) {
  return (
    <Container>
      {children}
      {detail}
    </Container>
  );
}
