const S = {
  user: null,
  threads: [
    {
      id:1, name:"COMP101 — Essay Submissions", date:"Mar 20, 2026",
      criteria:[
        {id:1,name:"Argument Quality",desc:"Central argument is clear, specific, and maintained throughout",pts:20},
        {id:2,name:"Evidence & Sources",desc:"Credible sources cited and used effectively",pts:20},
        {id:3,name:"Structure & Flow",desc:"Logical organization with clear intro, body, and conclusion",pts:15},
        {id:4,name:"Writing Clarity",desc:"Sentence-level clarity, grammar, and consistent academic tone",pts:10}
      ],
      results:[
        {id:1,date:"Mar 22",time:"14:32",total:52,max:65,scores:[
          {n:"Argument Quality",s:16,m:20,fb:"Strong central claim. Supporting reasoning in paragraphs 2–3 could be more specific."},
          {n:"Evidence & Sources",s:14,m:20,fb:"Good use of primary sources. Two citations missing page numbers in section 3."},
          {n:"Structure & Flow",s:13,m:15,fb:"Well-organized overall. Minor topic overlap between body paragraphs 2 and 4."},
          {n:"Writing Clarity",s:9,m:10,fb:"Excellent academic tone. One run-on sentence in paragraph 5."}
        ]},
        {id:2,date:"Mar 23",time:"09:15",total:44,max:65,scores:[
          {n:"Argument Quality",s:11,m:20,fb:"Argument present but underdeveloped. Needs a more explicit thesis statement."},
          {n:"Evidence & Sources",s:10,m:20,fb:"Sources exist but over-reliance on one reference. Broader evidence base needed."},
          {n:"Structure & Flow",s:13,m:15,fb:"Well-organized with clear transitions between all sections."},
          {n:"Writing Clarity",s:10,m:10,fb:"Excellent sentence construction and academic tone throughout."}
        ]}
      ]
    },
    {
      id:2,name:"Data Structures — Final Project",date:"Mar 18, 2026",
      criteria:[
        {id:1,name:"Correctness",desc:"Algorithm produces correct output for all test cases including edge cases",pts:30},
        {id:2,name:"Time Complexity",desc:"Optimal complexity achieved and clearly justified",pts:25},
        {id:3,name:"Code Quality",desc:"Readable, well-commented, properly structured code",pts:20}
      ],
      results:[]
    },
    {
      id:3,name:"Networks — Lab Report",date:"Mar 15, 2026",
      criteria:[
        {id:1,name:"Methodology",desc:"Experimental setup and procedure clearly described",pts:25},
        {id:2,name:"Data Analysis",desc:"Data interpreted correctly with appropriate depth",pts:25},
        {id:3,name:"Conclusion",desc:"Findings connect to theory with limitations acknowledged",pts:20}
      ],
      results:[
        {id:1,date:"Mar 16",time:"11:04",total:58,max:70,scores:[
          {n:"Methodology",s:22,m:25,fb:"Setup well described. Minor gap in variable control explanation."},
          {n:"Data Analysis",s:20,m:25,fb:"Solid quantitative work. Anomaly in trial 3 noted but unexplained."},
          {n:"Conclusion",s:16,m:20,fb:"Strong theory connection. Limitations section too brief."}
        ]}
      ]
    }
  ],
  thread: null,
  parsed: [],
  sidebarOpen: false,
  rubricOpen: false,
};

const FEEDBACK = {
  "Argument Quality":"Central argument is present and clear. The supporting reasoning could be more specific — particularly in the middle paragraphs where the claim drifts slightly.",
  "Evidence & Sources":"Good use of cited material. Two instances where claims lack supporting evidence. Recommend adding citations to the third body paragraph.",
  "Structure & Flow":"Well-organized overall. Introduction sets up the topic clearly. Conclusion could tie back more explicitly to the opening thesis.",
  "Writing Clarity":"Academic tone maintained throughout. A few run-on sentences in the middle section. Grammar is generally strong.",
  "Correctness":"Algorithm handles the main test cases. Edge case with empty input not addressed — this would cause a runtime error.",
  "Time Complexity":"O(n log n) achieved and clearly justified. Could elaborate on why O(n²) was rejected.",
  "Code Quality":"Well-structured and readable. Variable names are descriptive. Missing docstrings on two helper functions.",
  "Methodology":"Setup clearly described. Control variables section needs more detail on how interference was minimized.",
  "Data Analysis":"Quantitative analysis is solid. The anomaly in trial 3 is noted but unexplained.",
  "Conclusion":"Findings connect well to theory. Limitations section acknowledges sample size but not potential data collection bias.",
};

