export function page(body: string) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Performer flyer studio · St. Cletus Christmas Concert</title>
<style>
*{box-sizing:border-box}body{margin:0;background:#230a12;color:#fff2de;font:16px/1.5 system-ui,sans-serif}main{max-width:1000px;margin:auto;padding:clamp(20px,5vw,64px)}header{color:#eac064;font-weight:700;border-bottom:1px solid #744854;padding-bottom:14px}h1{font:600 clamp(32px,5vw,52px)/1.1 Georgia,serif;margin:30px 0 20px}label{display:block;font-weight:650;margin:14px 0}input,textarea,select{display:block;margin-top:5px;width:100%;padding:11px;background:#fff7ed;color:#32101b;border:1px solid #94707a;border-radius:5px;font:inherit}form{max-width:440px}button,.download{display:inline-block;background:#e9c064;color:#27121a;font:700 16px system-ui;padding:13px 18px;border:0;border-radius:5px;cursor:pointer;text-decoration:none}a{color:#f1d493}#layout{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:35px}canvas{align-self:start;aspect-ratio:4/5;min-width:0;width:100%;height:auto;display:block}small{font-weight:400}button:disabled{opacity:.55}footer{margin-top:28px;display:flex;align-items:center;gap:24px}footer button{background:transparent;color:#fff2de;text-decoration:underline}p:empty{display:none}@media(max-width:650px){#layout{grid-template-columns:minmax(0,1fr);gap:20px}}[hidden]{display:none!important}
</style></head><body><main><header>St. Cletus Choir · Christmas Concert</header>${body}</main></body></html>`;
}

export const editor = `<h1 id="heading">Who Am I?</h1><div id="layout"><section>
<label>Your name or choir name<input id="performer" maxlength="90" autocomplete="name"></label>
<label>Concert role<select id="role" required><option value="" selected disabled>Select your role</option><option>Soprano</option><option>Alto</option><option>Tenor</option><option>Bass</option><option>Solo Guitar</option><option>Bass Guitar</option><option>Keyboard</option><option>Drums</option><option>Musical Director</option><option>Master of Ceremonies (MC)</option><option>Guest Choir</option><option value="other">Other role</option></select></label>
<label id="customLabel" hidden>Your concert role<input id="customRole" maxlength="42"></label>
<label>Your concert moment <small>(optional)</small><textarea id="moment" maxlength="140" rows="3" placeholder="What are you looking forward to?"></textarea></label>
<label>Portrait or group photo<input id="photo" type="file" accept="image/*"></label><div id="framing" hidden><label>Photo framing<select id="fit"><option value="fill">Fill flyer</option><option value="full">Show full photo</option></select></label><label id="positionLabel" hidden>Photo position<input id="position" type="range" min="0" max="100" value="50"></label></div><p id="notice" role="status"></p>
<p>Your name or choir name and role will be recorded for the concert organisers when you create a flyer.</p>
<button id="create" disabled>Create flyer</button>
<button id="save" disabled>Download flyer</button> <button id="share" hidden>Share flyer</button></section>
<canvas id="poster" width="1080" height="1350" aria-label="Personalised concert flyer preview"></canvas></div>
<footer><a href="/">Concert home</a></footer>
<script>
const $=id=>document.getElementById(id);
const canvas=$('poster'), ctx=canvas.getContext('2d');
let registration=null, saving=false;
let portrait=null, selection=0, file=null, download=null, revision=0;
const samples={};
for(const [kind,src] of Object.entries({person:'/assets/avatars/choir-rsvp-portrait.webp',group:'/assets/st_cletus_choir_group.jpeg'})){
  const img=new Image();
  img.onload=()=>{samples[kind]=img;if(!portrait)render()};
  img.src=src;
}
function paintPhoto(image,fill,position){
  const top=0,height=1080,width=1080;
  const iw=image.naturalWidth,ih=image.naturalHeight;
  const scale=(fill?Math.max:Math.min)(width/iw,height/ih);
  const w=iw*scale,h=ih*scale;
  ctx.save();
  ctx.beginPath();ctx.rect(0,top,width,height);ctx.clip();
  const backdrop=ctx.createLinearGradient(0,top,width,top+height);
  backdrop.addColorStop(0,'#250911');backdrop.addColorStop(.5,'#702238');backdrop.addColorStop(1,'#260911');
  ctx.fillStyle=backdrop;ctx.fillRect(0,top,width,height);
  const anchor=fill?position:.5;
  ctx.drawImage(image,(width-w)*anchor,top+(height-h)*anchor,w,h);
  ctx.restore();
}
function line(text,y,size,colour,weight='700',align='center',x=540,max=990){
  ctx.font=weight+' '+size+'px Arial,sans-serif';
  while(ctx.measureText(text).width>max && size>14){size--;ctx.font=weight+' '+size+'px Arial,sans-serif'}
  ctx.fillStyle=colour;ctx.textAlign=align;ctx.fillText(text,x,y,max);
}
function quoteLines(text){
  ctx.font='34px Arial';
  const rows=[''];
  for(const word of text.trim().split(/\\s+/)){
    const i=rows.length-1, next=(rows[i]+' '+word).trim();
    if(rows[i] && ctx.measureText(next).width>960)rows.push(word);else rows[i]=next;
  }
  return rows;
}
function render(){
  $('create').disabled=true;$('create').hidden=false;
  const version=++revision;file=null;download=null;$('save').disabled=true;$('share').hidden=true;
  ctx.fillStyle='#3c0818';ctx.fillRect(0,0,1080,1350);
  const custom=$('role').value==='other';
  $('customLabel').hidden=!custom;
  const role=(custom?$('customRole').value:$('role').value).trim();
  const group=role.toLowerCase()==='guest choir';
  $('heading').textContent=group?'Who Are We?':'Who Am I?';
  const image=portrait||samples[group?'group':'person'];
  const fill=portrait ? $('fit').value==='fill' : !group;
  $('framing').hidden=!portrait;
  $('positionLabel').hidden=!portrait||!fill;
  if(image)paintPhoto(image,fill,portrait?Number($('position').value)/100:0.32);
  const shade=ctx.createLinearGradient(0,0,0,1350);
  shade.addColorStop(0,'rgba(40,0,12,.48)');
  shade.addColorStop(.23,'rgba(89,14,30,.06)');
  shade.addColorStop(.48,'rgba(89,14,30,.10)');
  shade.addColorStop(.78,'#23050d');
  shade.addColorStop(1,'#110508');
  ctx.fillStyle=shade;ctx.fillRect(0,0,1080,1350);
  ctx.save();
  ctx.shadowColor='#310811';ctx.shadowBlur=7;
  line('ST. CLETUS CHOIR',74,41,'#fff3dc','900','right',1040,730);
  line('Christmas Concert',115,35,'#fff3dc','italic','right',1040,600);
  ctx.restore();
  ctx.fillStyle='#680b24';
  ctx.beginPath();ctx.roundRect(40,409,219,276,22);ctx.fill();
  ['SUN','27 DEC','2026','1:00 PM'].forEach((text,i)=>line(text,[475,547,605,659][i],[61,54,54,43][i],'#fff3dc','900','center',150,198));
  line(group?'WHO ARE WE?':'WHO AM I?',784,44,'#eac05b','800');line(($('performer').value.trim()||(group?'Choir name':'Your name')).toUpperCase(),900,110,'#fff3dc','900');
  line(role||'Concert role',980,68,'#eac05b','800');
  const rows=quoteLines($('moment').value);rows.forEach((t,i)=>line(t,1010+(i+.7)*Math.min(40,112/rows.length),34,'#fff2dc','400'));
  line('Sing Unto God for Christ is Born',1165,53,'#eac05b','italic bold');
  ctx.strokeStyle='#ebd9be';ctx.lineWidth=2;ctx.strokeRect(64,1200,952,119);
  line('Christ the King Parish, Mankon',1252,42,'#fff2dc');line('Nacho, Bamenda',1296,35,'#fff2dc','400');
  const performer=$('performer').value.trim();
  if(!portrait||!performer||!role)return;
  if(registration?.performer!==performer||registration?.role!==role){
    registration={performer,role,id:crypto.randomUUID(),saved:false};
  }
  canvas.toBlob(blob=>{
    if(version!==revision)return;
    if(!blob){$('notice').textContent='The PNG could not be created. Please select your photo again.';return;}
    const name=group?'St-Cletus-Who-Are-We.png':'St-Cletus-Who-Am-I.png';
    download={blob,name};
    $('create').hidden=registration.saved;
    $('create').disabled=saving;
    $('save').disabled=!registration.saved;
    if(typeof File==='function' && navigator.canShare && navigator.share){
      file=new File([blob],name,{type:'image/png'});
      $('share').hidden=!registration.saved||!navigator.canShare({files:[file]});
    }
  },'image/png');
}
$('create').onclick=async()=>{
  if(saving||!download||!registration||registration.saved)return;
  const record=registration;
  saving=true;$('create').disabled=true;
  $('notice').textContent='Recording your flyer…';
  try{
    const response=await fetch('/api/performer-flyer',{
      method:'POST',headers:{'Content-Type':'application/json'},
      body:JSON.stringify({id:record.id,performer:record.performer,role:record.role}),
    });
    const result=await response.json();
    if(!response.ok||result.success!==true)throw new Error();
    record.saved=true;
    $('notice').textContent=registration===record?'Your flyer is ready.':'';
  }catch{
    $('notice').textContent='Could not record your flyer. Please try Create flyer again.';
  }finally{saving=false;render()}
};
$('fit').onchange=render;
$('position').oninput=render;
$('role').onchange=render;
['performer','customRole','moment'].forEach(id=>$(id).oninput=render);
$('photo').onchange=async()=>{
  const current=++selection, selected=$('photo').files[0];portrait=null;$('notice').textContent='';render();
  if(!selected)return;
  const url=URL.createObjectURL(selected),img=new Image();img.src=url;
  try{await img.decode();if(current===selection){portrait=img;$('fit').value='fill';$('position').value='32';render()}}
  catch{if(current===selection)$('notice').textContent='This photo could not be opened. Choose a JPEG or PNG.'}
  finally{URL.revokeObjectURL(url)}
};
$('save').onclick=()=>{if(!download)return;const url=URL.createObjectURL(download.blob),link=document.createElement('a');link.href=url;link.download=download.name;document.body.appendChild(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),60000)};
$('share').onclick=async()=>{if(file)try{await navigator.share({files:[file]})}catch(e){if(e.name!=='AbortError')$('notice').textContent='Sharing is unavailable. Download the flyer to share it.'}};
render();
</script>`;
