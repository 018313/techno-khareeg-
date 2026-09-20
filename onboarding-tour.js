// تكنو خريج - نظام الجولة التعريفية - نسخة مصلحة نهائية - ثابتة في النص
(function(){
  const STEPS = [
    { id: 'welcome', title: 'أهلاً بيك في تكنو خريج 🎓', desc: 'منصة بتجمع كل الخريجين - هتتعلم تستخدمها في 60 ثانية بس. دوس التالي.', icon: '🎓', color: 'linear-gradient(135deg,#f59e0b,#fbbf24)', target: null },
    { id: 'الرئيسية', title: '🏠 الرئيسية - البداية', desc: 'هنا بتشوف إحصائيات المنصة، رسالة ترحيب، ودعوة لزمايلك. دي أول حاجة بتشوفها لما تدخل.', icon: '🏠', color: 'linear-gradient(135deg,#f59e0b,#fbbf24)', target: 'الرئيسية' },
    { id: 'الخريجين', title: '👥 الخريجين - شبكتك', desc: 'كل الخريجين المسجلين هنا. تقدر تبحث وتتواصل مع أي حد. دوس على (شات) عشان تكلم أي زميل.', icon: '👥', color: 'linear-gradient(135deg,#3b82f6,#8b5cf6)', target: 'الخريجين' },
    { id: 'المتصدرين', title: '🏆 المتصدرين - لوحة الشرف', desc: 'أكتر ناس بتتفاعل في المنصة. كل تفاعل بيديك نقاط: منشور=10، تعليق=5، لايك=2، شات=1. اجمع نقاط وابقى بطل المنصة!', icon: '🏆', color: 'linear-gradient(135deg,#f59e0b,#d97706)', target: 'المتصدرين' },
    { id: 'المختبر', title: '🧪 المختبر - أدواتك', desc: '6 أدوات مهمة: منشئ CV احترافي، حاسبة المعدل GPA، مولد QR، أسئلة انترفيو، حاسبة راتب، وبورتفوليو.', icon: '🧪', color: 'linear-gradient(135deg,#10b981,#06b6d4)', target: 'المختبر' },
    { id: 'الشات', title: '💬 الشات - تواصل مباشر', desc: 'رسائل خاصة بينك وبين زمايلك، ومجموعات زي (دفعة تكنولوجيا 2023) و (فرص عمل). كل الرسائل آمنة ومحمية.', icon: '💬', color: 'linear-gradient(135deg,#8b5cf6,#ec4899)', target: 'الشات' },
    { id: 'المنشورات', title: '📝 المنشورات - شارك إنجازك', desc: 'انشر إنجازاتك، أفكارك، أو اسأل سؤال. زمايلك يقدروا يعملوا إعجاب وتعليق ومشاركة. تفاعلك بيزود نقاطك!', icon: '📝', color: 'linear-gradient(135deg,#f43f5e,#f59e0b)', target: 'المنشورات' },
    { id: 'حسابي', title: '👤 حسابي - بروفايلك', desc: 'صورتك، بياناتك، لوحة تحكم الأدمن لو أنت أدمن، وإدارة المستخدمين والمنشورات.', icon: '👤', color: 'linear-gradient(135deg,#6b7280,#374151)', target: 'حسابي' },
    { id: 'finish', title: 'جاهز تنطلق؟ 🚀', desc: 'كده عرفت كل حاجة! المنصة دي اتعملت عشان تجمعنا كلنا كخريجين ونساعد بعض. ابدأ دلوقتي وادعو زمايلك!', icon: '🚀', color: 'linear-gradient(135deg,#10b981,#06b6d4)', target: null }
  ];

  let curStep = 0;
  let overlay, spotlight, tooltip;

  function createElements(){
    if(document.getElementById('tk-onboard-overlay')) return;
    overlay = document.createElement('div');
    overlay.id = 'tk-onboard-overlay';
    document.body.appendChild(overlay);
    spotlight = document.createElement('div');
    spotlight.id = 'tk-spotlight';
    document.body.appendChild(spotlight);
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
    const buttons = document.querySelectorAll('button');
    for(let btn of buttons){
      if(btn.textContent.trim() === tabName && btn.offsetParent!==null) return btn;
      const oc = btn.getAttribute('onclick')||'';
      if(oc.includes(tabName)) return btn;
    }
    return null;
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

    dotsEl.innerHTML = '';
    STEPS.forEach((_,i)=>{
      const dot = document.createElement('div');
      dot.className = 'tk-dot' + (i===index ? ' active' : '');
      dotsEl.appendChild(dot);
    });

    // تثبيت التولتيب في النص دائما - حل مشكلة الكلام اللازق على الجنب
    tooltip.style.top = '50%';
    tooltip.style.left = '50%';
    tooltip.style.right = 'auto';
    tooltip.style.bottom = '';
    tooltip.style.transform = 'translate(-50%, -50%) scale(1)';
    tooltip.style.position = 'fixed';

    // Spotlight
    if(step.target){
      const target = findTarget(step.target);
      if(target){
        const rect = target.getBoundingClientRect();
        spotlight.style.display = 'block';
        spotlight.style.left = (rect.left-6)+'px';
        spotlight.style.top = (rect.top-6)+'px';
        spotlight.style.width = (rect.width+12)+'px';
        spotlight.style.height = (rect.height+12)+'px';
      } else {
        spotlight.style.display = 'none';
      }
    } else {
      spotlight.style.display = 'none';
    }

    overlay.classList.add('on');
    setTimeout(()=>tooltip.classList.add('on'),50);
  }

  function nextStep(){
    tooltip.classList.remove('on');
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
    setTimeout(()=>{ overlay.style.display='none'; tooltip.style.display='none'; },300);
    const email = getCurrentEmail();
    const key = email ? 'tk_tour_done_'+email : 'tk_tour_done';
    const skipKey = email ? 'tk_tour_skipped_'+email : 'tk_tour_skipped';
    if(finished){
      localStorage.setItem(key,'1');
      localStorage.setItem('tk_tour_done','1'); // احتياطي
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
    // شيل أي زرار قديم في حسابي لو موجود - احذفه نهائي
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
      // تحقق إننا في الرئيسية
      const txt = app.textContent || '';
      const isHome = txt.includes('دفعة تكنولوجيا') || txt.includes('مرحباً') || txt.includes('إحصائيات المنصة') || txt.includes('نقاطك') || txt.includes('الخريجين المتاحين');
      
      if(isHome){
        if(!document.getElementById('tk-help-btn-home')){
          const btn = createHomeBtn();
          // حاول تحطه فوق أول كارت
          const glass = app.querySelector('.glass');
          if(glass && glass.parentElement){
            glass.parentElement.insertBefore(btn, glass);
          } else {
            // fallback: أول عنصر في app
            const container = app.querySelector('div.flex-1') || app.firstElementChild || app;
            if(container && container.firstChild){
              container.insertBefore(btn, container.firstChild);
            } else if(container){
              container.appendChild(btn);
            }
          }
        }
      } else {
        // لو مش في الرئيسية، اخفيه مؤقتا (مش احذفه نهائي عشان يرجع)
        const existing = document.getElementById('tk-help-btn-home');
        if(existing && !isHome){
          // لو في صفحة غير الرئيسية، شيله عشان يرجع لما يرجع الرئيسية
          existing.remove();
        }
      }
      removeOldBtns();
    }

    // مراقب دائم كل 600ms - يثبت الزرار في الرئيسية
    setInterval(injectBtn, 600);
    // كمان راقب تغييرات الـ DOM
    setInterval(removeOldBtns, 1000);
    
    // أول محاولة بعد ثانية
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
    // لو مفيش إيميل محدد، شوف العام (للتوافق مع القديم)
    const globalDone = localStorage.getItem('tk_tour_done') || localStorage.getItem('tk_tour_skipped');
    // لو فيه إيميل جديد و globalDone موجود بس per-email مش موجود، اظهرها للإيميل الجديد
    if(email && globalDone){
      // ده إيميل جديد أول مرة يدخل على الجهاز ده
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

  // راقب تسجيل الدخول - لو المستخدم سجل دخول جديد، اظهر الجولة
  let lastCheck = null;
  setInterval(()=>{
    const nowLogged = isLoggedIn();
    if(nowLogged && lastCheck === false){
      // لسه مسجل دخول حالاً
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
