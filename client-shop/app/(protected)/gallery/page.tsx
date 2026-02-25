"use client";

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { HiOutlineTrash } from "react-icons/hi2";
import { useSpriteFilter } from "@/features/sprite/hooks/useSpriteFilter";
import { usePagination } from "@/features/sprite/hooks/usePagination";
import { useSprites } from "@/features/sprite/hooks/useSprites";
import { useMySprites } from "@/features/sprite/hooks/useMySprites";
import { useSpritesByUser } from "@/features/sprite/hooks/useSpritesByUser";
import { useCategories } from "@/features/sprite/hooks/useCategories";
import { useUsers } from "@/features/user/hooks/useUsers";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { SpriteService } from "@/features/sprite/services/sprite.service";
import SpriteFilters from "@/features/sprite/components/SpriteFilters";
import SpriteGrid from "@/features/sprite/components/SpriteGrid";
import Pagination from "@/features/sprite/components/Pagination";
import SavingSpriteForm from "@/features/sprite/components/SavingSpriteForm";
import TrashPanel from "@/features/sprite/components/TrashPanel";
import type { SpriteListResponse } from "@/features/sprite/types";
import type { UserListResponse } from "@/features/user/types";

type Tab = "mine" | "all" | "byUser";

export default function GalleryPage() {
    const { user } = useAuth();
    const isAdmin = user?.role === "ADMIN";

    const [tab, setTab] = useState<Tab>(isAdmin ? "all" : "mine");
    const [selectedUser, setSelectedUser] = useState<UserListResponse | null>(null);
    const [userKeyword, setUserKeyword] = useState("");
    const [trashOpen, setTrashOpen] = useState(false);

    const { filter, updateFilter, resetFilter, toggleCategory } = useSpriteFilter();
    const { page, size, goToPage, reset: resetPage } = usePagination(0, 42);
    const { data: categories } = useCategories();

    const allSprites = useSprites(filter, page, size);
    const mySprites = useMySprites(filter, page, size);
    const userSprites = useSpritesByUser(selectedUser?.id ?? "", filter, page, size);
    const { data: usersData, loading: usersLoading } = useUsers(userKeyword, 0, 20);

    const [modalOpen, setModalOpen] = useState(false);
    const [editingSprite, setEditingSprite] = useState<SpriteListResponse | null>(null);

    const active = tab === "all" ? allSprites : tab === "mine" ? mySprites : userSprites;

    useEffect(() => {
        resetPage();
    }, [filter, tab, selectedUser, resetPage]);

    const handleTabChange = useCallback((nextTab: Tab) => {
        setTab(nextTab);
        if (nextTab !== "byUser") setSelectedUser(null);
    }, []);

    const openCreate = () => { setEditingSprite(null); setModalOpen(true); };
    const openEdit = (sprite: SpriteListResponse) => { setEditingSprite(sprite); setModalOpen(true); };
    const handleClose = () => { setModalOpen(false); setEditingSprite(null); };

    const handleDelete = async (sprite: SpriteListResponse) => {
        try {
            await SpriteService.deleteById(sprite.id);
            // Refresh active tab
            if (tab === "mine") mySprites.refresh();
            else if (tab === "all") allSprites.refresh();
            else userSprites.refresh();
        } catch (e: any) {
            alert(e.message);
        }
    };

    const handleRestored = () => {
        // Khi restore từ trash, refresh grid hiện tại
        if (tab === "mine") mySprites.refresh();
        else if (tab === "all") allSprites.refresh();
        else userSprites.refresh();
    };

    return (
        <div className="min-h-screen bg-neutral-950 text-white">
            <div className="w-full px-4 sm:px-6 lg:px-8 py-10">

                <div className="mb-8 flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-white tracking-tight">
                            Sprite <span className="text-green-400">Store</span>
                        </h1>
                        <p className="text-slate-400 text-sm mt-1">
                            {isAdmin ? "Manage and browse all sprites" : "Browse and manage your sprites"}
                        </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                        {/* Trash button */}
                        <button
                            onClick={() => setTrashOpen(true)}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm border border-neutral-800 text-gray-500 hover:text-red-400 hover:border-red-500/30 hover:bg-red-500/5 transition-all"
                        >
                            <HiOutlineTrash className="w-4 h-4" />
                            <span className="hidden sm:inline">Trash</span>
                        </button>
                        <button
                            onClick={openCreate}
                            className="px-4 py-2 rounded-lg text-sm font-medium bg-green-500 hover:bg-green-400 text-black transition-colors"
                        >
                            + Upload Sprite
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-1 bg-neutral-900 border border-green-900/20 rounded-xl p-1 w-fit mb-8">
                    {isAdmin ? (
                        <>
                            <button
                                onClick={() => handleTabChange("all")}
                                className={`px-4 py-1.5 rounded-lg text-sm transition-all ${tab === "all"
                                    ? "bg-green-500/20 text-green-300 border border-green-500/30"
                                    : "text-gray-400 hover:text-white"}`}
                            >
                                All Sprites
                            </button>
                            <button
                                onClick={() => handleTabChange("byUser")}
                                className={`px-4 py-1.5 rounded-lg text-sm transition-all ${tab === "byUser"
                                    ? "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
                                    : "text-gray-400 hover:text-white"}`}
                            >
                                By User
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => handleTabChange("mine")}
                            className={`px-4 py-1.5 rounded-lg text-sm transition-all ${tab === "mine"
                                ? "bg-green-500/20 text-green-300 border border-green-500/30"
                                : "text-gray-400 hover:text-white"}`}
                        >
                            My Sprites
                        </button>
                    )}
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Sidebar */}
                    <div className="lg:w-60 xl:w-64 shrink-0 self-start sticky top-22">
                        {tab === "byUser" && isAdmin && (
                            <div className="space-y-2 mb-4">
                                <label className="text-xs text-gray-500 uppercase tracking-wider">
                                    Select User
                                </label>
                                <input
                                    type="text"
                                    placeholder="Search users..."
                                    value={userKeyword}
                                    onChange={(e) => setUserKeyword(e.target.value)}
                                    className="w-full bg-neutral-900 border border-green-900/20 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-green-500/40 transition-colors"
                                />
                                <div className="max-h-48 overflow-y-auto rounded-xl border border-green-900/20 bg-neutral-900 divide-y divide-green-900/10">
                                    {usersLoading && (
                                        <p className="text-xs text-gray-500 p-3">Loading...</p>
                                    )}
                                    {usersData?.content.map((u) => (
                                        <button
                                            key={u.id}
                                            onClick={() => setSelectedUser(u)}
                                            className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-white/5 ${selectedUser?.id === u.id ? "bg-green-500/10" : ""}`}
                                        >
                                            <div className="w-7 h-7 rounded-full bg-neutral-800 shrink-0 flex items-center justify-center text-xs font-semibold text-green-400 overflow-hidden relative">
                                                {u.avatarUrl
                                                    ? <Image src={u.avatarUrl} alt={u.username} fill className="object-cover" />
                                                    : u.username.charAt(0).toUpperCase()
                                                }
                                            </div>
                                            <div className="min-w-0">
                                                <p className={`text-xs font-medium truncate ${selectedUser?.id === u.id ? "text-green-300" : "text-white"}`}>
                                                    {u.username}
                                                </p>
                                                <p className="text-xs text-gray-500 truncate">{u.email}</p>
                                            </div>
                                        </button>
                                    ))}
                                    {!usersLoading && usersData?.content.length === 0 && (
                                        <p className="text-xs text-gray-600 p-3">No users found.</p>
                                    )}
                                </div>
                                {selectedUser && (
                                    <button
                                        onClick={() => setSelectedUser(null)}
                                        className="text-xs text-gray-500 hover:text-red-400 transition-colors"
                                    >
                                        Clear selection
                                    </button>
                                )}
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

                    {/* Main content */}
                    <div className="flex-1 min-w-0 space-y-6">
                        {tab === "byUser" && !selectedUser ? (
                            <div className="flex flex-col items-center justify-center py-24 text-center">
                                <div className="text-4xl mb-4">👤</div>
                                <p className="text-gray-500 text-sm">Select a user to view their sprites.</p>
                            </div>
                        ) : (
                            <>
                                {active.data && !active.loading && (
                                    <div className="flex items-center gap-2">
                                        <p className="text-xs text-slate-400">
                                            {active.data.totalElements} sprite{active.data.totalElements !== 1 ? "s" : ""} found
                                        </p>
                                        {tab === "byUser" && selectedUser && (
                                            <span className="text-xs text-yellow-400/70">
                                                — {selectedUser.username}
                                            </span>
                                        )}
                                    </div>
                                )}

                                <SpriteGrid
                                    sprites={active.data?.content ?? []}
                                    loading={active.loading}
                                    error={active.error}
                                    onEdit={tab === "mine" ? openEdit : undefined}
                                    onDelete={tab === "mine" || isAdmin ? handleDelete : undefined}
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
        </div>
    );
}