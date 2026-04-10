import { useState } from 'react';
import { Review, getReviewsByProduct } from '../../data/products';
import { useApp } from '../../contexts/AppContext';

function Stars({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <span>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ color: i <= rating ? '#f59e0b' : '#d1d5db', fontSize: `${size}px` }}>★</span>
      ))}
    </span>
  );
}

function ReviewItem({ review }: { review: Review }) {
  const [helpful, setHelpful] = useState(review.helpful);
  const [voted, setVoted] = useState(false);
  return (
    <div style={{ background: 'white', borderRadius: '10px', padding: '16px', marginBottom: '12px', border: '1px solid #eef0f3' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '10px' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: review.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: 700, color: 'white', flexShrink: 0 }}>
          {review.initials}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '14px', fontWeight: 700 }}>{review.name}</span>
            {review.verified && (
              <span style={{ fontSize: '11px', color: '#1a7c2e', background: '#edf7f0', padding: '2px 8px', borderRadius: '99px', fontWeight: 600 }}>
                ✅ مشتري موثق
              </span>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
            <Stars rating={review.rating} size={13} />
            <span style={{ fontSize: '12px', color: '#6b7280' }}>{review.date}</span>
          </div>
        </div>
      </div>
      <p style={{ fontSize: '13px', color: '#374151', lineHeight: 1.7 }}>{review.text}</p>
      <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '12px', color: '#6b7280' }}>هل كان مفيداً؟</span>
        <button
          onClick={() => { if (!voted) { setHelpful(h => h + 1); setVoted(true); } }}
          style={{
            padding: '4px 12px', background: voted ? '#edf7f0' : '#f4f6f8', border: `1px solid ${voted ? '#1a7c2e' : '#dde1e7'}`,
            borderRadius: '6px', cursor: voted ? 'default' : 'pointer', fontSize: '12px', fontWeight: 600,
            color: voted ? '#1a7c2e' : '#374151', fontFamily: 'Cairo, sans-serif',
          }}
        >
          👍 نعم ({helpful})
        </button>
      </div>
    </div>
  );
}

export default function ReviewSection({ productId }: { productId: number }) {
  const { showToast } = useApp();
  const reviews = getReviewsByProduct(productId);
  const [showForm, setShowForm] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newText, setNewText] = useState('');
  const [hoverRating, setHoverRating] = useState(0);

  const avgRating = reviews.length > 0 ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1) : '0';
  const ratingCounts = [5,4,3,2,1].map(r => ({ r, count: reviews.filter(rv => rv.rating === r).length }));

  const handleSubmit = () => {
    if (!newText.trim()) { showToast('الرجاء كتابة تقييمك', 'warning'); return; }
    showToast('شكراً! تم إرسال تقييمك بنجاح 🎉', 'success');
    setShowForm(false);
    setNewText('');
    setNewRating(5);
  };

  return (
    <div style={{ padding: '0 24px 32px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ fontSize: '17px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
          ⭐ تقييمات المشترين <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: 600 }}>({reviews.length} تقييم)</span>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{ padding: '9px 18px', background: '#1a7c2e', color: 'white', border: 'none', borderRadius: '8px', fontFamily: 'Cairo, sans-serif', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}
        >
          ✏️ أضف تقييمك
        </button>
      </div>

      {/* ملخص التقييمات */}
      {reviews.length > 0 && (
        <div style={{ display: 'flex', gap: '24px', background: '#f4f6f8', borderRadius: '12px', padding: '20px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <div style={{ textAlign: 'center', minWidth: '80px' }}>
            <div style={{ fontSize: '48px', fontWeight: 900, color: '#145c22', lineHeight: 1 }}>{avgRating}</div>
            <Stars rating={Math.round(Number(avgRating))} size={16} />
            <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>{reviews.length} تقييم</div>
          </div>
          <div style={{ flex: 1, minWidth: '160px' }}>
            {ratingCounts.map(({ r, count }) => (
              <div key={r} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, minWidth: '16px' }}>{r}</span>
                <span style={{ color: '#f59e0b', fontSize: '12px' }}>★</span>
                <div style={{ flex: 1, height: '8px', background: '#dde1e7', borderRadius: '99px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', background: '#f59e0b', borderRadius: '99px', width: reviews.length ? `${(count / reviews.length) * 100}%` : '0%', transition: 'width 0.5s ease' }} />
                </div>
                <span style={{ fontSize: '12px', color: '#6b7280', minWidth: '20px' }}>{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* نموذج إضافة تقييم */}
      {showForm && (
        <div style={{ background: '#edf7f0', borderRadius: '12px', padding: '20px', marginBottom: '20px', border: '1px solid #c8e6c9' }}>
          <div style={{ fontWeight: 800, marginBottom: '14px', fontSize: '15px' }}>✏️ اكتب تقييمك</div>
          <div style={{ marginBottom: '12px' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '8px' }}>تقييمك:</div>
            <div style={{ display: 'flex', gap: '6px' }}>
              {[1,2,3,4,5].map(i => (
                <span
                  key={i}
                  onMouseEnter={() => setHoverRating(i)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setNewRating(i)}
                  style={{ fontSize: '28px', cursor: 'pointer', color: i <= (hoverRating || newRating) ? '#f59e0b' : '#d1d5db', transition: 'color 0.15s' }}
                >★</span>
              ))}
            </div>
          </div>
          <textarea
            value={newText}
            onChange={e => setNewText(e.target.value)}
            placeholder="شارك تجربتك مع هذا المنتج..."
            style={{ width: '100%', minHeight: '100px', padding: '10px 12px', border: '1px solid #c8e6c9', borderRadius: '8px', fontFamily: 'Cairo, sans-serif', fontSize: '13px', resize: 'vertical', outline: 'none', background: 'white' }}
          />
          <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
            <button onClick={handleSubmit} style={{ padding: '9px 20px', background: '#1a7c2e', color: 'white', border: 'none', borderRadius: '8px', fontFamily: 'Cairo, sans-serif', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>
              إرسال التقييم
            </button>
            <button onClick={() => setShowForm(false)} style={{ padding: '9px 20px', background: 'white', color: '#374151', border: '1px solid #dde1e7', borderRadius: '8px', fontFamily: 'Cairo, sans-serif', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>
              إلغاء
            </button>
          </div>
        </div>
      )}

      {/* قائمة التقييمات */}
      {reviews.length > 0
        ? reviews.map(r => <ReviewItem key={r.id} review={r} />)
        : (
          <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>⭐</div>
            <div style={{ fontWeight: 700, marginBottom: '6px' }}>لا توجد تقييمات بعد</div>
            <div style={{ fontSize: '13px' }}>كن أول من يقيّم هذا المنتج!</div>
          </div>
        )
      }
    </div>
  );
}
