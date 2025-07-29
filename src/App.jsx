


import { useEffect, useState } from 'react';
import { FaRegSave } from 'react-icons/fa';
import { MdCancel, MdEdit, MdDeleteForever } from 'react-icons/md';
import './App.css';

// レスポンシブ用の追加CSS
const responsiveTableStyle = `
@media (max-width: 600px) {
  .container {
    padding: 0 !important;
    margin: 0 !important;
    width: 100% !important;
    max-width: 100% !important;
    min-width: 0 !important;
    box-sizing: border-box;
    overflow-x: hidden;
  }
  .container > h1 {
    margin: 0 !important;
    padding: 0 !important;
    width: auto !important;
    max-width: 100% !important;
    min-width: 0 !important;
    box-sizing: border-box;
    word-break: break-word;
    white-space: normal;
  }
  .container > div,
  .container > form,
  .container > hr,
  .container > h2 {
    margin: 0 !important;
    width: 100% !important;
    max-width: 100% !important;
    min-width: 0 !important;
    box-sizing: border-box;
  }
  .container > form {
    display: flex;
    flex-direction: column;
    gap: 1em;
    width: 100% !important;
    box-sizing: border-box;
  }
  .container > form .form-group {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 0.3em;
  }
  .container > form input,
  .container > form textarea {
    width: 100% !important;
    min-width: 0 !important;
    max-width: 100% !important;
    box-sizing: border-box;
    font-size: 1.05em;
  }
  .container > form button[type="submit"] {
    width: 100% !important;
    min-width: 0 !important;
    max-width: 100% !important;
    box-sizing: border-box;
    font-size: 1.1em;
    margin-top: 0.7em;
    padding: 0.7em 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5em;
  }
  .container > h1 {
    font-size: 1.5em !important;
    word-break: break-word;
    white-space: normal;
    width: 100% !important;
    max-width: 100% !important;
    min-width: 0 !important;
    box-sizing: border-box;
  }
  .container > form .form-group label {
    font-size: 1em;
    word-break: break-word;
    white-space: normal;
    width: 100%;
    max-width: 100%;
    min-width: 0;
    box-sizing: border-box;
  }
}
@media (max-width: 600px) {
  .review-table {
    display: block;
    width: 100vw;
    min-width: 0;
    max-width: 100vw;
    overflow-x: hidden;
    margin-left: -8px;
    margin-right: -8px;
  }
  .review-table thead { display: none; }
  .review-table tbody { display: block; width: 100%; }
  .review-table tr {
    display: block;
    margin-bottom: 1.2em;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 1px 4px #0001;
    padding: 0.7em 0.5em;
    width: 100%;
    min-width: 0;
    box-sizing: border-box;
  }
  .review-table td {
    display: flex;
    width: 100%;
    border: none;
    padding: 0.4em 0.2em;
    align-items: flex-start;
    font-size: 1rem;
    min-width: 0;
    box-sizing: border-box;
  }
  .review-table td[data-label="操作"]::before { display: none !important; }
  .review-table td::before {
    content: attr(data-label);
    flex: 0 0 7.5em;
    color: #888;
    font-size: 0.93em;
    font-weight: 500;
    margin-right: 0.7em;
    min-width: 7.5em;
    text-align: left;
    white-space: nowrap;
  }
  .review-table .opcell { justify-content: flex-end; gap: 12px; }
  .review-table .opcell button svg {
    width: 2.2em !important;
    height: 2.2em !important;
    min-width: 36px;
    min-height: 36px;
    pointer-events: none;
  }
  .review-table .opcell button {
    min-width: 44px;
    min-height: 44px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
  }
}
`;
const API_URL = '/api/reviews';

