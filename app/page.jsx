"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import MemberList from "@/components/MemberList";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import EmptyState from "@/components/EmptyState";
import ErrorState from "@/components/ErrorState";
import MemberFormModal from "@/components/MemberFormModal";
import ConfirmDialog from "@/components/ConfirmDialog";
import Toast from "@/components/Toast";
import {
  loadMembers,
  addMember,
  editMember,
  removeMember,
  clearMutationError,
} from "@/lib/membersSlice";
import { logEvent } from "@/lib/analytics";

export default function PortalPage() {
  const dispatch = useDispatch();
  const { items, status, error, mutationStatus, mutationError } = useSelector(
    (s) => s.members
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [modalMode, setModalMode] = useState(null); // null | "add" | "edit"
  const [editingMember, setEditingMember] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    dispatch(loadMembers());
  }, [dispatch]);

  const filtered = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (m) =>
        m.name.toLowerCase().includes(q) || m.memberId.toLowerCase().includes(q)
    );
  }, [items, searchTerm]);

  const handleRetryLoad = useCallback(() => {
    dispatch(loadMembers());
  }, [dispatch]);

  function openAddModal() {
    setEditingMember(null);
    setModalMode("add");
    dispatch(clearMutationError());
  }

  function openEditModal(member) {
    setEditingMember(member);
    setModalMode("edit");
    dispatch(clearMutationError());
  }

  function closeModal() {
    setModalMode(null);
    setEditingMember(null);
    dispatch(clearMutationError());
  }

  async function handleFormSubmit(payload) {
    if (modalMode === "add") {
      const result = await dispatch(addMember(payload));
      if (addMember.fulfilled.match(result)) {
        logEvent("member_added", { memberId: payload.memberId });
        setToast({ tone: "success", message: `${payload.name} added to the portal.` });
        closeModal();
      }
    } else if (modalMode === "edit") {
      const result = await dispatch(
        editMember({ id: editingMember.id, changes: payload })
      );
      if (editMember.fulfilled.match(result)) {
        logEvent("member_updated", { memberId: editingMember.memberId });
        setToast({ tone: "success", message: `${payload.name}'s record was updated.` });
        closeModal();
      }
    }
  }

  function requestDelete(member) {
    setPendingDelete(member);
  }

  async function confirmDelete() {
    const member = pendingDelete;
    const result = await dispatch(removeMember(member.id));
    if (removeMember.fulfilled.match(result)) {
      logEvent("member_removed", { memberId: member.memberId });
      setToast({ tone: "success", message: `${member.name} was removed.` });
    } else {
      setToast({ tone: "error", message: result.payload || "Couldn't remove this member." });
    }
    setPendingDelete(null);
  }

  return (
    <>
      <Header />
      <main id="main-content" className="page">
        <div className="page__toolbar">
          <SearchBar
            value={searchTerm}
            onChange={(v) => {
              setSearchTerm(v);
              logEvent("search_performed");
            }}
            resultCount={filtered.length}
            totalCount={items.length}
          />
          <button
            type="button"
            className="page__add-btn"
            onClick={openAddModal}
            aria-label="Add new member"
          >
            + Add member
          </button>
        </div>

        {status === "loading" && <LoadingSkeleton rows={4} />}

        {status === "failed" && <ErrorState message={error} onRetry={handleRetryLoad} />}

        {status === "succeeded" && items.length === 0 && (
          <EmptyState
            title="No members on file yet"
            message="Add your first frequent flyer record to get started."
            actionLabel="Add member"
            onAction={openAddModal}
          />
        )}

        {status === "succeeded" && items.length > 0 && (
          <MemberList
            members={filtered}
            onEdit={openEditModal}
            onDelete={requestDelete}
            searchTerm={searchTerm}
            onClearSearch={() => setSearchTerm("")}
          />
        )}
      </main>

      {modalMode && (
        <MemberFormModal
          initialData={editingMember}
          onSubmit={handleFormSubmit}
          onClose={closeModal}
          isSaving={mutationStatus === "loading"}
          serverError={mutationError}
        />
      )}

      {pendingDelete && (
        <ConfirmDialog
          title="Remove this member?"
          message={`This removes ${pendingDelete.name} (${pendingDelete.memberId}) from the portal. This can't be undone.`}
          confirmLabel="Remove member"
          isDangerous
          onConfirm={confirmDelete}
          onCancel={() => setPendingDelete(null)}
        />
      )}

      {toast && (
        <Toast message={toast.message} tone={toast.tone} onDismiss={() => setToast(null)} />
      )}

      <style jsx>{`
        .page {
          max-width: 960px;
          margin: 0 auto;
          padding: var(--space-3);
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
        }
        .page__toolbar {
          display: flex;
          gap: var(--space-2);
          align-items: center;
        }
        .page__toolbar > :global(.search-bar) {
          flex: 1;
        }
        .page__add-btn {
          background: var(--ink-900);
          color: var(--surface);
          border: none;
          padding: 12px var(--space-2);
          border-radius: var(--radius-md);
          font-weight: 600;
          white-space: nowrap;
        }
        .page__add-btn:hover {
          background: var(--ink-700);
        }

        @media (max-width: 560px) {
          .page__toolbar {
            flex-direction: column;
            align-items: stretch;
          }
        }
      `}</style>
    </>
  );
}
