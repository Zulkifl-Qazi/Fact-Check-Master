import React, { useEffect, useState } from 'react';

const AdminTweets = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('lf_sampleTweets');
      if (raw) {
        setItems(JSON.parse(raw));
      } else {
        fetch('/data/sample-tweets.json').then(r => r.json()).then(d => setItems(d)).catch(() => setItems([]));
      }
    } catch (e) {
      setItems([]);
    }
  }, []);

  const save = () => {
    localStorage.setItem('lf_sampleTweets', JSON.stringify(items));
    alert('Saved to localStorage (used as fallback content)');
  };

  return (
    <section className="py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <h2 className="text-2xl font-bold mb-4">Admin: Sample Tweets</h2>
        <p className="text-sm text-gray-600 mb-4">Edit the fallback tweets and save to localStorage for immediate local testing.</p>

        <div className="space-y-4">
          {items.map((it, idx) => (
            <div key={it.id || idx} className="p-4 border rounded">
              <input className="w-full p-2 mb-2" value={it.author} onChange={e => { const copy = [...items]; copy[idx].author = e.target.value; setItems(copy); }} />
              <input className="w-full p-2 mb-2" value={it.date} onChange={e => { const copy = [...items]; copy[idx].date = e.target.value; setItems(copy); }} />
              <textarea className="w-full p-2" value={it.text} onChange={e => { const copy = [...items]; copy[idx].text = e.target.value; setItems(copy); }} />
            </div>
          ))}
        </div>

        <div className="mt-4 flex gap-2">
          <button onClick={save} className="bg-purple-600 text-white px-4 py-2 rounded">Save</button>
        </div>
      </div>
    </section>
  );
};

export default AdminTweets;
