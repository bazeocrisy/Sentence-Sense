/* Sentence Sense 2 learning engine. All student content is authored in data modules.
   DOM textContent is used for both content and student responses. */
(function(){
'use strict';
const C=window.SS_CURRICULUM,P=window.SS_PROGRESS,$=id=>document.getElementById(id);
const modes={teach:'Teach',guided:'Practice Together',independent:'On My Own',test:'Test'};
let epoch=0,opener=null;
function node(tag,text,cls){const e=document.createElement(tag);if(text!==undefined)e.textContent=text;if(cls)e.className=cls;return e;}
function add(host,...els){els.forEach(e=>host.append(e));return host;}
function button(text,fn,cls){const b=node('button',text,cls);b.type='button';const version=epoch;b.addEventListener('click',()=>{if(version===epoch)fn();});return b;}
function para(host,text,cls){return add(host,node('p',text,cls));}
function title(text,small){const h=node('h1',text);h.tabIndex=-1;add($('main'),h);if(small)para($('main'),small,'muted');return h;}
function warning(){const w=$('storage-warning');w.textContent=P.warning;w.hidden=!P.warning;}
function save(){P.save();warning();}
function go(hash){if(location.hash===hash)render();else location.hash=hash;}
function lesson(id,mode='teach'){go(`#lesson/${id}/${mode}`);}
function dialog(name,fill){opener=document.activeElement;const d=$('dialog');$('dialog-title').textContent=name;$('dialog-body').replaceChildren();fill($('dialog-body'));d.showModal();}
function confirmAction(name,text,fn){dialog(name,host=>{para(host,text);add(host,button('Confirm',()=>{$('dialog').close();fn();},'danger'));});}
function current(){const [route,id,mode]=location.hash.slice(1).split('/');return {route:route||'home',id,mode};}
function home(){
 title('Where will your next sentence take you?','Build your skills, one clear step at a time.');
 const mark=P.data.bookmark;const grid=node('div',undefined,'grid');
 if(mark){const l=C.lessons.find(l=>l.id===mark.id),r=P.record(l.id),s=r.sessions[mark.mode];const card=node('section',undefined,'card recommended');
 add(card,node('span','Your place is saved','pill'),node('h2','Continue Learning'));para(card,`Unit ${l.unit+1} · ${l.title}`);para(card,`${modes[mark.mode]} · ${mark.mode==='teach'?`page ${r.teachStep+1} of 5`:s?.submitted?'results':`question ${(s?.pos||0)+1} of ${mark.mode==='test'?29:mark.mode==='independent'?10:12}`}`);add(card,button('Continue Learning',()=>lesson(l.id,mark.mode),'primary'));add(grid,card);}
 const first=C.lessons.find(l=>!P.record(l.id).teachDone)||C.lessons[0];
 const path=node('section',undefined,'card recommended');add(path,node('span','Recommended','pill'),node('h2','Follow My Learning Path'));para(path,'Start with complete thoughts, then build toward your own writing.');para(path,`Next teaching lesson: Unit ${first.unit+1} · ${first.title}`);add(path,button(mark?'Open Learning Path':'Start My Learning Path',()=>lesson(first.id),'primary'));add(grid,path);
 const browse=node('section',undefined,'card');add(browse,node('h2','Choose a Lesson'));para(browse,'Browse every unit. Review any lesson or choose a learning step.');add(browse,button('Choose a Lesson',()=>go('#lessons')));add(grid,browse);add($('main'),grid);
 const panel=node('section',undefined,'panel');add(panel,node('h2','Turn your ideas into writing'));para(panel,'Build, expand, fix, and combine sentences. Then write paragraphs, stories, opinions, or Weekend News.');add(panel,button('Open Writing Lab',()=>go('#writing')));add($('main'),panel);
 para($('main'),'No account needed. A grown-up reviews original writing; practice help never counts as independent mastery.','muted');
}
function lessonList(){
 title('All Lessons','Choose any lesson. The numbered units show the suggested path; review is always open.');
 const label=node('label','Find a lesson');label.htmlFor='lesson-search';const input=node('input');input.id='lesson-search';input.type='text';input.placeholder='Try nouns, paragraphs, or punctuation';input.className='search';const list=node('div');add($('main'),label,input,list);
 function fill(){list.replaceChildren();let count=0;C.units.forEach((u,unit)=>{const lessons=C.lessons.filter(l=>l.unit===unit&&(`${l.title} ${l.definition}`.toLowerCase().includes(input.value.toLowerCase())));if(!lessons.length)return;add(list,node('h2',`Unit ${unit+1} · ${u}`));const grid=node('div',undefined,'grid');lessons.forEach(l=>{count++;const r=P.record(l.id),card=node('section',undefined,'card');add(card,node('h3',l.title));para(card,l.objective);const status=r.results.some(x=>x.mastered)?'Mastery demonstrated':r.teachDone?'Teaching completed':'Ready to learn';add(card,node('span',status,'pill'),button('Open '+l.title,()=>lesson(l.id),'primary'));add(grid,card);});add(list,grid);});if(!count)para(list,'No lessons match. Try a different word.');}
 input.addEventListener('input',fill);fill();
}
function stageNav(l,mode){const bar=node('nav',undefined,'stage-tabs');bar.setAttribute('aria-label','Learning steps');Object.entries(modes).forEach(([key,name])=>{const b=button(name,()=>lesson(l.id,key));if(mode===key)b.setAttribute('aria-current','step');add(bar,b);});add($('main'),bar);}
function studyGuide(l){dialog(l.title+' · Study Guide',host=>{para(host,l.objective);para(host,l.definition);const ol=node('ol');l.steps.forEach(t=>add(ol,node('li',t)));add(host,ol);para(host,'Watch out: '+l.mistake);const q=C.example(l.id);para(host,q.context,'sentence');para(host,q.reason);});}
function lessonPage(id,mode){
 const l=C.lessons.find(l=>l.id===id);if(!l||!modes[mode]){title('That lesson link could not be found.');add($('main'),button('All Lessons',()=>go('#lessons')));return;}
 P.bookmark(id,mode);warning();para($('main'),`Unit ${l.unit+1} · ${C.units[l.unit]}`,'eyebrow');title(l.title);
 stageNav(l,mode);
 if(mode==='teach')teach(l);else activity(l,mode);
}
function teacherNote(host,text){const d=node('details');add(d,node('summary','Grown-up guidance'));para(d,text);add(host,d);}
function teach(l){
 const r=P.record(l.id),step=r.teachStep||0;const names=['Understand the idea','Watch it work','Use the steps','Avoid a common mistake','Check your understanding'];
 para($('main'),`Teach · page ${step+1} of 5 · ${names[step]}`,'muted');
 const panel=node('section',undefined,'panel');add(panel,node('h2',names[step]));const q=C.example(l.id);
 if(step===0){para(panel,l.objective,'pill');para(panel,l.definition);add(panel,node('h3','Why it matters'));para(panel,l.why);teacherNote(panel,'Read together if needed. Ask the student to explain the idea in their own words. Move at a comfortable pace; this path is a suggested order, not placement.');}
 if(step===1){para(panel,'Read it first.');para(panel,q.context,'sentence');add(panel,node('h3','See how it works'));para(panel,q.reason);if(['subject','complete-subject','builder','complete'].includes(l.id)){const s=C.contexts[0],parts=node('div',undefined,'breakdown');const left=node('div',undefined,'part');add(left,node('small','COMPLETE SUBJECT'),node('span',s.subject));const right=node('div',undefined,'part');add(right,node('small','PREDICATE'),node('span',s.predicate));add(parts,left,right);add(panel,parts);}const legacyMap={'verbs':'verb','subject':'subject','complete-subject':'complete-subject','nouns':'noun','describers':'adjective'};const old=window.SS_LEARN_CONTENT.topics[legacyMap[l.id]];if(old){const d=node('details');add(d,node('summary','Another worked example'));const ex=old.example;para(d,ex.sentence.words.join(' '),'sentence');ex.points.forEach(t=>para(d,t));add(panel,d);}}
 if(step===2){const ol=node('ol');l.steps.forEach(t=>add(ol,node('li',t)));add(panel,ol);para(panel,q.context,'sentence');para(panel,'Apply the steps: '+q.reason);}
 if(step===3){para(panel,l.mistake,'feedback');para(panel,q.context,'sentence');para(panel,q.reason);}
 let checkPassed=false;
 if(step===4){para(panel,q.context,'sentence');para(panel,q.prompt);const choices=node('div',undefined,'choices'),feedback=node('p',undefined,'feedback');feedback.hidden=true;feedback.setAttribute('role','status');shuffle(q.choices).forEach(c=>{const b=button(c.text,()=>{feedback.hidden=false;feedback.textContent=c.feedback;if(c.id==='key'){checkPassed=true;next.disabled=false;b.disabled=true;}});add(choices,b);});add(panel,choices,feedback);}
 add($('main'),panel);
 const rail=node('div',undefined,'action-rail'),back=button(step===0?'Back to All Lessons':'Back',()=>{if(step===0)go('#lessons');else{r.teachStep--;save();render();}}),next=button(step===4?'Start Practice Together':'Next',()=>{if(step===4){if(!checkPassed)return;r.teachDone=true;save();lesson(l.id,'guided');}else{r.teachStep++;save();render();}},'primary');
 if(step===4)next.disabled=true;add(rail,back,button('Study Guide',()=>studyGuide(l)),next);add($('main'),rail);add($('main'),button('Restart Lesson',()=>confirmAction('Restart this lesson?', 'Restart teaching and current guided work. Finished results and saved writing stay available.',()=>{r.teachStep=0;r.teachDone=false;delete r.sessions.guided;save();lesson(l.id,'teach');})));
}
function shuffle(a){const v=a.slice();for(let i=v.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[v[i],v[j]]=[v[j],v[i]];}return v;}
function canonical(text,caseSensitive){const t=String(text||'').trim().replace(/[‘’]/g,"'").replace(/[“”]/g,'"').replace(/\s+/g,' ');return caseSensitive?t:t.toLowerCase();}
function isRight(q,a){if(q.type==='choice')return a.selection==='key';if(q.type==='short')return canonical(a.text,['capitals','dialogue','word-choice'].includes(q.skill))===canonical(q.answer,['capitals','dialogue','word-choice'].includes(q.skill));return false;}
function hasResponse(q,a){return q.type==='choice'?a.selection!==null:a.text.trim().length>0;}
function getQuestions(l,mode,s){return C.questions(l.id,mode,s.form,s.seed);}
function finish(l,mode,s,qs){s.submitted=true;if(mode==='test')s.answers.forEach((a,i)=>{if(qs[i].type!=='writing')a.correct=isRight(qs[i],a);});P.result(l.id,mode,s,qs);save();render();}
function activity(l,mode){
 const s=P.session(l.id,mode),qs=getQuestions(l,mode,s);if(s.submitted){results(l,mode,s,qs);return;}
 const q=qs[s.pos],a=s.answers[s.pos],isTest=mode==='test',n=s.pos;const count=qs.length;
 para($('main'),`${modes[mode]} · Question ${n+1} of ${count}${isTest?' · Form '+(s.form%2===0?'A':'B'):''}`,'muted');const prog=node('progress');prog.max=count;prog.value=n+1;prog.setAttribute('aria-label',`Question ${n+1} of ${count}`);add($('main'),prog);
 if(isTest)para($('main'),'Complete all 29 questions, then submit. Your work saves here if you leave. Writing is reviewed by a grown-up after submission. No hints or answers appear during the test.','notice');
 if(mode==='independent'&&n===0)para($('main'),'Try each problem first. Help unlocks after an attempt. First-attempt answers without help are counted separately.','notice');
 const panel=node('section',undefined,'panel');add(panel,node('h2',q.prompt));if(q.context)para(panel,q.context,'sentence');
 if(!a.order.length&&q.choices)a.order=shuffle(q.choices.map(c=>c.id));
 let input;
 if(q.type==='choice'){
  const choices=node('div',undefined,'choices');choices.setAttribute('role','group');choices.setAttribute('aria-label','Answer choices');
  a.order.forEach(id=>{const c=q.choices.find(c=>c.id===id);const b=button(c.text,()=>{a.selection=id;if(!isTest){attempt(l,mode,s,qs,q,a);return;}save();render();});b.setAttribute('aria-pressed',String(a.selection===id));if(!isTest&&a.done)b.disabled=true;add(choices,b);});add(panel,choices);
 }else{
  if(q.type==='short'){
   const bank=node('div',undefined,'wordbank');para(bank,'Response bank · type one complete option exactly as shown.');const ul=node('ul');const key=C.questions(l.id,'test',0)[n];if(!a.order.length)a.order=shuffle(key.choices.map(c=>c.id));a.order.forEach(id=>add(ul,node('li',key.choices.find(c=>c.id===id).text)));add(bank,ul);add(panel,bank);
  }
  const label=node('label',q.type==='writing'?'Your writing':'Your answer');label.htmlFor='response';input=node('textarea');input.id='response';input.maxLength=12000;input.value=a.text;input.rows=q.type==='writing'?7:3;input.addEventListener('input',()=>{a.text=input.value;save();});add(panel,label,input);
  if(q.type==='writing'){
   const checklist=node('details');add(checklist,node('summary','Writing checklist'));q.criteria.forEach(c=>para(checklist,'• '+c));add(panel,checklist);para(panel,'Your writing is saved as your own work. A grown-up will review it; the app does not judge original writing automatically.','muted');
  }
  if(!isTest)add(panel,button(q.type==='writing'?'Save My Attempt':'Check My Answer',()=>attempt(l,mode,s,qs,q,a),'primary'));
 }
 if(!isTest){
  if(a.feedback){const fb=node('p',a.feedback,'feedback');fb.setAttribute('role','status');add(panel,fb);}
  for(let k=0;k<a.hints;k++)para(panel,`Hint ${k+1}: ${q.hints[k]}`,'hint');
  if(a.shown){para(panel,q.type==='writing'?q.model:`Answer: ${q.answer}`,'feedback good');para(panel,q.reason);}
  const help=node('div',undefined,'actions');const allowed=mode==='guided'||a.attempts>0;
  const hint=button(a.hints>=3?'All three hints shown':'Get a Hint',()=>{if(!allowed||a.hints>=3)return;a.assisted=true;a.hints++;save();render();});hint.disabled=!allowed||a.hints>=3;
  const unknown=button('I Don’t Know',()=>{if(!allowed)return;a.assisted=true;a.hints=Math.min(3,a.hints+1);save();render();});unknown.disabled=!allowed||a.hints>=3;
  const reveal=button('Show Me the Answer',()=>{if(!allowed)return;a.assisted=true;a.shown=true;a.done=true;save();render();});reveal.disabled=!allowed||a.shown;add(help,hint,unknown,reveal);add(panel,help);if(!allowed)para(panel,'Make an attempt first; then hints and the model answer will be available.','muted');
 }
 add($('main'),panel);
 const rail=node('div',undefined,'action-rail');add(rail,button('Back',()=>{if(n>0){s.pos--;save();render();}else lesson(l.id,'teach');}),button('Save & Exit',()=>go('#home')));
 const next=button(n===count-1?(isTest?'Review & Submit':'Finish Session'):'Next Question',()=>{
  if(isTest&& !hasResponse(q,a)){dialog('Add a response first',h=>para(h,'Choose an option or type your best attempt. Your answer can be changed before you submit.'));return;}
  if(!isTest&&!a.done&&a.attempts===0){dialog('Try this question first',h=>para(h,'Make an attempt or use the available help before moving on.'));return;}
  if(n<count-1){s.pos++;save();render();}else if(isTest)submitReview(l,s,qs);else finish(l,mode,s,qs);
 },'primary');add(rail,next);add($('main'),rail);if(!isTest)add($('main'),button('Study Guide',()=>studyGuide(l)));save();
}
function attempt(l,mode,s,qs,q,a){
 if(q.type!=='choice'&&!a.text.trim()){dialog('Write a response',h=>para(h,'Type your best attempt first. It does not need to be perfect.'));return;}
 if(a.done&&q.type!=='writing')return;
 a.attempts++;
 if(q.type==='writing'){a.done=true;a.feedback='Your attempt is saved. It needs a grown-up’s review. You may now use help or move on.';}
 else{const correct=isRight(q,a);a.correct=correct;if(a.attempts===1)a.firstCorrect=correct&&!a.assisted;a.done=correct;const selected=q.choices?.find(c=>c.id===a.selection);a.feedback=correct?q.reason:(selected?.feedback||'Compare your response with the exact requested form and use the lesson steps.')+' You can try again or ask for a hint.';}
 save();render();
}
function submitReview(l,s,qs){
 const unanswered=s.answers.findIndex((a,i)=>!hasResponse(qs[i],a));if(unanswered>=0){s.pos=unanswered;save();render();return;}
 dialog('Submit your 29-question test?',host=>{para(host,'Check your responses before submitting. After submission, the answers and explanations appear, and a grown-up can review your writing.');const ol=node('ol');qs.forEach((q,i)=>{const a=s.answers[i];add(ol,node('li',`${i+1}. ${q.type==='choice'?q.choices.find(c=>c.id===a.selection)?.text:a.text}`));});add(host,ol,button('Submit Test',()=>{$('dialog').close();finish(l,'test',s,qs);},'primary'));});
}
function stats(host,values){const grid=node('div',undefined,'result-grid');values.forEach(([value,label])=>{const d=node('div',undefined,'stat');add(d,node('strong',String(value)),node('span',label));add(grid,d);});add(host,grid);}
function results(l,mode,s,qs){
 const sc=P.score(s,qs);title(mode==='test'?'Your test review':'Session complete');
 if(mode==='test'){
  stats($('main'),[[sc.auto+'/26','objective items correct'],[sc.pending,'writing tasks awaiting review'],[sc.pending?'Pending':sc.total+'/29','final result']]);para($('main'),sc.mastered?'Mastery demonstrated on this local assessment.':sc.pending?'Writing review is needed before a final result or mastery decision.':'Review the skills below, practice, and try again. Mastery needs at least 24/29 and all writing criteria met.','notice');
 }else stats($('main'),[[sc.independent,'first-attempt correct without help'],[sc.assisted,'completed or attempted with help'],[sc.pending,'writing tasks awaiting review']]);
 const needs=qs.filter((q,i)=>q.type!=='writing'&&!s.answers[i].firstCorrect&&mode!=='test'||q.type!=='writing'&&mode==='test'&&!s.answers[i].correct).map(q=>q.skill);para($('main'),needs.length?'Practice next: '+l.title+'. Revisit the worked example and the questions below.':'Next: review your writing with a grown-up, then choose the next learning step.');
 const actions=node('div',undefined,'actions');if(mode==='guided')add(actions,button('Start On My Own',()=>lesson(l.id,'independent'),'primary'));if(mode==='independent')add(actions,button('Open Test',()=>lesson(l.id,'test'),'primary'));if(mode==='test')add(actions,button('Parent Writing Review',()=>go('#parents')));
 add(actions,button(mode==='test'?'Start Retake':'New Practice Session',()=>{P.session(l.id,mode,true);save();render();}));const idx=C.lessons.indexOf(l);if(C.lessons[idx+1])add(actions,button('Next Lesson',()=>lesson(C.lessons[idx+1].id)));add(actions,button('All Lessons',()=>go('#lessons')));add($('main'),actions);
 qs.forEach((q,i)=>{const a=s.answers[i],d=node('details');add(d,node('summary',`Question ${i+1} · ${q.type==='writing'?(a.rubric?'Reviewed':'Writing review pending'):(a.correct?'Correct':'Review')}${a.assisted?' · assistance used':''}`));para(d,q.prompt);para(d,q.context,'muted');para(d,'Your response: '+(q.type==='choice'?q.choices.find(c=>c.id===a.selection)?.text||'No response':a.text),'writing-sample');if(q.type==='writing'){q.criteria.forEach(c=>para(d,'Checklist: '+c));}else{para(d,'Answer: '+q.answer);para(d,q.reason);}add($('main'),d);});
}
function writingMenu(){title('Writing Lab','Every tool is part of your learning path. Keep a first draft and your own revisions.');const grid=node('div',undefined,'grid');['builder','expand','fixer','combine','paragraph','narrative','opinion','informational','weekend'].forEach(id=>{const l=C.lessons.find(l=>l.id===id),c=node('section',undefined,'card');add(c,node('h2',l.title));para(c,l.objective);add(c,button('Learn & Practice',()=>lesson(id)),button('Open Writing Notebook',()=>go('#notebook/'+id),'primary'));add(grid,c);});add($('main'),grid);}
function notebook(id){
 const l=C.lessons.find(l=>l.id===id)||C.lessons.find(l=>l.id==='weekend');title(l.title+' · Writing Notebook');para($('main'),l.write);teacherNote($('main'),'Ask the child to plan, draft, reread, revise, and edit. Discuss the checklist without replacing their words. This notebook has no automatic writing grade.');
 const label=node('label','Plan: who, what, order, and useful details');label.htmlFor='plan';const plan=node('textarea');plan.id='plan';plan.maxLength=5000;
 const draftLabel=node('label','Your first draft');draftLabel.htmlFor='draft';const draft=node('textarea');draft.id='draft';draft.maxLength=12000;
 const revisionLabel=node('label','Your revision');revisionLabel.htmlFor='revision';const revision=node('textarea');revision.id='revision';revision.maxLength=12000;
 let sample=P.data.writing.find(w=>w.lesson===l.id&&w.open);if(!sample){sample={id:`writing-${Date.now()}`,lesson:l.id,open:true,plan:'',original:'',draftText:'',revisionText:'',revisions:[],date:Date.now()};P.data.writing.push(sample);}
 plan.value=sample.plan||'';draft.value=sample.original||sample.draftText||'';draft.readOnly=!!sample.locked;revision.value=sample.revisionText||'';
 plan.addEventListener('input',()=>{sample.plan=plan.value;save();});draft.addEventListener('input',()=>{if(!sample.locked){sample.draftText=draft.value;save();}});revision.addEventListener('input',()=>{sample.revisionText=revision.value;save();});
 add($('main'),label,plan,draftLabel,draft,button(sample.locked?'First draft preserved':'Preserve First Draft',()=>{if(sample.locked)return;if(!draft.value.trim()){dialog('Write a first draft',h=>para(h,'Add your own writing before preserving a first draft.'));return;}sample.original=draft.value;sample.locked=true;save();render();}),revisionLabel,revision);
 const check=node('section',undefined,'panel');add(check,node('h2','Writing Checklist'));[...l.criteria,'read aloud and check the order of ideas','keep an original and explain one revision'].forEach(t=>{const lab=node('label',undefined,'check-label'),box=node('input');box.type='checkbox';add(lab,box,node('span',t));add(check,lab);});add($('main'),check);
 const actions=node('div',undefined,'actions');add(actions,button('Save Revised Version',()=>{if(!sample.locked){dialog('Preserve your first draft first',h=>para(h,'Keep your original before saving a revision.'));return;}if(!revision.value.trim()){dialog('Add a revision',h=>para(h,'Write your revised version first.'));return;}sample.revisions.push({text:revision.value,date:Date.now()});save();render();},'primary'),button('Start a New Writing Sample',()=>{sample.open=false;save();render();}),button('Back to Writing Lab',()=>go('#writing')));add($('main'),actions);
 P.data.writing.filter(w=>w.lesson===l.id).slice().reverse().forEach(w=>{const d=node('details');add(d,node('summary',`Writing sample · ${new Date(w.date).toLocaleDateString()} · ${w.revisions.length} saved revisions`));para(d,'Original: '+(w.original||w.draftText||'Draft not started'),'writing-sample');w.revisions.forEach((v,i)=>para(d,`Revision ${i+1}: ${v.text}`,'writing-sample'));add($('main'),d);});save();
}
function parents(){
 title('Parent Progress','This view stays on this device. It has no account or password.');para($('main'),'Teaching completion, independent work, help, and assessed mastery are different measures. Original writing needs your review. These are local practice assessments, not official Milestones scores.','notice');
 C.lessons.forEach(l=>{const r=P.record(l.id);if(!r.teachDone&&!Object.keys(r.sessions).length&&!r.results.length)return;const d=node('details');add(d,node('summary',`${l.title} · ${r.results.some(x=>x.mastered)?'mastery demonstrated':r.teachDone?'teaching completed':'in progress'}`));para(d,l.objective);para(d,`Teaching: ${r.teachDone?'completed':`page ${(r.teachStep||0)+1} of 5`}`);
 r.results.slice().reverse().forEach(result=>{const panel=node('section',undefined,'panel');para(panel,`${modes[result.mode]} · ${new Date(result.date).toLocaleString()}${result.mode==='test'?' · Form '+(result.form===0?'A':'B'):''}`);para(panel,`First-attempt independent: ${result.independent} · assistance used: ${result.assisted} · writing pending: ${result.pending}`);if(result.mode==='test')para(panel,`Objective: ${result.auto}/26 · ${result.pending?'Final result pending':`Final: ${result.total}/29 · ${result.mastered?'mastery demonstrated':'review recommended'}`}`);
 const qs=C.questions(l.id,result.mode,result.form,result.seed||0);
 if(result.responses)qs.forEach((q,i)=>{if(q.type!=='writing')return;const a=result.responses[i],sample=node('div');add(sample,node('h3',`Writing question ${i+1}`));para(sample,q.prompt);para(sample,a.text,'writing-sample');const checks=[];q.criteria.forEach((criterion,j)=>{const label=node('label',undefined,'check-label'),box=node('input');box.type='checkbox';box.checked=!!a.rubric?.[j];checks.push(box);add(label,box,node('span',criterion));add(sample,label);});const noteLabel=node('label','Parent feedback');const note=node('textarea');note.id=`feedback-${result.id}-${i}`;noteLabel.htmlFor=note.id;note.value=a.parentNote||'';note.maxLength=4000;add(sample,noteLabel,note,button('Save Writing Review',()=>{a.rubric=checks.map(x=>x.checked);a.parentNote=note.value;const temp={answers:result.responses,submitted:true};Object.assign(result,P.score(temp,qs));const active=r.sessions[result.mode];if(active?.resultId===result.id){active.answers[i].rubric=a.rubric.slice();active.answers[i].parentNote=a.parentNote;}save();render();},'primary'));add(panel,sample);});add(d,panel);
 });
 Object.entries(r.sessions).filter(([,s])=>!s.submitted).forEach(([mode,s])=>add(d,button(`Resume ${modes[mode]} · question ${s.pos+1}`,()=>lesson(l.id,mode))));if(r.results.some(x=>!x.mastered))add(d,button('Review '+l.title,()=>lesson(l.id)));add($('main'),d);});
 add($('main'),button('View Writing Lab',()=>go('#writing')),button('Reset Progress',()=>confirmAction('Reset all progress?', 'This permanently removes lesson progress, test history, and all saved writing from this browser. This cannot be undone.',()=>{P.reset();warning();go('#home');}),'danger'));
}
function render(){
 epoch++;if(P.locked){$('main').replaceChildren();title('Progress changed in another tab.');para($('main'),'Reload to use the latest saved progress. This tab has stopped saving so it cannot overwrite newer work.');add($('main'),button('Reload Latest Progress',()=>location.reload(),'primary'));return;}if($('dialog').open)$('dialog').close();$('main').replaceChildren();$('global-nav').replaceChildren();
 add($('global-nav'),button('Home',()=>go('#home')),button('All Lessons',()=>go('#lessons')),button('Writing Lab',()=>go('#writing')),button('Parent Progress',()=>go('#parents')));
 const r=current();try{if(r.route==='home')home();else if(r.route==='lessons')lessonList();else if(r.route==='lesson')lessonPage(r.id,r.mode||'teach');else if(r.route==='writing')writingMenu();else if(r.route==='notebook')notebook(r.id);else if(r.route==='parents')parents();else{title('Let’s find your place.');add($('main'),button('Home',()=>go('#home')));}}
 catch(e){console.error(e);title('Your work is still here.');para($('main'),'This screen could not open. Return Home and try again. Saved writing and finished results have not been cleared.');add($('main'),button('Home',()=>go('#home')));}
 warning();const h=$('main').querySelector('h1');if(h)h.focus({preventScroll:true});window.scrollTo(0,0);
}
$('dialog').addEventListener('close',()=>{if(opener?.isConnected)opener.focus();});window.addEventListener('hashchange',render);window.addEventListener('storage',e=>{if(e.key===P.KEY){P.blockWrites();render();warning();}});
window.SS_SYSTEM={canonical,isRight};render();
})();
