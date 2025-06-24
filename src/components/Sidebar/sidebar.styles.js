// Responsive breakpoints
const breakpoints = {
  mobile: '640px',
  tablet: '768px',
  desktop: '1024px',
}

// Responsive helper function
const responsive = (baseStyle, mobileStyle = {}, tabletStyle = {}) => {
  const style = { ...baseStyle }

  // Apply responsive styles based on viewport
  if (typeof window !== 'undefined') {
    const width = window.innerWidth
    if (width <= 640) {
      Object.assign(style, mobileStyle)
    } else if (width <= 768) {
      Object.assign(style, tabletStyle)
    }
  }

  return style
}

export const sidebarStyles = {
  container: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  innerContainer: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '100%',
  },
  controlsSection: {
    flexShrink: '0',
  },
  listSection: {
    flex: '1',
    overflowY: 'auto',
  },
  listContent: responsive(
    { padding: '1rem' },
    { padding: '0.75rem' }, // mobile
    { padding: '0.875rem' }, // tablet
  ),
  listTitle: responsive(
    { fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' },
    { fontSize: '1rem', marginBottom: '0.75rem' }, // mobile
    { fontSize: '1.0625rem', marginBottom: '0.875rem' }, // tablet
  ),
}

export const regularSidebarStyles = {
  container: responsive(
    {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      padding: '1.5rem',
    },
    { padding: '1rem' }, // mobile
    { padding: '1.25rem' }, // tablet
  ),
  header: {
    container: responsive(
      { marginBottom: '2rem' },
      { marginBottom: '1.5rem' }, // mobile
      { marginBottom: '1.75rem' }, // tablet
    ),
    title: responsive(
      {
        fontSize: '1.25rem',
        fontWeight: '600',
        paddingLeft: '1rem',
        paddingRight: '1rem',
      },
      { fontSize: '1.125rem', paddingLeft: '0.5rem', paddingRight: '0.5rem' }, // mobile
      {
        fontSize: '1.1875rem',
        paddingLeft: '0.75rem',
        paddingRight: '0.75rem',
      }, // tablet
    ),
  },
  nav: {
    container: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
    },
    link: {
      base: responsive(
        {
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '0.75rem 1rem',
          borderRadius: '0.5rem',
          transition: 'all 0.2s',
        },
        { gap: '0.5rem', padding: '0.625rem 0.875rem' }, // mobile
        { gap: '0.625rem', padding: '0.6875rem 0.9375rem' }, // tablet
      ),
    },
    icon: {
      container: responsive(
        {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '2rem',
          height: '2rem',
          borderRadius: '0.5rem',
          transition: 'all 0.2s',
        },
        { width: '1.75rem', height: '1.75rem' }, // mobile
        { width: '1.875rem', height: '1.875rem' }, // tablet
      ),
      size: responsive(
        { width: '1.25rem', height: '1.25rem' },
        { width: '1.125rem', height: '1.125rem' }, // mobile
        { width: '1.1875rem', height: '1.1875rem' }, // tablet
      ),
    },
  },
  userProfile: {
    container: responsive(
      {
        marginTop: 'auto',
        paddingTop: '1.5rem',
        borderTopWidth: '1px',
        borderTopStyle: 'solid',
      },
      { paddingTop: '1rem' }, // mobile
      { paddingTop: '1.25rem' }, // tablet
    ),
    card: responsive(
      {
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.75rem 1rem',
        borderRadius: '0.5rem',
      },
      { gap: '0.5rem', padding: '0.625rem 0.875rem' }, // mobile
      { gap: '0.625rem', padding: '0.6875rem 0.9375rem' }, // tablet
    ),
    avatar: {
      container: responsive(
        {
          width: '2.5rem',
          height: '2.5rem',
          borderRadius: '9999px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        },
        { width: '2rem', height: '2rem' }, // mobile
        { width: '2.25rem', height: '2.25rem' }, // tablet
      ),
      image: {
        width: '100%',
        height: '100%',
        borderRadius: '9999px',
        objectFit: 'cover',
      },
    },
    info: {
      container: {
        display: 'flex',
        flexDirection: 'column',
      },
      username: {
        fontWeight: '500',
      },
      role: responsive(
        { fontSize: '0.875rem' },
        { fontSize: '0.8125rem' }, // mobile
        { fontSize: '0.84375rem' }, // tablet
      ),
    },
  },
}

// Media query classes for CSS
export const responsiveClasses = {
  hideOnMobile: '@media (max-width: 640px) { display: none; }',
  hideOnTablet: '@media (max-width: 768px) { display: none; }',
  showOnMobile: '@media (min-width: 641px) { display: none; }',
  showOnTablet: '@media (min-width: 769px) { display: none; }',
}
