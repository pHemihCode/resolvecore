// components/widget/screens/CreateTicket.tsx
"use client";

import { useState, type FormEvent, type ChangeEvent } from "react";
import { motion } from "framer-motion";
import { Loader2, Paperclip, X, AlertCircle } from "lucide-react";
import { createTicket } from "@/lib/api/widget-api";
import type { WidgetView, TicketCategory } from "@/types/widget";
import { cn } from "@/lib/utils";

interface CreateTicketProps {
  widgetKey: string;
  brandColor: string;
  setCurrentView: (view: WidgetView) => void;
  setTicketId: (id: string | null) => void;
  setTicketEmail: (email: string | null) => void;
}

interface FormData {
  name: string;
  email: string;
  category: TicketCategory;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
  general?: string;
}

const CATEGORIES: { value: TicketCategory; label: string }[] = [
  { value: "General", label: "General Inquiry" },
  { value: "Technical", label: "Technical Support" },
  { value: "Billing", label: "Billing Question" },
];

export default function CreateTicket({
  widgetKey,
  brandColor,
  setCurrentView,
  setTicketId,
  setTicketEmail,
}: CreateTicketProps) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    category: "General",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attachment, setAttachment] = useState<File | null>(null);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          general: "File size must be less than 5MB",
        }));
        return;
      }
      setAttachment(file);
      setErrors((prev) => ({ ...prev, general: undefined }));
    }
  };

  const removeAttachment = () => setAttachment(null);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.message.trim() || formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);
    setErrors({});

    const result = await createTicket({
      widgetKey,
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      category: formData.category,
      message: formData.message.trim(),
    });

    if (result.success && result.data) {
      setTicketId(result.data.ticketId);
      setTicketEmail(formData.email.trim().toLowerCase());
      setCurrentView("success");
    } else {
      setErrors({
        general: result.error || "Failed to create ticket. Please try again.",
      });
    }

    setIsSubmitting(false);
  };

  return (
    <motion.form
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onSubmit={handleSubmit}
      className="space-y-3 sm:space-y-4"
      noValidate
    >
      {/* General Error */}
      {errors.general && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-red-700 text-sm"
        >
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{errors.general}</span>
        </motion.div>
      )}

      {/* Name Field */}
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 mb-1 sm:mb-1.5"
        >
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="John Doe"
          disabled={isSubmitting}
          className={cn(
            "w-full px-3 sm:px-4 py-2 sm:py-2.5 border rounded-xl transition-all text-sm sm:text-base",
            "focus:outline-none focus:ring-2",
            "disabled:bg-gray-50 disabled:cursor-not-allowed",
            errors.name
              ? "border-red-300 focus:ring-red-200 focus:border-red-400"
              : "border-gray-200 focus:ring-indigo-200 focus:border-indigo-400"
          )}
        />
        {errors.name && (
          <p className="mt-1 text-xs sm:text-sm text-red-500">{errors.name}</p>
        )}
      </div>

      {/* Email Field */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-1 sm:mb-1.5"
        >
          Email Address <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="john@example.com"
          disabled={isSubmitting}
          className={cn(
            "w-full px-3 sm:px-4 py-2 sm:py-2.5 border rounded-xl transition-all text-sm sm:text-base",
            "focus:outline-none focus:ring-2",
            "disabled:bg-gray-50 disabled:cursor-not-allowed",
            errors.email
              ? "border-red-300 focus:ring-red-200 focus:border-red-400"
              : "border-gray-200 focus:ring-indigo-200 focus:border-indigo-400"
          )}
        />
        {errors.email && (
          <p className="mt-1 text-xs sm:text-sm text-red-500">{errors.email}</p>
        )}
      </div>

      {/* Category Field */}
      <div>
        <label
          htmlFor="category"
          className="block text-sm font-medium text-gray-700 mb-1 sm:mb-1.5"
        >
          Category <span className="text-red-500">*</span>
        </label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          disabled={isSubmitting}
          className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 bg-white disabled:bg-gray-50 disabled:cursor-not-allowed appearance-none cursor-pointer text-sm sm:text-base"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      {/* Message Field */}
      <div>
        <label
          htmlFor="message"
          className="block text-sm font-medium text-gray-700 mb-1 sm:mb-1.5"
        >
          Message <span className="text-red-500">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={3}
          placeholder="Describe your issue or question..."
          disabled={isSubmitting}
          className={cn(
            "w-full px-3 sm:px-4 py-2 sm:py-2.5 border rounded-xl transition-all resize-none text-sm sm:text-base",
            "focus:outline-none focus:ring-2",
            "disabled:bg-gray-50 disabled:cursor-not-allowed",
            errors.message
              ? "border-red-300 focus:ring-red-200 focus:border-red-400"
              : "border-gray-200 focus:ring-indigo-200 focus:border-indigo-400"
          )}
        />
        {errors.message && (
          <p className="mt-1 text-xs sm:text-sm text-red-500">
            {errors.message}
          </p>
        )}
      </div>

      {/* File Attachment */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-1.5">
          Attachment <span className="text-gray-400">(Optional)</span>
        </label>
        {!attachment ? (
          <label
            className={cn(
              "flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-3 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer",
              "hover:border-gray-300 hover:bg-gray-50 transition-colors",
              isSubmitting && "opacity-50 cursor-not-allowed"
            )}
          >
            <Paperclip className="w-4 h-4 text-gray-400" />
            <span className="text-xs sm:text-sm text-gray-500">
              Click to attach (max 5MB)
            </span>
            <input
              type="file"
              onChange={handleFileChange}
              disabled={isSubmitting}
              className="hidden"
              accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,.txt"
            />
          </label>
        ) : (
          <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 border border-gray-200 rounded-xl">
            <Paperclip className="w-4 h-4 text-gray-500 shrink-0" />
            <span className="text-xs sm:text-sm text-gray-700 flex-1 truncate">
              {attachment.name}
            </span>
            <button
              type="button"
              onClick={removeAttachment}
              disabled={isSubmitting}
              className="p-1 hover:bg-gray-200 rounded-lg transition-colors shrink-0"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className={cn(
          "w-full py-2.5 sm:py-3 px-4 rounded-xl text-white font-medium text-sm sm:text-base",
          "flex items-center justify-center gap-2",
          "transition-all duration-200",
          "disabled:opacity-70 disabled:cursor-not-allowed",
          "hover:opacity-90 active:scale-[0.98]"
        )}
        style={{ backgroundColor: brandColor }}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
            Submitting...
          </>
        ) : (
          "Submit Ticket"
        )}
      </button>
    </motion.form>
  );
}