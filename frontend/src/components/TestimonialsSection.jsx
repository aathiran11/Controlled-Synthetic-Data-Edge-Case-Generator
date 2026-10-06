import React from 'react';
import { Star, Quote } from 'lucide-react';

export default function TestimonialsSection() {
  const reviews = [
    {
      quote: "SynthData AI allowed our team to generate thousands of rare logistical delay edge-cases in minutes. It exposed critical flaws in our ML model before we shipped to production.",
      author: "Dr. Aris Thorne",
      role: "VP of AI Systems, Global Logistics Corp",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&fit=crop&q=80"
    },
    {
      quote: "The combination of Gemini natural language schema planning and Scikit-Learn downstream stress testing is genius. We reduced our data prep cycle by 80%.",
      author: "Elena Rostova",
      role: "Lead Machine Learning Architect",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&fit=crop&q=80"
    },
    {
      quote: "The What-If scenario simulator is incredible. Being able to programmatically spike edge cases without wasting API tokens saved us thousands of dollars.",
      author: "Marcus Vance",
      role: "Principal Data Engineer",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&fit=crop&q=80"
    }
  ];

  return (
    <section className="mb-20">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="px-4 py-1.5 rounded-full glass-pill-ultra text-[#c5fc34] text-xs font-bold uppercase tracking-wider border border-[#c5fc34]/30">
          User Testimonials
        </span>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mt-4 font-display">
          Trusted by <span className="text-[#c5fc34]">AI engineers worldwide</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.map((rev, i) => (
          <div
            key={i}
            className="glass-card-ultra p-7 rounded-[32px] flex flex-col justify-between"
          >
            <div>
              <div className="flex text-amber-400 mb-4">
                {[...Array(5)].map((_, starIdx) => (
                  <Star key={starIdx} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-300 italic leading-relaxed mb-6 font-sans">
                "{rev.quote}"
              </p>
            </div>

            <div className="flex items-center space-x-3 pt-4 border-t border-white/10">
              <img
                src={rev.avatar}
                alt={rev.author}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-[#c5fc34]/50"
              />
              <div>
                <h4 className="text-xs font-bold text-white">{rev.author}</h4>
                <p className="text-[11px] text-slate-400">{rev.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
