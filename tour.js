
// tour.js - نظام نقطة البداية -> نقطة النهاية - منفصل تماما عن المنصة
(function(){
  if(window.__tourLoaded) return; window.__tourLoaded=true;
  console.log("🎯 Tour.js Loaded");
  
  var css = `
    #tourOverlayX{position:fixed;inset:0;background:rgba(0,0,0,0.88);z-index:999999;display:none;backdrop-filter:blur(4px)}
    #tourBoxX{position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);z-index:1000000;background:#1e293b;border:2px solid #f59e0b;border-radius:22px;padding:20px;width:92%;max-width:360px;display:none;box-shadow:0 25px 80px rgba(0,0,0,0.9);font-family:'Tajawal',sans-serif}
    #tourBtnX{background:rgba(245,158,11,0.15);border:1.5px solid #f59e0b;color:#fbbf24;padding:12px 18px;border-radius:99px;font-size:11px;font-weight:900;animation:tourPulse 2s infinite}
    @keyframes tourPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}
  `;
  var style=document.createElement('style'); style.innerHTML=css; document.head.appendChild(style);
  
  var overlay=document.createElement('div'); overlay.id='tourOverlayX'; document.body.appendChild(overlay);
  var box=document.createElement('div'); box.id='tourBoxX'; document.body.appendChild(box);
  
  var steps=[
    {k:'الرئيسية', t:'🏁 نقطة البداية', d:'أهلا بيك في تكنو خريج! دي البداية - هتشوف عدد الخريجين 13 وأهم الأخبار والدفعة'},
    {k:'الخريجين', t:'👥 الخريجين', d:'هنا كل زمايلك الـ 13 خريج. دوس على أي خريج عشان تكلمه في الشات الخاص'},
    {k:'المتصدرين', t:'🏆 المتصدرين', d:'لوحة الشرف: كل تفاعل = نقاط<br>• منشور = 10 نقاط<br>• تعليق = 5<br>• لايك = 2<br>• رسالة شات = 1'},
    {k:'الشات', t:'💬 الشات', d:'كلم زمايلك لحظي - فيه شات فردي وجماعي للدفعة كلها'},
    {k:'المنشورات', t:'📝 المنشورات', d:'انشر صور وذكريات الدفعة هنا. كل منشور بيزود نقاطك في المتصدرين'},
    {k:'حسابي', t:'🎯 نقطة النهاية - بطاقتك', d:'وصلنا للنهاية! 🎉<br>هنا بطاقة الخريج الرسمية<br>• اضغط مطولا على الصورة لحفظها<br>• شاركها على واتساب<br>مبروك انت خريج معتمد!'}
  ];
  var idx=0;
  function goTab(name){
    try{
      var btns=document.querySelectorAll('nav button, button');
      for(var i=0;i<btns.length;i++){
        var txt=(btns[i].textContent||'').trim();
        if(txt.indexOf(name)>=0 || (name==='الرئيسية' && txt.indexOf('الرئيسية')>=0)){
          btns[i].click(); return;
        }
      }
    }catch(e){}
  }
  function render(){
    var s=steps[idx];
    var pct=Math.round((idx+1)/steps.length*100);
    box.innerHTML='<div style="height:4px;background:#334155;border-radius:99px;overflow:hidden;margin-bottom:12px"><div style="height:100%;background:linear-gradient(90deg,#f59e0b,#fbbf24);width:'+pct+'%;transition:width .3s"></div></div><div style="font-weight:900;color:#fbbf24;font-size:15px">'+s.t+'</div><div style="color:#fff;font-size:12px;margin-top:10px;line-height:1.8">'+s.d+'</div><div style="display:flex;gap:8px;margin-top:18px;align-items:center"><button id="tp" style="padding:10px 14px;border-radius:99px;border:none;background:#334155;color:#fff;font-size:11px">السابق</button><div style="flex:1;text-align:center;color:#94a3b8;font-size:11px">'+(idx+1)+'/'+steps.length+'</div><button id="tn" style="padding:10px 18px;border-radius:99px;border:none;background:linear-gradient(90deg,#f59e0b,#fbbf24);color:#000;font-weight:900;font-size:12px">'+(idx==steps.length-1?'إنهاء 🏁':'التالي ➡️')+'</button></div><button id="ts" style="width:100%;margin-top:10px;background:none;border:none;color:#64748b;font-size:11px">تخطي الجولة ✕</button>';
    box.style.display='block';
    document.getElementById('tp').onclick=function(){ if(idx>0){ idx--; go(); } };
    document.getElementById('tn').onclick=function(){ if(idx<steps.length-1){ idx++; go(); }else{ end(); setTimeout(function(){ alert('🎉 مبروك! خلصت الجولة من البداية للنهاية'); },300); } };
    document.getElementById('ts').onclick=end;
  }
  function go(){ goTab(steps[idx].k); setTimeout(render,650); }
  window.startTourX=function(){ idx=0; overlay.style.display='block'; box.style.display='block'; go(); };
  function end(){ overlay.style.display='none'; box.style.display='none'; try{ localStorage.setItem('tourDoneFinal','1'); }catch(e){} }
  window.endTourX=end;
  overlay.onclick=end;
  
  // إضافة زر الجولة في الرئيسية
  function addBtn(){
    try{
      var target=document.querySelector('[onclick*="contactAhmed"]');
      if(target && !document.getElementById('tourBtnX')){
        var b=document.createElement('button');
        b.id='tourBtnX';
        b.innerHTML='🎯 من البداية للنهاية';
        b.onclick=window.startTourX;
        target.parentNode.insertBefore(b, target);
        return true;
      }
    }catch(e){}
    return false;
  }
  var attempts=0;
  var iv=setInterval(function(){ attempts++; if(addBtn() || attempts>30) clearInterval(iv); }, 1000);
  
  setTimeout(function(){
    try{
      if(!localStorage.getItem('tourDoneFinal')){
        if(confirm('👋 أهلا بيك في تكنو خريج!\n\nتحب أعملك جولة سريعة من نقطة البداية 🏁 لنقطة النهاية 🎯 عشان تعرف تستخدم المنصة؟')){
          window.startTourX();
        }else{
          localStorage.setItem('tourDoneFinal','1');
        }
      }
    }catch(e){}
  }, 3500);
})();
