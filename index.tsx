import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';

// Declare Chart.js, GSAP, and Swiper on window object since we are loading it via CDN
declare global {
  interface Window {
    Chart: any;
    gsap: any;
    ScrollTrigger: any;
    Swiper: any;
  }
}

// --- Constants ---
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyyZ8vxiq0JEA6RuBGLNVsMSDPYYdvh_0gcEZHgD6PKiQInouLsAfRogva5RE9cF0ZPgQ/exec";

const NAV_ITEMS = [
  { id: 'intro', label: '메디클립 소개' },
  { id: 'performance', label: '성공사례' },
  { id: 'packages', label: '패키지' },
  { id: 'services', label: '서비스' },
  { id: 'process', label: '진행과정' },
  { id: 'faq', label: 'FAQ' },
];

const SOLUTION_STEPS = [
    { 
        step: "01",
        title: "브랜드 리포지셔닝", 
        sub: "가격을 지우고 가치 UP",
        desc: (
            <>
                <span className="text-blue-600 font-bold">'공장형 피부과' 이미지 탈피</span><br/>
                → 피부 공학 연구소 및 1:1 퍼스널 스킨 디자인 브랜드로 재정립.<br/><br/>
                <span className="text-blue-600 font-bold">1회차 과잉 상담 탈피</span><br/>
                → 맞춤 피부 데이터 기반 진료로 신뢰 부여.
            </>
        ),
        icon: "💎",
        bgClass: "bg-blue-50",
        textClass: "text-blue-600",
        gradient: "from-blue-500 to-blue-600"
    },
    { 
        step: "02",
        title: <>온·오프라인<br/>락인(Lock-in) 마케팅</>, 
        sub: "Awareness → Trust",
        desc: (
            <>
                <span className="text-indigo-600 font-bold">SNS/유튜브 '닥터 브랜딩' 콘텐츠</span>:<br/>
                "왜 A피부과는 부담 없이 방문해도 되는가?"<br/><br/>
                <span className="text-indigo-600 font-bold">원내(대기실/상담실) 신뢰 지표 배치</span>로 결정 구조에 영향.
            </>
        ),
        icon: "🔒",
        bgClass: "bg-indigo-50",
        textClass: "text-indigo-600",
        gradient: "from-indigo-500 to-indigo-600"
    },
    { 
        step: "03",
        title: <>업무 효율 및<br/>세일즈 자동화 시스템</>, 
        sub: "Chaos → System",
        desc: (
            <>
                <span className="text-violet-600 font-bold">CRM 고도화</span>:<br/>
                이탈/장기 미방문 환자 자동 타겟팅.<br/><br/>
                <span className="text-violet-600 font-bold">상담 스크립트 표준화</span>로<br/>
                3단계 클로징 기법 도입.
            </>
        ),
        icon: "⚙️",
        bgClass: "bg-violet-50",
        textClass: "text-violet-600",
        gradient: "from-violet-500 to-violet-600"
    }
];

const PROCESS_STEPS = [
    { step: '01', title: '정밀 문진', sub: '(무료 진단)', desc: '원장님의 고민, 병원 지표,\n마케팅 현황 파악' },
    { step: '02', title: '진단 및 처방', sub: '(제안)', desc: '상권/경쟁사 분석을 통한\n\'최적 패키지\' 및 전략 제안' },
    { step: '03', title: '킥오프', sub: '(계약)', desc: '전담 매니저 배정,\n실행 스케줄 확정' },
    { step: '04', title: '시술 및 케어', sub: '(실행)', desc: '마케팅 집행, 내부 시스템 구축,\n직원 교육 실행' },
    { step: '05', title: '경과 관찰', sub: '(피드백)', desc: '월간 성과 보고,\n데이터 기반 전략 고도화' }
];

// --- Components ---

const Navbar = ({ activeTab, handleScroll }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScrollListener = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScrollListener);
    return () => window.removeEventListener('scroll', handleScrollListener);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled || isOpen ? 'glass-nav shadow-lg py-3 md:py-4' : 'bg-transparent py-4 md:py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center relative z-50">
        {/* Logo */}
        <a href="#" className="text-xl md:text-2xl font-black text-white tracking-tighter" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); setIsOpen(false); }}>
          MEDICLIP
        </a>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
          {NAV_ITEMS.map((item) => (
            <a 
              key={item.id} 
              href={`#${item.id}`} 
              onClick={(e) => handleScroll(e, item.id)}
              className={`text-sm font-medium transition hover:text-accent-yellow ${activeTab === item.id ? 'text-accent-yellow' : 'text-white'}`}
            >
              {item.label}
            </a>
          ))}
          <a href="https://blog.naver.com/1mediclip" target="_blank" rel="noreferrer" className="text-white hover:text-accent-yellow transition font-medium text-sm">
            블로그
          </a>
          <a 
            href="#marketing-form" 
            onClick={(e) => handleScroll(e, 'marketing-form')}
            className="bg-accent-yellow text-navy-900 px-6 py-2 rounded-full font-bold text-sm hover:bg-yellow-300 transition shadow-lg transform hover:scale-105"
          >
            마케팅 진단
          </a>
        </div>

        {/* Mobile Header Right Side (CTA + Hamburger) */}
        <div className="flex items-center gap-3 md:hidden">
            <a 
                href="#marketing-form" 
                onClick={(e) => handleScroll(e, 'marketing-form')}
                className="bg-accent-yellow text-navy-900 px-3 py-1.5 rounded-full font-bold text-xs hover:bg-yellow-300 transition shadow-md whitespace-nowrap"
            >
                마케팅 진단받기
            </a>
            <button 
                className="text-white text-2xl focus:outline-none" 
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? '✕' : '☰'}
            </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 bg-navy-900 z-40 transition-transform duration-300 ease-in-out md:hidden flex flex-col items-center justify-center space-y-8 h-[100dvh] ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        {NAV_ITEMS.map((item) => (
          <a 
            key={item.id} 
            href={`#${item.id}`} 
            onClick={(e) => { handleScroll(e, item.id); setIsOpen(false); }}
            className="text-white text-2xl font-bold hover:text-accent-yellow transition"
          >
            {item.label}
          </a>
        ))}
         <a 
            href="https://blog.naver.com/1mediclip" 
            target="_blank" 
            rel="noreferrer"
            className="text-white text-2xl font-bold hover:text-accent-yellow transition"
            onClick={() => setIsOpen(false)}
          >
            블로그
          </a>
        <a 
          href="#marketing-form" 
          onClick={(e) => { handleScroll(e, 'marketing-form'); setIsOpen(false); }}
          className="bg-accent-yellow text-navy-900 px-8 py-3 rounded-full font-bold text-xl hover:bg-yellow-300 transition shadow-lg mt-4"
        >
          마케팅 진단 받기
        </a>
      </div>
    </nav>
  );
};

const PrivacyModal = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div className="bg-white text-navy-900 p-6 md:p-8 rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl relative" onClick={e => e.stopPropagation()}>
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-navy-900 transition text-2xl font-bold"
        >
          ✕
        </button>
        <h3 className="text-xl md:text-2xl font-bold mb-6 border-b border-gray-100 pb-4 text-navy-900">[개인정보 수집 및 이용 동의]</h3>
        
        <div className="prose prose-sm text-gray-600 space-y-6 leading-relaxed">
            <p className="font-medium text-navy-900 text-lg">메디클립(이하 '회사')은 고객님의 마케팅 진단 및 상담 문의를 위하여 아래와 같이 개인정보를 수집·이용합니다.</p>
            
            <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                <strong className="block text-navy-900 mb-2 font-bold text-base">1. 수집 및 이용 목적</strong>
                <ul className="list-disc pl-5 space-y-1">
                    <li>마케팅 무료 진단 제공, 병원 경영 컨설팅 상담</li>
                    <li>견적서 발송 및 관련 서비스 안내</li>
                    <li>고객 문의 응대 및 이력 관리</li>
                </ul>
            </div>

            <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                <strong className="block text-navy-900 mb-2 font-bold text-base">2. 수집하는 개인정보의 항목</strong>
                <ul className="list-disc pl-5 space-y-1">
                    <li>필수항목: 병원명, 성함(담당자명), 연락처(휴대전화번호), 문의내용</li>
                    <li>자동수집: 신청 일시, 접속 로그</li>
                </ul>
            </div>

            <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                <strong className="block text-navy-900 mb-2 font-bold text-base">3. 개인정보의 보유 및 이용 기간</strong>
                <ul className="list-disc pl-5 space-y-1">
                    <li>수집 및 이용 목적 달성 시(상담 종료 시)까지</li>
                    <li>단, 관계 법령에 의하여 보존할 필요가 있는 경우 및 마케팅 활용 동의 시 1년간 보관 후 파기</li>
                </ul>
            </div>

            <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                <strong className="block text-navy-900 mb-2 font-bold text-base">4. 동의 거부 권리 및 불이익</strong>
                <ul className="list-disc pl-5 space-y-1">
                    <li>귀하는 개인정보 수집 및 이용에 대한 동의를 거부할 권리가 있습니다.</li>
                    <li>단, 동의를 거부할 경우 마케팅 진단 및 상담 신청이 제한될 수 있습니다.</li>
                </ul>
            </div>
        </div>

        <div className="mt-8 pt-4 text-center">
            <button 
                onClick={onClose} 
                className="bg-navy-900 text-white px-12 py-3 rounded-xl font-bold hover:bg-navy-800 transition shadow-lg transform active:scale-95"
            >
                확인
            </button>
        </div>
      </div>
    </div>
  );
};

