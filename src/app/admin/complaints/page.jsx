"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { UserRole } from "@/types";
import {
  AlertCircle,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  MessageSquare,
  Shield,
  User,
  ArrowRight,
  FileText,
  Send,
  Lock,
  ChevronDown } from "lucide-react";


const INITIAL_COMPLAINTS = [
  {
    id: "FW-CMP-20260921-0001",
    category: "Food Quality",
    subject: "Received stale items in biryani order",
    description: "The biryani ordered from Taj Coromandel tasted stale. Rice was dry and gravy had cooled significantly.",
    priority: "High",
    status: "UNDER_REVIEW",
    orderId: "ord-1",
    userEmail: "consumer@foodwise.demo",
    userName: "Priya Sharma",
    assignedTo: "Dr. Aris Thorne",
    internalNotes: ["Checked kitchen dispatch logs. Order was prepared at 1:30 PM, collected at 3:15 PM."],
    responses: ["We have reached out to the head chef and credited your account."],
    createdAt: new Date(Date.now() - 36 * 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 3600000).toISOString() },
  {
    id: "FW-CMP-20260921-0002",
    category: "Pickup Issue",
    subject: "Kitchen counter was closed when I arrived at 7:55 PM",
    description: "The listing stated collection deadline was 8:00 PM but bakery shutter was already pulled down.",
    priority: "Critical",
    status: "OPEN",
    orderId: "ord-2",
    userEmail: "priya@example.com",
    userName: "Karthik Raja",
    assignedTo: "Unassigned",
    internalNotes: ["Requires merchant penalty review under SLA 3.2."],
    responses: [],
    createdAt: new Date(Date.now() - 4 * 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 3600000).toISOString() },
  {
    id: "FW-CMP-20260921-0003",
    category: "Safety Concern",
    subject: "Unlabeled nuts in dessert box",
    description: "Bakery box did not declare presence of cashew powder. Severe allergen concern.",
    priority: "Critical",
    status: "IN_PROGRESS",
    orderId: "ord-3",
    userEmail: "meena@demo.com",
    userName: "Meena Lakshmi",
    assignedTo: "Compliance Team",
    internalNotes: ["Merchant allergen tag audit mandated."],
    responses: ["Emergency audit triggered for provider."],
    createdAt: new Date(Date.now() - 18 * 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 3600000).toISOString() },
];

