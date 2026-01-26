"use client";

import SupportWidget from "@/components/widget/SupportWidget";

export default function WidgetTestPage() {
  return (
    <div style={{ height: "200vh", padding: "40px" }}>
      <h1>Widget Test Environment</h1>
      <p>Scroll, click, reload, and test widget behavior.</p>

      <SupportWidget
        widgetKey="wk_0a8895e05452b1686e81aeb7f1d29d58"
      />
    </div>
  );
}
