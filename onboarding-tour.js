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

  function endTour(finished=false){
    overlay.classList.remove('on');
    tooltip.classList.remove('on');
    spotlight.style.display = 'none';
    setTimeout(()=>{ overlay.style.display='none'; tooltip.style.display='none'; },300);
    if(finished){
      localStorage.setItem('tk_tour_done','1');
      if(window.toast) toast('🎉 أهلاً بيك في تكنو خريج! ابدأ رحلتك الآن');
    } else {
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
    const check = setInterval(()=>{
      const btns = document.querySelectorAll('button');
      let homeTab = null;
      for(let b of btns){ if(b.textContent.includes('الرئيسية')){ homeTab=b; break; } }
      if(homeTab || document.body){
        clearInterval(check);
        if(document.getElementById('tk-help-btn-home')) return;
        const helpBtn = document.createElement('button');
        helpBtn.id = 'tk-help-btn-home';
        helpBtn.innerHTML = '<span style="font-size:20px">❓</span><div style="text-align:right"><div style="font-weight:900;color:#fbbf24">كيف تستخدم المنصة؟</div><div style="font-size:11px;color:#94a3b8">اضغط هنا لعرض الجولة التعريفية</div></div>';
        helpBtn.onclick = startTour;
        const main = document.querySelector('main, #app, [class*="container"]') || document.body;
        if(main.firstChild) main.insertBefore(helpBtn, main.firstChild.nextSibling);
        else main.appendChild(helpBtn);
      }
    },1000);
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
    // لو لسه في صفحة تسجيل الدخول (فيه زرار دخول)
    const loginBtn = document.getElementById('loginBtn');
    if(loginBtn && loginBtn.offsetParent !== null) return false;
    const done = localStorage.getItem('tk_tour_done') || localStorage.getItem('tk_tour_skipped');
    return !done;
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
