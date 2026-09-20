// تكنو خريج - الجولة التعريفية V18 FINAL - الكلمة فوق + الأيقونة جوه المربع - فعال 100%
(function(){
  const STEPS = [
    { id: 'welcome', title: 'أهلاً بيك في تكنو خريج 🎓', desc: 'منصة بتجمع كل الخريجين - هتتعلم تستخدمها في 60 ثانية بس. دوس التالي.', icon: '🎓', color: 'linear-gradient(135deg,#f59e0b,#fbbf24)', target: null },
    { id: 'الرئيسية', title: '🏠 الرئيسية - البداية', desc: 'هنا بتشوف إحصائيات المنصة، رسالة ترحيب، ودعوة لزمايلك. دي أول حاجة بتشوفها لما تدخل.', icon: '🏠', color: 'linear-gradient(135deg,#f59e0b,#fbbf24)', target: 'الرئيسية' },
    { id: 'الخريجين', title: '👥 الخريجين - شبكتك', desc: 'كل الخريجين المسجلين هنا. تقدر تبحث وتتواصل مع أي حد. دوس على (شات) عشان تكلم أي زميل.', icon: '👥', color: 'linear-gradient(135deg,#3b82f6,#8b5cf6)', target: 'الخريجين' },
    { id: 'المتصدرين', title: '🏆 المتصدرين - لوحة الشرف', desc: 'أكتر ناس بتتفاعل في المنصة. كل تفاعل بيديك نقاط: منشور=10، تعليق=5، لايك=2، شات=1. اجمع نقاط وابقى بطل المنصة!', icon: '🏆', color: 'linear-gradient(135deg,#f59e0b,#d97706)', target: 'المتصدرين' },
    { id: 'المختبر', title: '🧪 المختبر - أدواتك', desc: '6 أدوات مهمة: منشئ CV عربي/إنجليزي، حاسبة المعدل GPA، مولد QR، أسئلة انترفيو، حاسبة راتب، وبطاقة الخريج ID.', icon: '🧪', color: 'linear-gradient(135deg,#10b981,#06b6d4)', target: 'المختبر' },
    { id: 'الشات', title: '💬 الشات - تواصل مباشر', desc: 'رسائل خاصة بينك وبين زمايلك، ومجموعات زي (دفعة تكنولوجيا 2023) و (فرص عمل). كل الرسائل آمنة ومحمية.', icon: '💬', color: 'linear-gradient(135deg,#8b5cf6,#ec4899)', target: 'الشات' },
    { id: 'المنشورات', title: '📝 المنشورات - شارك إنجازك', desc: 'انشر إنجازاتك، أفكارك، أو اسأل سؤال. زمايلك يقدروا يعملوا إعجاب وتعليق ومشاركة. تفاعلك بيزود نقاطك!', icon: '📝', color: 'linear-gradient(135deg,#f43f5e,#f59e0b)', target: 'المنشورات' },
    { id: 'حسابي', title: '👤 حسابي - بروفايلك', desc: 'صورتك، بياناتك، لوحة تحكم الأدمن لو أنت أدمن، وإدارة المستخدمين والمنشورات.', icon: '👤', color: 'linear-gradient(135deg,#6b7280,#374151)', target: 'حسابي' },
    { id: 'finish', title: 'جاهز تنطلق؟ 🚀', desc: 'كده عرفت كل حاجة! المنصة دي اتعملت عشان تجمعنا كلنا كخريجين ونساعد بعض. ابدأ دلوقتي وادعو زمايلك!', icon: '🚀', color: 'linear-gradient(135deg,#10b981,#06b6d4)', target: null }
  ];

  let curStep = 0;
  let overlay, spotlight, tooltip, navLabel;

  function createElements(){
    if(document.getElementById('tk-onboard-overlay')) return;
    overlay = document.createElement('div');
    overlay.id = 'tk-onboard-overlay';
    document.body.appendChild(overlay);
    spotlight = document.createElement('div');
    spotlight.id = 'tk-spotlight';
    document.body.appendChild(spotlight);
    navLabel = document.createElement('div');
    navLabel.id = 'tk-nav-label';
    document.body.appendChild(navLabel);
    tooltip = document.createElement('div');
    tooltip.id = 'tk-tooltip';
    tooltip.innerHTML = `
      <div id="tk-tooltip-header">
        <div style="display:flex;gap:12px;align-items:center">
          <div id="tk-tooltip-icon"></div>
          <div>
            <p id="tk-tooltip-title"></p>
            <span id="tk-tooltip-step"></span>
          </div>
        </div>
        <button id="tk-close" style="width:30px;height:30px;border-radius:50%;background:#0f172a;color:#fff;border:1px solid #334155;cursor:pointer;font-weight:bold">✕</button>
      </div>
      <p id="tk-tooltip-desc"></p>
      <div id="tk-tooltip-footer">
        <div style="display:flex;gap:12px;align-items:center">
          <button id="tk-skip">تخطي</button>
          <div id="tk-dots"></div>
        </div>
        <button id="tk-next-btn">التالي →</button>
      </div>
    `;
    document.body.appendChild(tooltip);
    document.getElementById('tk-close').onclick = endTour;
    document.getElementById('tk-skip').onclick = endTour;
    document.getElementById('tk-next-btn').onclick = nextStep;
    overlay.onclick = ()=>nextStep();
  }

  function findTarget(tabName){
    if(!tabName) return null;
    const nav = document.querySelector('nav');
    if(nav){
      const navBtns = nav.querySelectorAll('button');
      for(let btn of navBtns){
        const oc = btn.getAttribute('onclick')||'';
        if(oc.includes(tabName)) return btn;
      }
    }
    const buttons = document.querySelectorAll('button');
    for(let btn of buttons){
      if(btn.textContent.trim() === tabName && btn.offsetParent!==null) return btn;
      const oc = btn.getAttribute('onclick')||'';
      if(oc.includes(tabName)) return btn;
    }
    return null;
  }

  function clearNavHighlights(){
    document.querySelectorAll('nav button').forEach(b=>{
      b.classList.remove('tk-nav-active');
      b.classList.remove('tk-nav-dim');
      b.style.transform = '';
      b.style.background = '';
      b.style.color = '';
      b.style.border = '';
      let spans = b.querySelectorAll('span');
      spans.forEach(s=>{ s.style.color=''; s.style.fontSize=''; s.style.display=''; s.style.opacity=''; s.style.visibility=''; });
    });
    let lbl = document.getElementById('tk-nav-label');
    if(lbl){ lbl.classList.remove('show'); lbl.style.display='none'; }
  }

  function highlightTarget(target){
    clearNavHighlights();
    if(!target) return;
    if(target.closest && target.closest('nav')){
      target.classList.add('tk-nav-active');
      target.style.background = 'linear-gradient(135deg,#f59e0b,#fbbf24)';
      target.style.color = '#000';
      target.style.border = '3px solid #fff';
      target.style.transform = 'scale(1.25)';
      target.style.width = '62px';
      target.style.height = '62px';
      let spans = target.querySelectorAll('span');
      spans.forEach((s,i)=>{
        if(i===0){
          s.style.color = '#000';
          s.style.opacity = '1';
          s.style.visibility = 'visible';
          s.style.display = 'flex';
          s.style.fontSize='30px';
          s.style.alignItems='center';
          s.style.justifyContent='center';
        } else {
          s.style.display='none';
          s.style.opacity='0';
          s.style.visibility='hidden';
        }
      });
      document.querySelectorAll('nav button').forEach(b=>{
        if(b !== target) b.classList.add('tk-nav-dim');
      });
      try{
        let rect = target.getBoundingClientRect();
        let lbl = document.getElementById('tk-nav-label');
        if(lbl){
          let oc = target.getAttribute('onclick')||'';
          let m = oc.match(/switchTab\('([^']+)'\)/);
          let name = m ? m[1] : target.textContent.trim();
          lbl.textContent = name;
          lbl.style.left = (rect.left + rect.width/2) + 'px';
          lbl.style.top = (rect.top - 46) + 'px';
          lbl.style.display = 'block';
          setTimeout(()=>lbl.classList.add('show'),10);
        }
      }catch(e){}
    } else {
      target.classList.add('tk-nav-active');
    }
  }

  function showStep(index){
    if(index>=STEPS.length){ endTour(true); return; }
    const step = STEPS[index];
    curStep = index;
    const titleEl = document.getElementById('tk-tooltip-title');
    const descEl = document.getElementById('tk-tooltip-desc');
    const iconEl = document.getElementById('tk-tooltip-icon');
    const stepEl = document.getElementById('tk-tooltip-step');
    const dotsEl = document.getElementById('tk-dots');
    const nextBtn = document.getElementById('tk-next-btn');

    titleEl.textContent = step.title;
    descEl.textContent = step.desc;
    iconEl.textContent = step.icon;
    iconEl.style.background = step.color;
    stepEl.textContent = (index+1) + ' / ' + STEPS.length;
    nextBtn.textContent = index===STEPS.length-1 ? 'ابدأ الآن 🚀' : 'التالي →';
    nextBtn.style.display = 'inline-flex';

    dotsEl.innerHTML = '';
    STEPS.forEach((_,i)=>{
      const dot = document.createElement('div');
      dot.className = 'tk-dot' + (i===index ? ' active' : '');
      dotsEl.appendChild(dot);
    });

    tooltip.style.top = '50%';
    tooltip.style.left = '50%';
    tooltip.style.transform = 'translate(-50%, -50%) scale(1)';
    tooltip.style.position = 'fixed';

    if(step.target){
      const target = findTarget(step.target);
      if(target){
        const rect = target.getBoundingClientRect();
        spotlight.style.display = 'block';
        spotlight.style.left = (rect.left-10)+'px';
        spotlight.style.top = (rect.top-10)+'px';
        spotlight.style.width = (rect.width+20)+'px';
        spotlight.style.height = (rect.height+20)+'px';
        highlightTarget(target);
      } else {
        spotlight.style.display = 'none';
        clearNavHighlights();
      }
    } else {
      spotlight.style.display = 'none';
      clearNavHighlights();
    }

    overlay.classList.add('on');
    setTimeout(()=>tooltip.classList.add('on'),50);
  }

  function nextStep(){
    tooltip.classList.remove('on');
    clearNavHighlights();
    setTimeout(()=>{ showStep(curStep+1); },200);
  }

  function getCurrentEmail(){
    try{
      const curData = localStorage.getItem('tk_cur');
      if(!curData) return null;
      const cur = JSON.parse(curData);
      return cur.email ? cur.email.toLowerCase() : null;
    }catch(e){ return null; }
  }

  function endTour(finished=false){
    overlay.classList.remove('on');
    tooltip.classList.remove('on');
    spotlight.style.display = 'none';
    clearNavHighlights();
    setTimeout(()=>{ overlay.style.display='none'; tooltip.style.display='none'; },300);
    const email = getCurrentEmail();
    const key = email ? 'tk_tour_done_'+email : 'tk_tour_done';
    const skipKey = email ? 'tk_tour_skipped_'+email : 'tk_tour_skipped';
    if(finished){
      localStorage.setItem(key,'1');
      localStorage.setItem('tk_tour_done','1');
      if(window.toast) toast('🎉 أهلاً بيك في تكنو خريج! ابدأ رحلتك الآن');
    } else {
      localStorage.setItem(skipKey,'1');
      localStorage.setItem('tk_tour_skipped','1');
    }
  }

  function startTour(){
    createElements();
    overlay.style.display='block';
    tooltip.style.display='block';
    spotlight.style.display='none';
    curStep = 0;
    showStep(0);
  }

  function addHelpButton(){
    const removeOldBtns = () => {
      const oldAcc = document.getElementById('tk-help-btn-account');
      if(oldAcc) oldAcc.remove();
    };
    removeOldBtns();
    function createHomeBtn(){
      if(document.getElementById('tk-help-btn-home')) return document.getElementById('tk-help-btn-home');
      const btn = document.createElement('button');
      btn.id = 'tk-help-btn-home';
      btn.innerHTML = '<span style="font-size:22px">❓</span><div style="text-align:right;flex:1"><div style="font-weight:900;color:#0f172a;font-size:14px">❓ عرض الجولة التعريفية</div><div style="font-size:11px;color:#475569;margin-top:2px">مش فاهم المنصة؟ دوس هنا وشوف الشرح في دقيقة</div></div><span style="font-size:18px">▶️</span>';
      btn.onclick = function(e){ e.preventDefault(); e.stopPropagation(); startTour(); };
      btn.style.cssText = 'display:flex;align-items:center;gap:12px;background:linear-gradient(135deg,#fffbeb,#fef3c7);border:2px dashed #f59e0b;border-radius:18px;padding:16px;width:calc(100% - 32px);margin:16px auto;cursor:pointer;font-family:Tajawal,sans-serif;text-align:right;direction:rtl;box-shadow:0 4px 12px rgba(245,158,11,0.15);position:relative;z-index:10;';
      return btn;
    }
    function injectBtn(){
      const app = document.getElementById('app');
      if(!app) return;
      const txt = app.textContent || '';
      const isHome = txt.includes('دفعة تكنولوجيا') || txt.includes('مرحباً') || txt.includes('إحصائيات المنصة') || txt.includes('نقاطك') || txt.includes('الخريجين المتاحين');
      if(isHome){
        if(!document.getElementById('tk-help-btn-home')){
          const btn = createHomeBtn();
          const glass = app.querySelector('.glass');
          if(glass && glass.parentElement){
            glass.parentElement.insertBefore(btn, glass);
          } else {
            const container = app.querySelector('div.flex-1') || app.firstElementChild || app;
            if(container && container.firstChild){
              container.insertBefore(btn, container.firstChild);
            } else if(container){
              container.appendChild(btn);
            }
          }
        }
      } else {
        const existing = document.getElementById('tk-help-btn-home');
        if(existing) existing.remove();
      }
      removeOldBtns();
    }
    setInterval(injectBtn, 600);
    setInterval(removeOldBtns, 1000);
    setTimeout(injectBtn, 800);
  }

  window.startTkTour = startTour;

  function isLoggedIn(){
    try{
      const curData = localStorage.getItem('tk_cur');
      if(!curData) return false;
      const cur = JSON.parse(curData);
      return !!(cur && (cur.email || cur.id));
    }catch(e){ return false; }
  }

  function shouldShowTour(){
    if(!isLoggedIn()) return false;
    const loginBtn = document.getElementById('loginBtn');
    if(loginBtn && loginBtn.offsetParent !== null) return false;
    const email = getCurrentEmail();
    if(email){
      const done = localStorage.getItem('tk_tour_done_'+email) || localStorage.getItem('tk_tour_skipped_'+email);
      if(done) return false;
    }
    const globalDone = localStorage.getItem('tk_tour_done') || localStorage.getItem('tk_tour_skipped');
    if(email && globalDone){
      return true;
    }
    return !globalDone;
  }

  document.addEventListener('DOMContentLoaded', ()=>{
    setTimeout(()=>{
      if(shouldShowTour()){
        setTimeout(startTour, 1500);
      }
      if(isLoggedIn()) addHelpButton();
    }, 1000);
  });

  let lastCheck = null;
  setInterval(()=>{
    const nowLogged = isLoggedIn();
    if(nowLogged && lastCheck === false){
      setTimeout(()=>{
        if(shouldShowTour()) startTour();
        addHelpButton();
      }, 1000);
    }
    lastCheck = nowLogged;
  }, 1000);

  if(document.readyState !== 'loading'){
    setTimeout(()=>{
      if(shouldShowTour()){
        setTimeout(()=>{ createElements(); startTour(); }, 1500);
      }
      if(isLoggedIn()) addHelpButton();
    }, 800);
  }
})();
