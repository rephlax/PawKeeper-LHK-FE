import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const NotFoundPage = () => {
  const { t } = useTranslation();
  return (
    <div>
      <div>
        <h1>{t('notfoundpage.notfound')}</h1>
        <img src="https://res.cloudinary.com/dmvawq2ak/image/upload/v1739582815/closeup-view-shocked-dog-expressing-surprise-with-its-mouth-opened_1247367-99679_ddeqfd.avif" alt="Shocked dog" />
        <Link to="/">{t('notfoundpage.backhome')}</Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
