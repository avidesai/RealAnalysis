import React, { useState, useEffect, useRef } from 'react';

const SaveModal = ({ propertyMeta, onSave, onClose, saving }) => {
  const [meta, setMeta] = useState({
    name: propertyMeta.name || '',
    address: propertyMeta.address || '',
    notes: propertyMeta.notes || '',
  });
  const addressRef = useRef(null);

  useEffect(() => {
    addressRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!meta.address.trim()) return;
    onSave(meta);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{propertyMeta.id ? 'Update Property' : 'Save Property'}</h2>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="modal-field">
            <label htmlFor="save-address">Property address *</label>
            <input
              ref={addressRef}
              id="save-address"
              type="text"
              value={meta.address}
              onChange={e => setMeta(prev => ({ ...prev, address: e.target.value }))}
              placeholder="123 Main St, Chicago, IL 60601"
              required
            />
          </div>

          <div className="modal-field">
            <label htmlFor="save-name">Nickname (optional)</label>
            <input
              id="save-name"
              type="text"
              value={meta.name}
              onChange={e => setMeta(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g. The Duplex on Main"
            />
          </div>

          <div className="modal-field">
            <label htmlFor="save-notes">Notes (optional)</label>
            <textarea
              id="save-notes"
              value={meta.notes}
              onChange={e => setMeta(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Any notes about this property..."
              rows={3}
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="modal-btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="modal-btn-primary" disabled={saving || !meta.address.trim()}>
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SaveModal;
