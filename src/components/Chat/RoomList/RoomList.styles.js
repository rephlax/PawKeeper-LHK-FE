export const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem',
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
  },
  headerTitle: {
    fontWeight: '500',
  },
  createButton: {
    padding: '0.375rem',
    borderRadius: '0.375rem',
    transition: 'background-color 0.2s',
  },
  roomList: {
    flex: '1',
    overflowY: 'auto',
  },
  roomItem: isActive => ({
    display: 'flex',
    alignItems: 'center',
    padding: '0.75rem',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    borderLeftWidth: '4px',
    borderLeftStyle: 'solid',
  }),
  roomContent: {
    flex: '1',
    display: 'flex',
    alignItems: 'center',
  },
  roomIcon: {
    height: '1rem',
    width: '1rem',
    marginRight: '0.5rem',
  },
  roomText: {
    flex: '1',
    minWidth: '0',
  },
  roomName: {
    fontWeight: '500',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  lastMessage: {
    fontSize: '0.875rem',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  deleteButton: {
    padding: '0.375rem',
    borderRadius: '0.375rem',
    transition: 'all 0.2s',
    opacity: '0',
  },
}