/* ── Auth ── */
function switchAuth(m){
  const isL=m==='login';
  id('form-login').style.display=isL?'flex':'none';
  id('form-register').style.display=isL?'none':'flex';
  id('sw-register').style.display=isL?'block':'none';
  id('sw-login').style.display=isL?'none':'block';
  id('auth-error').style.display='none';
}
function doLogin(){
  const e=id('login-email').value.trim(),p=id('login-pw').value;
  if(!e||!p){showErr('Please fill in all fields.');return;}
  S.user={name:e.split('@')[0],email:e};
  showView('list');
}
function doRegister(){
  const n=id('reg-name').value.trim(),e=id('reg-email').value.trim(),p=id('reg-pw').value;
  if(!n||!e||!p){showErr('Please fill in all fields.');return;}
  if(p.length<8){showErr('Password must be at least 8 characters.');return;}
  S.user={name:n,email:e};
  showView('list');
}
function doLogout(){S.user=null;showView('auth');}
function showErr(m){const el=id('auth-error');el.textContent=m;el.style.display='block';}

/* ── Views ── */
function showView(v){
  document.querySelectorAll('.view').forEach(x=>x.classList.remove('active'));
  id('view-'+v).classList.add('active');
  if(v==='list') renderGrid();
}
function goList(){S.thread=null;S.sidebarOpen=false;showView('list');}

/* ── Thread list ── */
function renderGrid(){
  id('nav-username').textContent=S.user?.name||'';
  const g=id('thread-grid');
  if(!S.threads.length){
    g.innerHTML=`<div class="empty-state">
      <div class="empty-icon"><svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="1" y="1" width="16" height="16" rx="3" stroke="#3a3a38" stroke-width="1"/></svg></div>
      <div class="empty-title">No threads yet</div>
      <div class="empty-desc">Create a grading thread to get started</div>
    </div>`;
    return;
  }
  g.innerHTML=S.threads.map(t=>`
    <div class="thread-card" onclick="openThread(${t.id})">
      <div class="thread-card__name">${t.name}</div>
      <div class="thread-card__tags">
        <span class="badge badge-default">${t.criteria.length} criteria</span>
        <span class="badge badge-default">${t.results.length} graded</span>
      </div>
      <div class="thread-card__footer">
        <span class="thread-card__date">${t.date}</span>
        <span class="thread-card__arrow">→</span>
      </div>
    </div>`).join('');
}

/* ── Thread page ── */
function openThread(tid){
  S.thread=S.threads.find(t=>t.id===tid);
  S.sidebarOpen=false;S.rubricOpen=false;
  id('thread-nav-name').textContent=S.thread.name;
  id('submission-text').value='';
  id('result-area').innerHTML='';
  id('grade-btn').disabled=false;
  id('grade-btn').textContent='Grade submission';
  id('sidebar').classList.remove('open');
  id('rubric-body').style.display='none';
  id('rubric-toggle-btn').textContent='Show';
  renderRubric();
  renderSidebar();
  showView('thread');
}

function renderRubric(){
  const t=S.thread;
  id('rubric-criteria-list').innerHTML=t.criteria.map(c=>`
    <div class="criterion-item">
      <div class="criterion-item__body">
        <div class="criterion-item__name">${c.name}</div>
        <div class="criterion-item__desc">${c.desc}</div>
      </div>
      <div class="criterion-item__pts">${c.pts} pts</div>
    </div>`).join('');
  const total=t.criteria.reduce((s,c)=>s+c.pts,0);
  id('rubric-total').innerHTML=`Total: <strong>${total} pts</strong>`;
}

function toggleRubric(){
  S.rubricOpen=!S.rubricOpen;
  id('rubric-body').style.display=S.rubricOpen?'block':'none';
  id('rubric-toggle-btn').textContent=S.rubricOpen?'Hide':'Show';
}

/* ── Grading ── */
function gradeSubmission(){
  const txt=id('submission-text').value.trim();
  if(!txt){alert('Please paste a submission before grading.');return;}
  const btn=id('grade-btn');
  btn.disabled=true;btn.textContent='Grading...';
  const area=id('result-area');
  const criteria=S.thread.criteria;
  area.innerHTML=`<div class="progress-card">
    <div class="progress-card__title">Grading in progress</div>
    ${criteria.map(c=>`
      <div class="progress-row">
        <span class="progress-name">${c.name}</span>
        <span class="progress-status s-pending" id="ps-${c.id}">Pending</span>
      </div>`).join('')}
  </div>`;
  let i=0;
  function step(){
    if(i>0){const p=id(`ps-${criteria[i-1].id}`);p.textContent='Done';p.className='progress-status s-done';}
    if(i<criteria.length){
      const p=id(`ps-${criteria[i].id}`);p.textContent='Grading...';p.className='progress-status s-active';
      i++;setTimeout(step,820);
    } else finishGrading();
  }
  setTimeout(step,280);
}