function App() {
  // 編集開始
  const handleEdit = (r) => {
    setEditId(r.id);
    setEditTitle(r.title);
    setEditReview(r.review);
  };

  // 編集キャンセル
  const handleEditCancel = () => {
    setEditId(null);
    setEditTitle('');
    setEditReview('');
  };

  // 編集保存
  const handleEditSave = async (id) => {
    if (!editTitle.trim() || !editReview.trim()) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: editTitle, review: editReview })
      });
      if (!res.ok) throw new Error('更新に失敗しました');
      setEditId(null);
      setEditTitle('');
      setEditReview('');
      fetchReviews(search);
    } catch (e) {
      alert('更新に失敗しました');
    }
  };

  // 削除
  const handleDelete = async (id) => {
    if (!window.confirm('本当に削除しますか？')) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('削除に失敗しました');
      fetchReviews(search);
    } catch (e) {
      alert('削除に失敗しました');
    }
  };
  const [reviews, setReviews] = useState([]);
  const [title, setTitle] = useState('');
  const [review, setReview] = useState('');
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editReview, setEditReview] = useState('');

  // 一覧取得
  // 新規登録
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !review.trim()) return;
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, review })
      });
      if (!res.ok) throw new Error('登録に失敗しました');
      setTitle('');
      setReview('');
      fetchReviews(search);
    } catch (e) {
      alert('登録に失敗しました');
    }
  };
  const fetchReviews = async (q = '') => {
    setLoading(true);
    try {
      const url = q ? `${API_URL}?q=${encodeURIComponent(q)}` : API_URL;
      const res = await fetch(url);
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
  return (
    <div className="container">
      <h1 style={{ fontWeight: 'bold', fontSize: '2.3rem', letterSpacing: '0.04em', marginBottom: '0.2em', color: '#3a3a5a' }}>
        Book Review Hub
      </h1>
      <div style={{ fontSize: '1.1rem', color: '#888', marginBottom: '1.5em', fontWeight: 400 }}>
        Share your thoughts on books you read
      </div>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="title">書籍タイトル</label>
          <input
            id="title"
            type="text"
            placeholder="書籍タイトル"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="review">感想文</label>
          <textarea
            id="review"
            placeholder="感想文"
            value={review}
            onChange={e => setReview(e.target.value)}
            required
          ></textarea>
        </div>
        <button type="submit" title="登録" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5em', fontSize: '1.1em' }}>
          <FaRegSave size={22} style={{ marginRight: 6 }} /> 登録
        </button>
      </form>
      <div style={{ margin: '1.2em 0 1em', textAlign: 'right' }}>
        <input
          type="text"
          placeholder="検索ワード（タイトル・感想文）"
          value={search}
          onChange={e => {
            setSearch(e.target.value);
            fetchReviews(e.target.value);
          }}
          style={{ padding: '0.5em', minWidth: 220, fontSize: '1rem', borderRadius: 4, border: '1px solid #ccc' }}
        />
      </div>
      <hr />
      <h2>登録済み一覧</h2>
      {loading ? <p>読込中...</p> : (
        <>
          <style>{responsiveTableStyle}</style>
          <table className="review-table" style={{ width: '100%', borderCollapse: 'collapse', minWidth: '0', background: '#fff' }}>
            <thead>
              <tr style={{ background: '#f5f5fa' }}>
                <th style={{ padding: '0.5em', borderBottom: '1px solid #ddd', textAlign: 'left', width: '22%' }}>書籍タイトル</th>
                <th style={{ padding: '0.5em', borderBottom: '1px solid #ddd', textAlign: 'left', width: '38%' }}>感想文</th>
                <th style={{ padding: '0.5em', borderBottom: '1px solid #ddd', textAlign: 'right', width: '20%' }}>登録日時</th>
                <th style={{ padding: '0.5em', borderBottom: '1px solid #ddd', textAlign: 'right', width: '20%' }}>更新日時</th>
                <th style={{ padding: '0.5em', borderBottom: '1px solid #ddd', textAlign: 'center', width: '120px' }}>操作</th>
              </tr>
            </thead>
            <tbody>
              {[...reviews]
                .sort((a, b) => {
                  const aTime = new Date(a.updatedAt || a.createdAt || 0).getTime();
                  const bTime = new Date(b.updatedAt || b.createdAt || 0).getTime();
                  return bTime - aTime;
                })
                .map(r => (
                  <tr key={r.id} style={{ background: editId === r.id ? '#f0f4ff' : 'transparent' }}>
                    {editId === r.id ? (
                      <>
                        <td data-label="書籍タイトル" style={{ padding: '0.5em', verticalAlign: 'top' }}>
                          <input
                            type="text"
                            value={editTitle}
                            onChange={e => setEditTitle(e.target.value)}
                            style={{ width: '100%', fontSize: '1rem' }}
                          />
                        </td>
                        <td data-label="感想文" style={{ padding: '0.5em', verticalAlign: 'top' }}>
                          <textarea
                            value={editReview}
                            onChange={e => setEditReview(e.target.value)}
                            style={{ width: '100%', fontSize: '1rem', minHeight: 40 }}
                          />
                        </td>
                        <td data-label="登録日時" style={{ padding: '0.5em', textAlign: 'right', color: '#888', fontSize: '0.95em', verticalAlign: 'top' }}>
                          {r.createdAt ? new Date(r.createdAt).toLocaleString() : '-'}
                        </td>
                        <td data-label="更新日時" style={{ padding: '0.5em', textAlign: 'right', color: '#888', fontSize: '0.95em', verticalAlign: 'top' }}>
                          {r.updatedAt ? new Date(r.updatedAt).toLocaleString() : '-'}
                        </td>
                        <td data-label="操作" className="opcell" style={{ padding: '0.5em', textAlign: 'center', verticalAlign: 'top' }}>
                          <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
                            <button onClick={() => handleEditSave(r.id)} title="保存" style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: '#4b51c6' }}>
                              <FaRegSave size={22} />
                            </button>
                            <button onClick={handleEditCancel} title="キャンセル" style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: '#888' }}>
                              <MdCancel size={24} />
                            </button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td data-label="書籍タイトル" style={{ padding: '0.5em', verticalAlign: 'top', wordBreak: 'break-all', textAlign: 'left' }}>{r.title}</td>
                        <td data-label="感想文" style={{ padding: '0.5em', verticalAlign: 'top', wordBreak: 'break-all', textAlign: 'left' }}>{r.review}</td>
                        <td data-label="登録日時" style={{ padding: '0.5em', textAlign: 'right', color: '#888', fontSize: '0.95em', verticalAlign: 'top' }}>
                          {r.createdAt ? new Date(r.createdAt).toLocaleString() : '-'}
                        </td>
                        <td data-label="更新日時" style={{ padding: '0.5em', textAlign: 'right', color: '#888', fontSize: '0.95em', verticalAlign: 'top' }}>
                          {r.updatedAt ? new Date(r.updatedAt).toLocaleString() : '-'}
                        </td>
                        <td data-label="操作" className="opcell" style={{ padding: '0.5em', textAlign: 'center', verticalAlign: 'top' }}>
                          <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
                            <button onClick={() => handleEdit(r)} title="編集" style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: '#4b51c6' }}>
                              <MdEdit size={22} />
                            </button>
                            <button onClick={() => handleDelete(r.id)} title="削除" style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: '#d32f2f' }}>
                              <MdDeleteForever size={24} />
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
    {/* container divは既に1つ存在するため、重複を削除 */}

export default App;
