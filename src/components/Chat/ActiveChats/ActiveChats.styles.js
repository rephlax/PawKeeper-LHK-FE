export const styles = {
  container: {
    padding: '1rem',
  },
  heading: {
    fontWeight: '500',
    marginBottom: '1rem',
  },
  listContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  chatItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.75rem',
    borderRadius: '0.5rem',
    borderWidth: '1px',
    borderStyle: 'solid',
    transition: 'background-color 0.2s',
    cursor: 'pointer',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  avatarContainer: {
    position: 'relative',
  },
  avatarImage: {
    width: '2.5rem',
    height: '2.5rem',
    borderRadius: '9999px',
    objectFit: 'cover',
    borderWidth: '2px',
    borderStyle: 'solid',
  },
  statusIndicator: {
    position: 'absolute',
    bottom: '0',
    right: '0',
    width: '0.75rem',
    height: '0.75rem',
    borderRadius: '9999px',
    borderWidth: '2px',
    borderStyle: 'solid',
    borderColor: 'white',
  },
  textContainer: {
    minWidth: '0',
    flexGrow: '1',
  },
  username: {
    fontWeight: '500',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  messagePreview: {
    fontSize: '0.875rem',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  emptyState: {
    textAlign: 'center',
    fontSize: '0.875rem',
    padding: '1rem 0',
  },
}
