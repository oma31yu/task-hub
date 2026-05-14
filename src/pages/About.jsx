import React from 'react';

const About = () => {
  return (
    <div className="max-w-2xl mx-auto p-4 animate-in fade-in duration-500 mt-10">
      {/* Зөвхөн аппын товч танилцуулга хэсэг үлдээв */}
      <div className="text-center space-y-4 bg-slate-100 dark:bg-slate-800 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <h1 className="text-3xl font-black text-blue-600 dark:text-blue-400">
          Mini TaskHub
        </h1>
        <p className="text-sm font-medium text-slate-600 dark:text-slate-300 max-w-xl mx-auto leading-relaxed">
          Энэхүү аппликейшн нь таны өдөр тутмын хийх ажлын жагсаалт (Tasks) болон тэмдэглэлүүдийг (Notes) нэг дороос цэгцтэй хөтлөхөд туслах зорилготой React дээр суурилсан бүтээгдэхүүн юм.
        </p>
        <div className="pt-4 border-t border-slate-200 dark:border-slate-700 text-xs text-slate-400 dark:text-slate-500 font-semibold tracking-wider uppercase flex justify-center gap-3">
          <span>React</span> • <span>Context API</span> • <span>Tailwind CSS</span> • <span>JSONPlaceholder</span>
        </div>
      </div>
    </div>
  );
};

export default About;