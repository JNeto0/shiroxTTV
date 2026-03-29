'use client';

import { useEffect, useState, useRef } from 'react';

const TTL_MS = 3 * 24 * 60 * 60 * 1000;
const platLabel = { ig: 'Instagram', tt: 'TikTok' };

export default function Home() {
  const [queue, setQueue] = useState([]);
  const [selectedPlatform, setSelectedPlatform] = useState('ig');
  const [urlInput, setUrlInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [playerIndex, setPlayerIndex] = useState(-1);
  const [playerEntry, setPlayerEntry] = useState(null);
  const [toast, setToast] = useState({ msg: '', isError: false, show: false });
  const [loading, setLoading] = useState(true);
  const toastTimeoutRef = useRef(null);

  // Carregar dados da API ao montar
  useEffect(() => {
    loadQueue();
    const interval = setInterval(loadQueue, 5000); // Recarregar a cada 5s
    return () => clearInterval(interval);
  }, []);

  async function loadQueue() {
    try {
      const res = await fetch('/api/videos');
      if (res.ok) {
        const data = await res.json();
        setQueue(data);
        setLoading(false);
      }
    } catch (error) {
      console.error('Erro ao carregar fila:', error);
    }
  }

  function showToast(msg, isError = false) {
    setToast({ msg, isError, show: true });
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => {
      setToast({ msg: '', isError: false, show: false });
    }, 3000);
  }

  function detectPlatform(url) {
    if (/instagram\.com/i.test(url)) return 'ig';
    if (/tiktok\.com/i.test(url)) return 'tt';
    return selectedPlatform;
  }

  async function submitVideo() {
    const url = urlInput.trim();
    const name = nameInput.trim() || 'Anônimo';

    if (!url || !/^https?:\/\//i.test(url)) {
      showToast('Link inválido!', true);
      return;
    }

    const plat = detectPlatform(url);
    if (plat !== 'ig' && plat !== 'tt') {
      showToast('Instagram ou TikTok!', true);
      return;
    }

    try {
      const res = await fetch('/api/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, name, plat }),
      });

      if (res.ok) {
        setUrlInput('');
        setNameInput('');
        showToast('Vídeo enviado! 🎬');
        await loadQueue();
      } else {
        showToast('Erro ao enviar vídeo', true);
      }
    } catch (error) {
      console.error('Erro:', error);
      showToast('Erro ao enviar', true);
    }
  }

  async function markReacted(id) {
    try {
      const entry = queue.find(e => e.id === id);
      if (!entry) return;

      const res = await fetch('/api/videos', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, reacted: !entry.reacted }),
      });

      if (res.ok) {
        await loadQueue();
        if (playerEntry?.id === id) {
          setPlayerEntry({ ...entry, reacted: !entry.reacted });
        }
      }
    } catch (error) {
      console.error('Erro:', error);
    }
  }

  async function deleteEntry(id) {
    try {
      const res = await fetch('/api/videos', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        showToast('Vídeo removido');
        await loadQueue();
      }
    } catch (error) {
      console.error('Erro:', error);
    }
  }

  async function openPlayer(idx) {
    const pending = queue.filter(e => !e.reacted);
    if (idx < 0 || idx >= pending.length) return;

    setPlayerIndex(idx);
    setPlayerEntry(pending[idx]);

    // Carregar embed do TikTok se necessário
    if (pending[idx].plat === 'tt') {
      if (window.tiktok && window.tiktok.embed && window.tiktok.embed.lib) {
        setTimeout(() => {
          try {
            window.tiktok.embed.lib.render(document.getElementById('modalPlayerArea'));
          } catch (e) {}
        }, 300);
      }
    }
  }

  function closePlayer() {
    setPlayerEntry(null);
    setPlayerIndex(-1);
  }

  function navPlayer(dir) {
    const pending = queue.filter(e => !e.reacted);
    const newIdx = playerIndex + dir;
    if (newIdx >= 0 && newIdx < pending.length) {
      openPlayer(newIdx);
    }
  }

  async function modalMarkReacted() {
    const pending = queue.filter(e => !e.reacted);
    if (playerIndex < 0 || playerIndex >= pending.length) return;

    await markReacted(pending[playerIndex].id);
    const newPending = queue.filter(e => !e.reacted);

    if (newPending.length === 0) {
      closePlayer();
    } else {
      openPlayer(Math.min(playerIndex, newPending.length - 1));
    }
  }

  function ttlPercent(entry) {
    return Math.max(0, Math.min(100, ((TTL_MS - (Date.now() - entry.createdAt)) / TTL_MS) * 100));
  }

  function ttlText(entry) {
    const r = TTL_MS - (Date.now() - entry.createdAt);
    if (r <= 0) return 'Expirado';
    const h = Math.floor(r / 3600000);
    return h >= 24 ? `${Math.floor(h / 24)}d ${h % 24}h` : `${h}h`;
  }

  function escHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  const pending = queue.filter(e => !e.reacted);
  const reacted = queue.filter(e => e.reacted);
  const all = [...pending, ...reacted];

  return (
    <>
      <div className="bg-orbs">
        <div className="orb orb1"></div>
        <div className="orb orb2"></div>
        <div className="orb orb3"></div>
      </div>

      <header>
        <div className="topbar">
          <div className="logo-area">
            <div className="logo-icon">SX</div>
            <div>
              <div className="logo-text">SHIROXBR</div>
              <div className="logo-sub">Fila de Reações</div>
            </div>
          </div>
          <nav className="nav-links">
            <a className="nav-link" href="https://discord.com/invite/D6c4JeBGHD" target="_blank" title="Discord">
              <svg viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>
            </a>
            <a className="nav-link" href="https://www.instagram.com/shirobrx/" target="_blank" title="Instagram">
              <svg viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
            </a>
          </nav>
        </div>
      </header>

      <div className="wrapper">
        <div className="hero">
          <div className="hero-grid-lines"></div>
          <div className="hero-avatar">
            <img src="https://shirox-io.vercel.app/perfil.enc" alt="Shirox" onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.textContent = 'SX'; }} />
          </div>
          <div className="hero-info">
            <div className="hero-live-badge"><div className="live-dot"></div>Streamer</div>
            <div className="hero-name">SHIROXBR</div>
            <div className="hero-desc">Manda o link do vídeo para o Shirox reagir na live! <strong>Instagram</strong> — só enviar abaixo.</div>
            <div className="hero-stats">
              <div className="stat"><div className="stat-val">{pending.length}</div><div className="stat-label">Na Fila</div></div>
              <div className="stat"><div className="stat-val cyan">{reacted.length}</div><div className="stat-label">Reagido</div></div>
            </div>
          </div>
        </div>

        <div className="section-header" style={{ marginTop: '40px' }}>
          <div className="section-title">Enviar Vídeo</div>
          <div className="section-line"></div>
        </div>

        <div className="submit-card">
          <h2>NOVO VÍDEO</h2>
          <p>Cole o link do Instagram ou TikTok abaixo 🎬</p>
          <div className="platform-icons">
            <div
              className={`plat-badge ig ${selectedPlatform === 'ig' ? 'active' : ''}`}
              onClick={() => setSelectedPlatform('ig')}
            >
              Instagram
            </div>
            <div
              className={`plat-badge tt ${selectedPlatform === 'tt' ? 'active' : ''}`}
              onClick={() => setSelectedPlatform('tt')}
            >
              TikTok
            </div>
          </div>
          <div className="form-row">
            <div className="form-group" style={{ flex: 2 }}>
              <label>Link do Vídeo</label>
              <input
                type="url"
                placeholder="https://..."
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && submitVideo()}
                autoComplete="off"
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Seu nome / nick</label>
              <input
                type="text"
                placeholder="ex: FanTop123"
                maxLength="30"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && submitVideo()}
                autoComplete="off"
              />
            </div>
          </div>
          <button className="btn-submit" onClick={submitVideo}>
            Enviar para a Fila
          </button>
        </div>

        <div className="section-header">
          <div className="section-title">Fila de Vídeos</div>
          <div className="section-line"></div>
          <div className="section-count">{pending.length} vídeo(s)</div>
        </div>

        <div id="queueList">
          {all.length === 0 ? (
            <div className="queue-empty">
              <div className="queue-empty-icon">📭</div>
              <p>Nenhum vídeo na fila ainda.</p>
            </div>
          ) : (
            all.map((entry, i) => (
              <div key={entry.id} className={`video-card ${entry.plat}`} style={{ opacity: entry.reacted ? 0.5 : 1 }}>
                <div className="card-num">{String(i + 1).padStart(2, '0')}</div>
                <div className="card-body">
                  <div className="card-top">
                    <span className={`plat-tag ${entry.plat}`}>{platLabel[entry.plat]}</span>
                    <span className="card-sender">@{escHtml(entry.name)}</span>
                  </div>
                  <span className="card-url">{escHtml(entry.url)}</span>
                  <div className="card-footer">
                    <div className="ttl-bar-wrap">
                      <div className="ttl-bar" style={{ width: `${ttlPercent(entry)}%` }}></div>
                    </div>
                    <span className="ttl-text">{entry.reacted ? '✅ Reagido' : ttlText(entry)}</span>
                  </div>
                </div>
                <div className="card-actions">
                  {!entry.reacted && pending.findIndex(p => p.id === entry.id) >= 0 && (
                    <button className="btn-play" onClick={() => openPlayer(pending.findIndex(p => p.id === entry.id))}>
                      ▶
                    </button>
                  )}
                  <button className="btn-icon react" onClick={() => markReacted(entry.id)}>
                    {entry.reacted ? '↩' : '✅'}
                  </button>
                  <button className="btn-icon danger" onClick={() => deleteEntry(entry.id)}>
                    ✕
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {playerEntry && (
        <div className="playerModal open">
          <div className="modal-backdrop" onClick={closePlayer}></div>
          <div className="modal-box">
            <div className="modal-header">
              <span className={`modal-plat-tag ${playerEntry.plat}`}>{platLabel[playerEntry.plat]}</span>
              <span className="modal-sender">@{playerEntry.name}</span>
              <span className="modal-url-text">{escHtml(playerEntry.url)}</span>
              <button className="modal-close" onClick={closePlayer}>✕</button>
            </div>
            <div className="modal-player-area" id="modalPlayerArea">
              {playerEntry.plat === 'ig' && (
                <div className="reel-wrap">
                  <div className="ig-iframe-wrap">
                    <iframe
                      src={playerEntry.url.split('?')[0].replace(/\/$/, '') + '/embed/'}
                      height="780"
                      scrolling="no"
                      allowTransparency="true"
                    ></iframe>
                  </div>
                </div>
              )}
              {playerEntry.plat === 'tt' && (
                <div className="reel-wrap">
                  <div className="tt-blockquote-wrap">
                    <iframe
                      src={`https://www.tiktok.com/embed/v2/${playerEntry.url.split('/').pop()}`}
                      width="100%"
                      height="800"
                      frameBorder="0"
                      allow="autoplay"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <div className="modal-nav">
                <button
                  className="btn-modal-nav"
                  disabled={playerIndex === 0}
                  onClick={() => navPlayer(-1)}
                >
                  ← Anterior
                </button>
                <button
                  className="btn-modal-nav"
                  disabled={playerIndex === pending.length - 1}
                  onClick={() => navPlayer(1)}
                >
                  Próximo →
                </button>
              </div>
              <span className="modal-pos">{playerIndex + 1} / {pending.length}</span>
              <button className="btn-modal-react" onClick={modalMarkReacted}>
                ✅ Marcar Reagido
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={`toast ${toast.show ? 'show' : ''} ${toast.isError ? 'error' : ''}`}>
        <span className="t-icon">{toast.isError ? '❌' : '✅'}</span>
        <span>{toast.msg}</span>
      </div>

      <script src="https://www.tiktok.com/embed.js" async></script>
    </>
  );
}
