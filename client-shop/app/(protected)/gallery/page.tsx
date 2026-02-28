"use client";

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { HiOutlineTrash } from "react-icons/hi2";
import { GiSpellBook, GiCrystalBall, GiScrollUnfurled, GiSwordman } from "react-icons/gi";
import { useSpriteFilter } from "@/features/sprite/hooks/useSpriteFilter";
import { usePagination } from "@/features/sprite/hooks/usePagination";
import { useSprites } from "@/features/sprite/hooks/useSprites";
import { useMySprites } from "@/features/sprite/hooks/useMySprites";
import { useSpritesByUser } from "@/features/sprite/hooks/useSpritesByUser";
import { useCategories } from "@/features/sprite/hooks/useCategories";
import { useUsers } from "@/features/user/hooks/useUsers";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useDeleteConfirm } from "@/features/shared/hooks/useDeleteConfirm";
import { SpriteService } from "@/features/sprite/services/sprite.service";
import SpriteFilters from "@/features/sprite/components/SpriteFilters";
import SpriteGrid from "@/features/sprite/components/SpriteGrid";
import Pagination from "@/features/sprite/components/Pagination";
import SavingSpriteForm from "@/features/sprite/components/SavingSpriteForm";
import TrashPanel from "@/features/sprite/components/TrashPanel";
import DeleteConfirmModal from "@/features/shared/components/DeleteConfirmModal";
import type { SpriteListResponse } from "@/features/sprite/types";
import type { UserListResponse } from "@/features/user/types";

type Tab = "mine" | "all" | "byUser";

// Decorative rune divider
function RuneSeparator() {
    return (
        <div className="flex items-center gap-2 my-2">
            <div className="flex-1 h-px bg-linear-to-r from-transparent to-green-400/20" />
            <span className="text-green-400/30 text-[9px] tracking-[0.4em] select-none">ᚱᚢᚾᛖ</span>
            <div className="flex-1 h-px bg-linear-to-l from-transparent to-green-400/20" />
        </div>
    );
}

