"use client";

import { useState } from "react";
import { GiScrollUnfurled } from "react-icons/gi";
import { HiOutlinePencil, HiOutlineLockClosed, HiOutlineXMark } from "react-icons/hi2";
import { useUpdateProfile } from "../hooks/useUpdateProfile";
import type { UserListResponse } from "../types";

interface ProfileFormProps {
  user: UserListResponse;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

interface FieldProps {
  label: string;
  hint?: string;
  value: string;
  onChange?: (v: string) => void;
  locked: boolean;
  type?: string;
  placeholder?: string;
}

function Field({ label, hint, value, onChange, locked, type = "text", placeholder }: FieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] text-green-400/40 uppercase tracking-[0.2em] font-medium">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={locked}
        placeholder={placeholder}
        className={`w-full bg-neutral-900 border rounded-xl px-3 py-2.5 text-sm outline-none transition-all ${
          locked
            ? "border-neutral-800/50 text-neutral-500 cursor-not-allowed"
            : "border-neutral-700 focus:border-green-400/50 text-white placeholder-neutral-600"
        }`}
      />
      {hint && <p className="text-[10px] text-neutral-600 pl-1">{hint}</p>}
    </div>
  );
}

export function ProfileForm({ user, onSuccess, onError }: ProfileFormProps) {
  const [editing, setEditing] = useState(false);
  const [username, setUsername] = useState(user.username);
  const [fullName, setFullName] = useState(user.fullName);
  const { updateProfile, loading } = useUpdateProfile();

  const handleCancel = () => {
    setUsername(user.username);
    setFullName(user.fullName);
    setEditing(false);
  };

  const handleSubmit = async () => {
    if (!username.trim()) return onError("Your war name must be spoken aloud");
    if (!fullName.trim()) return onError("Your true name must be inscribed");
    try {
      await updateProfile({ username: username.trim(), fullName: fullName.trim() });
      onSuccess("✦ Chronicle updated");
      setEditing(false);
    } catch (e: any) {
      onError(e.message ?? "The scribes refused your changes");
    }
  };

  return (
    <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6 relative overflow-hidden">
      <span className="absolute top-3 right-12 text-green-400/10 text-xs select-none">ᚷ</span>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-green-950 border border-green-400/20 flex items-center justify-center shrink-0">
            <GiScrollUnfurled className="w-4 h-4 text-green-400" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white leading-none">Adventurer's Dossier</h2>
            <p className="text-[10px] text-green-400/40 tracking-widest uppercase mt-0.5">
              {editing ? "Inscribing your legend..." : "Inscribe your legend"}
            </p>
          </div>
        </div>

        {/* Lock / Edit toggle */}
        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-700 hover:border-green-400/40 text-neutral-400 hover:text-green-400 text-xs transition-all"
          >
            <HiOutlinePencil className="w-3.5 h-3.5" />
            Edit
          </button>
        ) : (
          <button
            onClick={handleCancel}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-700 hover:border-red-400/40 text-neutral-400 hover:text-red-400 text-xs transition-all disabled:opacity-50"
          >
            <HiOutlineXMark className="w-3.5 h-3.5" />
            Cancel
          </button>
        )}
      </div>

      {/* Fields */}
      <div className="space-y-4">
        <Field
          label="War Name"
          hint="This name echoes through the realm"
          value={username}
          onChange={setUsername}
          locked={!editing}
          placeholder="Your alias..."
        />
        <Field
          label="True Name"
          hint="Known only to the inner circle"
          value={fullName}
          onChange={setFullName}
          locked={!editing}
          placeholder="Your full name..."
        />
        <Field
          label="Oath-bound Scroll"
          hint="The binding scroll cannot be rewritten"
          value={user.email}
          locked
        />
      </div>

      {/* Save — only in edit mode */}
      {editing && (
        <div className="flex justify-end mt-6 pt-5 border-t border-neutral-800">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 bg-green-500 hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold text-sm rounded-xl transition-colors"
          >
            <HiOutlinePencil className="w-3.5 h-3.5" />
            {loading ? "Inscribing..." : "Inscribe Changes"}
          </button>
        </div>
      )}

      {/* Locked indicator */}
      {!editing && (
        <div className="flex items-center justify-center gap-1.5 mt-6 pt-4 border-t border-neutral-800/50">
          <HiOutlineLockClosed className="w-3 h-3 text-neutral-600" />
          <span className="text-[10px] text-neutral-600 tracking-widest">
            Chronicle is sealed — press Edit to inscribe
          </span>
        </div>
      )}
    </div>
  );
}