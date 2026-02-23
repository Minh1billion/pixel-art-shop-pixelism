"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSavingSprite } from "@/features/sprite/hooks/useSavingSprite";
import { useCategories } from "@/features/sprite/hooks/useCategories";
import { SpriteService } from "@/features/sprite/services/sprite.service";
import type { SpriteListResponse } from "@/features/sprite/types";

interface SavingSpriteFormProps {
    open: boolean;
    editingSprite?: SpriteListResponse | null;
    onClose: () => void;
    onSaved: () => void;
}

interface FormContentProps {
    editingSprite?: SpriteListResponse | null;
    onClose: () => void;
    onSaved: () => void;
}

function FormContent({ editingSprite, onClose, onSaved }: FormContentProps) {
    const { data: categories } = useCategories();

    const [name, setName] = useState("");
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [fetchingSprite, setFetchingSprite] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const isEditing = !!editingSprite;

    const { save, loading, error } = useSavingSprite({
        onSuccess: () => {
            onSaved();
            onClose();
        },
    });

    useEffect(() => {
        if (!editingSprite) return;

        setFetchingSprite(true);
        SpriteService.getById(editingSprite.id)
            .then((data) => {
                setName(data.name);
                setSelectedCategories(data.categoryIds ?? []);
                setPreview(data.imageUrl ?? null);
            })
            .finally(() => setFetchingSprite(false));
    }, [editingSprite]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        setImage(file);
        if (file) setPreview(URL.createObjectURL(file));
    };

    const toggleCategory = useCallback((id: string) => {
        setSelectedCategories((prev) =>
            prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
        );
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isEditing && !image) return;
        await save(
            { name, categoryIds: selectedCategories },
            image,
            editingSprite?.id
        );
    };

    if (fetchingSprite) {
        return (
            <div className="space-y-4 animate-pulse">
                <div className="h-4 bg-neutral-800 rounded w-1/4" />
                <div className="h-9 bg-neutral-800 rounded" />
                <div className="h-4 bg-neutral-800 rounded w-1/4 mt-2" />
                <div className="h-36 bg-neutral-800 rounded-lg" />
                <div className="h-4 bg-neutral-800 rounded w-1/4" />
                <div className="flex gap-2">
                    <div className="h-7 w-20 bg-neutral-800 rounded-full" />
                    <div className="h-7 w-20 bg-neutral-800 rounded-full" />
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div>
                <label className="block text-xs text-gray-400 mb-1.5">Name</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="e.g. Dragon Warrior"
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-green-500 transition-colors"
                />
            </div>

            <div>
                <label className="block text-xs text-gray-400 mb-1.5">
                    Image{" "}
                    {isEditing && (
                        <span className="text-gray-600">(leave empty to keep current)</span>
                    )}
                </label>
                <div
                    onClick={() => fileInputRef.current?.click()}
                    className="relative cursor-pointer border border-dashed border-neutral-700 hover:border-green-500 rounded-lg transition-colors overflow-hidden"
                >
                    {preview ? (
                        <div
                            className="flex items-center justify-center h-36"
                            style={{
                                backgroundImage: "repeating-conic-gradient(#1a1a1a 0% 25%, #232323 0% 50%)",
                                backgroundSize: "10px 10px",
                            }}
                        >
                            <img
                                src={preview}
                                alt="preview"
                                className="max-h-full max-w-full object-contain"
                                style={{ imageRendering: "pixelated" }}
                            />
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-36 gap-2">
                            <span className="text-2xl text-gray-600">↑</span>
                            <span className="text-xs text-gray-500">Click to upload image</span>
                        </div>
                    )}
                </div>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                />
            </div>

            {categories && categories.length > 0 && (
                <div>
                    <label className="block text-xs text-gray-400 mb-2">Categories</label>
                    <div className="flex flex-wrap gap-2">
                        {categories.map((cat) => {
                            const active = selectedCategories.includes(cat.id);
                            return (
                                <button
                                    key={cat.id}
                                    type="button"
                                    onClick={() => toggleCategory(cat.id)}
                                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                                        active
                                            ? "bg-green-500/20 border-green-500 text-green-400"
                                            : "bg-neutral-800 border-neutral-700 text-gray-400 hover:border-neutral-500"
                                    }`}
                                >
                                    {cat.name}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {error && (
                <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                    {error}
                </p>
            )}

            <div className="flex gap-3 pt-1">
                <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-2 rounded-lg text-sm text-gray-400 bg-neutral-800 hover:bg-neutral-700 transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading || (!isEditing && !image)}
                    className="flex-1 px-4 py-2 rounded-lg text-sm font-medium bg-green-500 hover:bg-green-400 text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading
                        ? isEditing ? "Saving..." : "Uploading..."
                        : isEditing ? "Save Changes" : "Upload"
                    }
                </button>
            </div>
        </form>
    );
}

export default function SavingSpriteForm({
    open,
    editingSprite,
    onClose,
    onSaved,
}: SavingSpriteFormProps) {
    if (!open) return null;

    const formKey = editingSprite?.id ?? "create";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                onClick={onClose}
            />
            <div className="relative z-10 w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-white font-semibold text-base">
                        {editingSprite ? "Edit Sprite" : "Upload Sprite"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-white transition-colors text-xl leading-none"
                    >
                        ×
                    </button>
                </div>

                <FormContent
                    key={formKey}
                    editingSprite={editingSprite}
                    onClose={onClose}
                    onSaved={onSaved}
                />
            </div>
        </div>
    );
}