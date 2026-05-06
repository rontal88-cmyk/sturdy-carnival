import { useState, useEffect, useCallback } from 'react';

const TOTAL_SLIDES = 7;

function Slide0() {
  return (
    <div className="text-center my-auto space-y-8">
      <div className="w-24 h-24 bg-teal-50 rounded-3xl flex items-center justify-center mx-auto rotate-3">
        <i className="fa-solid fa-seedling text-5xl text-[#00A3A3]"></i>
      </div>
      <h1 className="text-6xl font-black text-[#002D42] leading-tight">
        אימוץ פרספקטיבה של<br />
        <span className="text-[#00A3A3]">אימפקט מערכתי</span>
      </h1>
      <p className="text-2xl text-slate-500 max-w-2xl mx-auto">
        חממת בוראות | משיפור חוויה נקודתית להתייעלות מערכתית רחבה
      </p>
      <div className="flex justify-center gap-4 pt-10">
        <span className="px-4 py-2 bg-slate-100 rounded-full text-xs font-bold text-slate-500">SYSTEMIC THINKING</span>
        <span className="px-4 py-2 bg-teal-50 rounded-full text-xs font-bold text-teal-600">VALUE-BASED IMPACT</span>
      </div>
    </div>
  );
}

function Slide1() {
  return (
    <>
      <h2 className="text-3xl font-black text-[#002D42] mb-10 border-r-8 border-[#00A3A3] pr-4">
        השיפט: מ"חמלה" ל"ערך"
      </h2>
      <div className="grid grid-cols-2 gap-12 items-center flex-grow">
        <div className="space-y-6">
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
            <h4 className="font-bold text-slate-400 uppercase text-xs mb-2">המבט הליניארי (הישן)</h4>
            <p className="text-slate-700 text-lg">
              טיפול בסימפטום: "המטופלת חרדה, בואו נקל עליה כדי שתרגיש טוב יותר."
            </p>
          </div>
          <i className="fa-solid fa-arrow-down text-teal-500 text-2xl mr-10"></i>
          <div className="p-6 bg-teal-50 rounded-2xl border border-teal-100">
            <h4 className="font-bold text-teal-600 uppercase text-xs mb-2">המבט המערכתי (החדש)</h4>
            <p className="text-[#002D42] text-lg font-bold">
              זיהוי נקודת המינוף: "החרדה יוצרת כשל תפעולי, ביטולי תורים ואי-היענות.
              נפתור את החרדה כדי להציל חיים ולחסוך משאבים."
            </p>
          </div>
        </div>
        <div className="bg-slate-900 rounded-3xl p-10 text-white relative overflow-hidden">
          <i className="fa-solid fa-chart-pie absolute -bottom-10 -left-10 text-9xl opacity-10"></i>
          <h3 className="text-2xl font-bold mb-6 text-teal-400">למה זה חשוב למערכת?</h3>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <i className="fa-solid fa-check text-teal-500 mt-1"></i>
              <span>צמצום No-shows (ביטולי תורים)</span>
            </li>
            <li className="flex items-start gap-3">
              <i className="fa-solid fa-check text-teal-500 mt-1"></i>
              <span>העלאת אחוזי גילוי מוקדם</span>
            </li>
            <li className="flex items-start gap-3">
              <i className="fa-solid fa-check text-teal-500 mt-1"></i>
              <span>ייעול "זמן כיסא" של הצוות</span>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}

function Slide2() {
  return (
    <>
      <h2 className="text-3xl font-black text-[#002D42] mb-6">מודל הקרחון המערכתי</h2>
      <div className="grid grid-cols-12 gap-8 flex-grow items-center">
        <div className="col-span-5 relative">
          <svg viewBox="0 0 200 200" className="w-full">
            <path d="M100,20 L140,80 L60,80 Z" fill="#bae6fd" />
            <path d="M60,80 L140,80 L160,180 L40,180 Z" fill="#0ea5e9" opacity="0.8" />
            <line x1="20" y1="80" x2="180" y2="80" stroke="#0369a1" strokeWidth="2" strokeDasharray="4" />
            <text x="140" y="75" fontSize="8" fill="#0369a1">פני השטח</text>
          </svg>
        </div>
        <div className="col-span-7 space-y-3">
          <div className="p-4 border rounded-xl bg-blue-50 border-blue-200 transition-all duration-300 hover:bg-teal-50 hover:scale-[1.02] cursor-pointer">
            <h4 className="font-bold text-blue-800">1. אירועים (Events)</h4>
            <p className="text-xs text-blue-600">מה קורה עכשיו? (למשל: אישה מבטלת תור לבדיקה)</p>
          </div>
          <div className="p-4 border rounded-xl transition-all duration-300 hover:bg-teal-50 hover:scale-[1.02] cursor-pointer">
            <h4 className="font-bold text-slate-800">2. דפוסים (Patterns)</h4>
            <p className="text-xs text-slate-500">מה קורה לאורך זמן? (למשל: ירידה בהיענות בקרב נשים עם פוסט-טראומה)</p>
          </div>
          <div className="p-4 border rounded-xl transition-all duration-300 hover:bg-teal-50 hover:scale-[1.02] cursor-pointer">
            <h4 className="font-bold text-slate-800">3. מבנים (Structures)</h4>
            <p className="text-xs text-slate-500">איך בנויה המערכת? (למשל: תורים קצרים מדי, חוסר במידע מקדים)</p>
          </div>
          <div className="p-4 border rounded-xl bg-slate-900 text-white transition-all duration-300 hover:scale-[1.02] cursor-pointer">
            <h4 className="font-bold text-teal-400">4. מודלים מנטליים (Mental Models)</h4>
            <p className="text-xs opacity-70">מהי תפיסת העולם? (למשל: "הבדיקה היא אירוע טכני בלבד")</p>
          </div>
        </div>
      </div>
    </>
  );
}

function Slide3() {
  return (
    <>
      <h2 className="text-3xl font-black text-[#002D42] mb-10">ארבעת ממדי האימפקט</h2>
      <div className="grid grid-cols-4 gap-6 flex-grow">
        <div className="p-8 bg-white border-b-4 border-blue-500 rounded-2xl shadow-sm hover:shadow-md transition-all text-center">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="fa-solid fa-gavel text-2xl text-blue-500"></i>
          </div>
          <h4 className="font-bold text-xl mb-4 text-blue-900">אסטרטגי</h4>
          <p className="text-sm text-slate-500">שינוי מדיניות, חקיקה ונהלים ברמה הלאומית.</p>
        </div>
        <div className="p-8 bg-white border-b-4 border-teal-500 rounded-2xl shadow-sm hover:shadow-md transition-all text-center">
          <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="fa-solid fa-sitemap text-2xl text-teal-500"></i>
          </div>
          <h4 className="font-bold text-xl mb-4 text-teal-900">מבני</h4>
          <p className="text-sm text-slate-500">הקצאת משאבים, טכנולוגיה ותשתיות חדשות.</p>
        </div>
        <div className="p-8 bg-white border-b-4 border-purple-500 rounded-2xl shadow-sm hover:shadow-md transition-all text-center">
          <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="fa-solid fa-users text-2xl text-purple-500"></i>
          </div>
          <h4 className="font-bold text-xl mb-4 text-purple-900">תרבותי</h4>
          <p className="text-sm text-slate-500">שינוי נורמות, שפה ושיח ציבורי סביב הבעיה.</p>
        </div>
        <div className="p-8 bg-white border-b-4 border-amber-500 rounded-2xl shadow-sm hover:shadow-md transition-all text-center">
          <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="fa-solid fa-heart text-2xl text-amber-500"></i>
          </div>
          <h4 className="font-bold text-xl mb-4 text-amber-900">אישי/יחסים</h4>
          <p className="text-sm text-slate-500">שינוי אמונות, רמת אמון ותחושת מסוגלות.</p>
        </div>
      </div>
    </>
  );
}

function Slide4() {
  return (
    <>
      <h2 className="text-3xl font-black text-[#002D42] mb-10">דינמיקה של שינוי ארוך טווח</h2>
      <div className="flex-grow flex flex-col justify-center">
        <div className="relative h-64 w-full border-b border-r border-slate-200">
          <svg viewBox="0 0 1000 250" preserveAspectRatio="none" className="w-full h-full">
            <path
              d="M0,230 Q250,220 500,150 T1000,50 L1000,250 L0,250 Z"
              fill="#ccfbf1"
              opacity="0.5"
            />
            <path
              d="M0,230 Q250,220 500,150 T1000,50"
              fill="none"
              stroke="#00A3A3"
              strokeWidth="4"
            />
            <circle cx="500" cy="150" r="6" fill="#002D42" />
            <text x="510" y="145" fontSize="14" fontWeight="bold" fill="#002D42">
              נקודת המינוף
            </text>
          </svg>
          <div className="absolute bottom-[-30px] right-0 text-xs font-bold text-slate-400 uppercase">
            זמן (השקעה במערכת)
          </div>
          <div
            className="absolute top-0 right-[-60px] text-xs font-bold text-slate-400 uppercase"
            style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
          >
            אימפקט מצטבר
          </div>
        </div>
        <div className="mt-16 grid grid-cols-3 gap-8">
          <div className="text-center">
            <h5 className="font-bold text-slate-400">שלב 1</h5>
            <p className="text-sm">טיפול במשברים נקודתיים</p>
          </div>
          <div className="text-center">
            <h5 className="font-bold text-teal-600">שלב 2</h5>
            <p className="text-sm font-bold">שינוי מבני ושינוי תהליכים</p>
          </div>
          <div className="text-center">
            <h5 className="font-bold text-slate-400">שלב 3</h5>
            <p className="text-sm">שינוי פרדיגמה מערכתית</p>
          </div>
        </div>
      </div>
    </>
  );
}

function Slide5() {
  return (
    <>
      <h2 className="text-3xl font-black text-[#002D42] mb-10">צ'ק-ליסט ליזמית בבוראות</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center flex-grow">
        <div className="space-y-6">
          {[
            { num: 1, text: 'מהו הכשל המערכתי שאני פותרת (ולא רק הבעיה האישית)?' },
            { num: 2, text: 'איך הפתרון שלי משפיע על ניצול משאבים וקיצור תורים?' },
            { num: 3, text: 'אילו מחזיקי עניין במערכת ירוויחו מהשינוי הזה (ROI)?' },
          ].map(({ num, text }) => (
            <div
              key={num}
              className="flex items-center gap-6 p-4 rounded-2xl hover:bg-slate-50 transition-all cursor-default group"
            >
              <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center group-hover:bg-teal-500 group-hover:text-white transition-all flex-shrink-0">
                {num}
              </div>
              <p className="font-bold text-lg text-slate-700">{text}</p>
            </div>
          ))}
        </div>
        <div className="bg-teal-600 rounded-3xl p-10 text-white shadow-xl">
          <h4 className="text-2xl font-bold mb-6">משימה לסדנה:</h4>
          <p className="text-lg leading-relaxed opacity-90 italic">
            קחי את הפרויקט שלך ותרגמי "תחושה" ל-"מדד".<br /><br />
            במקום "היא תרגיש פחות לבד",<br />
            כתבי: "היא תזדקק ל-15% פחות ביקורי חירום עקב החרדה".
          </p>
        </div>
      </div>
    </>
  );
}

function Slide6() {
  return (
    <div className="text-center my-auto space-y-10 px-20">
      <i className="fa-solid fa-quote-right text-6xl text-teal-100"></i>
      <h2 className="text-5xl font-black text-[#002D42] leading-tight">
        "חדשנות אמיתית בבריאות לא רק מטפלת בחולה, היא משנה את המערכת שבה החולה מטופל."
      </h2>
      <div className="w-20 h-1 bg-teal-500 mx-auto"></div>
      <p className="text-2xl text-slate-400 font-light">תודה רבה!</p>
    </div>
  );
}

const SLIDES = [Slide0, Slide1, Slide2, Slide3, Slide4, Slide5, Slide6];

export function SystemicImpactPresentationPage() {
  const [current, setCurrent] = useState(0);

  const goNext = useCallback(() => {
    setCurrent((c) => Math.min(c + 1, TOTAL_SLIDES - 1));
  }, []);

  const goPrev = useCallback(() => {
    setCurrent((c) => Math.max(c - 1, 0));
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goNext();
      if (e.key === 'ArrowRight') goPrev();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [goNext, goPrev]);

  const SlideContent = SLIDES[current];
  const progress = ((current + 1) / TOTAL_SLIDES) * 100;

  return (
    <div
      dir="rtl"
      className="min-h-screen flex items-center justify-center p-4 bg-slate-100"
      style={{ fontFamily: "'Assistant', sans-serif" }}
    >
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden relative border border-slate-200">
        {/* Progress bar */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-100 flex">
          <div
            className="h-full bg-[#00A3A3] transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Content */}
        <div
          className="p-12 md:p-16 flex flex-col justify-between"
          style={{ minHeight: '650px', fontFamily: "'Assistant', sans-serif" }}
        >
          <div
            key={current}
            className="flex flex-col flex-grow animate-[fadeSlide_0.4s_ease-out]"
            style={{ animation: 'fadeSlide 0.4s ease-out' }}
          >
            <style>{`
              @keyframes fadeSlide {
                from { opacity: 0; transform: translateY(10px); }
                to   { opacity: 1; transform: translateY(0); }
              }
              h1, h2, h3, h4, h5 {
                font-family: 'Heebo', sans-serif;
              }
            `}</style>
            <SlideContent />
          </div>

          {/* Footer controls */}
          <div className="flex justify-between items-center mt-12">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#002D42] rounded-xl flex items-center justify-center text-white font-bold italic">
                B
              </div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Borot Impact Series
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={goPrev}
                disabled={current === 0}
                className="w-12 h-12 border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:bg-white hover:text-[#002D42] transition-all disabled:opacity-30"
              >
                <i className="fa-solid fa-arrow-right"></i>
              </button>
              <button
                onClick={goNext}
                disabled={current === TOTAL_SLIDES - 1}
                className="w-12 h-12 bg-[#00A3A3] rounded-full flex items-center justify-center text-white shadow-lg shadow-teal-100 hover:bg-[#008a8a] transition-all disabled:opacity-30"
              >
                <i className="fa-solid fa-arrow-left"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
