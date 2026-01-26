// components/widget/WidgetPanel.tsx
"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { WidgetView, WidgetConfig } from "@/types/widget";
import WidgetHeader from "./WidgetHeader";
import Welcome from "./screens/Welcome";
import CreateTicket from "./screens/CreateTicket";
import Success from "./screens/Success";
import CheckStatus from "./screens/CheckStatus";
import TicketStatus from "./screens/TicketStatus";

interface WidgetPanelProps {
  widgetKey: string;
  config: WidgetConfig;
  currentView: WidgetView;
  ticketId: string | null;
  ticketEmail: string | null;
  setCurrentView: (view: WidgetView) => void;
  setTicketId: (id: string | null) => void;
  setTicketEmail: (email: string | null) => void;
  closeWidget: () => void;
  resetWidget: () => void;
  goBack: () => void;
}

export default function WidgetPanel({
  widgetKey,
  config,
  currentView,
  ticketId,
  ticketEmail,
  setCurrentView,
  setTicketId,
  setTicketEmail,
  closeWidget,
  resetWidget,
  goBack,
}: WidgetPanelProps) {
  const renderScreen = () => {
    switch (currentView) {
      case "welcome":
        return <Welcome config={config} setCurrentView={setCurrentView} />;
      case "create-ticket":
        return (
          <CreateTicket
            widgetKey={widgetKey}
            brandColor={config.brandColor}
            setCurrentView={setCurrentView}
            setTicketId={setTicketId}
            setTicketEmail={setTicketEmail}
          />
        );
      case "success":
        return (
          <Success
            ticketId={ticketId!}
            brandColor={config.brandColor}
            setCurrentView={setCurrentView}
            closeWidget={closeWidget}
          />
        );
      case "check-status":
        return (
          <CheckStatus
            brandColor={config.brandColor}
            initialTicketId={ticketId}
            initialEmail={ticketEmail}
            setCurrentView={setCurrentView}
            setTicketId={setTicketId}
            setTicketEmail={setTicketEmail}
          />
        );
      case "ticket-status":
        return (
          <TicketStatus
            ticketId={ticketId!}
            email={ticketEmail!}
            brandColor={config.brandColor}
            setCurrentView={setCurrentView}
          />
        );
      default:
        return <Welcome config={config} setCurrentView={setCurrentView} />;
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-[99997] sm:hidden"
        onClick={closeWidget}
      />

      {/* Widget Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
        className={cn(
          "fixed z-[99998]",
          "bg-white rounded-2xl shadow-2xl",
          "flex flex-col",
          "border border-gray-200",
          // Mobile: Full screen with padding
          "inset-2 sm:inset-auto",
          // Desktop: Fixed position and size
          config.position === "bottom-right"
            ? "sm:right-6 sm:bottom-24"
            : "sm:left-6 sm:bottom-24",
          // Desktop dimensions
          "sm:w-[380px] sm:h-[min(600px,calc(100vh-120px))]",
          // Mobile: Use available space
          "max-h-[calc(100vh-16px)] sm:max-h-[600px]"
        )}
        style={{
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        }}
      >
        {/* Header - Fixed at top */}
        <div className="flex-shrink-0">
          <WidgetHeader
            companyName={config.companyName}
            brandColor={config.brandColor}
            currentView={currentView}
            onBack={goBack}
            onClose={closeWidget}
          />
        </div>

        {/* Content - Scrollable */}
        <motion.div
          key={currentView}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.2 }}
          className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-5"
        >
          {renderScreen()}
        </motion.div>

        {/* Footer - Fixed at bottom */}
        <div className="flex-shrink-0 px-4 sm:px-5 py-3 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
          <p className="text-xs text-center text-gray-400">
            Powered by{" "}
            <span className="font-medium text-gray-500">ResolveCore</span>
          </p>
        </div>
      </motion.div>
    </>
  );
}