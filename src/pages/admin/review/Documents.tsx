import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import DataTable, { DataTableColumn } from '../../../components/DataTable';
import FilterTabs from '../../../components/FilterTabs';
import ImageZoomModal from '../../../components/ImageZoomModal';
import Modal from '../../../components/Modal';
import StatusBadge from '../../../components/StatusBadge';
import { useAdminAuth } from '../../../lib/auth';
import { API_URL } from '../../../lib/api/core';
import { AdminDocument, adminGetPendingDocuments, adminReviewDocument } from '../../../lib/api/adminReview';

const ROLE_FILTERS = ['all', 'driver', 'client', 'agent', 'truck_owner'] as const;
type RoleFilter = (typeof ROLE_FILTERS)[number];

interface UserDocGroup {
  userId: string;
  fullName: string;
  phone: string;
  role: string;
  documents: AdminDocument[];
}

function groupDocumentsByUser(docs: AdminDocument[]): UserDocGroup[] {
  const map = new Map<string, UserDocGroup>();
  for (const doc of docs) {
    const userId = doc.user?.id || doc.userId;
    if (!userId) continue;
    const existing = map.get(userId);
    if (existing) {
      existing.documents.push(doc);
    } else {
      map.set(userId, {
        userId,
        fullName: doc.user?.fullName || '—',
        phone: doc.user?.phone || '—',
        role: doc.user?.role || '—',
        documents: [doc],
      });
    }
  }
  return Array.from(map.values()).sort((a, b) => a.fullName.localeCompare(b.fullName));
}

