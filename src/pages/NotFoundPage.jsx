const NotFoundPage = () => {
  const { t } = useTranslation()
  return (
    <div className='flex flex-col items-center justify-center h-full p-6 text-center'>
      <div className='space-y-6'>
        <h1 className='text-4xl font-bold text-cream-800'>
          {t('notfoundpage.notfound')}
        </h1>

        <div className='relative w-64 h-64 mx-auto'>
          <img
            src='https://res.cloudinary.com/dmvawq2ak/image/upload/v1739582815/closeup-view-shocked-dog-expressing-surprise-with-its-mouth-opened_1247367-99679_ddeqfd.avif'
            alt='Shocked dog'
            className='w-full h-full object-cover rounded-lg shadow-lg'
          />
        </div>

        <Link
          to='/'
          className='inline-block mt-6 px-6 py-2 bg-cream-600 text-white rounded-lg
                   hover:bg-cream-700 transition-colors duration-200'
        >
          {t('notfoundpage.backhome')}
        </Link>
      </div>
    </div>
  )
}

export default NotFoundPage