const LandingPage = ({ 
  handleScroll, 
  activeTab, 
  setActiveTab, 
  activeNav, 
  setActiveNav,
  handleSubmit,
  isSubmitting,
  openPrivacyModal,
  isPrivacyModalOpen,
  setIsPrivacyModalOpen
}: any) => {

  const horizontalRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for Scroll Animations and Nav Highlighting
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            if (setActiveNav && NAV_ITEMS.find(item => item.id === entry.target.id)) {
                setActiveNav(entry.target.id);
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('.reveal');
    elements.forEach((el) => observer.observe(el));
    
    // Observe sections for scroll spy
    NAV_ITEMS.forEach(item => {
        const el = document.getElementById(item.id);
        if(el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [setActiveNav]);

  // GSAP Horizontal Scroll
  useEffect(() => {
    if (window.gsap && window.ScrollTrigger && horizontalRef.current && trackRef.current) {
        window.gsap.registerPlugin(window.ScrollTrigger);
        
        const mm = window.gsap.matchMedia();

        mm.add("(min-width: 1280px)", () => {
            const sections = window.gsap.utils.toArray('.horizontal-item');
            
            window.gsap.to(sections, {
                xPercent: -100 * (sections.length - 1),
                ease: "none",
                scrollTrigger: {
                    trigger: horizontalRef.current,
                    pin: true,
                    scrub: 1,
                    snap: {
                        snapTo: 1 / (sections.length - 1),
                        duration: { min: 0.2, max: 0.3 },
                        delay: 0.1,
                        ease: "power1.inOut"
                    },
                    end: () => "+=" + (horizontalRef.current!.offsetWidth * 2) 
                }
            });
        });

        return () => mm.revert();
    }
  }, []);

  return (
    <>
      <Navbar activeTab={activeNav} handleScroll={handleScroll} />

      {/* Hero Section */}
      <section className="relative h-screen w-full bg-navy-900 overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 z-0 reveal">
          <iframe 
            src='https://my.spline.design/dashboardui-D3vDc2yU0jX7gzSoqwWVoTOT/' 
            frameBorder='0' 
            width='100%' 
            height='100%'
            className="w-full h-full"
            title="3D Dashboard UI"
          ></iframe>
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/60 to-transparent z-10 pointer-events-none"></div>

        <div className="relative z-20 flex flex-col justify-center items-center text-center px-6 max-w-7xl mx-auto">
          <h2 className="text-accent-yellow text-sm md:text-2xl font-bold mb-4 md:mb-6 tracking-[0.2em] animate-pulse reveal">MEDICAL MANAGEMENT AGENCY</h2>
          
          <h1 className="text-3xl md:text-6xl lg:text-7xl font-bold text-white mb-2 leading-tight reveal delay-100">
            병원 성장의 <span className="text-accent-orange">퀀텀 점프</span>
          </h1>
          
          <div className="h-8 md:h-12"></div>
          
          <p className="text-xl md:text-5xl lg:text-5xl font-bold text-white mb-8 leading-tight reveal delay-200 opacity-90 break-keep">
             메디클립이 현실로 만듭니다.
          </p>

          <a href="#marketing-form" onClick={(e) => handleScroll(e, 'marketing-form')} className="reveal delay-300 mt-4 md:mt-8 bg-accent-yellow hover:bg-yellow-300 text-navy-900 text-lg md:text-2xl px-8 py-4 md:px-12 md:py-5 rounded-full font-bold shadow-2xl shadow-yellow-500/40 transition-all duration-300 transform hover:scale-105 pointer-events-auto">
            우리 병원 마케팅 진단받기
          </a>
        </div>
      </section>

      {/* Intro Section */}
      <section id="intro" className="py-16 md:py-24 bg-navy-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 md:mb-20 reveal">
            <h2 className="text-2xl md:text-5xl font-bold text-white mt-4 leading-tight break-keep">
              <span className="text-accent-yellow block mb-2 md:mb-4">원장님,</span>
              혹시 이런 고민으로<br/>밤잠 설치시나요?
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 mb-16 md:mb-24">
            {[
              { icon: '💸', title: '고비용 저효율', desc: '마케팅 비용은 쓰는데\n신규 환자는 늘지 않나요?' },
              { icon: '📉', title: '환자 이탈 & 관리 부재', desc: '환자가 와도 관리가 안 돼서\n재방문이 없나요?' },
              { icon: '🐢', title: '성장 정체', desc: '옆 병원은 확장하는데\n우리만 제자리인 것 같나요?' },
            ].map((item, idx) => (
              <div key={idx} className={`bg-navy-800 p-8 md:p-10 rounded-3xl border border-white/5 hover:border-accent-yellow/50 transition duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-accent-orange/10 reveal delay-${(idx+1)*100}`}>
                <div className="text-5xl md:text-7xl mb-6 animate-float" style={{animationDelay: `${idx * 1}s`}}>{item.icon}</div>
                <h3 className="text-xl md:text-3xl font-bold text-white mb-4">{item.title}</h3>
                <p className="text-gray-400 text-base md:text-xl leading-relaxed whitespace-pre-line">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-32 md:mt-60 mb-10 md:mb-20 reveal">
            <p className="text-3xl md:text-6xl font-bold text-white mb-8 md:mb-12 break-keep leading-tight">
                메디클립은 <br className="md:hidden" /> <span className="text-accent-orange inline-block border-b-4 border-accent-yellow leading-none pb-1">'마케팅'</span>만 하지 않습니다.
            </p>

            <h2 className="text-2xl md:text-5xl font-bold text-white break-keep">메디클립의 3-Step 병원성장 엔진</h2>
          </div>
          
          <div className="relative flex flex-col md:flex-row items-center justify-center max-w-7xl mx-auto md:-space-x-24 -space-y-10 md:space-y-0 pb-20 pt-10">
            {[
              { 
                step: 1, 
                title: '마케팅 (유입)', 
                subtitle: '"보이게 만들고,\n오게 만듭니다."', 
                details: ['검색 장악', 'SNS 타겟팅', '브랜딩', '광고'], 
                colorClass: 'text-yellow-400', 
                textColorClass: 'text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]',
                badgeColorClass: 'bg-yellow-500 text-slate-900',
                rimColorClass: 'stroke-yellow-600/30'
              },
              { 
                step: 2, 
                title: '컨설팅 (전략)', 
                subtitle: '"이기는 싸움의\n판을 짭니다."', 
                details: ['상권 분석', '진료 컨셉 도출', '경쟁 우위 선점'], 
                colorClass: 'text-orange-500', 
                textColorClass: 'text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]', 
                badgeColorClass: 'bg-orange-600 text-white',
                rimColorClass: 'stroke-orange-700/30'
              },
              { 
                step: 3, 
                title: '시스템 (운영)', 
                subtitle: '"한 번 온 환자를\n충성 고객으로\n만듭니다."', 
                details: ['접점별 응대 매뉴얼', 'DB 관리', '업무 효율화'], 
                colorClass: 'text-blue-800', 
                textColorClass: 'text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]',
                badgeColorClass: 'bg-blue-700 text-white',
                rimColorClass: 'stroke-blue-500/30'
              },
            ].map((item, idx) => (
                <div key={idx} className={`relative group flex flex-col items-center z-10 reveal`} style={{ transitionDelay: `${idx * 150}ms` }}>
                    <div className="relative w-64 h-64 md:w-96 md:h-96 flex items-center justify-center">
                         <div className={`absolute inset-0 w-full h-full flex items-center justify-center ${idx % 2 !== 0 ? 'rotate-[22.5deg]' : ''}`}>
                            <svg 
                                viewBox="0 0 512 512" 
                                className={`w-full h-full drop-shadow-2xl ${item.colorClass} ${idx % 2 === 0 ? 'animate-[spin_20s_linear_infinite]' : 'animate-[spin_20s_linear_infinite_reverse]'}`}
                                style={{ filter: 'drop-shadow(0px 8px 16px rgba(0,0,0,0.6))' }}
                            >
                                 <path fill="currentColor" d="M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z" />
                                 <circle cx="256" cy="256" r="140" strokeWidth="20" fill="none" className={item.rimColorClass} />
                            </svg>
                         </div>
                        <div className={`relative z-10 w-40 h-40 md:w-60 md:h-60 rounded-full flex flex-col justify-center items-center p-4 text-center`}>
                            <div className={`text-sm md:text-xl font-black mb-1 md:mb-2 px-4 py-1 md:px-6 md:py-2 rounded-full shadow-lg transform -translate-y-1 ${item.badgeColorClass}`}>
                                STEP 0{item.step}
                            </div>
                            <h3 className={`text-2xl md:text-5xl font-extrabold mb-1 leading-none drop-shadow-md ${item.textColorClass}`}>
                              <span className="relative inline-block px-1">
                                <span className="absolute inset-x-0 bottom-0 h-6 md:h-12 bg-red-600/90 -z-10 skew-x-[-10deg]"></span>
                                {item.title.split(' ')[0]}
                              </span>
                              <br/>
                              <span className={`text-base md:text-2xl font-bold mt-1 block opacity-95`}>{item.title.split(' ')[1]}</span>
                            </h3>
                            <p className={`block text-xl md:text-2xl font-bold leading-tight mt-1 md:mt-3 opacity-90 whitespace-pre-line ${item.textColorClass}`}>{item.subtitle.replace(/"/g, '')}</p>
                        </div>
                    </div>
                </div>
            ))}
          </div>

          <div className="text-center mt-12 md:mt-20 reveal">
               <p className="text-white text-2xl md:text-3xl leading-relaxed break-keep mb-8 md:mb-12 font-medium">
                이 3가지 본질을 꿰뚫어<br />
                원장님이 꿈꾸는 <span className="font-bold text-accent-yellow">병원의 성장</span>을 설계합니다.
              </p>
               <a href="#marketing-form" onClick={(e) => handleScroll(e, 'marketing-form')} className="inline-block bg-accent-yellow hover:bg-yellow-300 text-navy-900 font-bold text-lg md:text-xl px-10 py-4 rounded-full shadow-lg transition transform hover:scale-105">
                    마케팅 진단 받기
               </a>
          </div>

        </div>
      </section>

      {/* Performance Section */}
      <section id="performance" ref={horizontalRef} className="w-full relative bg-white z-20">
          <div className="w-full h-auto xl:h-screen xl:sticky xl:top-0 xl:overflow-hidden relative">
            <div ref={trackRef} className="w-full h-auto flex flex-col xl:flex-row xl:h-full xl:will-change-transform">
                
                {/* Panel 1 */}
                <div className="horizontal-item w-full h-auto xl:w-screen xl:h-full py-12 md:py-20 px-6 xl:p-0 flex flex-col justify-center items-center relative bg-gradient-to-br from-gray-50 via-white to-red-50 border-b-8 xl:border-b-0 border-gray-100/50 flex-shrink-0">
                     <div className="max-w-7xl w-full mx-auto flex flex-col justify-center h-full">
                        <div className="mb-12 text-center">
                            <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-navy-900 mb-6 leading-tight break-keep tracking-tight">
                                피부과 A의 <br className="md:hidden" />
                                <span className="relative inline-block z-10">
                                   <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600">
                                     월 매출 260% <br className="md:hidden" /> 폭발적 성장기
                                   </span>
                                   <span className="absolute bottom-2 left-0 w-full h-3 bg-yellow-300/40 -z-10 rounded-sm transform -rotate-1"></span>
                                </span>
                            </h2>
                            <div className="inline-block bg-red-100 text-red-600 font-extrabold text-2xl md:text-3xl px-6 py-2 rounded-full mb-8 tracking-wide shadow-md">1. BEFORE</div>
                            <h3 className="text-xl md:text-2xl font-medium text-gray-500 break-keep">"열심히 진료할수록 <span className="text-gray-800 font-bold decoration-wavy underline decoration-red-400">손해 보는 구조</span>였습니다."</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 w-full">
                             {[
                                { title: "수익 구조 붕괴", desc: "가격 경쟁으로 인한\n저가 이벤트 반복", icon: "📉", color: "bg-red-50 text-red-600" },
                                { title: "패키지 부재", desc: "고단가 리프팅\n전환율 5% 미만", icon: "📦", color: "bg-gray-50 text-gray-600" },
                                { title: "저효율 마케팅", desc: "월 2천만원 지출\n체리피커 80%", icon: "💸", color: "bg-gray-50 text-gray-600" },
                                { title: "시스템 부재", desc: "상담 실장\n잦은 퇴사", icon: "🚪", color: "bg-gray-50 text-gray-600" },
                                { title: "브랜드 실종", desc: "차별점 없는\n동네 피부과", icon: "😶", color: "bg-gray-50 text-gray-600" },
                             ].map((item, idx) => (
                                <div key={idx} className={`relative p-8 rounded-3xl border ${idx === 0 ? 'border-red-200 shadow-lg shadow-red-100/50' : 'border-gray-200 shadow-sm md:border-gray-100 md:shadow-sm'} bg-white flex flex-col items-center text-center justify-center group ${idx === 4 ? 'md:col-span-1' : ''}`}>
                                    <div className={`w-20 h-20 md:w-24 md:h-24 rounded-3xl flex items-center justify-center text-5xl md:text-6xl mb-6 ${item.color} group-hover:scale-110 transition-transform`}>{item.icon}</div>
                                    <h4 className="text-2xl md:text-3xl font-bold text-navy-900 mb-4 break-keep leading-tight">{item.title}</h4>
                                    <p className="text-lg md:text-xl text-gray-600 whitespace-pre-line leading-relaxed font-medium">{item.desc}</p>
                                </div>
                             ))}
                        </div>
                     </div>
                </div>

                {/* Panel 2 */}
                <div className="horizontal-item w-full h-auto xl:w-screen xl:h-full py-12 md:py-20 px-6 xl:p-0 flex flex-col justify-center items-center relative bg-gradient-to-br from-white to-blue-50 border-b-8 xl:border-b-0 border-gray-100/50 flex-shrink-0">
                     <div className="max-w-7xl w-full mx-auto flex flex-col justify-center h-full">
                         <div className="mb-12 text-center">
                            <div className="inline-block bg-blue-100 text-blue-600 font-extrabold text-2xl md:text-3xl px-6 py-2 rounded-full mb-8 tracking-wide shadow-md">2. SOLUTION</div>
                            <h3 className="text-3xl md:text-5xl font-black text-navy-900 break-keep mb-4">
                                수익 극대화를 위한 <br className="md:hidden" />
                                <span className="text-blue-600">3대 체질 개선</span>
                            </h3>
                            <p className="text-gray-500 text-lg md:text-xl">"본질적인 가치를 높여 가격 저항을 없앴습니다."</p>
                         </div>
                         
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-stretch">
                            {SOLUTION_STEPS.map((item, idx) => (
                                <div key={idx} className="relative group h-full">
                                    <div className={`absolute inset-0 bg-gradient-to-r ${item.gradient} rounded-[2rem] transform translate-y-2 opacity-0 group-hover:opacity-100 transition duration-300 blur-xl`}></div>
                                    <div className="relative bg-white border border-gray-100 p-8 rounded-[2rem] shadow-xl h-full flex flex-col overflow-hidden hover:border-transparent transition-colors z-10">
                                        <div className="flex justify-between items-start mb-6">
                                            <span className={`inline-block px-3 py-1 rounded-lg text-xs font-bold ${item.bgClass} ${item.textClass}`}>STEP {item.step}</span>
                                            <div className={`text-4xl p-2 rounded-xl ${item.bgClass}`}>{item.icon}</div>
                                        </div>
                                        <h4 className="text-2xl font-bold text-navy-900 mb-1">{item.title}</h4>
                                        <p className={`${item.textClass} font-bold text-sm mb-6 uppercase tracking-wider`}>{item.sub}</p>
                                        <div className="w-full h-px bg-gray-100 mb-6"></div>
                                        <div className="text-gray-600 leading-relaxed whitespace-pre-line relative z-10 text-base flex-1">{item.desc}</div>
                                    </div>
                                </div>
                            ))}
                         </div>
                     </div>
                </div>

                {/* Panel 3 */}
                <div className="horizontal-item w-full h-auto xl:w-screen xl:h-full py-12 md:py-20 px-6 xl:p-0 flex flex-col justify-center items-center relative bg-navy-900 overflow-hidden flex-shrink-0">
                    <div className="absolute top-0 right-0 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-blue-600/20 rounded-full filter blur-[80px] md:blur-[120px] pointer-events-none mix-blend-screen animate-pulse"></div>
                    <div className="absolute bottom-0 left-0 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-accent-orange/10 rounded-full filter blur-[80px] md:blur-[100px] pointer-events-none mix-blend-screen"></div>

                    <div className="max-w-7xl w-full mx-auto flex flex-col justify-center relative z-10 h-full">
                        <div className="mb-8 md:mb-12 text-center">
                            <div className="inline-block bg-accent-yellow text-navy-900 font-extrabold text-2xl md:text-3xl px-6 py-2 rounded-full mb-8 tracking-wide shadow-md">3. AFTER</div>
                            <h3 className="text-3xl md:text-5xl font-black text-white break-keep mb-2">
                                12개월의 기적,<br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-yellow to-accent-orange">지역 1등 브랜드</span> 달성
                            </h3>
                        </div>

                        <div className="bg-white/10 backdrop-blur-2xl rounded-[2.5rem] p-6 md:p-12 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] border border-white/20 relative w-full max-w-6xl mx-auto">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
                            
                            <div className="flex flex-col md:flex-row items-center justify-between gap-10 md:gap-16">
                                <div className="flex-1 w-full max-w-full">
                                    <div className="text-center md:text-left mb-6 md:mb-8 flex justify-center md:justify-start items-center">
                                         <div className="bg-red-600 text-white text-xl md:text-4xl font-black px-6 md:px-8 py-3 md:py-4 rounded-full animate-bounce whitespace-nowrap shadow-[0_0_20px_rgba(220,38,38,0.5)] z-20 border-2 border-white/20 transform hover:scale-110 transition-transform duration-300">
                                            +317% 성장 🔥
                                        </div>
                                    </div>
                                    
                                    <div className="relative flex items-end justify-center md:justify-start gap-4 md:gap-8 h-64 md:h-72 w-full max-w-md mx-auto md:mx-0 p-4 bg-navy-800/50 rounded-2xl border border-white/5 shadow-inner">
                                        <div className="absolute inset-0 flex flex-col justify-between p-4 opacity-20 pointer-events-none">
                                            <div className="w-full h-px bg-white"></div>
                                            <div className="w-full h-px bg-white"></div>
                                            <div className="w-full h-px bg-white"></div>
                                            <div className="w-full h-px bg-white"></div>
                                        </div>

                                        <div className="flex flex-col items-center justify-end h-full z-10 w-1/3">
                                            <div className="mb-2 text-gray-400 font-bold text-base md:text-lg animate-fade-in-up">8.5천</div>
                                            <div className="w-full bg-gray-600/50 rounded-t-lg relative group h-[30%] hover:bg-gray-600 transition-all duration-500">
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-t-lg"></div>
                                            </div>
                                            <div className="mt-3 px-3 py-1 bg-gray-800 rounded-full text-xs font-bold text-gray-400">Before</div>
                                        </div>
                                        
                                        <div className="pb-12 text-accent-yellow text-2xl md:text-3xl animate-pulse hidden sm:block">➔</div>

                                        <div className="flex flex-col items-center justify-end h-full z-10 w-1/3">
                                            <div className="mb-2 text-white font-black text-xl md:text-3xl drop-shadow-glow animate-fade-in-up delay-100">2.7억</div>
                                            <div className="w-full bg-gradient-to-t from-accent-orange to-accent-yellow rounded-t-lg relative shadow-[0_0_20px_rgba(251,191,36,0.3)] h-[95%]">
                                                <div className="absolute inset-0 bg-white/20 rounded-t-lg"></div>
                                                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent skew-x-12 opacity-50"></div>
                                            </div>
                                            <div className="mt-3 px-3 py-1 bg-accent-orange rounded-full text-xs font-bold text-white shadow-lg shadow-orange-500/40">After</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex-1 w-full grid grid-cols-2 gap-4">
                                     {[
                                        { label: "객단가 상승", val: "12만→45만", change: "3.7배", icon: "💰", color: "text-yellow-400" },
                                        { label: "VIP 전환율", val: "5%→48%", change: "안정적", icon: "👑", color: "text-purple-400" },
                                        { label: "광고 효율(ROAS)", val: "62%→260%", change: "고효율", icon: "📈", color: "text-red-400" },
                                        { label: "직원 근속률", val: "22%→80%", change: "조직안정", icon: "🤝", color: "text-blue-400" },
                                    ].map((stat, idx) => (
                                        <div key={idx} className="bg-navy-800/80 border border-white/10 rounded-2xl p-4 md:p-5 hover:bg-white/5 transition duration-300 hover:border-white/30 group">
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="text-2xl md:text-3xl group-hover:scale-110 transition-transform">{stat.icon}</div>
                                                <span className={`text-[10px] md:text-xs font-bold bg-white/10 px-2 py-1 rounded ${stat.color}`}>{stat.change}</span>
                                            </div>
                                            <p className="text-gray-400 text-xs md:text-sm mb-1 font-medium">{stat.label}</p>
                                            <div className="text-base md:text-xl font-bold text-white tracking-tight break-words">{stat.val}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
          </div>
      </section>

      {/* Message & CTA */}
      <section className="py-20 bg-navy-900 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-6 text-center">
            <div className="bg-gradient-to-r from-transparent via-white/5 to-transparent p-8 rounded-3xl">
                <p className="text-gray-200 text-2xl md:text-4xl font-medium leading-relaxed break-keep mb-12">
                    잘 되는 병원은 운이 좋아서가 아닙니다.<br/>
                    <span className="text-accent-yellow font-bold">잘 될 수 밖에 없는 시스템</span>을 갖췄기 때문입니다.<br/>
                    <br className="block"/>
                    <br className="block md:hidden"/>
                    메디클립은 실제 병원 현장에서<br/>
                    경영과 마케팅 노하우를 쌓은 전문가 집단입니다.<br/>
                    <br className="block"/>
                    오랜 실전 경험을 토대로<br/>
                    검증된 마케팅과 시스템을 구축해 드립니다.
                </p>
                <p className="text-white font-bold text-3xl md:text-5xl animate-pulse leading-snug">
                    불경기의 한 숨 대신, <br />
                    <span className="text-accent-orange">폭발적 성장의 주인공</span>이 되시겠습니까?
                </p>
            </div>
            
            <div className="mt-12">
                <a href="#marketing-form" onClick={(e) => handleScroll(e, 'marketing-form')} className="inline-flex items-center gap-3 bg-white text-navy-900 font-bold text-lg md:text-xl px-12 py-5 rounded-full shadow-lg shadow-white/10 hover:bg-gray-100 transition transform hover:scale-105 group">
                    <span>우리 병원 진단받기</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                </a>
            </div>
        </div>
      </section>

      {/* Packages Section */}
      <section id="packages" className="py-16 md:py-24 bg-gray-50 relative z-30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 md:mb-20 reveal">
            <h2 className="text-3xl md:text-5xl font-bold text-navy-900 mt-4 break-keep">원장님이 현재 상황에 딱 맞는 '성장 공식'을 선택하세요.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 mb-20 items-stretch">
            {/* Package 1 */}
            <div className="flex flex-col bg-navy-800 rounded-[2.5rem] shadow-xl border border-navy-700 hover:border-green-500 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 reveal delay-100 overflow-hidden group h-full">
              <div className="p-10 md:p-12 flex flex-col h-full text-center">
                 <div className="w-24 h-24 rounded-3xl bg-green-900/30 flex items-center justify-center text-6xl mb-8 group-hover:scale-110 transition-transform duration-300 mx-auto">🌱</div>
                 <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">스타팅 포인트</h3>
                 <p className="text-green-400 font-bold text-2xl md:text-3xl mb-8">초기 병원 / 1인 의원</p>
                 
                 <p className="text-gray-300 text-xl md:text-2xl mb-10 leading-relaxed break-keep border-b border-gray-700 pb-10 min-h-[120px] flex items-center justify-center font-medium">
                   "이제 막 시작하는 병원,<br/>저비용으로 기틀을 잡고 싶다면"
                 </p>

                 <div className="space-y-6 mb-10 flex-1 text-left">
                    <div className="flex items-start gap-4 justify-center md:justify-start">
                        <span className="text-green-400 text-3xl font-bold mt-1">✓</span>
                        <span className="text-gray-200 text-xl md:text-2xl"><strong>99 마케팅</strong> (기초 노출)</span>
                    </div>
                    <div className="flex items-start gap-4 justify-center md:justify-start">
                        <span className="text-green-400 text-3xl font-bold mt-1">✓</span>
                        <span className="text-gray-200 text-xl md:text-2xl"><strong>199 컨설팅</strong> (경영 진단)</span>
                    </div>
                 </div>

                 <div className="mt-auto pt-8">
                    <span className="inline-block px-8 py-5 bg-green-900/50 text-green-300 rounded-2xl text-xl md:text-2xl font-bold w-full group-hover:bg-green-900 transition-colors">개원 1년 미만 추천</span>
                 </div>
              </div>
            </div>

            {/* Package 2 */}
            <div className="flex flex-col bg-navy-800 rounded-[2.5rem] shadow-xl border border-navy-700 hover:border-accent-orange hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 reveal delay-200 overflow-hidden group h-full">
               <div className="p-10 md:p-12 flex flex-col h-full text-center">
                 <div className="w-24 h-24 rounded-3xl bg-orange-900/30 flex items-center justify-center text-6xl mb-8 group-hover:scale-110 transition-transform duration-300 mx-auto">🚀</div>
                 <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">점핑 포인트</h3>
                 <p className="text-accent-orange font-bold text-2xl md:text-3xl mb-8">성장 정체기 / 경쟁 심화</p>
                 
                 <p className="text-gray-300 text-xl md:text-2xl mb-10 leading-relaxed break-keep border-b border-gray-700 pb-10 min-h-[120px] flex items-center justify-center font-medium">
                   "매출 정체기,<br/>독보적인 컨셉으로 경쟁 우위"
                 </p>

                 <div className="space-y-6 mb-10 flex-1 text-left">
                    <div className="flex items-start gap-4 justify-center md:justify-start">
                        <span className="text-accent-orange text-3xl font-bold mt-1">✓</span>
                        <span className="text-gray-200 text-xl md:text-2xl"><strong>올인원 마케팅</strong> (브랜딩)</span>
                    </div>
                    <div className="flex items-start gap-4 justify-center md:justify-start">
                        <span className="text-accent-orange text-3xl font-bold mt-1">✓</span>
                        <span className="text-gray-200 text-xl md:text-2xl"><strong>199 컨설팅</strong> (전략 수립)</span>
                    </div>
                     <div className="flex items-start gap-4 justify-center md:justify-start">
                        <span className="text-accent-orange text-3xl font-bold mt-1">+</span>
                        <span className="text-gray-200 text-xl md:text-2xl">경쟁 병원 분석 포함</span>
                    </div>
                 </div>

                 <div className="mt-auto pt-8">
                    <span className="inline-block px-8 py-5 bg-orange-900/50 text-orange-300 rounded-2xl text-xl md:text-2xl font-bold w-full group-hover:bg-orange-900 transition-colors">매출 2배 성장 목표</span>
                </div>
              </div>
            </div>

            {/* Package 3 */}
            <div className="flex flex-col bg-navy-800 rounded-[2.5rem] shadow-xl border border-navy-700 hover:border-blue-500 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 reveal delay-300 overflow-hidden group h-full">
              <div className="p-10 md:p-12 flex flex-col h-full text-center">
                 <div className="w-24 h-24 rounded-3xl bg-blue-900/30 flex items-center justify-center text-6xl mb-8 group-hover:scale-110 transition-transform duration-300 mx-auto">💎</div>
                 <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">스케일업 포인트</h3>
                 <p className="text-blue-400 font-bold text-2xl md:text-3xl mb-8">병원 확장 / 중형급 병원</p>
                 
                 <p className="text-gray-300 text-xl md:text-2xl mb-10 leading-relaxed break-keep border-b border-gray-700 pb-10 min-h-[120px] flex items-center justify-center font-medium">
                   "개원부터 확장까지,<br/>경영/마케팅/시스템 완벽 셋팅"
                 </p>

                 <div className="space-y-6 mb-10 flex-1 text-left">
                    <div className="flex items-start gap-4 justify-center md:justify-start">
                        <span className="text-blue-400 text-3xl font-bold mt-1">✓</span>
                        <span className="text-gray-200 text-xl md:text-2xl"><strong>올인원 마케팅</strong></span>
                    </div>
                    <div className="flex items-start gap-4 justify-center md:justify-start">
                        <span className="text-blue-400 text-3xl font-bold mt-1">✓</span>
                        <span className="text-gray-200 text-xl md:text-2xl"><strong>올인원 컨설팅</strong></span>
                    </div>
                    <div className="flex items-start gap-4 justify-center md:justify-start">
                        <span className="text-blue-400 text-3xl font-bold mt-1">✓</span>
                        <span className="text-gray-200 text-xl md:text-2xl"><strong>시스템 플랜</strong> (매뉴얼)</span>
                    </div>
                </div>

                 <div className="mt-auto pt-8">
                    <span className="inline-block px-8 py-5 bg-blue-900/50 text-blue-300 rounded-2xl text-xl md:text-2xl font-bold w-full group-hover:bg-blue-900 transition-colors">퀀텀 점프 솔루션</span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center reveal">
                 <a href="#marketing-form" onClick={(e) => handleScroll(e, 'marketing-form')} className="inline-block bg-accent-yellow hover:bg-yellow-300 text-navy-900 font-bold text-lg md:text-xl px-10 py-4 rounded-full shadow-lg transition transform hover:scale-105">
                    마케팅 진단 받기
                 </a>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 md:py-24 bg-slate-50 relative z-30">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-10 md:mb-16 reveal">
            <h2 className="text-2xl md:text-5xl font-bold text-navy-900">상황에 맞는 최적의 처방전</h2>
          </div>

          <div className="flex flex-nowrap overflow-x-auto justify-center md:justify-center gap-1 md:gap-8 mb-8 md:mb-16 reveal delay-100 px-1 scrollbar-hide pb-4">
            {[
              { id: 'marketing', label: '마케팅 플랜' },
              { id: 'consulting', label: '컨설팅 플랜' },
              { id: 'system', label: '시스템 플랜' }
            ].map((item) => (
              <button 
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                onMouseEnter={() => setActiveTab(item.id as any)}
                className={`flex-shrink-0 px-6 py-4 md:px-12 md:py-5 rounded-full font-black text-base md:text-2xl transition-all duration-300 transform whitespace-nowrap border-2 flex items-center justify-center ${activeTab === item.id ? 'bg-navy-900 text-white border-accent-yellow shadow-[0_0_20px_rgba(251,191,36,0.3)] scale-105 -translate-y-1 z-10' : 'bg-white text-gray-400 border-gray-200 hover:border-accent-yellow hover:text-navy-900 hover:bg-yellow-50 hover:shadow-lg hover:-translate-y-0.5'}`}
              >
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          <div className="text-center max-w-6xl mx-auto min-h-[400px] delay-200">
            {activeTab === 'marketing' && (
              <div className="animate-fade-in-up">
                <p className="text-lg md:text-3xl text-accent-orange font-bold mb-6 md:mb-10 break-keep">"다르게 접근하고, 확실하게 유입시킵니다."</p>
                <div className="grid md:grid-cols-2 gap-6 md:gap-10 text-left">
                  <div className="p-6 md:p-10 bg-accent-yellow rounded-3xl border border-amber-400 shadow-lg hover:shadow-xl transition flex flex-col">
                    <h4 className="text-2xl md:text-4xl font-bold text-navy-900 mb-4">99 마케팅</h4>
                    <p className="text-red-600 font-bold text-lg md:text-2xl mb-6">"보이게 만듭니다"</p>
                    <ul className="text-navy-900 space-y-3 mb-8 text-base md:text-xl flex-1 font-medium">
                      <li className="flex items-center"><span className="text-navy-900 mr-2 font-bold">✓</span>네이버 플레이스 관리</li>
                      <li className="flex items-center"><span className="text-navy-900 mr-2 font-bold">✓</span>네이버 브랜드 블로그</li>
                      <li className="flex items-center"><span className="text-navy-900 mr-2 font-bold">✓</span>인스타그램 피드 관리</li>
                      <li className="flex items-center"><span className="text-navy-900 mr-2 font-bold">✓</span>언론보도</li>
                    </ul>
                    <p className="text-navy-900 text-base md:text-xl pt-6 border-t border-navy-900/20 break-keep font-medium">저비용 고효율 가성비 노출.<br/>초기 병원의 온라인 존재감을 확실히 알립니다.</p>
                  </div>
                  <div className="p-6 md:p-10 bg-accent-yellow rounded-3xl border border-amber-400 shadow-lg hover:shadow-xl transition flex flex-col">
                    <h4 className="text-2xl md:text-4xl font-bold text-navy-900 mb-4">올인원 마케팅</h4>
                    <p className="text-red-600 font-bold text-lg md:text-2xl mb-6">"브랜딩으로 설득합니다"</p>
                    <ul className="text-navy-900 space-y-3 mb-8 text-base md:text-xl flex-1 font-medium">
                      <li className="flex items-center"><span className="text-navy-900 mr-2 font-bold">✓</span>채널별 병원 맞춤 브랜딩</li>
                      <li className="flex items-center"><span className="text-navy-900 mr-2 font-bold">✓</span>오프라인 광고</li>
                      <li className="flex items-center"><span className="text-navy-900 mr-2 font-bold">✓</span>CRM 연동</li>
                    </ul>
                    <p className="text-navy-900 text-base md:text-xl pt-6 border-t border-navy-900/20 break-keep font-medium">단순 노출을 넘어선 팬덤 확보.<br/>병원의 격을 높여 충성 고객을 만듭니다.</p>
                  </div>
                </div>
                <div className="mt-10 bg-white p-6 md:p-8 rounded-2xl text-left border border-gray-100 shadow-md">
                  <p className="text-gray-600 italic text-base md:text-xl break-keep">"개원 초라 막막했는데, 가성비있게 네이버부터 인스타그램까지 병원을 노출시켰어요."</p>
                  <p className="font-bold text-navy-900 mt-4 text-base md:text-xl">- OO정형외과 김원장님 (99마케팅 이용)</p>
                </div>
              </div>
            )}
            {activeTab === 'consulting' && (
              <div className="animate-fade-in-up">
                <p className="text-lg md:text-3xl text-accent-orange font-bold mb-6 md:mb-10 break-keep">"성장의 판을 짜고, 로드맵을 제시합니다."</p>
                <div className="grid md:grid-cols-2 gap-6 md:gap-10 text-left">
                  <div className="p-6 md:p-10 bg-accent-yellow rounded-3xl border border-amber-400 shadow-lg hover:shadow-xl transition flex flex-col">
                    <h4 className="text-2xl md:text-4xl font-bold text-navy-900 mb-4">199 컨설팅</h4>
                    <p className="text-red-600 font-bold text-lg md:text-2xl mb-6">"경영 진단 & 기초 설계"</p>
                    <ul className="text-navy-900 space-y-3 mb-8 text-base md:text-xl flex-1 font-medium">
                      <li className="flex items-center"><span className="text-navy-900 mr-2 font-bold">✓</span>마케팅 정밀 진단</li>
                      <li className="flex items-center"><span className="text-navy-900 mr-2 font-bold">✓</span>기초 진료 전략 수립</li>
                    </ul>
                    <p className="text-navy-900 text-base md:text-xl pt-6 border-t border-navy-900/20 break-keep font-medium">시행착오 최소화.<br/>정밀 진단으로 새는 돈을 막고 기초 체력을 기릅니다.</p>
                  </div>
                  <div className="p-6 md:p-10 bg-accent-yellow rounded-3xl border border-amber-400 shadow-lg hover:shadow-xl transition flex flex-col">
                    <h4 className="text-2xl md:text-4xl font-bold text-navy-900 mb-4">올인원 컨설팅</h4>
                    <p className="text-red-600 font-bold text-lg md:text-2xl mb-6">"퀀텀 성장 설계"</p>
                    <ul className="text-navy-900 space-y-3 mb-8 text-base md:text-xl flex-1 font-medium">
                      <li className="flex items-center"><span className="text-navy-900 mr-2 font-bold">✓</span>입지 분석 / 인테리어</li>
                      <li className="flex items-center"><span className="text-navy-900 mr-2 font-bold">✓</span>HR (직원교육)</li>
                      <li className="flex items-center"><span className="text-navy-900 mr-2 font-bold">✓</span>온/오프라인 통합 전략</li>
                    </ul>
                    <p className="text-navy-900 text-base md:text-xl pt-6 border-t border-navy-900/20 break-keep font-medium">중장기 매출 향상 & 브랜딩.<br/>개원부터 확장까지 빈틈없는 성공 방정식을 씁니다.</p>
                  </div>
                </div>
                <div className="mt-10 bg-white p-6 md:p-8 rounded-2xl text-left border border-gray-100 shadow-md">
                  <p className="text-gray-600 italic text-base md:text-xl break-keep">"마케팅에 아무리 많은 비용을 쏟아부어도 뭔가 부족한 느낌이 있었는데 ‘199 컨설팅’을 받고 그 부족한 1%를 찾을 수 있었어요."</p>
                  <p className="font-bold text-navy-900 mt-4 text-base md:text-xl">- OO치과 김원장님 (199컨설팅 이용)</p>
                </div>
              </div>
            )}
            {activeTab === 'system' && (
              <div className="animate-fade-in-up">
                <div className="mb-8 md:mb-10">
                   <span className="inline-block bg-navy-900 text-accent-yellow px-4 py-1 rounded-full text-sm md:text-base font-bold mb-3 animate-bounce">오직 메디클립에만 있는 솔루션!</span>
                   <p className="text-lg md:text-3xl text-accent-orange font-bold break-keep">"빈틈없는 병원 운영을 위한 메디클립만의 필살기"</p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6 md:gap-10 text-left">
                  <div className="p-6 md:p-10 bg-navy-900 rounded-3xl text-white hover:scale-[1.02] transition duration-300 flex flex-col shadow-2xl border border-white/10">
                    <h4 className="text-2xl md:text-4xl font-bold text-accent-yellow mb-4">🔄 DB 새로고침</h4>
                    <p className="text-base md:text-xl font-bold mb-6 text-gray-200 break-keep">"병원 특성에 맞춘 개인화 타겟팅으로<br/>잠자고 있는 환자데이터를 깨웁니다"</p>
                    <ul className="text-gray-300 space-y-3 mb-8 text-base md:text-xl flex-1">
                      <li className="flex items-center"><span className="text-accent-orange mr-2">✓</span>구환 DB 리타겟팅</li>
                      <li className="flex items-center"><span className="text-accent-orange mr-2">✓</span>최신 로직 노출 장악</li>
                    </ul>
                    <p className="text-gray-400 text-base md:text-xl pt-6 border-t border-white/20 break-keep">광고비 '0'원으로 매출 증대.<br/>놓치고 있던 재방문 매출을 확보합니다.</p>
                  </div>
                  <div className="p-6 md:p-10 bg-navy-900 rounded-3xl text-white hover:scale-[1.02] transition duration-300 flex flex-col shadow-2xl border border-white/10">
                    <h4 className="text-2xl md:text-4xl font-bold text-white mb-4">⚙️ 스마트 워크 시스템</h4>
                    <p className="text-base md:text-xl font-bold mb-6 text-gray-200 break-keep">"데스크, 처치실, 마케팅실의 업무가 뒤섞여 있나요?<br/>복잡한 병원 업무, 심플하게 정리!"</p>
                    <ul className="text-gray-300 space-y-3 mb-8 text-base md:text-xl flex-1">
                      <li className="flex items-center"><span className="text-accent-orange mr-2">✓</span>데스크/진료실/마케팅실 업무 통합 및 효율화</li>
                    </ul>
                    <p className="text-gray-400 text-base md:text-xl pt-6 border-t border-white/20 break-keep">의료진이 오직 '진료'와 '환자'에만 집중할 수 있는 환경으로 전환.<br/>직원 효율 상승으로 인건비 절감 효과까지.</p>
                  </div>
                </div>
                <div className="mt-10 bg-white p-6 md:p-8 rounded-2xl text-left border border-gray-100 shadow-md">
                  <p className="text-gray-600 italic text-base md:text-xl break-keep">"마케팅도 중요하지만 내부가 엉망이었죠. 업무 시스템 도입 후엔 직원들이 알아서 움직입니다. 제가 진료에만 집중하게 된 게 가장 큽니다."</p>
                  <p className="font-bold text-navy-900 mt-4 text-base md:text-xl">- OO피부과 박원장 (스마트 워크 시스템 이용)</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section id="process" className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 md:mb-20 reveal">
            <h2 className="text-2xl md:text-5xl font-bold text-navy-900 break-keep">체계적인 ‘메디클립’ 업무 프로세스</h2>
            <p className="text-gray-600 mt-6 text-base md:text-xl break-keep">"병원의 진료 프로세스처럼,<br/>메디클립도 체계적으로 진단하고 처방합니다."</p>
          </div>
          
          <div className="md:hidden px-4 pb-8">
             <div className="space-y-4">
                {PROCESS_STEPS.map((item, idx) => (
                   <div key={idx} className="bg-white p-5 rounded-2xl shadow-md border border-gray-100 text-left flex flex-col justify-center">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-accent-orange font-black text-sm">STEP {item.step}</div>
                        <h4 className="font-bold text-navy-900 text-lg">{item.title}</h4>
                      </div>
                      <p className="text-xs text-gray-500 mb-1 font-medium">{item.sub}</p>
                      <p className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">{item.desc}</p>
                   </div>
                ))}
             </div>
          </div>

          <div className="hidden md:grid grid-cols-5 gap-4">
            {PROCESS_STEPS.map((item, idx) => (
              <div key={idx} className={`bg-white p-6 rounded-2xl shadow-md border border-gray-100 text-center relative hover:translate-y-[-5px] transition duration-300 reveal delay-${(idx+1)*100}`}>
                {idx < 4 && <div className="hidden md:block absolute top-1/2 -right-6 transform -translate-y-1/2 text-gray-300 z-10 text-2xl">▶</div>}
                <div className="text-accent-orange font-black text-xl mb-3">STEP {item.step}</div>
                <h4 className="font-bold text-navy-900 text-xl mb-2">{item.title}</h4>
                <p className="text-sm text-gray-500 mb-4">{item.sub}</p>
                <p className="text-base text-gray-600 whitespace-pre-line">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-2xl md:text-5xl font-bold text-navy-900 text-center mb-16 reveal break-keep">원장님이 가장 궁금해하시는 질문들</h2>
          <div className="space-y-6">
            {[
              { q: '메디클립은 일반 병원 마케팅 대행사와 무엇이 다른가요?', a: `일반 대행사는 상위 노출이나 조회수 같은 '단순 지표'에 집중하지만, 메디클립은 병원 경영 컨설팅을 기반으로 '실제 매출 성장'을 목표로 합니다. 마케팅으로 환자를 부르는 것(유입)뿐만 아니라, [시스템]을 통해 재방문을 유도하고 [경영 전략]으로 경쟁 우위를 선점하는 3-Step 성장 엔진(마케팅+컨설팅+시스템)을 제공한다는 점이 가장 큰 차이점입니다.` },
              { q: '이제 막 개원한 1인 의원(소규모 의원)입니다. 컨설팅 비용이 부담스러운데 괜찮을까요?', a: `네, 초기 병원을 위한 '스타팅 포인트(Starting Point)' 패키지가 준비되어 있습니다. 무조건 고가의 컨설팅을 제안하지 않고, [99 마케팅]과 [199 컨설팅]을 결합하여 합리적인 예산으로 병원의 온라인 존재감을 알리고 기초 경영 기틀을 잡을 수 있도록 가성비 높은 성장 공식을 제안해 드립니다.` },
              { q: '마케팅 비용은 계속 쓰는데 신규 환자가 늘지 않습니다. 무엇이 문제일까요?', a: `'밑 빠진 독'에 물을 붓고 계실 가능성이 큽니다. 노출은 되지만 병원의 [브랜딩]이 약하거나, 유입된 환자를 잡는 [내부 시스템]이 부재하기 때문입니다. 메디클립은 무료 마케팅 진단을 통해 마케팅 효율이 떨어지는 원인을 진단하고, 단순 노출을 넘어 환자가 스스로 찾아오게 만드는 브랜드 리포지셔닝 전략을 제시합니다.` },
              { q: '우리 병원 상황에 맞는 패키지는 어떻게 선택해야 하나요?', a: `병원의 성장 단계에 따라 최적의 처방전이 다릅니다.

스타팅 포인트: 개원 1년 미만, 초기 기틀 마련
점핑 포인트: 성장 정체기, 경쟁 심화 지역, 매출 돌파구 필요
스케일업 포인트: 병원 개원, 확장 및 퀀텀 점프, 시스템 완벽 셋팅 필요

상담 시 원장님의 병원 데이터를 분석하여 가장 시급한 솔루션을 제안해 드립니다.` },
              { q: '컨설팅 후 실제 매출이 오른 사례가 있나요?', a: `네, 데이터로 증명합니다.
예를 들어, 메디클립의 솔루션을 도입한 A 피부과의 경우 월 매출이 8,500만 원에서 2억 7,000만 원으로 317% 상승했습니다.
특히 고가 패키지 전환율이 5% 미만에서 48%로 급증하며 수익 구조 자체가 개선되었습니다. 이러한 성과는 [객단가 상승]과 [광고비 절감]이 동시에 이루어졌기 때문에 가능했습니다.` },
              { q: "'병원 시스템'을 구축한다는 것이 구체적으로 어떤 의미인가요?", a: `병원 시스템 구축이란 의료진이 진료에만 집중할 수 있는 환경을 만드는 것입니다. 메디클립의 [스마트 워크 시스템]은 뒤섞인 데스크, 처치실, 마케팅실의 업무를 심플하게 정리하고, 접점별 응대 매뉴얼과 DB 리타겟팅 프로세스를 도입하여 직원 의존도를 낮추고 업무 효율을 극대화하는 솔루션입니다.` },
              { q: '새로운 시스템을 도입하면 기존 직원들이 힘들어하지 않을까요?', a: `오히려 업무가 명확해져 직원 만족도가 올라갑니다. 메디클립의 솔루션은 불필요한 감정 소모와 중복 업무를 줄이는 방향으로 설계됩니다. 실제로 시스템 도입 후 직원 근속률이 22%에서 80%로 상승한 사례가 있듯이, 업무 가이드라인이 잡히면 직원들은 본연의 업무에 집중할 수 있어 장기적으로 조직이 안정화됩니다.` },
              { q: "'DB 새로고침'이나 '리타겟팅'은 무엇인가요?", a: `잠자고 있는 구환(기존 환자) 데이터를 깨워 매출로 연결하는 전략입니다. 신규 환자 유치에는 많은 비용이 들지만, [구환 DB 리타겟팅]은 광고비 '0'원으로도 매출을 만들 수 있는 고효율 전략입니다. 병원 특성에 맞춘 개인화 메시지를 통해 잊혀진 환자의 재방문을 유도하고 충성 고객으로 전환시킵니다.` },
              { q: '성형외과나 피부과 같은 비급여 진료과만 가능한가요?', a: `아닙니다. 메디클립은 성형/피부과 등 미용 병원뿐만 아니라 정형외과, 내과, 치과, 한의원 등 보험/비급여 진료과 특성에 맞는 맞춤형 전략을 보유하고 있습니다. 진료 과목별로 환자의 방문 경로와 의사결정 포인트가 다르기 때문에, 해당 과목에 특화된 차별화된 소구점(USP)을 발굴하여 마케팅을 진행합니다.` },
              { q: '이제 막 개원을 준비 중인데, 언제부터 컨설팅을 받는 게 좋나요?', a: `성공적인 개원을 위해서는 최소 개원 3~6개월 전부터 컨설팅을 시작하는 것을 권장합니다. 메디클립은 입지 및 상권 분석부터 시작하여, 경쟁 병원 분석, 병원 네이밍 및 브랜딩, 인테리어 컨셉 도출, 사전 마케팅(Pre-marketing)까지 개원 타임라인에 맞춘 단계별 솔루션을 제공하여 개원 첫 달부터 안정적인 매출을 낼 수 있도록 돕습니다.` },
              { q: '의료법이 까다로운데, 마케팅 진행 시 법적인 문제는 없나요?', a: `메디클립은 의료법을 철저히 준수하는 것을 제1원칙으로 합니다. 최신 의료법 가이드라인을 숙지한 전문 에디터와 검수 팀이 콘텐츠를 제작하며, 허위/과장 광고나 환자 유인 알선 등 법적 리스크가 있는 마케팅은 절대 진행하지 않습니다. 안전하고 지속 가능한 브랜딩을 통해 병원의 신뢰도를 높여 '병원의 격'을 높이는 안전한 마케팅을 집행합니다.` }
            ].map((item, idx) => (
              <details key={idx} className={`group bg-white p-6 md:p-8 rounded-2xl cursor-pointer border border-gray-100 shadow-sm transition hover:shadow-md reveal delay-${(idx % 3 + 1) * 100}`}>
                <summary className="flex justify-between items-center font-bold text-navy-900 text-lg md:text-2xl">
                  <span className="flex-1 pr-4 break-keep">Q{idx+1}. {item.q}</span>
                  <span className="transition group-open:rotate-180 flex-shrink-0">▼</span>
                </summary>
                <div className="text-gray-600 mt-6 pl-4 md:pl-6 border-l-4 border-accent-orange leading-relaxed text-base md:text-xl animate-fade-in-up break-keep whitespace-pre-line">
                  A. {item.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Form Section */}
      <section id="cta-section" className="py-16 md:py-24 bg-navy-900">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16 md:mb-20 reveal">
            <h2 className="text-2xl md:text-5xl font-bold text-white mb-6 break-keep">오늘도 환자는 '준비된 병원'을 찾아갑니다.</h2>
            <p className="text-gray-300 text-lg md:text-2xl break-keep">경영 진단부터 마케팅, 시스템 구축까지.<br/>원장님은 진료만 하세요.<br/>나머지는 메디클립이 해결합니다.</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">
            <div className="lg:w-1/2 text-white reveal delay-100 w-full">
              <h3 className="text-2xl md:text-4xl font-bold mb-8 text-accent-yellow">문의 채널</h3>
              <div className="space-y-6">
                <a href="http://pf.kakao.com/_xbtRxcn" target="_blank" rel="noreferrer" className="flex items-center space-x-6 bg-[#FEE500] text-black px-6 md:px-8 py-6 rounded-2xl font-bold hover:opacity-90 transition transform hover:scale-105">
                  <span className="text-4xl">💬</span>
                  <div className="text-left">
                    <div className="text-base md:text-lg opacity-70">실시간 상담</div>
                    <div className="text-xl md:text-2xl">카카오톡 채널 상담하기</div>
                  </div>
                </a>
                <a href="https://talk.naver.com/ct/wclj4fn?frm=mnmb&frm=nmb_detail&resizeTo=1423,765nidref=https%3A%2F%2Fpcmap.place.naver.com%2Fplace%2F2058802324%2Fhome%3Fentry%3Dplt%26from%3Dmap%26fromPanelNum%3D1%26additionalHeight%3D76%26timestamp%3D202601091059%26locale%3Dko%26svcName%3Dmap_pcv5" target="_blank" rel="noreferrer" className="flex items-center space-x-6 bg-[#03C75A] text-white px-6 md:px-8 py-6 rounded-2xl font-bold hover:opacity-90 transition transform hover:scale-105">
                  <span className="text-4xl">N</span>
                  <div className="text-left">
                    <div className="text-base md:text-lg opacity-70">빠른 문의</div>
                    <div className="text-xl md:text-2xl">네이버 톡톡 문의하기</div>
                  </div>
                </a>
              </div>
              <div className="mt-12 p-8 bg-navy-800 rounded-2xl border border-white/10">
                <p className="text-gray-300 leading-relaxed text-base md:text-xl break-keep">
                  병원 현장을 잘 아는 병원 경영·마케팅 전문가들이<br/>
                  병원의 진짜 가치를 발굴해 전달하는<br/>
                  <span className="text-white font-bold">메디컬 전문 경영 컨설팅·마케팅 대행사입니다.</span>
                </p>
              </div>
            </div>

            <div className="lg:w-1/2 w-full reveal delay-200">
              <form id="marketing-form" name="mediclip-form" onSubmit={handleSubmit} className="bg-white p-8 md:p-10 rounded-3xl shadow-2xl scroll-mt-28">
                <h3 className="text-2xl md:text-4xl font-bold text-navy-900 mb-8">우리 병원 마케팅 진단 신청하기</h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-base md:text-lg font-medium text-gray-700 mb-2">병원명</label>
                    <input type="text" name="hospital" required className="w-full px-6 py-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-accent-orange focus:border-transparent outline-none transition text-base md:text-lg" placeholder="예: 메디클립 의원" />
                  </div>
                  <div>
                    <label className="block text-base md:text-lg font-medium text-gray-700 mb-2">성함 / 직함</label>
                    <input type="text" name="name" required className="w-full px-6 py-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-accent-orange focus:border-transparent outline-none transition text-base md:text-lg" placeholder="예: 김지민 원장" />
                  </div>
                  <div>
                    <label className="block text-base md:text-lg font-medium text-gray-700 mb-2">핸드폰 번호</label>
                    <input type="tel" name="phone" required className="w-full px-6 py-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-accent-orange focus:border-transparent outline-none transition text-base md:text-lg" placeholder="010-1234-5678" />
                  </div>
                  <div>
                    <label className="block text-base md:text-lg font-medium text-gray-700 mb-2">문의 내용</label>
                    <textarea name="message" className="w-full px-6 py-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-accent-orange focus:border-transparent outline-none transition text-base md:text-lg" placeholder="문의 내용을 입력해주세요 (선택)" rows={3}></textarea>
                  </div>
                </div>

                <div className="mt-6 mb-2">
                    <div className="flex items-start">
                        <div className="flex items-center h-5">
                            <input
                                id="privacy-agreement"
                                name="privacyAgreement"
                                type="checkbox"
                                required
                                className="w-5 h-5 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-accent-orange cursor-pointer"
                            />
                        </div>
                        <label htmlFor="privacy-agreement" className="ml-3 text-sm font-medium text-gray-500">
                            (필수) <button type="button" onClick={openPrivacyModal} className="text-navy-900 font-bold underline hover:text-accent-orange underline-offset-4">개인정보 수집 및 이용</button>에 동의합니다.
                        </label>
                    </div>
                </div>

                <button type="submit" disabled={isSubmitting} className="w-full bg-accent-yellow text-navy-900 font-bold text-xl md:text-2xl py-5 rounded-2xl mt-4 hover:bg-yellow-300 transition shadow-lg transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
                  {isSubmitting ? '전송 중...' : '우리 병원 마케팅 진단 신청하기'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-navy-900 text-white py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center justify-center text-center">
            <span className="text-3xl font-black tracking-tighter mb-6 text-white">MEDICLIP</span>
            <div className="text-sm text-gray-400 space-y-1">
                <p className="font-bold text-white text-lg mb-2">메디클립</p>
                <p>사업자등록번호 702-17-02664</p>
                <p>서울 강남구 강남대로112길 47 2층</p>
                <p>1mediclip@gmail.com</p>
                <p>개인정보관리책임자 김지민</p>
                <p>
                    <button onClick={() => setIsPrivacyModalOpen(true)} className="hover:text-white underline underline-offset-4">개인정보처리방침</button>
                </p>
                <p className="mt-4 text-xs opacity-60">© 2025 MEDICLIP. All rights reserved.</p>
            </div>
        </div>
      </footer>

      {isPrivacyModalOpen && <PrivacyModal onClose={() => setIsPrivacyModalOpen(false)} />}
    </>
  );
};

const App = () => {
  const [activeTab, setActiveTab] = useState('marketing');
  const [activeNav, setActiveNav] = useState('intro');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

  const handleScroll = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setActiveNav(id);
    }
  };

  const openPrivacyModal = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setIsPrivacyModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const form = e.currentTarget;
    const formData = new FormData(form);

    fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      body: formData,
      mode: 'no-cors',
    })
      .then(() => {
        alert("신청이 완료되었습니다. 담당자가 곧 연락드리겠습니다.");
        form.reset();
      })
      .catch((error) => {
        console.error('Error!', error.message);
        alert("오류가 발생했습니다. 다시 시도해주세요.");
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <LandingPage 
      handleScroll={handleScroll}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      activeNav={activeNav}
      setActiveNav={setActiveNav}
      handleSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      openPrivacyModal={openPrivacyModal}
      isPrivacyModalOpen={isPrivacyModalOpen}
      setIsPrivacyModalOpen={setIsPrivacyModalOpen}
    />
  );
};

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(<App />);
}