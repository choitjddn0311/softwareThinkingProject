import { useParams, useLocation } from 'react-router-dom';

const ReadPage = () => {
  const { date } = useParams();        // "2026-05-02"
  const { state } = useLocation();
  const diary = state?.diary;          // false 또는 일기 객체

  const [year, month, day] = date.split('-');
  const displayDate = `${year}.${month}.${day}`;

  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">{displayDate}</h2>

      {!diary ? (
        <p className="text-gray-400">
          ({displayDate})에는 작성된 일기가 없어요.
        </p>
      ) : (
        <div>
          <h3 className="text-xl font-bold">{diary.title}</h3>
          <p className="text-sm text-gray-500">{diary.emotion}</p>
          <p className="mt-2 text-gray-700">{diary.content}</p>
        </div>
      )}
    </div>
  );
};

export default ReadPage;