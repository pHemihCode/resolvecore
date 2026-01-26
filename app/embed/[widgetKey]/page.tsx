// app/embed/[widgetKey]/page.tsx
import SupportWidget from "@/components/widget/SupportWidget";

interface EmbedPageProps {
  params: Promise<{
    widgetKey: string;
  }>;
}

export default async function EmbedPage({ params }: EmbedPageProps) {
  const { widgetKey } = await params;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "transparent",
        pointerEvents: "none",
      }}
    >
      <div style={{ pointerEvents: "auto" }}>
        <SupportWidget widgetKey={widgetKey} />
      </div>
    </div>
  );
}