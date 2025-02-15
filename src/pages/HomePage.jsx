import logo from '../assets/logo.png';
import { useTranslation } from 'react-i18next';

const HomePage = () => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center h-full space-y-4">
      <h1>{t('homepage.welcome')}</h1>
      <img className="w-40 h-40" src={logo} alt="Pawkeeper logo" />
    </div>
  );
};

export default HomePage;