export default function AdminComplaintsPage() {
  const { user, switchRole } = useAuth();

  const [complaints, setComplaints] = useState(INITIAL_COMPLAINTS);
  const [selectedId, setSelectedId] = useState(INITIAL_COMPLAINTS[0].id);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");

  const [newNote, setNewNote] = useState("");
  const [newResponse, setNewResponse] = useState("");

  const isAdmin = user?.role === UserRole.ADMIN || user?.role === "admin";

  if (!isAdmin) {
    return (
      <div className="min-h-screen py-16 px-4 flex items-center justify-center" style={{ background: "var(--cream)" }}>
        <div className="max-w-md w-full bg-white rounded-2xl border p-8 shadow-sm text-center space-y-4" style={{ borderColor: "var(--fw-border)" }}>
          <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto text-gray-700">
            <Lock className="w-7 h-7" />
          </div>
          <h1 className="text-xl font-bold" style={{ color: "var(--charcoal)" }}>
            Admin Access Required
          </h1>
          <p className="text-xs text-gray-600">
            The complaints management dashboard is restricted to platform administrators.
          </p>
          <button
            type="button"
            onClick={() => switchRole(UserRole.ADMIN)}
            className="w-full btn-primary py-2.5 rounded-xl text-xs font-bold"
          >
            Switch to Demo Admin Persona
          </button>
        </div>
      </div>
    );
  }

  const filtered = complaints.filter((c) => {
    const matchSearch =
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.userName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchStatus = statusFilter === "ALL" || c.status === statusFilter;
    const matchPriority = priorityFilter === "ALL" || c.priority === priorityFilter;

    return matchSearch && matchStatus && matchPriority;
  });

  const selectedComplaint = complaints.find((c) => c.id === selectedId) || complaints[0];

  const updateSelectedComplaint = (updates) => {
    setComplaints((prev) =>
      prev.map((c) => (c.id === selectedId ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c))
    );
  };

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    const updatedNotes = [...(selectedComplaint.internalNotes || []), newNote.trim()];
    updateSelectedComplaint({ internalNotes: updatedNotes });
    setNewNote("");
  };

  const handleSendResponse = (e) => {
    e.preventDefault();
    if (!newResponse.trim()) return;
    const updatedResponses = [...(selectedComplaint.responses || []), newResponse.trim()];
    updateSelectedComplaint({ responses: updatedResponses, status: "IN_PROGRESS" });
    setNewResponse("");
  };

  return (
    <div className="min-h-screen py-8" style={{ background: "var(--cream)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4" style={{ borderColor: "var(--fw-border)" }}>
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500">
              <Shield className="w-3.5 h-3.5 text-emerald-700" />
              Platform Administration
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold" style={{ color: "var(--charcoal)" }}>
              Complaints & Dispute Triage
            </h1>
            <p className="text-xs sm:text-sm text-gray-500">
              Review, assign, resolve, and audit platform quality and safety disputes.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/admin"
              className="px-3.5 py-2 rounded-xl border text-xs font-semibold hover:bg-white"
              style={{ borderColor: "var(--fw-border)", color: "var(--charcoal)" }}
            >
              ← Back to Admin Console
            </Link>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="bg-white rounded-2xl p-4 border shadow-xs flex flex-col sm:flex-row items-center gap-3" style={{ borderColor: "var(--fw-border)" }}>
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by complaint ID, user name, or subject..."
              className="fw-input pl-9 text-xs"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="fw-select text-xs"
            >
              <option value="ALL">All Statuses</option>
              <option value="OPEN">Open</option>
              <option value="UNDER_REVIEW">Under Review</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
              <option value="CLOSED">Closed</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="fw-select text-xs"
            >
              <option value="ALL">All Priorities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>
        </div>

        {/* Layout: Left List + Right Detail Drawer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Complaint List */}
          <div className="lg:col-span-5 space-y-3">
            <div className="text-xs font-bold text-gray-500 uppercase px-1">
              Complaints ({filtered.length})
            </div>

            {filtered.map((item) => {
              const isSelected = item.id === selectedComplaint.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedId(item.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 bg-white ${
                    isSelected
                      ? "ring-2 ring-emerald-600 border-emerald-600 shadow-sm"
                      : "hover:border-gray-300"
                  }`}
                  style={{ borderColor: isSelected ? "var(--forest)" : "var(--fw-border)" }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[11px] font-bold text-gray-500">{item.id}</span>
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          item.priority === "Critical"
                            ? "bg-red-100 text-red-800"
                            : item.priority === "High"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {item.priority}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                        {item.status.replace("_", " ")}
                      </span>
                    </div>
                  </div>

                  <h3 className="font-bold text-sm text-gray-900 line-clamp-1">{item.subject}</h3>
                  <p className="text-xs text-gray-500 line-clamp-2">{item.description}</p>

                  <div className="pt-2 border-t flex items-center justify-between text-[11px] text-gray-400">
                    <span>From: {item.userName}</span>
                    <span>{item.category}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Detail Pane */}
          {selectedComplaint && (
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 border shadow-xs space-y-6" style={{ borderColor: "var(--fw-border)" }}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
                <div>
                  <span className="font-mono text-xs font-bold text-gray-400">{selectedComplaint.id}</span>
                  <h2 className="text-lg font-black text-gray-900">{selectedComplaint.subject}</h2>
                  <div className="text-xs text-gray-500">
                    Filed by <strong>{selectedComplaint.userName}</strong> ({selectedComplaint.userEmail}) • Order #{selectedComplaint.orderId || "N/A"}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={selectedComplaint.status}
                    onChange={(e) => updateSelectedComplaint({ status: e.target.value })}
                    className="fw-select text-xs font-bold"
                  >
                    <option value="OPEN">OPEN</option>
                    <option value="UNDER_REVIEW">UNDER REVIEW</option>
                    <option value="IN_PROGRESS">IN PROGRESS</option>
                    <option value="RESOLVED">RESOLVED</option>
                    <option value="CLOSED">CLOSED</option>
                  </select>

                  <select
                    value={selectedComplaint.priority}
                    onChange={(e) => updateSelectedComplaint({ priority: e.target.value })}
                    className="fw-select text-xs font-bold"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>

              {/* Description Box */}
              <div className="p-4 rounded-xl bg-gray-50 border text-xs space-y-1">
                <span className="font-bold text-gray-500 uppercase tracking-wider text-[10px]">
                  User Complaint Statement
                </span>
                <p className="text-gray-800 leading-relaxed">{selectedComplaint.description}</p>
              </div>

              {/* Assignment & Metadata */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="fw-label">Assigned Staff / Officer</label>
                  <input
                    type="text"
                    value={selectedComplaint.assignedTo || "Unassigned"}
                    onChange={(e) => updateSelectedComplaint({ assignedTo: e.target.value })}
                    className="fw-input"
                  />
                </div>
                <div>
                  <label className="fw-label">Category</label>
                  <div className="font-bold text-sm pt-2 text-gray-800">{selectedComplaint.category}</div>
                </div>
              </div>

              {/* Internal Notes History */}
              <div className="space-y-3 pt-3 border-t">
                <h3 className="font-bold text-xs uppercase tracking-wider text-gray-500">
                  Internal Administrative Notes ({selectedComplaint.internalNotes?.length || 0})
                </h3>

                <div className="space-y-2">
                  {selectedComplaint.internalNotes?.map((note, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/60 text-xs text-amber-900">
                      • {note}
                    </div>
                  ))}
                </div>

                <form onSubmit={handleAddNote} className="flex gap-2">
                  <input
                    type="text"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Add internal staff note (confidential)..."
                    className="fw-input text-xs"
                  />
                  <button type="submit" className="btn-secondary py-2 px-3 text-xs font-bold shrink-0">
                    Add Note
                  </button>
                </form>
              </div>

              {/* Official Response History */}
              <div className="space-y-3 pt-3 border-t">
                <h3 className="font-bold text-xs uppercase tracking-wider text-gray-500">
                  Customer Communications ({selectedComplaint.responses?.length || 0})
                </h3>

                <div className="space-y-2">
                  {selectedComplaint.responses?.map((resp, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
                      <strong>Response:</strong> {resp}
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendResponse} className="flex gap-2">
                  <input
                    type="text"
                    value={newResponse}
                    onChange={(e) => setNewResponse(e.target.value)}
                    placeholder="Type official response to user..."
                    className="fw-input text-xs"
                  />
                  <button type="submit" className="btn-primary py-2 px-4 text-xs font-bold shrink-0 flex items-center gap-1.5">
                    <Send className="w-3.5 h-3.5" /> Send Response
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