export default function GalleryPage() {
    const { user } = useAuth();
    const isAdmin = user?.role === "ADMIN";

    const [tab, setTab] = useState<Tab>(isAdmin ? "all" : "mine");
    const [selectedUser, setSelectedUser] = useState<UserListResponse | null>(null);
    const [userKeyword, setUserKeyword] = useState("");
    const [trashOpen, setTrashOpen] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const { filter, updateFilter, resetFilter, toggleCategory } = useSpriteFilter();
    const { page, size, goToPage, reset: resetPage } = usePagination(0, 42);
    const { data: categories } = useCategories();
    const { target, confirmSoftDelete, dismiss } = useDeleteConfirm();

    const allSprites = useSprites(filter, page, size, tab === "all");
    const mySprites = useMySprites(filter, page, size, tab === "mine");
    const userSprites = useSpritesByUser(selectedUser?.id ?? "", filter, page, size, tab === "byUser");
    const { data: usersData, loading: usersLoading } = useUsers(userKeyword, 0, 20);

    const [modalOpen, setModalOpen] = useState(false);
    const [editingSprite, setEditingSprite] = useState<SpriteListResponse | null>(null);

    const active = tab === "all" ? allSprites : tab === "mine" ? mySprites : userSprites;

    useEffect(() => { resetPage(); }, [filter, tab, selectedUser, resetPage]);

    const handleTabChange = useCallback((nextTab: Tab) => {
        setTab(nextTab);
        if (nextTab !== "byUser") setSelectedUser(null);
    }, []);

    const openCreate = () => { setEditingSprite(null); setModalOpen(true); };
    const openEdit = (sprite: SpriteListResponse) => { setEditingSprite(sprite); setModalOpen(true); };
    const handleClose = () => { setModalOpen(false); setEditingSprite(null); };

    const handleDeleteRequest = useCallback((sprite: SpriteListResponse) => {
        confirmSoftDelete(sprite);
    }, [confirmSoftDelete]);

    const handleDeleteConfirmed = async () => {
        if (!target) return;
        try {
            setDeletingId(target.sprite.id);
            await SpriteService.deleteById(target.sprite.id);
            dismiss();
            if (tab === "mine") mySprites.refresh();
            else if (tab === "all") allSprites.refresh();
            else userSprites.refresh();
        } catch (e: any) {
            alert(e.message);
        } finally {
            setDeletingId(null);
        }
    };

    const handleRestored = () => {
        if (tab === "mine") mySprites.refresh();
        else if (tab === "all") allSprites.refresh();
        else userSprites.refresh();
    };

    return (
        <div className="min-h-screen bg-neutral-950 text-white">
            {/* Ambient top glow */}
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-150 h-48 bg-green-500/5 blur-3xl rounded-full pointer-events-none" />

            <div className="w-full px-4 sm:px-6 lg:px-8 py-10 relative">

                {/* Page header */}
                <div className="mb-8 flex items-start justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <GiSpellBook className="w-5 h-5 text-green-400/60" />
                            <span className="text-green-400/40 text-[10px] tracking-[0.35em] uppercase font-medium">
                                Sacred Visual Archives
                            </span>
                        </div>
                        <h1 className="text-2xl font-bold text-white tracking-tight">
                            The <span className="text-green-400">Sanctum</span>
                        </h1>
                        <p className="text-neutral-500 text-sm mt-1">
                            {isAdmin
                                ? "Oversee all relics forged within the realm"
                                : "Your collected relics & pixel enchantments"}
                        </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        <button
                            onClick={() => setTrashOpen(true)}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm border border-neutral-800 text-neutral-500 hover:text-red-400 hover:border-red-500/30 hover:bg-red-500/5 transition-all"
                            title="Cursed relics — items banished from the Sanctum"
                        >
                            <HiOutlineTrash className="w-4 h-4" />
                            <span className="hidden sm:inline text-xs">Void</span>
                        </button>
                        <button
                            onClick={openCreate}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-green-500 hover:bg-green-400 text-black transition-colors"
                        >
                            <span className="text-base leading-none">✦</span>
                            <span>Enshrine Relic</span>
                        </button>
                    </div>
                </div>

                {/* Tab switcher */}
                <div className="flex items-center gap-1 bg-neutral-900/80 border border-green-900/20 rounded-xl p-1 w-fit mb-8">
                    {isAdmin ? (
                        <>
                            <button
                                onClick={() => handleTabChange("all")}
                                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs transition-all ${
                                    tab === "all"
                                        ? "bg-green-500/20 text-green-300 border border-green-500/30"
                                        : "text-neutral-400 hover:text-white"
                                }`}
                            >
                                <GiCrystalBall className="w-3 h-3" />
                                All Relics
                            </button>
                            <button
                                onClick={() => handleTabChange("byUser")}
                                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs transition-all ${
                                    tab === "byUser"
                                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                                        : "text-neutral-400 hover:text-white"
                                }`}
                            >
                                <GiSwordman className="w-3 h-3" />
                                By Adventurer
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => handleTabChange("mine")}
                            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs transition-all ${
                                tab === "mine"
                                    ? "bg-green-500/20 text-green-300 border border-green-500/30"
                                    : "text-neutral-400 hover:text-white"
                            }`}
                        >
                            <GiScrollUnfurled className="w-3 h-3" />
                            My Relics
                        </button>
                    )}
                </div>

                {/* Main content */}
                <div className="flex flex-col lg:flex-row gap-6">

                    {/* Sidebar */}
                    <div className="lg:w-60 xl:w-64 shrink-0 self-start sticky top-22">
                        {tab === "byUser" && isAdmin && (
                            <div className="space-y-2 mb-4">
                                <label className="text-[10px] text-green-400/40 uppercase tracking-[0.25em]">
                                    ⚔ Seek Adventurer
                                </label>
                                <input
                                    type="text"
                                    placeholder="Search by name or oath..."
                                    value={userKeyword}
                                    onChange={(e) => setUserKeyword(e.target.value)}
                                    className="w-full bg-neutral-900 border border-green-900/20 rounded-xl px-3 py-2 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-green-500/40 transition-colors"
                                />
                                <div className="max-h-48 overflow-y-auto rounded-xl border border-green-900/20 bg-neutral-900 divide-y divide-green-900/10">
                                    {usersLoading && (
                                        <p className="text-xs text-neutral-500 p-3 italic">Consulting the oracle...</p>
                                    )}
                                    {usersData?.content.map((u) => (
                                        <button
                                            key={u.id}
                                            onClick={() => setSelectedUser(u)}
                                            className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-white/5 ${selectedUser?.id === u.id ? "bg-green-500/10" : ""}`}
                                        >
                                            <div className="w-7 h-7 rounded-full bg-neutral-800 shrink-0 flex items-center justify-center text-xs font-semibold text-green-400 overflow-hidden relative">
                                                {u.avatarUrl
                                                    ? <Image src={u.avatarUrl} alt={u.username} fill className="object-cover" sizes="28px" />
                                                    : u.username.charAt(0).toUpperCase()
                                                }
                                            </div>
                                            <div className="min-w-0">
                                                <p className={`text-xs font-medium truncate ${selectedUser?.id === u.id ? "text-green-300" : "text-white"}`}>
                                                    {u.username}
                                                </p>
                                                <p className="text-[10px] text-neutral-500 truncate">{u.email}</p>
                                            </div>
                                        </button>
                                    ))}
                                    {!usersLoading && usersData?.content.length === 0 && (
                                        <p className="text-xs text-neutral-600 p-3 italic">No adventurers found in the registry.</p>
                                    )}
                                </div>
                                {selectedUser && (
                                    <button
                                        onClick={() => setSelectedUser(null)}
                                        className="text-[10px] text-neutral-500 hover:text-red-400 transition-colors"
                                    >
                                        ✕ Release selection
                                    </button>
                                )}
                                <RuneSeparator />
                            </div>
                        )}

                        <SpriteFilters
                            filter={filter}
                            categories={categories}
                            onFilterChange={updateFilter}
                            onCategoryToggle={toggleCategory}
                            onReset={resetFilter}
                        />
                    </div>

                    {/* Grid area */}
                    <div className="flex-1 min-w-0 space-y-6">
                        {tab === "byUser" && !selectedUser ? (
                            <div className="flex flex-col items-center justify-center py-24 text-center">
                                <GiSwordman className="w-12 h-12 text-neutral-700 mb-4" />
                                <p className="text-neutral-500 text-sm">Choose an adventurer to unveil their relics.</p>
                                <p className="text-neutral-700 text-xs mt-1 tracking-widest">✦ ✦ ✦</p>
                            </div>
                        ) : (
                            <>
                                {active.data && !active.loading && (
                                    <div className="flex items-center gap-2">
                                        <p className="text-xs text-neutral-500">
                                            <span className="text-green-400/70 font-medium">{active.data.totalElements}</span>
                                            {" "}relic{active.data.totalElements !== 1 ? "s" : ""} enshrined
                                        </p>
                                        {tab === "byUser" && selectedUser && (
                                            <span className="text-xs text-amber-400/60">
                                                — bound to <span className="text-amber-300/80">{selectedUser.username}</span>
                                            </span>
                                        )}
                                    </div>
                                )}

                                <SpriteGrid
                                    sprites={active.data?.content ?? []}
                                    loading={active.loading}
                                    error={active.error}
                                    onEdit={tab === "mine" ? openEdit : undefined}
                                    onDelete={tab === "mine" || isAdmin ? handleDeleteRequest : undefined}
                                />

                                {active.data && (
                                    <Pagination
                                        page={active.data.number}
                                        totalPages={active.data.totalPages}
                                        totalElements={active.data.totalElements}
                                        size={active.data.size}
                                        onPageChange={goToPage}
                                    />
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>

            <SavingSpriteForm
                open={modalOpen}
                editingSprite={editingSprite}
                onClose={handleClose}
                onSaved={tab === "mine" ? mySprites.refresh : allSprites.refresh}
            />

            <TrashPanel
                open={trashOpen}
                onClose={() => setTrashOpen(false)}
                onRestored={handleRestored}
            />

            <DeleteConfirmModal
                target={target}
                loading={!!deletingId}
                onConfirm={handleDeleteConfirmed}
                onCancel={dismiss}
            />
        </div>
    );
}