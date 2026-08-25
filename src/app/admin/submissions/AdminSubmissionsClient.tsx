'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { toast } from 'sonner'
import { 
    Check, 
    X, 
    Trash2, 
    Clock, 
    Sparkles, 
    User, 
    Shield, 
    Sword, 
    Gem, 
    MessageSquare, 
    Calendar,
    Filter
} from 'lucide-react'
import { 
    type CommunityBuildSubmission, 
    approveCommunityBuild, 
    rejectCommunityBuild, 
    deleteCommunityBuildSubmission 
} from '@/lib/community-build-actions'
import SafeImage from '@/components/shared/SafeImage'

interface AdminSubmissionsClientProps {
    initialSubmissions: any[]
}

export default function AdminSubmissionsClient({ initialSubmissions }: AdminSubmissionsClientProps) {
    const [submissions, setSubmissions] = useState<any[]>(initialSubmissions)
    const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending')
    const [actionLoading, setActionLoading] = useState<number | null>(null)

    const filtered = submissions.filter(s => {
        if (filter === 'all') return true
        return s.status === filter
    })

    const pendingCount = submissions.filter(s => s.status === 'pending').length

    const handleApprove = async (id: number) => {
        if (!confirm('Approve this build and add it to the live hero builds list?')) return
        setActionLoading(id)
        toast.loading('Approving submission...')

        try {
            const res = await approveCommunityBuild(id)
            toast.dismiss()
            if (res.success) {
                toast.success('Build approved and added to live website! 🎉')
                setSubmissions(prev => prev.map(s => s.id === id ? { ...s, status: 'approved' } : s))
            } else {
                toast.error(res.error || 'Failed to approve submission')
            }
        } catch (err: any) {
            toast.dismiss()
            toast.error(err.message || 'Error approving submission')
        } finally {
            setActionLoading(null)
        }
    }

    const handleReject = async (id: number) => {
        const note = prompt('Optional rejection reason / admin note:')
        if (note === null) return // cancelled

        setActionLoading(id)
        toast.loading('Rejecting submission...')

        try {
            const res = await rejectCommunityBuild(id, note)
            toast.dismiss()
            if (res.success) {
                toast.info('Submission marked as rejected')
                setSubmissions(prev => prev.map(s => s.id === id ? { ...s, status: 'rejected', admin_note: note } : s))
            } else {
                toast.error(res.error || 'Failed to reject submission')
            }
        } catch (err: any) {
            toast.dismiss()
            toast.error(err.message || 'Error rejecting submission')
        } finally {
            setActionLoading(null)
        }
    }

    const handleDelete = async (id: number) => {
        if (!confirm('Permanently delete this submission record?')) return
        setActionLoading(id)
        toast.loading('Deleting submission...')

        try {
            const res = await deleteCommunityBuildSubmission(id)
            toast.dismiss()
            if (res.success) {
                toast.success('Submission deleted')
                setSubmissions(prev => prev.filter(s => s.id !== id))
            } else {
                toast.error(res.error || 'Failed to delete submission')
            }
        } catch (err: any) {
            toast.dismiss()
            toast.error(err.message || 'Error deleting submission')
        } finally {
            setActionLoading(null)
        }
    }

    return (
        <div className="space-y-6">
            {/* Header & Filter Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-5">
                <div>
                    <h1 className="text-2xl font-black tracking-tight text-foreground flex items-center gap-2">
                        <Sparkles className="text-amber-400" size={24} />
                        Community Build Submissions
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Review, approve, or reject hero gear setups submitted by community players.
                    </p>
                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-1.5 bg-muted/40 p-1 rounded-xl border border-border/40">
                    {(['pending', 'approved', 'rejected', 'all'] as const).map(tab => (
                        <button
                            key={tab}
                            type="button"
                            onClick={() => setFilter(tab)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all flex items-center gap-1.5 ${
                                filter === tab
                                    ? 'bg-primary text-primary-foreground shadow-sm'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                            }`}
                        >
                            <span>{tab}</span>
                            {tab === 'pending' && pendingCount > 0 && (
                                <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-amber-400 text-black font-black">
                                    {pendingCount}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* List of Submissions */}
            {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-border/60 rounded-2xl bg-card/30">
                    <div className="w-12 h-12 rounded-full bg-muted/40 flex items-center justify-center text-muted-foreground mb-3">
                        <Filter size={20} />
                    </div>
                    <h3 className="text-base font-bold text-foreground">No submissions found</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                        {filter === 'pending' ? 'No pending community builds waiting for moderation.' : 'No records match this status filter.'}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {filtered.map(sub => {
                        const isLoading = actionLoading === sub.id

                        return (
                            <div 
                                key={sub.id}
                                className="bg-card border border-border/50 rounded-2xl p-5 shadow-sm space-y-4 hover:border-amber-400/30 transition-all"
                            >
                                {/* Top Meta Row */}
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/30 pb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-black border border-amber-400/40 flex-shrink-0">
                                            <SafeImage
                                                src={`/heroes/${sub.hero_filename}.webp`}
                                                alt={sub.hero_name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="text-base font-black text-foreground">
                                                    {sub.hero_name}
                                                </h3>
                                                <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-400 uppercase">
                                                    {sub.hero_grade}
                                                </span>
                                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                                                    Level {sub.c_level}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                                                <span className="flex items-center gap-1 font-bold text-amber-300">
                                                    <User size={12} />
                                                    Author: {sub.author_name}
                                                </span>
                                                {sub.author_contact && (
                                                    <span className="text-[11px] text-zinc-400">
                                                        ({sub.author_contact})
                                                    </span>
                                                )}
                                                <span>•</span>
                                                <span className="flex items-center gap-1 text-[11px]">
                                                    <Calendar size={11} />
                                                    {new Date(sub.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Status Badge & Actions */}
                                    <div className="flex items-center gap-2">
                                        <span className={`text-xs font-black uppercase px-2.5 py-1 rounded-lg border ${
                                            sub.status === 'approved'
                                                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                                                : sub.status === 'rejected'
                                                ? 'bg-rose-500/15 border-rose-500/40 text-rose-400'
                                                : 'bg-amber-500/15 border-amber-500/40 text-amber-400'
                                        }`}>
                                            {sub.status}
                                        </span>

                                        {sub.status === 'pending' && (
                                            <>
                                                <button
                                                    type="button"
                                                    disabled={isLoading}
                                                    onClick={() => handleApprove(sub.id)}
                                                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-sm"
                                                    title="Approve and push to active builds"
                                                >
                                                    <Check size={14} />
                                                    <span>Approve</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    disabled={isLoading}
                                                    onClick={() => handleReject(sub.id)}
                                                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-600/80 hover:bg-rose-600 text-white text-xs font-bold transition-all"
                                                    title="Reject submission"
                                                >
                                                    <X size={14} />
                                                    <span>Reject</span>
                                                </button>
                                            </>
                                        )}

                                        <button
                                            type="button"
                                            disabled={isLoading}
                                            onClick={() => handleDelete(sub.id)}
                                            className="p-1.5 rounded-lg bg-muted/60 hover:bg-rose-600/20 text-muted-foreground hover:text-rose-400 transition-colors"
                                            title="Delete record"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>

                                {/* Modes & Substats */}
                                <div className="flex flex-wrap items-center gap-3 text-xs">
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-muted-foreground font-bold">Modes:</span>
                                        {(sub.modes || []).map((m: string) => (
                                            <span key={m} className="px-2 py-0.5 rounded bg-muted text-foreground font-semibold text-[11px]">
                                                {m}
                                            </span>
                                        ))}
                                    </div>

                                    {sub.substats && sub.substats.length > 0 && (
                                        <div className="flex items-center gap-1.5 ml-auto">
                                            <span className="text-muted-foreground font-bold">Priority Stats:</span>
                                            {sub.substats.map((st: string) => (
                                                <span key={st} className="px-2 py-0.5 rounded bg-amber-400/10 border border-amber-400/30 text-amber-300 text-[11px] font-bold">
                                                    {st}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Gear Details */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-muted/20 p-3 rounded-xl border border-border/30">
                                    {/* Weapons */}
                                    <div className="space-y-1">
                                        <span className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                                            <Sword size={11} /> Weapons
                                        </span>
                                        <div className="flex items-center gap-1.5">
                                            {(sub.weapons || []).map((w: any, idx: number) => (
                                                <div key={idx} className="relative w-10 h-10 rounded-lg bg-black border border-border/60 overflow-hidden">
                                                    {w.image && (
                                                        <SafeImage src={`/items/weapon/${w.image}`} alt="W" fill className="object-contain p-1" />
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Armors */}
                                    <div className="space-y-1">
                                        <span className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                                            <Shield size={11} /> Armors
                                        </span>
                                        <div className="flex items-center gap-1.5">
                                            {(sub.armors || []).map((a: any, idx: number) => (
                                                <div key={idx} className="relative w-10 h-10 rounded-lg bg-black border border-border/60 overflow-hidden">
                                                    {a.image && (
                                                        <SafeImage src={`/items/armor/${a.image}`} alt="A" fill className="object-contain p-1" />
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Accessories */}
                                    <div className="col-span-2 space-y-1">
                                        <span className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                                            <Gem size={11} /> Accessories &amp; Refining
                                        </span>
                                        <div className="flex items-center gap-2">
                                            {(sub.accessories || []).map((acc: any, idx: number) => (
                                                <div key={idx} className="flex items-center gap-1">
                                                    <div className="relative w-10 h-10 rounded-lg bg-black border border-border/60 overflow-hidden">
                                                        {acc.image && (
                                                            <SafeImage src={`/items/accessory/${acc.image}`} alt="Acc" fill className="object-contain p-1" />
                                                        )}
                                                    </div>
                                                    {acc.refined && (
                                                        <div className="relative w-6 h-6 rounded-md bg-black border border-amber-400/40 overflow-hidden">
                                                            <SafeImage src={`/items/accessory/${acc.refined}`} alt="Ref" fill className="object-contain p-0.5" />
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Minimum Stats */}
                                    {sub.min_stats && Object.keys(sub.min_stats).length > 0 && Object.values(sub.min_stats).some(Boolean) && (
                                        <div className="col-span-2 sm:col-span-4 space-y-1 pt-2 border-t border-border/30">
                                            <span className="text-[10px] font-bold text-orange-400 uppercase">
                                                Minimum Target Stats
                                            </span>
                                            <div className="flex flex-wrap gap-2">
                                                {Object.entries(sub.min_stats).filter(([_, val]) => Boolean(val)).map(([k, val]) => (
                                                    <span key={k} className="px-2 py-0.5 rounded-md bg-orange-400/10 border border-orange-400/30 text-orange-300 text-[10px] font-bold">
                                                        {k}: {String(val)}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Dedicated Stats */}
                                    {sub.dedicated_stats && sub.dedicated_stats.some((d: any) => Boolean(d)) && (
                                        <div className="col-span-2 sm:col-span-4 space-y-1 pt-2 border-t border-border/30">
                                            <span className="text-[10px] font-bold text-amber-400 uppercase">
                                                Dedicated Stats
                                            </span>
                                            <div className="flex flex-wrap gap-1.5">
                                                {sub.dedicated_stats.filter(Boolean).map((d: string, dIdx: number) => (
                                                    <span key={dIdx} className="px-2 py-0.5 rounded-md bg-amber-400/10 border border-amber-400/30 text-amber-300 text-[10px] font-bold">
                                                        {d}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Tactical Notes */}
                                {sub.note && (
                                    <div className="text-xs text-foreground/80 bg-background/50 p-2.5 rounded-lg border border-border/30">
                                        <strong className="text-amber-400 mr-1.5">Strategy / Note:</strong>
                                        {sub.note}
                                    </div>
                                )}

                                {sub.admin_note && (
                                    <div className="text-xs text-rose-300 bg-rose-950/30 p-2 rounded-lg border border-rose-500/20">
                                        <strong>Admin Note:</strong> {sub.admin_note}
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
