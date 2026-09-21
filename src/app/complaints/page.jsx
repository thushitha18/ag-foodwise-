"use client";

import React, { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import {
  AlertCircle,
  Check,
  ChevronDown,
  Clock,
  FileText,
  Loader2,
  MessageSquare,
  Send,
  Leaf } from "lucide-react";
import Link from "next/link";


const categories = [
  "Food Quality",
  "Wrong Item",
  "Order Issue",
  "Pickup Issue",
  "Payment Issue",
  "Provider Issue",
  "Delivery/Tracking",
  "Safety Concern",
  "Account Issue",
  "Other",
];

// In-memory complaint store (demo)
const complaintStore = [
  {
    id: "FW-CMP-20260921-0001",
    category: "Food Quality",
    subject: "Received stale items in biryani order",
    description: "The biryani I ordered from Taj Coromandel tasted stale. Rice was hard and gravy was cold.",
    priority: "High",
    status: "UNDER_REVIEW",
    orderId: "ord-1",
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString() },
];

export default function ComplaintsPage() {
  const { user, isAuthenticated } = useAuth();
  const [tab, setTab] = useState("new");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [complaints, setComplaints] = useState(complaintStore);

  const [form, setForm] = useState({
    category: "",
    subject: "",
    description: "",
    priority: "Medium",
    orderId: "" });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.category || !form.subject || !form.description) return;

    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));

    const newComplaint = {
      id: `FW-CMP-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${String(complaints.length + 1).padStart(4, "0")}`,
      category: form.category,
      subject: form.subject,
      description: form.description,
      priority: form.priority,
      status: "OPEN",
      orderId: form.orderId || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString() };

    setComplaints((prev) => [newComplaint, ...prev]);
    complaintStore.unshift(newComplaint);
    setIsSubmitting(false);
    setSubmitted(true);
    setForm({ category: "", subject: "", description: "", priority: "Medium", orderId: "" });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--cream)' }}>
        <div className="text-center space-y-3">
          <MessageSquare className="w-10 h-10 mx-auto" style={{ color: 'var(--muted)' }} />
          <p className="font-semibold" style={{ color: 'var(--charcoal)' }}>Please sign in to submit complaints.</p>
          <Link href="/join" className="btn-primary">Join FoodWise</Link>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "OPEN": return { bg: "#FEF3C7", color: "#92400E" };
      case "UNDER_REVIEW": return { bg: "#DBEAFE", color: "#1E40AF" };
      case "IN_PROGRESS": return { bg: "var(--sage-light)", color: "var(--forest)" };
      case "RESOLVED": return { bg: "#D1FAE5", color: "#065F46" };
      case "CLOSED": return { bg: "#F3F4F6", color: "#6B7280" };
      default: return { bg: "#F3F4F6", color: "#6B7280" };
    }
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--cream)' }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--charcoal)' }}>Support & Complaints</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            Report issues with orders, food quality, or platform experience.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 mb-6 p-1 rounded-lg" style={{ background: 'var(--beige)' }}>
          <button
            onClick={() => { setTab("new"); setSubmitted(false); }}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-semibold transition-colors ${tab === "new" ? "bg-white shadow-sm" : ""}`}
            style={{ color: tab === "new" ? 'var(--charcoal)' : 'var(--muted)' }}
          >
            New Complaint
          </button>
          <button
            onClick={() => setTab("history")}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-semibold transition-colors ${tab === "history" ? "bg-white shadow-sm" : ""}`}
            style={{ color: tab === "history" ? 'var(--charcoal)' : 'var(--muted)' }}
          >
            My Complaints ({complaints.length})
          </button>
        </div>

        {/* New Complaint Form */}
        {tab === "new" && !submitted && (
          <form onSubmit={handleSubmit} className="bg-white rounded-xl border p-6 space-y-4" style={{ borderColor: 'var(--fw-border)' }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="fw-label fw-label-required">Category</label>
                <select name="category" value={form.category} onChange={handleChange} className="fw-input" required>
                  <option value="">Select category</option>
                  {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="fw-label">Priority</label>
                <select name="priority" value={form.priority} onChange={handleChange} className="fw-input">
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
            </div>

            <div>
              <label className="fw-label">Order ID (optional)</label>
              <input name="orderId" value={form.orderId} onChange={handleChange} className="fw-input" placeholder="e.g. ord-1" />
            </div>

            <div>
              <label className="fw-label fw-label-required">Subject</label>
              <input name="subject" value={form.subject} onChange={handleChange} className="fw-input" placeholder="Brief summary of the issue" required />
            </div>

            <div>
              <label className="fw-label fw-label-required">Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} className="fw-textarea" rows={4} placeholder="Describe the issue in detail..." required />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-lg text-white font-semibold text-sm transition-all disabled:opacity-60 flex items-center justify-center gap-2"
              style={{ background: 'var(--forest-light)' }}
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              {isSubmitting ? "Submitting..." : "Submit Complaint"}
            </button>
          </form>
        )}

        {/* Success State */}
        {tab === "new" && submitted && (
          <div className="bg-white rounded-xl border p-8 text-center space-y-3" style={{ borderColor: 'var(--fw-border)' }}>
            <div className="w-12 h-12 rounded-full mx-auto flex items-center justify-center" style={{ background: 'var(--sage-light)' }}>
              <Check className="w-6 h-6" style={{ color: 'var(--forest)' }} />
            </div>
            <h2 className="text-lg font-bold" style={{ color: 'var(--charcoal)' }}>Complaint Submitted</h2>
            <p className="text-sm" style={{ color: 'var(--muted)' }}>
              Your complaint ID is <strong style={{ color: 'var(--charcoal)' }}>{complaints[0]?.id}</strong>.
              We&apos;ll review it and get back to you.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button onClick={() => setSubmitted(false)} className="btn-secondary text-sm">Submit Another</button>
              <button onClick={() => setTab("history")} className="btn-primary text-sm">View History</button>
            </div>
          </div>
        )}

        {/* Complaint History */}
        {tab === "history" && (
          <div className="space-y-3">
            {complaints.length === 0 ? (
              <div className="bg-white rounded-xl border p-8 text-center" style={{ borderColor: 'var(--fw-border)' }}>
                <FileText className="w-10 h-10 mx-auto mb-2" style={{ color: 'var(--muted)' }} />
                <p className="font-semibold" style={{ color: 'var(--charcoal)' }}>No complaints yet</p>
              </div>
            ) : (
              complaints.map((c) => {
                const statusColor = getStatusColor(c.status);
                return (
                  <div key={c.id} className="bg-white rounded-xl border p-4" style={{ borderColor: 'var(--fw-border)' }}>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-mono font-medium" style={{ color: 'var(--muted)' }}>{c.id}</span>
                          <span
                            className="px-2 py-0.5 rounded text-[10px] font-semibold"
                            style={{ background: statusColor.bg, color: statusColor.color }}
                          >
                            {c.status.replace(/_/g, " ")}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            c.priority === "Critical" || c.priority === "High" ? "bg-red-50 text-red-700" : "bg-gray-50 text-gray-600"
                          }`}>
                            {c.priority}
                          </span>
                        </div>
                        <h3 className="font-semibold text-sm" style={{ color: 'var(--charcoal)' }}>{c.subject}</h3>
                      </div>
                      <div className="text-right text-[11px] shrink-0" style={{ color: 'var(--muted)' }}>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(c.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                        </div>
                      </div>
                    </div>
                    <p className="text-xs line-clamp-2" style={{ color: 'var(--muted)' }}>{c.description}</p>
                    <div className="flex items-center gap-3 mt-2 text-[11px]" style={{ color: 'var(--muted)' }}>
                      <span>{c.category}</span>
                      {c.orderId && <span>Order: {c.orderId}</span>}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}
