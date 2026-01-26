// hooks/useWidget.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import type { WidgetView, WidgetConfig } from "@/types/widget";
import { fetchWidgetConfig } from "@/lib/api/widget-api";

interface UseWidgetProps {
  widgetKey: string;
}

interface UseWidgetReturn {
  // Config
  config: WidgetConfig | null;
  isLoading: boolean;
  error: string | null;

  // Widget state
  isOpen: boolean;
  currentView: WidgetView;
  ticketId: string | null;
  ticketEmail: string | null;

  // Actions
  openWidget: () => void;
  closeWidget: () => void;
  toggleWidget: () => void;
  setCurrentView: (view: WidgetView) => void;
  setTicketId: (id: string | null) => void;
  setTicketEmail: (email: string | null) => void;
  resetWidget: () => void;
  goBack: () => void;
}

export function useWidget({ widgetKey }: UseWidgetProps): UseWidgetReturn {
  const [config, setConfig] = useState<WidgetConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [currentView, setCurrentView] = useState<WidgetView>("welcome");
  const [ticketId, setTicketId] = useState<string | null>(null);
  const [ticketEmail, setTicketEmail] = useState<string | null>(null);
  const [viewHistory, setViewHistory] = useState<WidgetView[]>([]);

  // Load widget configuration
  useEffect(() => {
    if (!widgetKey) {
      setError("Widget key is required");
      setIsLoading(false);
      return;
    }

    const loadConfig = async () => {
      setIsLoading(true);
      setError(null);

      const result = await fetchWidgetConfig(widgetKey);

      if (result.success && result.data) {
        setConfig(result.data);
      } else {
        setError(result.error || "Failed to load widget");
      }

      setIsLoading(false);
    };

    loadConfig();
  }, [widgetKey]);

  const openWidget = useCallback(() => setIsOpen(true), []);
  const closeWidget = useCallback(() => setIsOpen(false), []);
  const toggleWidget = useCallback(() => setIsOpen((prev) => !prev), []);

  const handleSetCurrentView = useCallback((view: WidgetView) => {
    setViewHistory((prev) => [...prev, currentView]);
    setCurrentView(view);
  }, [currentView]);

  const goBack = useCallback(() => {
    if (viewHistory.length > 0) {
      const previousView = viewHistory[viewHistory.length - 1];
      setViewHistory((prev) => prev.slice(0, -1));
      setCurrentView(previousView);
    } else {
      setCurrentView("welcome");
    }
  }, [viewHistory]);

  const resetWidget = useCallback(() => {
    setCurrentView("welcome");
    setTicketId(null);
    setTicketEmail(null);
    setViewHistory([]);
  }, []);

  return {
    config,
    isLoading,
    error,
    isOpen,
    currentView,
    ticketId,
    ticketEmail,
    openWidget,
    closeWidget,
    toggleWidget,
    setCurrentView: handleSetCurrentView,
    setTicketId,
    setTicketEmail,
    resetWidget,
    goBack,
  };
}