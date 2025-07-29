
import { useEffect, useState } from 'react';
import './App.css';

const API_URL = '/api/reviews';

function App() {
  const [reviews, setReviews] = useState([]);
  const [title, setTitle] = useState('');
  const [review, setReview] = useState('');
  const [loading, setLoading] = useState(false);

  // 一覧取得
  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setReviews(data);
    } catch (e) {
      alert('データ取得に失敗しました');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // 新規登録
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !review) return;
    try {
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, review })
      });
      setTitle('');
      setReview('');
      fetchReviews();
    } catch (e) {
      alert('登録に失敗しました');
    }
  };

  // 削除
  const handleDelete = async (id) => {
    if (!window.confirm('削除しますか？')) return;
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      fetchReviews();
    } catch (e) {
      alert('削除に失敗しました');
    }
  };

  return (
    <div className="container">
      <h1>書籍感想記録アプリ</h1>
      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          placeholder="書籍タイトル"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="感想文"
          value={review}
          onChange={e => setReview(e.target.value)}
          required
        />
        <button type="submit">登録</button>
      </form>
      <hr />
      <h2>登録済み一覧</h2>
      {loading ? <p>読込中...</p> : (
        <ul>
          {reviews.map(r => (
            <li key={r.id} className="review-item">
              <strong>{r.title}</strong><br />
              <span>{r.review}</span><br />
              <button onClick={() => handleDelete(r.id)}>削除</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