function humanizeDocType(type: string): string {
  return type
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function fileUri(fileUrl?: string | null): string | null {
  if (!fileUrl) return null;
  if (fileUrl.startsWith('http')) return fileUrl;
  return `${API_URL.replace(/\/api\/?$/, '')}${fileUrl}`;
}

/** Documents review screen — pending docs grouped by user, mirrors `app/(admin)/documents.tsx`. */
export default function Documents() {
  const { t } = useTranslation();
  const { token } = useAdminAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const ROLE_LABEL: Record<string, string> = {
    all: t('common.all'),
    driver: t('admin.users.roleTabs.driver'),
    client: t('admin.users.roleTabs.client'),
    agent: t('admin.users.roleTabs.agent'),
    truck_owner: t('admin.users.roleTabs.truck_owner'),
  };

  const [documents, setDocuments] = useState<AdminDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('all');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(searchParams.get('userId'));
  const [reviewingDoc, setReviewingDoc] = useState<AdminDocument | null>(null);
  const [decision, setDecision] = useState<'approve' | 'reject' | null>(null);
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [zoomSrc, setZoomSrc] = useState<string | null>(null);

  const userGroups = useMemo(() => groupDocumentsByUser(documents), [documents]);
  const selectedGroup = useMemo(
    () => userGroups.find((g) => g.userId === selectedUserId) ?? null,
    [userGroups, selectedUserId]
  );

  const loadDocuments = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    const params = roleFilter === 'all' ? { limit: 200 } : { role: roleFilter, limit: 200 };
    const { data, error: err } = await adminGetPendingDocuments(token, params);
    if (err) setError(err);
    else if (data) setDocuments(data.documents);
    setLoading(false);
  }, [token, roleFilter]);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  useEffect(() => {
    if (!selectedUserId) return;
    if (userGroups.length && !userGroups.some((g) => g.userId === selectedUserId)) {
      setSelectedUserId(null);
    }
  }, [userGroups, selectedUserId]);

  useEffect(() => {
    const docId = searchParams.get('docId');
    if (!docId || !selectedGroup) return;
    const match = selectedGroup.documents.find((d) => String(d.id) === String(docId));
    if (match) {
      setReviewingDoc(match);
      setDecision(null);
      setReason('');
    }
  }, [searchParams, selectedGroup]);

  const openDocument = (doc: AdminDocument) => {
    setReviewingDoc(doc);
    setDecision(null);
    setReason('');
    setError(null);
  };

  const closeDocument = () => {
    setReviewingDoc(null);
    if (searchParams.get('docId')) {
      const next = new URLSearchParams(searchParams);
      next.delete('docId');
      setSearchParams(next, { replace: true });
    }
  };

  const selectUser = (userId: string | null) => {
    setSelectedUserId(userId);
    const next = new URLSearchParams(searchParams);
    if (userId) next.set('userId', userId);
    else next.delete('userId');
    next.delete('docId');
    setSearchParams(next, { replace: true });
  };

  const submitReview = async () => {
    if (!token || !reviewingDoc || !decision) return;
    if (decision === 'reject' && !reason.trim()) {
      setError(t('admin.documents.rejectionReasonRequired'));
      return;
    }
    setSubmitting(true);
    setError(null);
    const { error: err } = await adminReviewDocument(token, reviewingDoc.id, decision, reason.trim() || undefined);
    setSubmitting(false);
    if (err) {
      setError(err);
      return;
    }
    closeDocument();
    await loadDocuments();
  };

  const userColumns: DataTableColumn<UserDocGroup>[] = [
    { key: 'fullName', header: t('admin.documents.columns.name'), render: (g) => <span className="font-medium">{g.fullName}</span> },
    { key: 'role', header: t('admin.documents.columns.role'), render: (g) => (g.role !== '—' ? ROLE_LABEL[g.role] ?? g.role : '—') },
    { key: 'phone', header: t('admin.documents.columns.phone') },
    {
      key: 'count',
      header: t('admin.documents.columns.pendingDocs'),
      render: (g) => (
        <span className="inline-flex items-center rounded-full bg-admin-accent/15 px-2.5 py-0.5 text-xs font-semibold text-admin-accent">
          {g.documents.length}
        </span>
      ),
    },
  ];

  const docColumns: DataTableColumn<AdminDocument>[] = [
    { key: 'type', header: t('admin.documents.columns.type'), render: (d) => humanizeDocType(d.type) },
    {
      key: 'preview',
      header: t('admin.documents.columns.preview'),
      render: (d) =>
        d.fileUrl ? (
          <img src={fileUri(d.fileUrl) ?? undefined} alt={d.type} className="h-10 w-10 rounded object-cover" />
        ) : (
          <span className="text-admin-subtext">—</span>
        ),
    },
    {
      key: 'createdAt',
      header: t('admin.documents.columns.uploaded'),
      render: (d) => (d.createdAt ? new Date(d.createdAt).toLocaleDateString() : '—'),
    },
    { key: 'status', header: t('admin.documents.columns.status'), render: (d) => <StatusBadge status={d.status} /> },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-admin-text">
            {selectedGroup ? selectedGroup.fullName : t('admin.documents.title')}
          </h1>
          <p className="mt-1 text-sm text-admin-subtext">
            {selectedGroup
              ? t('admin.documents.userSubtitle', { count: selectedGroup.documents.length })
              : t('admin.documents.subtitle', { count: userGroups.length })}
          </p>
        </div>
        {selectedGroup ? (
          <button
            type="button"
            onClick={() => selectUser(null)}
            className="rounded-md border border-admin-border px-3 py-1.5 text-sm font-medium text-admin-subtext transition hover:border-admin-accent hover:text-admin-accent"
          >
            {t('admin.documents.backToUsers')}
          </button>
        ) : null}
      </div>

      {!selectedGroup ? (
        <>
          <FilterTabs
            tabs={ROLE_FILTERS.map((f) => ({ value: f, label: ROLE_LABEL[f] }))}
            active={roleFilter}
            onChange={(v) => setRoleFilter(v as RoleFilter)}
          />
          <DataTable
            columns={userColumns}
            data={userGroups}
            keyExtractor={(g) => g.userId}
            loading={loading}
            emptyMessage={t('admin.documents.noDocs')}
            onRowClick={(g) => selectUser(g.userId)}
          />
        </>
      ) : (
        <DataTable
          columns={docColumns}
          data={selectedGroup.documents}
          keyExtractor={(d) => d.id}
          loading={loading}
          emptyMessage={t('admin.documents.noDocs')}
          onRowClick={openDocument}
        />
      )}

      <Modal
        open={!!reviewingDoc}
        onClose={closeDocument}
        title={reviewingDoc ? humanizeDocType(reviewingDoc.type) : ''}
        size="lg"
        footer={
          <>
            <button
              type="button"
              onClick={closeDocument}
              className="rounded-md border border-admin-border px-3 py-1.5 text-sm font-medium text-admin-subtext transition hover:text-admin-text"
            >
              {t('common.cancel')}
            </button>
            <button
              type="button"
              onClick={submitReview}
              disabled={!decision || submitting}
              className="rounded-md bg-admin-accent px-4 py-1.5 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? t('common.loading') : t('admin.documents.confirmReview')}
            </button>
          </>
        }
      >
        {reviewingDoc ? (
          <div className="space-y-4">
            {reviewingDoc.fileUrl ? (
              <button
                type="button"
                onClick={() => setZoomSrc(fileUri(reviewingDoc.fileUrl))}
                className="block w-full overflow-hidden rounded-lg border border-admin-border bg-black"
              >
                <img
                  src={fileUri(reviewingDoc.fileUrl) ?? undefined}
                  alt={humanizeDocType(reviewingDoc.type)}
                  className="mx-auto max-h-72 w-full object-contain"
                />
              </button>
            ) : (
              <div className="flex h-28 items-center justify-center rounded-lg border border-admin-border bg-admin-bg text-sm text-admin-subtext">
                PDF file
              </div>
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setDecision('approve')}
                className={`flex-1 rounded-md border px-3 py-2 text-sm font-semibold transition ${
                  decision === 'approve'
                    ? 'border-brand-success bg-brand-success/15 text-brand-success'
                    : 'border-admin-border text-admin-text hover:border-brand-success/60'
                }`}
              >
                {t('admin.documents.approve')}
              </button>
              <button
                type="button"
                onClick={() => setDecision('reject')}
                className={`flex-1 rounded-md border px-3 py-2 text-sm font-semibold transition ${
                  decision === 'reject'
                    ? 'border-brand-danger bg-brand-danger/15 text-brand-danger'
                    : 'border-admin-border text-admin-text hover:border-brand-danger/60'
                }`}
              >
                {t('admin.documents.reject')}
              </button>
            </div>

            {decision === 'reject' ? (
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder={t('admin.documents.rejectionReasonPlaceholder')}
                rows={3}
                className="w-full rounded-md border border-admin-border bg-admin-bg p-2 text-sm text-admin-text placeholder:text-admin-subtext focus:border-admin-accent focus:outline-none"
              />
            ) : null}

            {error ? <p className="text-sm text-brand-danger">{error}</p> : null}
          </div>
        ) : null}
      </Modal>

      <ImageZoomModal src={zoomSrc} alt="Document" onClose={() => setZoomSrc(null)} />
    </div>
  );
}
