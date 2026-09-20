
// تكنو خريج - نظام الجولة التعريفية الحقيقي 100% - فعال ومجرب
// يظهر تلقائياً لأي مستخدم جديد + زرار في الرئيسية يرجعله في أي وقت
(function(){
  const STEPS = [
    {
      id: 'welcome',
      title: 'أهلاً بيك في تكنو خريج 🎓',
      desc: 'منصة بتجمع كل الخريجين - هتتعلم تستخدمها في 60 ثانية بس. دوس التالي.',
      icon: '🎓', color: 'linear-gradient(135deg,#f59e0b,#fbbf24)',
      target: null, // center screen
      pos: 'center'
    },
    {
      id: 'الرئيسية',
      title: '🏠 الرئيسية - البداية',
      desc: 'هنا بتشوف إحصائيات المنصة، رسالة ترحيب، ودعوة لزمايلك. دي أول حاجة بتشوفها لما تدخل.',
      icon: '🏠', color: 'linear-gradient(135deg,#f59e0b,#fbbf24)',
      target: 'الرئيسية', pos: 'top'
    },
    {
      id: 'الخريجين',
      title: '👥 الخريجين - شبكتك',
      desc: 'كل الخريجين المسجلين هنا. تقدر تبحث وتتواصل مع أي حد. دوس على (شات) عشان تكلم أي زميل.',
      icon: '👥', color: 'linear-gradient(135deg,#3b82f6,#8b5cf6)',
      target: 'الخريجين', pos: 'top'
    },
    {
      id: 'المتصدرين',
      title: '🏆 المتصدرين - لوحة الشرف',
      desc: 'أكتر ناس بتتفاعل في المنصة. كل تفاعل بيديك نقاط: منشور=10، تعليق=5، لايك=2، شات=1. اجمع نقاط وابقى بطل المنصة!',
      icon: '🏆', color: 'linear-gradient(135deg,#f59e0b,#d97706)',
      target: 'المتصدرين', pos: 'top'
    },
    {
      id: 'المختبر',
      title: '🧪 المختبر - أدواتك',
      desc: '6 أدوات مهمة: منشئ CV احترافي، حاسبة المعدل GPA، مولد QR، أسئلة انترفيو، حاسبة راتب، وبورتفوليو. دوس على أي أداة عشان تفتحها.',
      icon: '🧪', color: 'linear-gradient(135deg,#10b981,#06b6d4)',
      target: 'المختبر', pos: 'top'
    },
    {
      id: 'الشات',
      title: '💬 الشات - تواصل مباشر',
      desc: 'رسائل خاصة بينك وبين زمايلك، ومجموعات زي (دفعة تكنولوجيا 2023) و (فرص عمل). كل الرسائل آمنة ومحمية.',
      icon: '💬', color: 'linear-gradient(135deg,#8b5cf6,#ec4899)',
      target: 'الشات', pos: 'top'
    },
    {
      id: 'المنشورات',
      title: '📝 المنشورات - شارك إنجازك',
      desc: 'انشر إنجازاتك، أفكارك، أو اسأل سؤال. زمايلك يقدروا يعملوا إعجاب وتعليق ومشاركة. تفاعلك بيزود نقاطك!',
      icon: '📝', color: 'linear-gradient(135deg,#f43f5e,#f59e0b)',
      target: 'المنشورات', pos: 'top'
    },
    {
      id: 'حسابي',
      title: '👤 حسابي - بروفايلك',
      desc: 'صورتك، بياناتك، لوحة تحكم الأدمن لو أنت أدمن، وإدارة المستخدمين والمنشورات. تقدر تغير صورتك من هنا.',
      icon: '👤', color: 'linear-gradient(135deg,#6b7280,#374151)',
      target: 'حسابي', pos: 'top'
    },
    {
      id: 'finish',
      title: 'جاهز تنطلق؟ 🚀',
      desc: 'كده عرفت كل حاجة! المنصة دي اتعملت عشان تجمعنا كلنا كخريجين ونساعد بعض. ابدأ دلوقتي وادعو زمايلك!',
      icon: '🚀', color: 'linear-gradient(135deg,#10b981,#06b6d4)',
      target: null, pos: 'center'
    }
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
        <button id="tk-close" style="width:28px;height:28px;border-radius:50%;background:#1e293b;color:#fff;border:none;cursor:pointer">✕</button>
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
    overlay.onclick = (e)=>{ if(e.target===overlay) nextStep(); };
  }

  function findTarget(tabName){
    if(!tabName) return null;
    // يدور على زرار التاب في البوتوم ناف
    const buttons = document.querySelectorAll('button');
    for(let btn of buttons){
      const oc = btn.getAttribute('onclick')||'';
      if(oc.includes(`tab='${tabName}'`) || oc.includes(`tab="${tabName}"`) || btn.textContent.includes(tabName)){
        return btn;
      }
    }
    // لو مالقاش، يدور بالنص
    const all = document.querySelectorAll('*');
    for(let el of all){
      if(el.textContent.trim()===tabName && el.offsetParent!==null){
        return el;
      }
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
    stepEl.textContent = `${index+1} / ${STEPS.length}`;
    nextBtn.textContent = index===STEPS.length-1 ? 'ابدأ الآن 🚀' : 'التالي →';

    dotsEl.innerHTML = '';
    STEPS.forEach((_,i)=>{
      const dot = document.createElement('div');
      dot.className = 'tk-dot' + (i===index ? ' active' : '');
      dotsEl.appendChild(dot);
    });

    if(step.target){
      const target = findTarget(step.target);
      if(target){
        const rect = target.getBoundingClientRect();
        spotlight.style.display = 'block';
        spotlight.style.left = (rect.left-8)+'px';
        spotlight.style.top = (rect.top-8)+'px';
        spotlight.style.width = (rect.width+16)+'px';
        spotlight.style.height = (rect.height+16)+'px';

        // position tooltip
        const tooltipRect = tooltip.getBoundingClientRect();
        let top, left;
        if(step.pos==='top'){
          top = rect.top - tooltipRect.height - 20;
          left = Math.max(10, Math.min(window.innerWidth-tooltipRect.width-10, rect.left + rect.width/2 - tooltipRect.width/2));
          if(top<10){ top = rect.bottom + 20; }
        } else {
          top = window.innerHeight/2 - tooltipRect.height/2;
          left = window.innerWidth/2 - tooltipRect.width/2;
        }
        tooltip.style.top = top+'px';
        tooltip.style.left = left+'px';
      } else {
        spotlight.style.display = 'none';
        tooltip.style.top = '50%';
        tooltip.style.left = '50%';
        tooltip.style.transform = 'translate(-50%,-50%) scale(1)';
      }
    } else {
      spotlight.style.display = 'none';
      tooltip.style.top = '50%';
      tooltip.style.left = '50%';
      tooltip.style.transform = 'translate(-50%,-50%) scale(1)';
      tooltip.style.position = 'fixed';
    }

    overlay.classList.add('on');
    spotlight.style.display = step.target ? 'block' : 'none';
    setTimeout(()=>tooltip.classList.add('on'),50);

    try{ if(navigator.vibrate) navigator.vibrate(30); }catch(e){}
  }

  function nextStep(){
    tooltip.classList.remove('on');
    setTimeout(()=>{
      showStep(curStep+1);
    },200);
  }

  function endTour(finished=false){
    overlay.classList.remove('on');
    tooltip.classList.remove('on');
    spotlight.style.display = 'none';
    if(finished){
      localStorage.setItem('tk_tour_done','1');
      showConfetti();
      if(window.toast) toast('🎉 أهلاً بيك في تكنو خريج! ابدأ رحلتك الآن');
    } else {
      localStorage.setItem('tk_tour_skipped','1');
    }
  }

  function showConfetti(){
    const c = document.createElement('div');
    c.id = 'tk-confetti';
    c.innerHTML = '<div style="position:absolute;top:0;left:50%;font-size:24px;animation:confettiFall 2s ease-out forwards">🎉 🎓 🚀 ✨ 🎉</div><style>@keyframes confettiFall{0%{transform:translateY(-100px) translateX(-50%) rotate(0deg);opacity:1}100%{transform:translateY(100vh) translateX(-50%) rotate(720deg);opacity:0}}</style>';
    document.body.appendChild(c);
    setTimeout(()=>c.remove(),2500);
  }

  function startTour(){
    createElements();
    curStep = 0;
    showStep(0);
  }

  function addHelpButton(){
    // يدور على الرئيسية ويضيف زرار
    const check = setInterval(()=>{
      const homeContent = document.querySelector('#app, [class*="الرئيسية"], main');
      // يدور على أول كارد برتقالي في الرئيسية
      const orangeCard = document.querySelector('[style*="orange"], [class*="bg-orange"], [class*="gradient"]');
      // لو لقى الرئيسية أو أي مكان، يضيف الزرار
      const existing = document.getElementById('tk-help-btn-home');
      if(existing) { clearInterval(check); return; }

      // يحاول يضيف في الرئيسية
      const mainArea = document.body; // هنضيفه fixed مؤقتاً للمعاينة
      if(document.getElementById('tk-help-btn-home')) return;

      const btn = document.createElement('button');
      btn.id = 'tk-help-btn-home';
      btn.innerHTML = `
        <div style="width:32px;height:32px;border-radius:10px;background:linear-gradient(135deg,#f59e0b,#fbbf24);display:flex;align-items:center;justify-content:center">❓</div>
        <div style="text-align:right;flex:1">
          <p style="font-weight:900;font-size:12px;color:#fff;margin:0">كيف تستخدم المنصة؟</p>
          <p style="font-size:10px;color:#9aa4b2;margin:2px 0 0 0">دليل سريع 60 ثانية</p>
        </div>
        <div style="color:#fbbf24">→</div>
      `;
      btn.onclick = startTour;
      
      // حاول تلاقي مكان في الرئيسية
      const homeSection = document.querySelector('div[class*="p-"], #app');
      if(homeSection && homeSection.firstChild){
        // هنضيفه بعد أول كارد
        const firstCard = homeSection.querySelector('div');
        if(firstCard && firstCard.parentNode){
          firstCard.parentNode.insertBefore(btn, firstCard.nextSibling);
          clearInterval(check);
        }
      }
    },1000);

    // زرار عائم احتياطي لو مالقاش مكان
    setTimeout(()=>{
      if(!document.getElementById('tk-help-btn-home-fixed')){
        const fixedBtn = document.createElement('button');
        fixedBtn.id = 'tk-help-btn-home-fixed';
        fixedBtn.style.cssText = 'position:fixed;bottom:88px;left:12px;z-index:80;background:linear-gradient(135deg,#f59e0b,#fbbf24);color:#000;font-weight:900;font-size:11px;padding:10px 16px;border-radius:999px;border:none;box-shadow:0 8px 24px rgba(251,191,36,0.5);font-family:Tajawal,sans-serif;cursor:pointer;display:none';
        fixedBtn.textContent = '❓ كيف تستخدم المنصة؟';
        fixedBtn.onclick = startTour;
        document.body.appendChild(fixedBtn);
        // اظهره لو المستخدم مسجل
        setInterval(()=>{
          if(typeof logged!=='undefined' && logged){
            fixedBtn.style.display = 'flex';
          }
        },1000);
      }
    },2000);
  }

  // تشغيل تلقائي للمستخدم الجديد
  window.addEventListener('load', ()=>{
    createElements();
    addHelpButton();
    
    setTimeout(()=>{
      const done = localStorage.getItem('tk_tour_done');
      const skipped = localStorage.getItem('tk_tour_skipped');
      const isNewUser = !done && !skipped;
      
      // لو مستخدم جديد (أول مرة) أو لو مفيش علامة إنه شاف الجولة
      if(isNewUser){
        // استنى 1.5 ثانية بعد التحميل عشان المنصة تحمل
        setTimeout(startTour, 1500);
      }
    },1000);
  });

  // API عالمي
  window.startTekhnoTour = startTour;
  window.TekhnoTour = { start: startTour, steps: STEPS };
  
  console.log('✅ نظام الجولة التعريفية تكنو خريج جاهز - فعال 100%');
})();
