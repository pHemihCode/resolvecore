// components/widget/SupportWidget.tsx
"use client";

import { useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { useWidget } from "@/hooks/useWidget";
import WidgetLauncher from "./WidgetLauncher";
import WidgetPanel from "./WidgetPanel";

interface SupportWidgetProps {
  widgetKey: string;
}

export default function SupportWidget({ widgetKey }: SupportWidgetProps) {
  const widget = useWidget({ widgetKey });

  // Handle ESC key to close widget
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && widget.isOpen) {
        widget.closeWidget();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [widget.isOpen, widget.closeWidget]);

  // Don't render if loading or error
  if (widget.isLoading) {
    return null;
  }

  if (widget.error || !widget.config) {
    if (process.env.NODE_ENV === "development") {
      console.error("Widget Error:", widget.error);
    }
    return null;
  }

  return (
    <>
      {/* Launcher Button */}
      <WidgetLauncher
        isOpen={widget.isOpen}
        onClick={widget.toggleWidget}
        brandColor={widget.config.brandColor}
        position={widget.config.position}
      />

      {/* Widget Panel */}
      <AnimatePresence mode="wait">
        {widget.isOpen && (
          <WidgetPanel
            widgetKey={widgetKey}
            config={widget.config}
            currentView={widget.currentView}
            ticketId={widget.ticketId}
            ticketEmail={widget.ticketEmail}
            setCurrentView={widget.setCurrentView}
            setTicketId={widget.setTicketId}
            setTicketEmail={widget.setTicketEmail}
            closeWidget={widget.closeWidget}
            resetWidget={widget.resetWidget}
            goBack={widget.goBack}
          />
        )}
      </AnimatePresence>
    </>
  );
}