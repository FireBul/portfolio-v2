import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, Github, Linkedin, CheckCircle } from 'lucide-react';
import { submitLead } from '../utils/crm';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    inquiryType: 'project',
    budget: 'under-5k',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitLead(formData);
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', email: '', inquiryType: 'project', budget: 'under-5k', message: '' });
    }, 3000);
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="max-w-6xl mx-auto px-6 py-24"
    >
      <motion.div variants={item} className="mb-16 md:mb-24">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-[1.1] mb-6">
          연락처
        </h1>
        <p className="text-xl text-zinc-400 max-w-2xl leading-relaxed">
          일정·예산·목적 기반으로 빠르게 컨텍스트를 전달할 수 있습니다.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-12 md:gap-24">
        <motion.div variants={item} className="space-y-12">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold tracking-tight">Contact</h2>
            <div className="space-y-4">
              <a href="mailto:jarelrs@gmail.com" className="flex items-center gap-4 text-zinc-400 hover:text-emerald-400 transition-colors group">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-emerald-400/10 transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <span className="text-lg">jarelrs@gmail.com</span>
              </a>
              <a href="tel:+82-10-3810-9130" className="flex items-center gap-4 text-zinc-400 hover:text-emerald-400 transition-colors group">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-emerald-400/10 transition-colors">
                  <Phone className="w-5 h-5" />
                </div>
                <span className="text-lg">010-3810-9130</span>
              </a>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-bold tracking-tight">Professional</h2>
            <div className="space-y-4">
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="flex items-center gap-4 text-zinc-400 hover:text-emerald-400 transition-colors group">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-emerald-400/10 transition-colors">
                  <Linkedin className="w-5 h-5" />
                </div>
                <span className="text-lg">LinkedIn (update 예정)</span>
              </a>
              <a href="https://github.com/FireBul" target="_blank" rel="noreferrer" className="flex items-center gap-4 text-zinc-400 hover:text-emerald-400 transition-colors group">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-emerald-400/10 transition-colors">
                  <Github className="w-5 h-5" />
                </div>
                <span className="text-lg">github.com/FireBul</span>
              </a>
            </div>
          </div>

        </motion.div>

        <motion.div variants={item} className="p-8 md:p-12 rounded-3xl glass-panel h-fit">
          <h2 className="text-2xl font-bold tracking-tight mb-8">문의하기</h2>
          {isSubmitted ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">메시지가 전송되었습니다</h3>
              <p className="text-zinc-400">빠른 시일 내에 답변 드리겠습니다.</p>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-zinc-400">이름 / 소속</label>
                <input 
                  type="text" 
                  id="name" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-400 transition-colors"
                  placeholder="홍길동 / OO컴퍼니"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-zinc-400">이메일</label>
                <input 
                  type="email" 
                  id="email" 
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-400 transition-colors"
                  placeholder="example@company.com"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="inquiryType" className="text-sm font-medium text-zinc-400">문의 유형</label>
                  <select 
                    id="inquiryType"
                    value={formData.inquiryType}
                    onChange={(e) => setFormData({...formData, inquiryType: e.target.value})}
                    className="w-full bg-[#1c1c1c] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-400 transition-colors appearance-none"
                  >
                    <option value="project">프로젝트 의뢰</option>
                    <option value="recruiting">채용 제안</option>
                    <option value="consulting">컨설팅</option>
                    <option value="other">기타</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="budget" className="text-sm font-medium text-zinc-400">예산 범위</label>
                  <select 
                    id="budget"
                    value={formData.budget}
                    onChange={(e) => setFormData({...formData, budget: e.target.value})}
                    className="w-full bg-[#1c1c1c] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-400 transition-colors appearance-none"
                  >
                    <option value="under-5k">500만원 미만</option>
                    <option value="5k-10k">500만 - 1,000만원</option>
                    <option value="10k+">1,000만원 이상</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-zinc-400">문의 내용</label>
                <textarea 
                  id="message" 
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-400 transition-colors resize-none"
                  placeholder="프로젝트 목적, 일정, 예산 등을 간략히 적어주세요."
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-white text-black font-bold rounded-xl px-4 py-4 hover:bg-zinc-200 transition-colors"
              >
                메시지 보내기
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
