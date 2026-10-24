(function () {
  'use strict';

  // ---------- utilità ----------
  var $app = document.getElementById('app');
  var $fx = document.getElementById('fx');
  var CHIAVE = 'studio-v1';
  var GIORNI = ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'];
  var MESI = ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'];
  var CHIAVI_GIORNI = ['lun', 'mar', 'mer', 'gio', 'ven'];
  var STELLA = 'M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7-6.2-3.8-6.2 3.8 1.6-7L2 9.2l7.1-.6z';

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function pad(n) { return n < 10 ? '0' + n : '' + n; }
  function dataStr(d) { d = d || new Date(); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function daStr(s) { var p = s.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function piuGiorni(s, n) { var d = daStr(s); d.setDate(d.getDate() + n); return dataStr(d); }
  function oggi() { return dataStr(new Date()); }
  function giorniTra(a, b) { return Math.round((daStr(b) - daStr(a)) / 86400000); }
  function fmtData(s) { var d = daStr(s); var g = GIORNI[d.getDay()]; return g.charAt(0).toUpperCase() + g.slice(1) + ' ' + d.getDate() + ' ' + MESI[d.getMonth()]; }
  function fmtBreve(s) { var d = daStr(s); return GIORNI[d.getDay()].slice(0, 3).replace(/^./, function (c) { return c.toUpperCase(); }) + ' ' + d.getDate(); }
  function mmss(ms) { var s = Math.max(0, Math.ceil(ms / 1000)); return Math.floor(s / 60) + ':' + pad(s % 60); }
  function nome() { return (S.dati && S.dati.config && S.dati.config.nome) || ''; }
  function conNome(prima, dopo) { return nome() ? prima + ', ' + nome() + dopo : prima + dopo; }
  function saluto() {
    var h = new Date().getHours();
    var s = h < 13 ? 'Buongiorno' : h < 18 ? 'Buon pomeriggio' : 'Buonasera';
    return nome() ? s + ' ' + nome() : s;
  }
  function minuscola(s) { s = String(s || ''); return s.charAt(0).toLowerCase() + s.slice(1); }
  function mescola(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }

  function svgStella(size, fill, extra) {
    return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" aria-hidden="true"' + (extra || '') + '><path d="' + STELLA + '" fill="' + fill + '"></path></svg>';
  }
  var ICONE = {
    check: '<path d="M5 12l5 5 9-10"></path>',
    indietro: '<path d="M15 5l-7 7 7 7"></path>',
    orologio: '<circle cx="12" cy="12" r="9"></circle><path d="M12 7v5l3 2"></path>',
    libro: '<path d="M4 5h6a2 2 0 0 1 2 2v12a2 2 0 0 0-2-2H4z"></path><path d="M20 5h-6a2 2 0 0 0-2 2v12a2 2 0 0 1 2-2h6z"></path>',
    librochiuso: '<path d="M4 5h6a2 2 0 0 1 2 2v12a2 2 0 0 0-2-2H4z"></path><path d="M20 5h-6a2 2 0 0 0-2 2v12a2 2 0 0 1 2-2h6z"></path><path d="M3 3l18 18"></path>',
    persona: '<circle cx="12" cy="8" r="4"></circle><path d="M4 21c1-4 4-6 8-6s7 2 8 6"></path>',
    lucchetto: '<rect x="5" y="11" width="14" height="10" rx="2"></rect><path d="M8 11V7a4 4 0 0 1 8 0v4"></path>',
    calendario: '<rect x="3" y="5" width="18" height="16" rx="3"></rect><path d="M3 10h18M8 3v4M16 3v4"></path>',
    grafico: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"></path>',
    fulmine: '<path d="M13 2L4 14h7l-1 8 9-12h-7z"></path>',
    freccia: '<path d="M5 12h14"></path><path d="M13 6l6 6-6 6"></path>',
    scarica: '<path d="M12 4v11"></path><path d="M7 10l5 5 5-5"></path><path d="M5 20h14"></path>',
    zaino: '<path d="M6 9a6 6 0 0 1 12 0v10a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2z"></path><path d="M9 6V4a3 3 0 0 1 6 0v2"></path><path d="M6 14h12"></path><path d="M10 14v2h4v-2"></path>'
  };
  function ico(nome, size, colore, spessore) {
    return '<svg width="' + (size || 22) + '" height="' + (size || 22) + '" viewBox="0 0 24 24" fill="none" stroke="' + (colore || 'currentColor') + '" stroke-width="' + (spessore || 2.4) + '" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICONE[nome] + '</svg>';
  }

  // ---------- memoria sul tablet ----------
  var store = { v: 1, sess: {}, coda: [], ripLog: [], ripFatto: '', suono: true, fatti: {} };
  try {
    var salvato = JSON.parse(localStorage.getItem(CHIAVE) || 'null');
    if (salvato && salvato.v === 1) store = Object.assign(store, salvato);
  } catch (e) { /* memoria non disponibile: si lavora in memoria */ }
  function salva() { try { localStorage.setItem(CHIAVE, JSON.stringify(store)); } catch (e) { /* ignorato */ } }

  function prog(id) {
    if (!store.sess[id]) store.sess[id] = { pezzi: [], quiz: null, fine: null };
    return store.sess[id];
  }
  function pz(id, i) {
    var p = prog(id);
    if (!p.pezzi[i]) p.pezzi[i] = { inizio: null, data: null, fine: null, ms: 0, parole: ['', '', ''], ipotesi: '', autov: [], papa: [], bloccata: 0, lungo: 0, extra: 0, controllato: false };
    return p.pezzi[i];
  }

  // ---------- suoni leggeri ----------
  var actx = null;
  function suona(note) {
    if (!store.suono) return;
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      var t = actx.currentTime;
      note.forEach(function (f, i) {
        var o = actx.createOscillator(), g = actx.createGain();
        o.type = 'sine'; o.frequency.value = f;
        g.gain.setValueAtTime(0.0001, t + i * 0.12);
        g.gain.exponentialRampToValueAtTime(0.18, t + i * 0.12 + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t + i * 0.12 + 0.5);
        o.connect(g); g.connect(actx.destination);
        o.start(t + i * 0.12); o.stop(t + i * 0.12 + 0.55);
      });
    } catch (e) { /* audio non disponibile */ }
  }
  var SUONO_FINE = [660, 880];
  var SUONO_STELLA = [523, 659, 784, 1047];

  // ---------- stato dell'app ----------
  var S = { dati: null, view: 'caricamento', sessId: null, pi: 0, qi: 0, reveal: false, papa: false, aiuto: false, timer: null, quiz: null, rip: null, sett: null };

  function sessioni() { return (S.dati.sessioni.sessioni || []).slice().sort(function (a, b) { return (a.data || '').localeCompare(b.data || ''); }); }
  function sessione(id) { return sessioni().filter(function (s) { return s.id === id; })[0]; }
  function sessioneAttiva() { return sessioni().filter(function (s) { return !prog(s.id).fine; })[0] || null; }
  function elencoCompiti() {
    var lista = ((S.dati.compiti && S.dati.compiti.compiti) || []).slice();
    var collegate = {};
    lista.forEach(function (c) { if (c.sessione) collegate[c.sessione] = true; });
    sessioni().forEach(function (s) {
      if (!collegate[s.id]) lista.push({ id: 'sessione-' + s.id, consegna: s.data, materia: s.materia, testo: s.titolo + (s.dove ? ' (' + s.dove.toLowerCase() + ')' : ''), sessione: s.id });
    });
    return lista.sort(function (a, b) { return a.consegna.localeCompare(b.consegna); });
  }
  function compitoFatto(c) {
    return !!(store.fatti[c.id] || (c.sessione && store.sess[c.sessione] && store.sess[c.sessione].fine));
  }
  function primoPezzoDaFare(s) { for (var i = 0; i < s.pezzi.length; i++) { if (!pz(s.id, i).fine) return i; } return s.pezzi.length; }
  function nomeMateria(m) { return m ? m.charAt(0).toUpperCase() + m.slice(1) : ''; }
  function classeMateria(m) { m = (m || '').toLowerCase(); return m === 'storia' || m === 'geografia' ? m : 'altro'; }
  function cfg(k, def) { return S.dati.config && S.dati.config[k] != null ? S.dati.config[k] : def; }

  // ---------- caricamento dati ----------
  function carica(nome) {
    return fetch('data/' + nome + '.json', { cache: 'no-store' }).then(function (r) {
      if (!r.ok) throw new Error(nome);
      return r.json();
    });
  }
  Promise.all([carica('sessioni'), carica('orario'), carica('config'), carica('compiti').catch(function () { return { compiti: [] }; })]).then(function (r) {
    S.dati = { sessioni: r[0], orario: r[1], config: r[2], compiti: r[3] };
    if (!store.fatti) store.fatti = {};
    vai('oggi');
  }).catch(function () {
    $app.innerHTML = '<div class="screen"><h1 class="title">Non riesco a caricare i dati</h1><p class="muted" style="font-size:20px">Controlla che il tablet sia connesso a internet e riapri l\'app.</p></div>';
  });

  // ---------- navigazione ----------
  function vai(view) {
    fermaTimer();
    S.view = view;
    render();
    window.scrollTo(0, 0);
  }
  function render() {
    document.body.className = S.view === 'pausa' ? 'pausa' : '';
    var f = VISTE[S.view];
    $app.innerHTML = f ? f() : '';
    if (S.view === 'lettura' || S.view === 'pausa' || S.view === 'ripasso') aggiornaTimer();
  }
  function toast(testo) {
    var t = document.createElement('div');
    t.className = 'toast'; t.setAttribute('role', 'status'); t.textContent = testo;
    document.body.appendChild(t);
    setTimeout(function () { t.classList.add('esce'); setTimeout(function () { t.remove(); }, 450); }, 3200);
  }

  // ---------- timer morbido ----------
  function avviaTimer(durataMs) {
    fermaTimer();
    S.timer = { start: Date.now(), durata: durataMs, finito: false, id: setInterval(aggiornaTimer, 1000) };
  }
  function fermaTimer() { if (S.timer && S.timer.id) clearInterval(S.timer.id); if (S.timer) S.timer.id = null; }
  function trascorso() { return S.timer ? Date.now() - S.timer.start : 0; }
  function aggiornaTimer() {
    if (!S.timer) return;
    var frac = Math.min(1, trascorso() / S.timer.durata);
    var r = document.getElementById('riempi'), st = document.getElementById('stellaBarra'), tx = document.getElementById('tempoTxt');
    if (r) r.style.width = (frac * 100) + '%';
    if (st) st.style.left = (frac * 100) + '%';
    if (S.view === 'pausa') {
      var c = document.getElementById('cerchioArco'), m = document.getElementById('pausaTempo');
      if (c) c.style.strokeDashoffset = String(691 * frac);
      if (m) m.textContent = mmss(S.timer.durata - trascorso());
    }
    if (frac >= 1 && !S.timer.finito) {
      S.timer.finito = true;
      suona(SUONO_FINE);
      if (S.view === 'lettura' && tx) tx.textContent = 'Tempo finito: chiudi la frase e passa alla verifica';
      if (S.view === 'ripasso' && tx) tx.textContent = 'Tempo finito: puoi chiudere questa domanda';
      if (S.view === 'pausa') {
        var b = document.getElementById('riprendo'), msg = document.getElementById('pausaMsg');
        if (b) b.disabled = false;
        if (msg) msg.textContent = 'Pausa finita. Quando sei pronta, riprendi.';
        if (m) m.textContent = '0:00';
      }
    }
  }

  // ---------- effetti di incoraggiamento ----------
  function fxPezzo(rimasti) {
    var colori = ['#FFD45C', '#F26B4F', '#5B3FC4', '#FFD45C', '#12857C', '#FFD45C', '#F26B4F', '#5B3FC4'];
    var dir = [[-170, -110], [180, -100], [-230, 30], [240, 40], [-120, 120], [130, 130], [10, -150], [-20, 160]];
    var stelle = dir.map(function (d, i) { return svgStella(22 + (i % 3) * 6, colori[i], ' class="burst" style="--dx:' + d[0] + 'px;--dy:' + d[1] + 'px"'); }).join('');
    var testo = rimasti > 0 ? 'Ancora ' + rimasti + (rimasti === 1 ? ' pezzo' : ' pezzi') + ' e hai finito per oggi.' : 'Adesso il quiz, poi hai finito.';
    $fx.innerHTML = '<div class="fx-msg rise"><b>' + conNome('Pezzo fatto', '!') + '</b><span>' + testo + '</span></div><div class="fx-centro">' + stelle + '</div>';
    suona(SUONO_STELLA);
    pulisciFx(2600);
  }
  function fxRecuperata(domanda) {
    $fx.innerHTML = '<div class="fx-msg rise"><span class="fx-stella-grande spinin">' + svgStella(64, '#2B1B4A') + '</span><b>' + conNome('Questa adesso la sai', '') + '</b><span>' + esc(domanda) + '</span></div>';
    suona(SUONO_STELLA);
    pulisciFx(2800);
  }
  function fxSessione(s, fatti, tot) {
    var colori = ['#FFD45C', '#F26B4F', '#7CE0D3'];
    var stelle = '';
    for (var i = 0; i < 12; i++) stelle += svgStella(20 + (i % 3) * 6, colori[i % 3], ' class="fall" style="left:' + (4 + i * 8) + '%;animation-delay:' + ((i * 0.37) % 1.4).toFixed(2) + 's"');
    $fx.innerHTML = '<div class="fx-pieno" role="dialog" aria-label="Sessione finita">' + stelle +
      '<span class="chip rise" style="background:#FFD45C;color:#2B1B4A;align-self:center">' + esc(nomeMateria(s.materia)) + ', ' + fatti + ' pezzi su ' + tot + '</span>' +
      '<h2 class="rise">' + conNome('Brava', '!') + '</h2><p class="rise" style="font-family:var(--titoli);font-size:30px;color:#fff">Sessione finita</p><p class="rise2">Domani ti aspetta il ripasso lampo, ' + cfg('minutiRipasso', 3) + ' minuti.</p>' +
      '<button class="btn bianco rise2" data-a="chiudiFx" style="margin-top:12px">Vedi com\'è andata</button></div>';
    suona(SUONO_STELLA);
  }
  var fxTimer = null;
  function pulisciFx(ms) { clearTimeout(fxTimer); fxTimer = setTimeout(function () { $fx.innerHTML = ''; }, ms); }

  // ---------- coda del ripasso ----------
  function chiave(sid, pi, qi) { return sid + '|' + pi + '|' + qi; }
  function inCoda(item) {
    var c = store.coda.filter(function (x) { return x.k === item.k; })[0];
    if (c) { c.box = 0; c.due = piuGiorni(oggi(), 1); return; }
    item.box = 0; item.due = piuGiorni(oggi(), 1); item.sbagliata = true;
    store.coda.push(item);
  }
  function ripassoPronto() {
    var t = oggi();
    var dovute = store.coda.filter(function (c) { return c.due <= t; }).slice(0, 6);
    var items = dovute.map(function (c) { return { k: c.k, d: c.d, r: c.r, materia: c.materia, coda: true }; });
    if (items.length < 3) {
      var extra = [];
      sessioni().forEach(function (s) {
        (s.pezzi || []).forEach(function (pezzo, i) {
          var p = prog(s.id).pezzi[i];
          if (!p || !p.fine || p.data === t) return;
          (pezzo.domande || []).forEach(function (q, j) {
            if (p.autov[j] === 'si' && !store.coda.some(function (c) { return c.k === chiave(s.id, i, j); })) {
              extra.push({ k: chiave(s.id, i, j), d: q.d, r: q.r, materia: s.materia, coda: false, data: p.data });
            }
          });
        });
      });
      extra.sort(function (a, b) { return (b.data || '').localeCompare(a.data || ''); });
      var recenti = extra.filter(function (x) { return x.data === (extra[0] && extra[0].data); });
      items = items.concat(mescola(recenti).slice(0, 3 - items.length));
    }
    return items;
  }

  // ---------- componenti ----------
  function passi(attivo) {
    var nomi = ['Anteprima', 'Lettura', 'Verifica', 'Pausa'];
    return '<div class="tabs" aria-label="Fasi del pezzo">' + nomi.map(function (n) {
      return '<span' + (n === attivo ? ' class="attivo" aria-current="step"' : '') + '>' + n + '</span>';
    }).join('') + '</div>';
  }
  function testata(s, attivo) {
    return '<div class="row between wrap">' +
      '<button class="link" data-a="home">' + ico('indietro', 20) + ' Oggi</button>' + passi(attivo) +
      '<span class="subtitle" style="font-size:20px">Pezzo ' + (S.pi + 1) + ' di ' + s.pezzi.length + '</span></div>';
  }
  function percorso(s) {
    var n = s.pezzi.length, fatti = 0, ora = primoPezzoDaFare(s);
    s.pezzi.forEach(function (_, i) { if (pz(s.id, i).fine) fatti++; });
    var margine = 100 / (2 * n);
    var pieno = n > 1 ? Math.min(fatti, n - 1) / (n - 1) * (100 - 2 * margine) : 0;
    var html = '<div class="percorso"><div class="linea" style="left:' + margine + '%;right:' + margine + '%;background:#F3EEFF"></div>' +
      '<div class="linea" style="left:' + margine + '%;width:' + pieno + '%;background:#5B3FC4"></div>';
    s.pezzi.forEach(function (pezzo, i) {
      var p = pz(s.id, i);
      var cls = p.fine ? 'fatta' : (i === ora ? 'ora' : '');
      var dentro = p.fine ? ico('check', 28, '#fff', 3) : (i === n - 1 && !p.fine && i !== ora ? svgStella(28, '#E0A800') : String(i + 1));
      html += '<div class="tappa ' + cls + '"><div class="pallino">' + dentro + '</div><span>' + esc(pezzo.titolo) + '</span></div>';
    });
    return html + '</div>';
  }
  function prossimeVerifiche(giorni) {
    var t = oggi();
    return (S.dati.orario.verifiche || []).filter(function (v) { var g = giorniTra(t, v.data); return g >= 0 && g <= giorni; })
      .sort(function (a, b) { return a.data.localeCompare(b.data); });
  }
  function prossimoGiornoScuola() {
    var d = oggi();
    do { d = piuGiorni(d, 1); } while (daStr(d).getDay() === 0 || daStr(d).getDay() === 6);
    return d;
  }
  function notePer(data) {
    return (S.dati.orario.note || []).filter(function (n) { return n.data === data; })
      .sort(function (a, b) { return (a.ora || 0) - (b.ora || 0); });
  }
  function quando(data) {
    var g = giorniTra(oggi(), data);
    return g === 0 ? 'oggi' : g === 1 ? 'domani' : 'tra ' + g + ' giorni';
  }

  // ---------- viste ----------
  var VISTE = {};

  function rigaCompito(c) {
    var fatto = compitoFatto(c);
    var studio = '';
    if (c.sessione && sessione(c.sessione)) {
      var ss = sessione(c.sessione), pr = prog(ss.id);
      var fattiP = ss.pezzi.filter(function (_, k) { return pz(ss.id, k).fine; }).length;
      var testoBtn = pr.fine ? 'Rivedi' : fattiP ? 'Continua' : 'Studia con l\'app';
      studio = '<button class="btn primario piccolo" data-a="studia" data-s="' + esc(ss.id) + '">' + testoBtn + '</button>';
    }
    return '<div class="compito' + (fatto ? ' fatto' : '') + '">' +
      '<button class="spunta" data-a="spunta" data-id="' + esc(c.id) + '" aria-pressed="' + !!fatto + '" aria-label="' + (fatto ? 'Segna come da fare' : 'Segna come fatto') + '">' + ico('check', 24, '#fff', 3.2) + '</button>' +
      '<div class="testo"><span class="chip mini ' + classeMateria(c.materia) + '">' + esc(nomeMateria(c.materia)) + '</span><span class="t">' + esc(c.testo) + '</span>' +
      (c.nota ? '<span class="muted small">' + esc(c.nota) + '</span>' : '') + '</div>' + studio + '</div>';
  }

  VISTE.oggi = function () {
    var giorno = prossimoGiornoScuola();
    var etichetta = giorniTra(oggi(), giorno) === 1 ? 'domani' : fmtData(giorno).split(' ')[0].toLowerCase();
    var tutti = elencoCompiti();
    var perGiorno = tutti.filter(function (c) { return c.consegna === giorno; });
    var indietro = tutti.filter(function (c) { return c.consegna <= oggi() && c.consegna >= piuGiorni(oggi(), -7) && !compitoFatto(c); });
    var lista = perGiorno;
    var fattiN = lista.filter(compitoFatto).length;
    var finito = lista.length && fattiN === lista.length;
    var settimanaFine = piuGiorni(oggi(), 7);
    var avanti = tutti.filter(function (c) { return c.consegna > giorno && c.consegna <= settimanaFine; });

    var guidate = lista.concat(indietro).filter(function (c) { return c.sessione && sessione(c.sessione) && !compitoFatto(c); });
    var materieGuidate = [];
    guidate.forEach(function (c) { var m = minuscola(nomeMateria(c.materia)); if (materieGuidate.indexOf(m) < 0) materieGuidate.push(m); });
    var sotto = !lista.length ? 'Niente compiti per ' + etichetta + '.'
      : finito ? 'Per ' + etichetta + ' hai finito tutto.'
      : materieGuidate.length ? 'Oggi studiamo ' + materieGuidate.join(' e ') + ', poi gli altri compiti per ' + etichetta + '.'
      : 'Ecco i compiti per ' + etichetta + '.';
    var head = '<div class="row between wrap" style="align-items:flex-end">' +
      '<div class="col" style="gap:4px"><p class="muted" style="font-size:18px">' + fmtData(oggi()) + '</p>' +
      '<h1 class="big-title">' + saluto() + (finito ? '!' : '') + '</h1><p style="font-size:22px">' + esc(sotto) + '</p></div>' +
      '<span class="pill">' + ico('orologio', 22, '#5B3FC4') + '<span>Libera alle <b>' + esc(cfg('oraFine', '17:30')) + '</b></span></span></div>';

    var corpo = lista.length
      ? lista.map(rigaCompito).join('')
      : '<p style="font-size:20px" class="muted">Niente da fare per ' + etichetta + '.</p>';
    var giorniAvanti = [];
    avanti.forEach(function (c) { if (giorniAvanti.indexOf(c.consegna) < 0) giorniAvanti.push(c.consegna); });
    var gruppi = giorniAvanti.map(function (g) {
      var del = avanti.filter(function (c) { return c.consegna === g; });
      var nf = del.filter(compitoFatto).length;
      var aperto = S.aperti && S.aperti[g];
      return '<button class="giorno-avanti" data-a="apri" data-g="' + g + '" aria-expanded="' + !!aperto + '"><span>Per ' + esc(fmtData(g).toLowerCase()) + '</span><span class="muted">' + nf + ' su ' + del.length + ' fatti</span></button>' +
        (aperto ? del.map(rigaCompito).join('') : '');
    }).join('');
    var rimasti = indietro.length
      ? '<p class="label" style="margin-top:14px">Rimasti indietro</p>' + indietro.map(rigaCompito).join('')
      : '';
    var sinistra = '<div class="card" style="gap:6px"><div class="row between wrap"><h2 class="subtitle" style="font-weight:700;font-size:28px">Per ' + esc(etichetta) + '</h2>' +
      (lista.length ? '<span class="pill" style="box-shadow:none;background:#F3EEFF">' + fattiN + ' su ' + lista.length + ' fatti</span>' : '') + '</div>' +
      corpo + rimasti + (gruppi ? '<h3 class="subtitle" style="margin-top:18px">Più avanti</h3>' + gruppi : '') + '</div>';

    var items = ripassoPronto();
    var rip = store.ripFatto === oggi()
      ? '<div class="card tenue"><div class="row">' + ico('check', 26, '#5B3FC4', 3) + '<h3 class="subtitle">Ripasso lampo fatto</h3></div><p class="muted" style="font-size:17px">Ci vediamo domani.</p></div>'
      : items.length
        ? '<div class="card giallo"><div class="row">' + ico('fulmine', 28, '#2B1B4A', 0.1).replace('fill="none"', 'fill="#2B1B4A"') + '<h3 class="subtitle" style="font-weight:700">Ripasso lampo</h3></div>' +
          '<p style="font-size:18px;line-height:1.4">' + cfg('minutiRipasso', 3) + ' minuti a libro chiuso, ' + items.length + (items.length === 1 ? ' domanda' : ' domande') + '. Fallo prima di studiare.</p>' +
          '<button class="btn scuro piccolo" data-a="ripasso" style="align-self:flex-start">Vai</button></div>'
        : '';

    var perMateria = {};
    store.coda.forEach(function (c) { perMateria[c.materia] = (perMateria[c.materia] || 0) + 1; });
    var daRip = Object.keys(perMateria).length
      ? '<div class="card"><h3 class="subtitle">Da ripassare</h3>' + Object.keys(perMateria).map(function (m) {
          var cm = classeMateria(m);
          var bg = cm === 'storia' ? '#FFE3DA' : cm === 'geografia' ? '#D8F3EF' : '#F3EEFF';
          var fg = cm === 'storia' ? '#A8301A' : cm === 'geografia' ? '#0B5A54' : '#5B3FC4';
          return '<div class="row" style="background:' + bg + ';border-radius:18px;padding:12px 16px;gap:14px"><b style="font-family:var(--titoli);font-size:30px;color:' + fg + '">' + perMateria[m] + '</b><span style="font-size:18px">' + (perMateria[m] === 1 ? 'domanda' : 'domande') + ' di ' + esc(m.toLowerCase()) + '</span></div>';
        }).join('') + '<p class="muted small">Tornano finché non le sai.</p></div>'
      : '';

    var ver = prossimeVerifiche(7).slice(0, 2);
    var arrivo = ver.length
      ? '<div class="card"><h3 class="subtitle">In arrivo</h3>' + ver.map(function (v) {
          return '<div class="evento" style="background:#FFF0B8"><span class="muted small">' + esc(fmtData(v.data)) + '</span><b>' + esc(v.tipo) + ' di ' + esc(v.materia.toLowerCase()) + '</b><span class="small">' + quando(v.data) + '</span></div>';
        }).join('') + '</div>'
      : '';

    var giornoZaino = prossimoGiornoScuola();
    var daPortare = notePer(giornoZaino);
    var zaino = daPortare.length
      ? '<div class="card verde" style="gap:10px"><div class="row">' + ico('zaino', 26, '#0B5A54') + '<h3 class="subtitle" style="font-weight:700">' + (giorniTra(oggi(), giornoZaino) === 1 ? 'Domani' : esc(fmtData(giornoZaino).split(' ')[0])) + ' porta</h3></div>' +
        daPortare.map(function (n) { return '<p style="font-size:18px;line-height:1.35"><b>' + esc(n.materia) + ':</b> ' + esc(n.testo) + '</p>'; }).join('') + '</div>'
      : '';

    var nav = '<div class="row wrap no-print" style="justify-content:flex-end">' +
      '<button class="link" data-a="settimana">' + ico('calendario', 20) + ' La mia settimana</button>' +
      '<button class="link trasparente" data-a="registro">' + ico('grafico', 20) + ' Per papà</button></div>';

    return '<div class="screen">' + head + '<div class="grid-3">' + sinistra + '<div class="col" style="gap:22px">' + rip + zaino + arrivo + daRip + '</div></div>' + nav + '</div>';
  };

  VISTE.sessione = function () {
    var s = sessione(S.sessId);
    if (!s) return VISTE.oggi();
    var i = primoPezzoDaFare(s);
    var finiti = i >= s.pezzi.length;
    var iniziato = s.pezzi.some(function (_, k) { return pz(s.id, k).inizio; });
    var pr = prog(s.id);
    var cta = pr.fine
      ? '<button class="btn primario" data-a="vediRisultato">Com\'è andata</button><div class="col" style="gap:2px"><b style="font-size:19px">Sessione finita</b><span class="muted small">Le domande da ripassare tornano nel ripasso lampo</span></div>'
      : finiti
        ? '<button class="btn primario" data-a="quiz">Al quiz!</button><div class="col" style="gap:2px"><b style="font-size:19px">Pezzi finiti</b><span class="muted small">Manca solo il quiz</span></div>'
        : '<button class="btn primario" data-a="pezzo" data-i="' + i + '">' + (iniziato ? 'Continua' : 'Si parte!') + '</button><div class="col" style="gap:2px"><b style="font-size:19px">Pezzo ' + (i + 1) + ': ' + esc(s.pezzi[i].titolo) + '</b><span class="muted small">' + (s.pezzi[i].minuti || 8) + ' minuti di lettura, poi ti verifichi</span></div>';
    return '<div class="screen"><button class="link indietro" data-a="home">' + ico('indietro', 20) + ' Oggi</button>' +
      '<div class="card" style="flex-grow:1"><div class="row wrap"><span class="chip ' + classeMateria(s.materia) + '">' + esc(nomeMateria(s.materia)) + '</span><span class="muted" style="font-size:17px">' + esc(s.dove || '') + '</span></div>' +
      '<h1 class="title" style="font-weight:600">' + esc(s.titolo) + '</h1>' + percorso(s) +
      '<div class="row wrap" style="margin-top:auto;background:#FFE3DA;border-radius:24px;padding:16px 18px;gap:18px">' + cta + '</div></div></div>';
  };

  VISTE.anteprima = function () {
    var s = sessione(S.sessId), pezzo = s.pezzi[S.pi], p = pz(s.id, S.pi);
    return '<div class="screen">' + testata(s, 'Anteprima') +
      '<div class="card" style="flex-grow:1;max-width:860px;width:100%;align-self:center">' +
      '<span class="chip ' + classeMateria(s.materia) + '">' + esc(nomeMateria(s.materia)) + '</span>' +
      '<h1 class="title">' + esc(pezzo.titolo) + '</h1>' +
      '<div class="istruzione"><span class="icona-q">' + ico('libro', 28, '#fff', 2) + '</span><p>' + esc(pezzo.dove || '') + '</p></div>' +
      '<p style="font-size:22px;line-height:1.45">' + esc(pezzo.anteprima || 'Guarda titolo, immagini e cartine. Di cosa parlerà?') + '</p>' +
      '<label for="ipotesi" class="muted" style="font-size:16px">Secondo me parla di... (se vuoi)</label>' +
      '<input id="ipotesi" data-campo="ipotesi" value="' + esc(p.ipotesi) + '" style="font-family:var(--titoli);font-size:22px;padding:14px 18px;border:3px dashed #E5D7F7;border-radius:18px;width:100%">' +
      '<button class="btn primario" data-a="leggi" style="align-self:flex-start;margin-top:auto">Inizia a leggere</button></div></div>';
  };

  VISTE.lettura = function () {
    var s = sessione(S.sessId), pezzo = s.pezzi[S.pi], p = pz(s.id, S.pi);
    var minuti = Math.round(S.timer.durata / 60000);
    var aiuto = S.aiuto
      ? '<div class="aiuto"><p class="label">Se ti sei bloccata</p><p>Rileggi il titolo e la prima frase. Poi leggi una frase alla volta e chiediti: chi? cosa succede? Se proprio non va, passa alla verifica: papà vedrà il punto nel registro.</p></div>'
      : '';
    var campi = [0, 1, 2].map(function (k) {
      return '<div class="parola"><label for="k' + k + '">Parola ' + (k + 1) + '</label><input id="k' + k + '" data-k="' + k + '" autocomplete="off" autocapitalize="off" placeholder="scrivi qui" value="' + esc(p.parole[k] || '') + '"></div>';
    }).join('');
    var cerca = classeMateria(s.materia) === 'geografia'
      ? 'Dove si trova? Com\'è il territorio? Come vivono le persone?'
      : 'Chi? Cosa succede? Perché? Cosa cambia dopo? Che data?';
    return '<div class="screen">' + testata(s, 'Lettura') +
      '<div class="grid-5">' +
      '<div class="card"><span class="chip ' + classeMateria(s.materia) + '">' + esc(nomeMateria(s.materia)) + '</span>' +
      '<h1 class="title">' + esc(pezzo.titolo) + '</h1>' +
      '<div class="istruzione"><span class="icona-q">' + ico('libro', 28, '#fff', 2) + '</span><p>' + esc(pezzo.dove || '') + '</p></div>' +
      '<div class="col" style="gap:12px;margin-top:6px"><div class="row between" style="font-size:18px"><b id="tempoTxt">Stai andando bene</b><span class="muted">' + minuti + ' minuti in tutto</span></div>' +
      '<div class="barra"><div class="riempi" id="riempi" style="width:0%"></div><span class="stella" id="stellaBarra" style="left:0%">' + svgStella(24, '#2B1B4A') + '</span></div>' +
      '<div class="row wrap" style="margin-top:8px"><button class="link" data-a="piu2">+2 minuti</button><button class="link" data-a="lungo">È troppo lungo</button></div></div>' +
      aiuto +
      '<div class="row wrap" style="margin-top:auto;gap:14px"><button class="btn primario" data-a="verifica">Fatto! Mi verifico</button><button class="btn bordo" data-a="bloccata" style="font-size:20px">Mi sono bloccata</button></div></div>' +
      '<div class="card viola"><h2 class="subtitle" style="font-size:28px;font-weight:700">Le tue 3 parole</h2><p style="font-size:17px;color:#E5DEFF">Quelle che ti servono per raccontarlo a libro chiuso.</p>' + campi +
      '<div class="box-domande" style="margin-top:auto"><p class="label">Mentre leggi, cerca</p><p>' + cerca + '</p></div></div>' +
      '</div></div>';
  };

  VISTE.verifica = function () {
    var s = sessione(S.sessId), pezzo = s.pezzi[S.pi], p = pz(s.id, S.pi);
    var dom = pezzo.domande || [];
    var segnate = dom.filter(function (_, j) { return p.autov[j]; }).length;
    var finito = segnate === dom.length;
    var nomiEsito = { si: 'Lo sapevo', parte: 'In parte', no: 'Non ancora' };
    var lista = dom.map(function (q, j) {
      if (p.autov[j] && !(S.papa && j === S.qi && !p.papa[j])) {
        return '<div class="domanda ' + p.autov[j] + '"><div class="testo"><b>' + esc(q.d) + '</b><span>' + esc(q.r) + '</span></div><span class="esito ' + p.autov[j] + '">' + nomiEsito[p.autov[j]] + '</span></div>';
      }
      if (j === S.qi) {
        var corpo;
        if (!S.reveal) {
          corpo = '<p class="muted" style="font-size:18px">Rispondi a voce alta, poi controlla.</p><button class="btn giallo piccolo" data-a="mostra" style="align-self:flex-start">Mostra la risposta</button>';
        } else {
          var lei = p.autov[j];
          corpo = '<div class="risposta"><span class="label">Risposta</span><span>' + esc(q.r) + '</span></div>' +
            '<div class="voti"><span class="muted" style="font-size:16px;margin-right:4px">' + (S.papa ? 'Tu:' : 'Com\'è andata?') + '</span>' +
            ['si', 'parte', 'no'].map(function (v) { return '<button class="voto ' + v + (lei === v ? ' scelto' : '') + '" data-a="voto" data-v="' + v + '"' + (lei && lei !== v ? ' style="opacity:.45"' : '') + '>' + nomiEsito[v] + '</button>'; }).join('') + '</div>' +
            (S.papa ? '<div class="voti papa"><span class="muted" style="font-size:16px;margin-right:4px">Papà:</span>' + ['si', 'parte', 'no'].map(function (v) { return '<button class="voto ' + v + (p.papa[j] === v ? ' scelto' : '') + '" data-a="votoPapa" data-v="' + v + '">' + nomiEsito[v] + '</button>'; }).join('') + '</div>' : '');
        }
        return '<div class="domanda-attiva"><h3>' + esc(q.d) + '</h3>' + corpo + '</div>';
      }
      return '<div class="domanda chiusa"><div class="testo"><b>' + esc(q.d) + '</b></div>' + ico('lucchetto', 22, '#B9A8F5', 2.2) + '</div>';
    }).join('');
    var sue = (p.parole || []).filter(function (x) { return x && x.trim(); });
    var ultimo = S.pi === s.pezzi.length - 1;
    var avanti = finito
      ? '<button class="btn primario" data-a="dopoVerifica" style="margin-top:auto">' + (ultimo ? 'Al quiz!' : 'Ok, pausa!') + '</button>'
      : '';
    return '<div class="screen">' + testata(s, 'Verifica') +
      '<div class="card giallo" style="flex-direction:row;align-items:center;gap:18px;padding:20px 26px">' +
      '<span style="width:60px;height:60px;flex-shrink:0;border-radius:999px;background:#2B1B4A;display:flex;align-items:center;justify-content:center">' + ico('librochiuso', 30, '#FFD45C', 2.2) + '</span>' +
      '<div class="col grow" style="gap:2px"><h1 class="title" style="font-size:36px">' + conNome('Tocca a te', '!') + '</h1><p style="font-size:18px">Libro chiuso. Rispondi a voce alta, poi scopri la risposta e segna com\'è andata.</p></div>' +
      '<span class="pill" style="box-shadow:none;font-family:var(--titoli);font-weight:600">' + segnate + ' su ' + dom.length + '</span></div>' +
      '<div class="grid-5"><div class="card" style="gap:10px;padding:22px 24px">' + lista + '</div>' +
      '<div class="col" style="gap:18px">' +
      '<div class="card" style="gap:10px"><h2 class="subtitle" style="font-size:21px">Le tue parole</h2>' +
      (sue.length ? '<div class="parole">' + sue.map(function (x) { return '<span>' + esc(x) + '</span>'; }).join('') + '</div>' : '<p class="muted small">Non hai scritto parole chiave. La prossima volta prova a sceglierne tre.</p>') +
      ((pezzo.parole || []).length ? '<h2 class="subtitle" style="font-size:21px;margin-top:6px">Da confrontare</h2><div class="parole confronto">' + pezzo.parole.map(function (x) { return '<span>' + esc(x) + '</span>'; }).join('') + '</div>' : '') + '</div>' +
      '<div class="aiuto"><p class="label">Se non ti viene</p><p>Riapri il libro solo su quel paragrafo, rileggilo e riprova. Non serve ripartire da capo.</p></div>' +
      '<button class="link' + (S.papa ? ' papa-on' : ' trasparente') + '" data-a="papa" aria-pressed="' + S.papa + '" style="align-self:flex-start">' + ico('persona', 18) + (S.papa ? ' Papà sta controllando' : ' Controlla papà') + '</button>' +
      avanti + '</div></div></div>';
  };

  VISTE.pausa = function () {
    var ultimoFatto = S.pi;
    var s = sessione(S.sessId);
    var prossimo = s.pezzi[ultimoFatto + 1];
    return '<div class="screen"><h1 class="big-title">' + conNome('Pausa', '!') + '</h1>' +
      '<p id="pausaMsg" style="font-size:24px;max-width:640px;line-height:1.4">Alzati, bevi un bicchiere d\'acqua, muoviti un po\'. Il libro resta chiuso.</p>' +
      '<svg class="cerchio" viewBox="0 0 260 260" aria-hidden="true"><circle cx="130" cy="130" r="110" fill="#fff" stroke="#E8B42E" stroke-width="16"></circle>' +
      '<circle id="cerchioArco" cx="130" cy="130" r="110" fill="none" stroke="#5B3FC4" stroke-width="16" stroke-linecap="round" stroke-dasharray="691" stroke-dashoffset="0" transform="rotate(-90 130 130)"></circle>' +
      '<text id="pausaTempo" x="130" y="148" text-anchor="middle" font-family="Fredoka, sans-serif" font-size="54" font-weight="700" fill="#2B1B4A">' + mmss(S.timer ? S.timer.durata : 0) + '</text></svg>' +
      (prossimo ? '<p style="font-size:19px">Dopo: <b>' + esc(prossimo.titolo) + '</b></p>' : '') +
      '<button class="btn primario" id="riprendo" data-a="riprendi" disabled>Riprendo</button>' +
      '<button class="link trasparente" data-a="riprendi" style="font-size:15px;border:0">Devo riprendere prima</button></div>';
  };

  VISTE.quiz = function () {
    var s = sessione(S.sessId), q = s.quiz[S.quiz.i], n = s.quiz.length;
    var scelta = S.quiz.scelta;
    var opzioni = q.tipo === 'vf' ? ['Vero', 'Falso'] : q.opzioni;
    var giusta = q.tipo === 'vf' ? (q.giusta ? 0 : 1) : q.giusta;
    var puntini = '';
    for (var i = 0; i < n; i++) puntini += '<span style="flex:1;height:10px;border-radius:999px;background:' + (i < S.quiz.i ? '#5B3FC4' : i === S.quiz.i ? '#F26B4F' : '#F3EEFF') + '"></span>';
    var bott = opzioni.map(function (o, k) {
      var cls = '';
      if (scelta != null) { if (k === giusta) cls = ' giusta'; else if (k === scelta) cls = ' sbagliata'; }
      return '<button class="opzione' + cls + '" data-a="rispondi" data-k="' + k + '"' + (scelta != null ? ' aria-disabled="true"' : '') + '>' + esc(o) + '</button>';
    }).join('');
    var dopo = '';
    if (scelta != null) {
      var ok = scelta === giusta;
      dopo = '<div class="row wrap between" style="margin-top:4px"><p style="font-size:20px"><b>' + (ok ? 'Giusto.' : 'La risposta giusta è: ' + esc(opzioni[giusta]) + '.') + '</b>' + (q.spiega ? ' ' + esc(q.spiega) : '') + (q.pag ? ' <span class="muted">(libro, pag. ' + esc(q.pag) + ')</span>' : '') + '</p>' +
        '<button class="btn primario" data-a="avantiQuiz">' + (S.quiz.i === n - 1 ? 'Finito!' : 'Avanti') + '</button></div>';
    }
    return '<div class="screen"><div class="row between wrap"><button class="link" data-a="home">' + ico('indietro', 20) + ' Oggi</button><span class="subtitle" style="font-size:20px">Quiz, domanda ' + (S.quiz.i + 1) + ' di ' + n + '</span></div>' +
      '<div class="row" style="gap:6px">' + puntini + '</div>' +
      '<div class="card" style="flex-grow:1"><span class="chip ' + classeMateria(s.materia) + '">' + (q.tipo === 'vf' ? 'Vero o falso' : 'Scegli la risposta') + '</span>' +
      '<h1 class="title" style="font-weight:600">' + esc(q.d) + '</h1><div class="opzioni">' + bott + '</div>' + dopo + '</div></div>';
  };

  VISTE.risultato = function () {
    var s = sessione(S.sessId), r = prog(s.id).quiz;
    var sbagliate = [];
    (s.quiz || []).forEach(function (q, i) {
      var opz = q.tipo === 'vf' ? ['Vero', 'Falso'] : q.opzioni;
      var g = q.tipo === 'vf' ? (q.giusta ? 0 : 1) : q.giusta;
      if (r && r.risposte[i] !== g) sbagliate.push({ q: q, tua: opz[r.risposte[i]], giusta: opz[g] });
    });
    var punti = r ? r.punteggio : 0, n = r ? r.n : 0;
    var stelle = '';
    for (var i = 0; i < n; i++) stelle += i < punti ? svgStella(24, '#FFD45C') : '<svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><path d="' + STELLA + '" fill="none" stroke="#B9A8F5" stroke-width="2"></path></svg>';
    var frase = punti === 0 ? 'Sei arrivata in fondo.' : punti === n ? 'Tutte giuste!' : punti + (punti === 1 ? ' la sai già!' : ' le sai già!');
    var dopo = sbagliate.length ? 'Le altre ' + sbagliate.length + ' tornano domani nel ripasso lampo.' : 'Domani ripasso lampo di ' + cfg('minutiRipasso', 3) + ' minuti.';
    var lista = sbagliate.length ? sbagliate.map(function (x) {
      return '<div class="errore"><b>' + esc(x.q.d) + '</b><div class="row"><span class="tua">' + esc(x.tua) + '</span>' + ico('freccia', 22, '#6B5E7E') + '<span class="giusta-r">' + esc(x.giusta) + (x.q.spiega ? ': ' + esc(minuscola(x.q.spiega)) : '') + '</span>' + (x.q.pag ? '<span class="muted small" style="margin-left:auto">libro, pag. ' + esc(x.q.pag) + '</span>' : '') + '</div></div>';
    }).join('') : '<div class="card tenue"><p style="font-size:20px">Nessuna risposta da sistemare oggi.</p></div>';
    return '<div class="screen"><h1 class="title">Com\'è andata oggi</h1><div class="grid-3" style="grid-template-columns:1fr 2fr">' +
      '<div class="card viola" style="align-items:center;text-align:center"><div class="punteggio"><b>' + punti + '</b><span class="muted" style="font-family:var(--titoli);font-size:22px">su ' + n + '</span></div>' +
      '<p style="font-family:var(--titoli);font-size:26px;font-weight:600">' + frase + '</p><div class="row wrap" style="gap:4px;justify-content:center">' + stelle + '</div>' +
      '<p style="font-size:17px;color:#E5DEFF">' + dopo + '</p><button class="btn giallo" data-a="home" style="margin-top:auto;align-self:stretch">Fine per oggi</button></div>' +
      '<div class="col"><h2 class="subtitle">Da sistemare</h2>' + lista + '</div></div></div>';
  };

  VISTE.ripasso = function () {
    var R = S.rip;
    if (R.i >= R.items.length) {
      return '<div class="screen" style="align-items:center;justify-content:center;text-align:center">' + svgStella(80, '#FFD45C', ' class="spinin"') +
        '<h1 class="big-title">' + conNome('Ripasso fatto', '!') + '</h1><p style="font-size:22px" class="muted">Adesso puoi passare allo studio di oggi.</p>' +
        '<button class="btn primario" data-a="home">Torna a oggi</button></div>';
    }
    var it = R.items[R.i];
    var corpo = !R.reveal
      ? '<p class="muted" style="font-size:20px">Rispondi a voce alta, poi controlla.</p><button class="btn giallo" data-a="ripMostra" style="align-self:flex-start">Mostra la risposta</button>'
      : '<div class="risposta"><span class="label">Risposta</span><span>' + esc(it.r) + '</span></div><div class="voti"><span class="muted" style="font-size:16px">Com\'è andata?</span>' +
        '<button class="voto si" data-a="ripVoto" data-v="si">Lo sapevo</button><button class="voto parte" data-a="ripVoto" data-v="parte">In parte</button><button class="voto no" data-a="ripVoto" data-v="no">Non ancora</button></div>';
    return '<div class="screen"><div class="row between wrap"><button class="link" data-a="home">' + ico('indietro', 20) + ' Oggi</button><span class="subtitle" style="font-size:20px">Domanda ' + (R.i + 1) + ' di ' + R.items.length + '</span></div>' +
      '<div class="card giallo" style="flex-direction:row;align-items:center;gap:16px;padding:20px 26px">' + ico('fulmine', 34, '#2B1B4A', 0.1).replace('fill="none"', 'fill="#2B1B4A"') +
      '<div class="col grow" style="gap:8px"><h1 class="title" style="font-size:34px">Ripasso lampo</h1><div class="barra" style="background:#fff;height:18px"><div class="riempi" id="riempi" style="width:0%;background:#5B3FC4"></div></div><b id="tempoTxt" style="font-size:16px">Libro chiuso, ' + cfg('minutiRipasso', 3) + ' minuti</b></div></div>' +
      '<div class="card" style="flex-grow:1;max-width:900px;width:100%;align-self:center"><span class="chip ' + classeMateria(it.materia) + '">' + esc(nomeMateria(it.materia)) + '</span>' +
      '<h2 class="title" style="font-weight:600">' + esc(it.d) + '</h2>' + corpo + '</div></div>';
  };

  VISTE.settimana = function () {
    var off = S.sett;
    var t = new Date(); var lun = new Date(t.getFullYear(), t.getMonth(), t.getDate() - ((t.getDay() + 6) % 7) + 7 * off);
    var date = [0, 1, 2, 3, 4].map(function (k) { var d = new Date(lun); d.setDate(lun.getDate() + k); return dataStr(d); });
    var O = S.dati.orario, ore = O.ore || [];
    var verPer = {};
    (O.verifiche || []).forEach(function (v) { verPer[v.data + '|' + v.ora] = v; });
    var notaPer = {};
    (O.note || []).forEach(function (n) { notaPer[n.data + '|' + n.ora] = n; });
    var noteSett = (O.note || []).filter(function (n) { return n.data >= date[0] && n.data <= date[4]; }).sort(function (a, b) { return a.data.localeCompare(b.data) || (a.ora || 0) - (b.ora || 0); });
    var portare = noteSett.length ? '<div class="card verde" style="gap:10px;padding:22px"><h2 class="subtitle" style="font-weight:700">Da portare</h2>' + noteSett.map(function (n) {
      return '<div class="evento"><span class="muted small">' + esc(fmtData(n.data)) + '</span><b>' + esc(n.materia) + '</b><span class="small">' + esc(n.testo) + '</span></div>';
    }).join('') + '</div>' : '';
    var html = '<div class="orario"><span></span>' + date.map(function (d) { return '<span class="giorno' + (d === oggi() ? ' oggi' : '') + '">' + fmtBreve(d) + '</span>'; }).join('');
    ore.forEach(function (ora, h) {
      html += '<span class="ora">' + esc(ora) + '</span>';
      CHIAVI_GIORNI.forEach(function (g, k) {
        var mat = (O.giorni[g] || [])[h] || '';
        var v = verPer[date[k] + '|' + (h + 1)];
        var n = notaPer[date[k] + '|' + (h + 1)];
        html += '<div class="cella ' + classeMateria(mat) + (v ? ' verifica' : '') + '">' + esc(mat) + (v ? '<span class="tag">' + esc(v.tipo) + '</span>' : '') + (n ? '<span class="tag portare">Da portare</span>' : '') + '</div>';
      });
    });
    html += '</div>';
    var prox = (O.verifiche || []).filter(function (v) { return v.data >= oggi(); }).sort(function (a, b) { return a.data.localeCompare(b.data); }).slice(0, 4);
    var arrivo = prox.length ? prox.map(function (v) {
      return '<div class="evento"><span class="muted small">' + esc(fmtData(v.data)) + ', ' + v.ora + 'ª ora</span><b>' + esc(v.tipo) + ' di ' + esc(v.materia.toLowerCase()) + '</b><span class="small">' + esc(v.cosa || '') + (v.cosa ? ', ' : '') + quando(v.data) + '</span></div>';
    }).join('') : '<p style="font-size:18px">Nessuna verifica segnata.</p>';
    var vicina = prox.filter(function (v) { return giorniTra(oggi(), v.data) <= 3 && giorniTra(oggi(), v.data) >= 1; })[0];
    var consiglio = vicina ? '<div class="card"><p class="label">Prossimo pomeriggio</p><p style="font-size:18px;line-height:1.4">Prima il ripasso di ' + esc(vicina.materia.toLowerCase()) + ' per la ' + esc(vicina.tipo.toLowerCase()) + ' di ' + esc(fmtData(vicina.data).toLowerCase()) + '.</p></div>' : '';
    return '<div class="screen"><div class="row between wrap" style="align-items:flex-end"><div class="col" style="gap:4px"><button class="link indietro" data-a="home">' + ico('indietro', 20) + ' Oggi</button>' +
      '<h1 class="title" style="margin-top:8px">' + daStr(date[0]).getDate() + '-' + daStr(date[4]).getDate() + ' ' + MESI[daStr(date[4]).getMonth()] + '</h1></div>' +
      '<div class="tabs"><button data-a="sett" data-v="0" aria-pressed="' + (off === 0) + '">Questa</button><button data-a="sett" data-v="1" aria-pressed="' + (off === 1) + '">Prossima</button></div></div>' +
      '<div class="grid-3" style="grid-template-columns:3fr 1fr"><div class="card scorri" style="padding:20px 22px">' + html + '</div>' +
      '<div class="col" style="gap:18px"><div class="card giallo" style="gap:12px;padding:22px"><h2 class="subtitle" style="font-weight:700">In arrivo</h2>' + arrivo + '</div>' + portare + consiglio +
      '<p class="muted small" style="margin-top:auto">Orario e verifiche aggiornati da papà</p></div></div></div>';
  };

  function tabellaCompiti() {
    var da = piuGiorni(oggi(), -7), a = piuGiorni(oggi(), 7);
    var lista = elencoCompiti().filter(function (c) { return c.consegna >= da && c.consegna <= a; });
    if (!lista.length) return '';
    var fatti = lista.filter(compitoFatto).length;
    return '<div class="card scorri" style="padding:10px 24px"><div class="row between" style="padding-top:12px"><h2 class="subtitle">Compiti</h2><span class="muted">' + fatti + ' su ' + lista.length + ' spuntati</span></div>' +
      '<table class="tabella"><thead><tr><th>Consegna</th><th>Materia</th><th>Compito</th><th>Stato</th></tr></thead><tbody>' +
      lista.map(function (c) {
        var f = compitoFatto(c);
        return '<tr><td>' + esc(fmtBreve(c.consegna)) + '</td><td>' + esc(nomeMateria(c.materia)) + '</td><td>' + esc(c.testo) + '</td><td>' + (f ? '<b style="color:#5B3FC4">Fatto</b>' : (c.consegna < oggi() ? '<b style="color:#A8301A">Non spuntato</b>' : '<span class="muted">Da fare</span>')) + '</td></tr>';
      }).join('') + '</tbody></table></div>';
  }

  VISTE.registro = function () {
    var righe = [], giorni = {}, pezziFatti = 0, pezziTot = 0, blocchi = 0, accordo = 0, controllate = 0;
    sessioni().forEach(function (s) {
      var pr = store.sess[s.id];
      if (!pr) return;
      var perData = {};
      s.pezzi.forEach(function (pezzo, i) {
        var p = pr.pezzi[i];
        if (!p || !p.inizio) return;
        var d = p.data || oggi();
        perData[d] = perData[d] || { ms: 0, fatti: 0, tot: 0, note: [], si: 0, segn: 0 };
        var r = perData[d];
        r.ms += p.ms; r.tot++; if (p.fine) r.fatti++;
        if (p.bloccata) r.note.push(pezzo.titolo + ' (bloccata' + (p.bloccata > 1 ? ' ' + p.bloccata + ' volte' : '') + ')');
        if (p.lungo) r.note.push(pezzo.titolo + ' (troppo lungo)');
        p.autov.forEach(function (v, j) { if (v) { r.segn++; if (v === 'si') r.si++; } if (p.papa[j]) { controllate++; if (p.papa[j] === v) accordo++; } });
        blocchi += p.bloccata;
      });
      pezziTot += s.pezzi.length;
      s.pezzi.forEach(function (_, i) { if (pr.pezzi[i] && pr.pezzi[i].fine) pezziFatti++; });
      Object.keys(perData).forEach(function (d) {
        var r = perData[d];
        giorni[d] = (giorni[d] || 0) + r.ms;
        righe.push({ d: d, materia: s.materia, titolo: s.titolo, dove: s.dove, min: Math.round(r.ms / 60000), pezzi: r.fatti + ' su ' + r.tot, note: r.note.join('; '), aut: r.segn ? Math.round(100 * r.si / r.segn) + '%' : '' });
      });
      if (pr.quiz) righe.push({ d: pr.quiz.data, materia: s.materia, titolo: 'Quiz: ' + s.titolo, dove: '', min: '', pezzi: '', note: pr.quiz.punteggio + ' su ' + pr.quiz.n + ' giuste', aut: '' });
    });
    righe.sort(function (a, b) { return b.d.localeCompare(a.d); });
    var nGiorni = Object.keys(giorni).length;
    var medio = nGiorni ? Math.round(Object.keys(giorni).reduce(function (a, k) { return a + giorni[k]; }, 0) / nGiorni / 60000) : 0;
    var rip = store.ripLog.length ? Math.round(100 * store.ripLog.filter(function (x) { return x.esito === 'si'; }).length / store.ripLog.length) + '%' : 'nessun dato';
    var tab = righe.length ? '<table class="tabella"><thead><tr><th>Giorno</th><th>Materia</th><th>Cosa</th><th>Lettura</th><th>Pezzi</th><th>"Lo sapevo"</th><th>Note</th></tr></thead><tbody>' +
      righe.map(function (r) {
        return '<tr><td>' + esc(fmtBreve(r.d)) + '</td><td><span class="chip ' + classeMateria(r.materia) + '" style="font-size:14px;padding:4px 12px">' + esc(nomeMateria(r.materia)) + '</span></td><td>' + esc(r.titolo) + (r.dove ? '<br><span class="muted small">' + esc(r.dove) + '</span>' : '') + '</td><td>' + (r.min !== '' ? r.min + ' min' : '') + '</td><td>' + esc(r.pezzi) + '</td><td>' + esc(r.aut) + '</td><td>' + (esc(r.note) || '<span class="muted">nessun blocco</span>') + '</td></tr>';
      }).join('') + '</tbody></table>' : '<p style="font-size:18px" class="muted">Ancora nessuna sessione registrata.</p>';
    var papa = controllate ? '<div class="stat"><span class="muted">Accordo con papà</span><b>' + accordo + ' su ' + controllate + '</b></div>' : '<div class="stat"><span class="muted">Pezzi completati</span><b>' + pezziFatti + ' su ' + pezziTot + '</b></div>';
    return '<div class="screen"><div class="row between wrap" style="align-items:flex-end"><div class="col" style="gap:4px"><button class="link indietro no-print" data-a="home">' + ico('indietro', 20) + ' Oggi</button>' +
      '<p class="muted" style="font-size:18px;margin-top:8px">Per papà e per gli insegnanti</p><h1 class="title">Registro dello studio</h1></div>' +
      '<button class="btn primario no-print" data-a="stampa">' + ico('scarica', 20, '#fff') + ' Stampa o salva PDF</button></div>' +
      '<div class="stats"><div class="stat"><span class="muted">Lettura al giorno, in media</span><b>' + medio + ' min</b></div>' + papa +
      '<div class="stat"><span class="muted">Ricordato al ripasso</span><b>' + rip + '</b></div><div class="stat"><span class="muted">"Mi sono bloccata"</span><b>' + blocchi + (blocchi === 1 ? ' volta' : ' volte') + '</b></div></div>' +
      '<div class="card scorri" style="padding:10px 24px">' + tab + '</div>' + tabellaCompiti() +
      '<div class="row wrap no-print" style="justify-content:space-between"><button class="link" data-a="suono">Suoni: ' + (store.suono ? 'attivi' : 'spenti') + '</button>' +
      '<button class="link trasparente" data-a="azzera" style="color:#A8301A">Azzera tutti i progressi</button></div></div>';
  };

  // ---------- azioni ----------
  var AZ = {};
  AZ.home = function () { S.papa = false; S.aiuto = false; vai('oggi'); };
  AZ.chiudiFx = function () { $fx.innerHTML = ''; };
  AZ.settimana = function () {
    var t = new Date(), g = t.getDay();
    S.sett = (g === 0 || g === 6 || (g === 5 && t.getHours() >= 14)) ? 1 : 0;
    vai('settimana');
  };
  AZ.sett = function (d) { S.sett = +d.v; render(); };
  AZ.registro = function () { vai('registro'); };
  AZ.stampa = function () { window.print(); };
  AZ.suono = function () { store.suono = !store.suono; salva(); render(); };
  AZ.azzera = function () {
    if (window.confirm('Cancellare tutti i progressi salvati su questo tablet? Non si può annullare.')) {
      store = { v: 1, sess: {}, coda: [], ripLog: [], ripFatto: '', suono: store.suono, fatti: {} };
      salva(); vai('oggi');
    }
  };
  AZ.spunta = function (d, b) {
    if (store.fatti[d.id]) delete store.fatti[d.id];
    else { store.fatti[d.id] = Date.now(); suona([784, 1047]); }
    salva(); render();
    var nuovo = document.querySelector('[data-a="spunta"][data-id="' + d.id + '"]');
    if (nuovo && store.fatti[d.id]) nuovo.classList.add('pop');
    void b;
  };
  AZ.apri = function (d) { S.aperti = S.aperti || {}; S.aperti[d.g] = !S.aperti[d.g]; render(); };
  AZ.studia = function (d) { S.sessId = d.s; vai('sessione'); };
  AZ.vediRisultato = function () { if (prog(S.sessId).quiz) vai('risultato'); };
  AZ.pezzo = function (d) {
    var s = sessione(S.sessId); if (!s) return;
    S.sessId = s.id; S.pi = +d.i; S.papa = false; S.aiuto = false;
    vai('anteprima');
  };
  AZ.leggi = function () {
    var s = sessione(S.sessId), p = pz(s.id, S.pi);
    if (!p.inizio) { p.inizio = Date.now(); p.data = oggi(); }
    salva();
    S.view = 'lettura';
    avviaTimer((s.pezzi[S.pi].minuti || 8) * 60000);
    render();
  };
  AZ.piu2 = function () {
    var p = pz(S.sessId, S.pi); p.extra++; salva();
    S.timer.durata += 120000; S.timer.finito = false;
    var tx = document.getElementById('tempoTxt'); if (tx) tx.textContent = 'Ok, altri 2 minuti';
    aggiornaTimer();
  };
  AZ.lungo = function () {
    var p = pz(S.sessId, S.pi); p.lungo++; salva();
    toast('Segnato. Leggi fino a metà, verificati, poi fai l\'altra metà.');
  };
  AZ.bloccata = function () {
    var p = pz(S.sessId, S.pi); p.bloccata++; salva();
    var timer = S.timer; S.aiuto = true; render(); S.timer = timer;
    toast('Segnato. Papà lo vedrà nel registro.');
  };
  AZ.verifica = function () {
    var s = sessione(S.sessId), p = pz(s.id, S.pi);
    p.ms += trascorso(); salva();
    fermaTimer(); S.timer = null;
    var dom = s.pezzi[S.pi].domande || [];
    S.qi = 0; while (S.qi < dom.length && p.autov[S.qi]) S.qi++;
    S.reveal = false; S.aiuto = false;
    if (!dom.length) { chiudiPezzo(); return; }
    vai('verifica');
  };
  AZ.mostra = function () { S.reveal = true; render(); };
  AZ.papa = function () { S.papa = !S.papa; render(); };
  function avanzaDomanda() {
    var s = sessione(S.sessId), p = pz(s.id, S.pi), dom = s.pezzi[S.pi].domande;
    var q = dom[S.qi], v = p.autov[S.qi];
    if (v !== 'si') inCoda({ k: chiave(s.id, S.pi, S.qi), d: q.d, r: q.r, materia: s.materia });
    if (S.papa) p.controllato = true;
    S.qi++; while (S.qi < dom.length && p.autov[S.qi]) S.qi++;
    S.reveal = false;
    salva();
    if (S.qi >= dom.length) { chiudiPezzo(); return; }
    render();
  }
  AZ.voto = function (d) {
    var p = pz(S.sessId, S.pi);
    p.autov[S.qi] = d.v; salva();
    if (S.papa && !p.papa[S.qi]) { render(); return; }
    avanzaDomanda();
  };
  AZ.votoPapa = function (d) {
    var p = pz(S.sessId, S.pi);
    p.papa[S.qi] = d.v; salva();
    if (!p.autov[S.qi]) { render(); return; }
    avanzaDomanda();
  };
  function chiudiPezzo() {
    var s = sessione(S.sessId), p = pz(s.id, S.pi);
    if (!p.fine) {
      p.fine = Date.now(); salva();
      var rimasti = s.pezzi.filter(function (_, i) { return !pz(s.id, i).fine; }).length;
      fxPezzo(rimasti);
    }
    S.view = 'verifica'; S.qi = (s.pezzi[S.pi].domande || []).length; render();
  }
  AZ.dopoVerifica = function () {
    var s = sessione(S.sessId);
    S.papa = false;
    if (S.pi >= s.pezzi.length - 1 || primoPezzoDaFare(s) >= s.pezzi.length) { AZ.quiz(); return; }
    S.view = 'pausa';
    avviaTimer(cfg('minutiPausa', 4) * 60000);
    render();
  };
  AZ.riprendi = function () {
    var s = sessione(S.sessId);
    S.pi = primoPezzoDaFare(s);
    if (S.pi >= s.pezzi.length) { AZ.quiz(); return; }
    vai('anteprima');
  };
  AZ.quiz = function () {
    var s = sessione(S.sessId) || sessioneAttiva(); if (!s) { vai('oggi'); return; }
    S.sessId = s.id;
    if (!s.quiz || !s.quiz.length) { finisciSessione(s); return; }
    S.quiz = { i: 0, risposte: [], scelta: null };
    vai('quiz');
  };
  AZ.rispondi = function (d) {
    if (S.quiz.scelta != null) return;
    var s = sessione(S.sessId), q = s.quiz[S.quiz.i];
    S.quiz.scelta = +d.k; S.quiz.risposte[S.quiz.i] = +d.k;
    var g = q.tipo === 'vf' ? (q.giusta ? 0 : 1) : q.giusta;
    if (+d.k === g) suona([784, 1047]);
    render();
  };
  AZ.avantiQuiz = function () {
    var s = sessione(S.sessId);
    if (S.quiz.i < s.quiz.length - 1) { S.quiz.i++; S.quiz.scelta = null; render(); return; }
    var punti = 0;
    s.quiz.forEach(function (q, i) {
      var opz = q.tipo === 'vf' ? ['Vero', 'Falso'] : q.opzioni;
      var g = q.tipo === 'vf' ? (q.giusta ? 0 : 1) : q.giusta;
      if (S.quiz.risposte[i] === g) punti++;
      else inCoda({ k: s.id + '|quiz|' + i, d: q.d, r: opz[g] + (q.spiega ? '. ' + q.spiega : ''), materia: s.materia });
    });
    prog(s.id).quiz = { risposte: S.quiz.risposte.slice(), punteggio: punti, n: s.quiz.length, data: oggi() };
    salva();
    finisciSessione(s);
  };
  function finisciSessione(s) {
    var pr = prog(s.id);
    pr.fine = Date.now(); salva();
    var fatti = s.pezzi.filter(function (_, i) { return pz(s.id, i).fine; }).length;
    S.sessId = s.id;
    if (pr.quiz) vai('risultato'); else vai('oggi');
    fxSessione(s, fatti, s.pezzi.length);
  }
  AZ.ripasso = function () {
    S.rip = { items: ripassoPronto(), i: 0, reveal: false };
    S.view = 'ripasso';
    avviaTimer(cfg('minutiRipasso', 3) * 60000);
    render();
  };
  AZ.ripMostra = function () { S.rip.reveal = true; var t = S.timer; render(); S.timer = t; };
  AZ.ripVoto = function (d) {
    var it = S.rip.items[S.rip.i];
    store.ripLog.push({ data: oggi(), esito: d.v });
    var c = store.coda.filter(function (x) { return x.k === it.k; })[0];
    if (d.v === 'si') {
      if (c) {
        c.box++;
        if (c.box >= 2) store.coda = store.coda.filter(function (x) { return x !== c; });
        else c.due = piuGiorni(oggi(), 3);
        if (c.sbagliata) { c.sbagliata = false; fxRecuperata(it.d); }
      }
    } else {
      if (c) { c.box = 0; c.due = piuGiorni(oggi(), 1); }
      else inCoda({ k: it.k, d: it.d, r: it.r, materia: it.materia });
    }
    S.rip.i++; S.rip.reveal = false;
    if (S.rip.i >= S.rip.items.length) { store.ripFatto = oggi(); fermaTimer(); }
    salva();
    render();
  };

  // ---------- eventi ----------
  $app.addEventListener('click', function (e) {
    var b = e.target.closest('[data-a]');
    if (!b || b.disabled) return;
    var f = AZ[b.getAttribute('data-a')];
    if (f) f(b.dataset, b);
  });
  $fx.addEventListener('click', function (e) {
    var b = e.target.closest('[data-a]');
    if (b && AZ[b.getAttribute('data-a')]) AZ[b.getAttribute('data-a')](b.dataset, b);
  });
  $app.addEventListener('input', function (e) {
    var el = e.target;
    if (!S.sessId) return;
    var p = pz(S.sessId, S.pi);
    if (el.hasAttribute('data-k')) { p.parole[+el.getAttribute('data-k')] = el.value; salva(); }
    if (el.getAttribute('data-campo') === 'ipotesi') { p.ipotesi = el.value; salva(); }
  });
  document.addEventListener('visibilitychange', function () { if (!document.hidden) aggiornaTimer(); });

  if ('serviceWorker' in navigator && location.protocol === 'https:') {
    navigator.serviceWorker.register('sw.js').catch(function () { /* non essenziale */ });
  }
})();
