export default function StatusBadge({ status }) {
  const map = {
    'Pending':      'badge badge-pending',
    'Under Review': 'badge badge-progress',
    'Approved':     'badge badge-approved',
    'Rejected':     'badge badge-rejected',
    'Issued':       'badge badge-issued',
    'In Progress':  'badge badge-progress',
    'Awaiting Docs':'badge badge-awaiting',
  };
  const cls = map[status] || 'badge badge-pending';
  // Display label
  const label = {
    'Under Review': 'In Progress',
    'Issued':       'Issued',
  }[status] || status;

  return <span className={cls}>{label}</span>;
}