function finishGrading(){
  const t=S.thread;
  const scores=t.criteria.map(c=>({
    n:c.name,
    s:Math.min(c.pts,Math.round(c.pts*(0.66+Math.random()*0.28))),
    m:c.pts,
    fb:FEEDBACK[c.name]||"Criterion assessed. Partially meets requirements with room to improve specificity."
  }));
  const total=scores.reduce((a,x)=>a+x.s,0);
  const max=scores.reduce((a,x)=>a+x.m,0);
  const now=new Date();
  const r={id:Date.now(),date:now.toLocaleDateString('en-US',{month:'short',day:'numeric'}),time:now.toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'}),total,max,scores};
  t.results.push(r);
  id('result-area').innerHTML=`<div class="result-card">
    <div class="result-header">
      <div><span class="result-score">${total}</span><span class="result-score-max"> / ${max} pts</span></div>
      <span class="result-date">Just now</span>
    </div>
    ${scores.map(s=>`
      <div class="result-row">
        <div class="result-row-head">
          <span class="result-row-name">${s.n}</span>
          <span class="result-row-pts">${s.s} / ${s.m}</span>
        </div>
        <div class="result-row-fb">${s.fb}</div>
        <div class="score-bar"><div class="score-bar-fill" style="width:${Math.round(s.s/s.m*100)}%"></div></div>
      </div>`).join('')}
  </div>`;
  renderSidebar();
  if(!S.sidebarOpen)openSidebar();
  id('grade-btn').disabled=false;
  id('grade-btn').textContent='Grade submission';
  id('submission-text').value='';
}

/* ── Sidebar ── */
function toggleSidebar(){S.sidebarOpen?closeSidebar():openSidebar();}
function openSidebar(){S.sidebarOpen=true;id('sidebar').classList.add('open');}
function closeSidebar(){S.sidebarOpen=false;id('sidebar').classList.remove('open');}
function renderSidebar(){
  const t=S.thread;const b=id('sidebar-body');
  if(!t.results.length){b.innerHTML='<div class="sidebar-empty">No gradings yet.<br>Submit something to get started.</div>';return;}
  b.innerHTML=[...t.results].reverse().map(r=>`
    <div class="sb-item">
      <div class="sb-item-head" onclick="toggleSbDetail(${r.id})">
        <div class="sb-item-score">${r.total} / ${r.max} pts</div>
        <div class="sb-item-right">
          <span class="sb-item-date">${r.date} · ${r.time}</span>
          <span class="sb-item-pct">${Math.round(r.total/r.max*100)}%</span>
        </div>
      </div>
      <div class="sb-detail" id="sbd-${r.id}">
        ${r.scores.map(s=>`
          <div class="sb-crit">
            <div class="sb-crit-top">
              <span class="sb-crit-name">${s.n}</span>
              <span class="sb-crit-pts">${s.s}/${s.m}</span>
            </div>
            <div class="sb-crit-fb">${s.fb}</div>
          </div>`).join('')}
      </div>
    </div>`).join('');
}
function toggleSbDetail(rid){
  document.querySelectorAll('.sb-detail').forEach(d=>{if(d.id!==`sbd-${rid}`)d.classList.remove('open');});
  document.getElementById(`sbd-${rid}`)?.classList.toggle('open');
}

/* ── Modal ── */
function openModal(){
  id('modal-overlay').classList.add('open');
  id('modal-name').value='';id('rubric-paste').value='';
  id('parsed-preview').classList.remove('visible');
  id('confirm-btn').disabled=true;S.parsed=[];
  setTimeout(()=>id('modal-name').focus(),80);
}
function closeModal(){id('modal-overlay').classList.remove('open');}
function overlayClick(e){if(e.target===id('modal-overlay'))closeModal();}

function parseRubric(){
  const txt=id('rubric-paste').value.trim();
  if(!txt){alert('Please paste rubric text first.');return;}
  S.parsed=[
    {name:"Argument Quality",desc:"Clear, well-supported central argument maintained throughout",pts:20},
    {name:"Evidence & Sources",desc:"Credible sources cited and used effectively",pts:20},
    {name:"Structure & Flow",desc:"Logical organization with clear introduction and conclusion",pts:15}
  ];
  id('parsed-list').innerHTML=S.parsed.map(c=>`
    <div class="parsed-criterion">
      <div class="parsed-criterion__body">
        <div class="parsed-criterion__name">${c.name}</div>
        <div class="parsed-criterion__desc">${c.desc}</div>
      </div>
      <div class="parsed-criterion__pts">${c.pts} pts</div>
    </div>`).join('');
  id('parsed-preview').classList.add('visible');
  id('confirm-btn').disabled=false;
}

function createThread(){
  const name=id('modal-name').value.trim();
  if(!name){alert('Please enter a thread name.');return;}
  if(!S.parsed.length){alert('Please parse a rubric first.');return;}
  const t={id:S.threads.length+1,name,date:new Date().toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}),criteria:S.parsed.map((c,i)=>({id:i+1,...c})),results:[]};
  S.threads.unshift(t);closeModal();openThread(t.id);
}

/* ── Utils ── */
function id(x){return document.getElementById(x);}
