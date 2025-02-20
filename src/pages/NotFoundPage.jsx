import PageWrapper from '../components/PageWrapper'

const NotFoundPage = () => {
  const { t } = useTranslation()

  return (
    <PageWrapper>
      <div className='text-center space-y-8'>
        <h1 className='text-4xl font-bold text-cream-800'>
          {t('notfoundpage.notfound')}
        </h1>
        <div className='relative w-64 h-64 mx-auto'>
          <img
            src='[your-image-url]'
            alt='Shocked dog'
            className='w-full h-full object-cover rounded-lg shadow-lg'
          />
        </div>
        <Link
          to='/'
          className='inline-block px-6 py-2 bg-cream-600 text-white rounded-lg
                   hover:bg-cream-700 transition-colors duration-200'
        >
          {t('notfoundpage.backhome')}
        </Link>
      </div>
    </PageWrapper>
  )
}

export default NotFoundPage
