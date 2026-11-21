export function page(body: string) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Performer flyer studio · St. Cletus Christmas Concert</title>
<style>
*{box-sizing:border-box}body{margin:0;background:#230a12;color:#fff2de;font:16px/1.5 system-ui,sans-serif}main{max-width:1000px;margin:auto;padding:clamp(20px,5vw,64px)}header{color:#eac064;font-weight:700;border-bottom:1px solid #744854;padding-bottom:14px}h1{font:600 clamp(32px,5vw,52px)/1.1 Georgia,serif;margin:30px 0 20px}label{display:block;font-weight:650;margin:14px 0}input,textarea,select{display:block;margin-top:5px;width:100%;padding:11px;background:#fff7ed;color:#32101b;border:1px solid #94707a;border-radius:5px;font:inherit}form{max-width:440px}button,.download{display:inline-block;background:#e9c064;color:#27121a;font:700 16px system-ui;padding:13px 18px;border:0;border-radius:5px;cursor:pointer;text-decoration:none}a{color:#f1d493}#layout{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:35px}canvas{min-width:0;width:100%;height:auto;display:block}small{font-weight:400}button:disabled{opacity:.55}footer{margin-top:28px;display:flex;align-items:center;gap:24px}footer button{background:transparent;color:#fff2de;text-decoration:underline}p:empty{display:none}@media(max-width:650px){#layout{grid-template-columns:minmax(0,1fr);gap:20px}}[hidden]{display:none!important}
</style></head><body><main><header>St. Cletus Choir · Christmas Concert</header>${body}</main></body></html>`;
}

export const editor = `<h1 id="heading">Who Am I?</h1><div id="layout"><section>
<label>Your name or choir name<input id="performer" maxlength="90" autocomplete="name"></label>
<label>Concert role<select id="role" required><option value="" selected disabled>Select your role</option><option>Soprano</option><option>Alto</option><option>Tenor</option><option>Bass</option><option>Solo Guitar</option><option>Bass Guitar</option><option>Keyboard</option><option>Drums</option><option>Musical Director</option><option>Master of Ceremonies (MC)</option><option>Guest Choir</option><option value="other">Other role</option></select></label>
<label id="customLabel" hidden>Your concert role<input id="customRole" maxlength="42"></label>
<label>Your concert moment <small>(optional)</small><textarea id="moment" maxlength="140" rows="3" placeholder="What are you looking forward to?"></textarea></label>
<label>Portrait or group photo<input id="photo" type="file" accept="image/*"></label><p id="notice" role="status"></p>
<button id="save" disabled>Download flyer</button> <button id="share" hidden>Share flyer</button></section>
<canvas id="poster" width="1080" height="1350" aria-label="Personalised concert flyer preview"></canvas></div>
<footer><a href="/">Concert home</a></footer>
<script>
const $=id=>document.getElementById(id);
const canvas=$('poster'), ctx=canvas.getContext('2d');
let portrait=null, selection=0, file=null, download=null, revision=0;
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
  const version=++revision;file=null;download=null;$('save').disabled=true;$('share').hidden=true;
  ctx.fillStyle='#3c0818';ctx.fillRect(0,0,1080,1350);
  const custom=$('role').value==='other';
  $('customLabel').hidden=!custom;
  const role=(custom?$('customRole').value:$('role').value).trim();
  const group=role.toLowerCase()==='guest choir';
  $('heading').textContent=group?'Who Are We?':'Who Am I?';
  if(portrait){
    const scale=(group?Math.min:Math.max)(1080/portrait.width,920/portrait.height);
    ctx.drawImage(portrait,(1080-portrait.width*scale)/2,(920-portrait.height*scale)*(group ? 0.5 : 0.28),portrait.width*scale,portrait.height*scale);
  }else line(group?'Your choir photo':'Your portrait',440,46,'#c19b91');
  const shade=ctx.createLinearGradient(0,500,0,1075);
  shade.addColorStop(0,'rgba(45,5,17,0)');shade.addColorStop(.8,'#380714');shade.addColorStop(1,'#270810');
  ctx.fillStyle=shade;ctx.fillRect(0,500,1080,850);
  ctx.fillStyle='rgba(47,4,17,.84)';ctx.fillRect(666,20,394,103);
  line('ST. CLETUS CHOIR',65,37,'#fff2dc','800','right',1040,355);line('Christmas Concert',105,33,'#fff2dc','italic','right',1040,355);
  ctx.fillStyle='#650e28';ctx.fillRect(38,184,220,223);
  ['SUN','27 DEC','2026','1:00 PM'].forEach((t,i)=>line(t,237+i*49,44,'#fff3df','800','center',148,195));
  line(group?'WHO ARE WE?':'WHO AM I?',784,44,'#eac05b','800');line(($('performer').value.trim()||(group?'Choir name':'Your name')).toUpperCase(),900,110,'#fff3dc','900');
  line(role||'Concert role',980,68,'#eac05b','800');
  const rows=quoteLines($('moment').value);rows.forEach((t,i)=>line(t,1010+(i+.7)*Math.min(40,112/rows.length),34,'#fff2dc','400'));
  line('Sing Unto God for Christ is Born',1165,53,'#eac05b','italic bold');
  ctx.strokeStyle='#ebd9be';ctx.lineWidth=2;ctx.strokeRect(64,1200,952,119);
  line('Christ the King Parish, Mankon',1252,42,'#fff2dc');line('Nacho, Bamenda',1296,35,'#fff2dc','400');
  if(!portrait||!$('performer').value.trim()||!role)return;
  canvas.toBlob(blob=>{
    if(version!==revision)return;
    if(!blob){$('notice').textContent='The PNG could not be created. Please select your photo again.';return;}
    const name=group?'St-Cletus-Who-Are-We.png':'St-Cletus-Who-Am-I.png';
    download={blob,name};
    $('save').disabled=false;
    if(typeof File==='function' && navigator.canShare && navigator.share){
      file=new File([blob],name,{type:'image/png'});
      $('share').hidden=!navigator.canShare({files:[file]});
    }
  },'image/png');
}
$('role').onchange=render;
['performer','customRole','moment'].forEach(id=>$(id).oninput=render);
$('photo').onchange=async()=>{
  const current=++selection, selected=$('photo').files[0];portrait=null;$('notice').textContent='';render();
  if(!selected)return;
  const url=URL.createObjectURL(selected),img=new Image();img.src=url;
  try{await img.decode();if(current===selection){portrait=img;render()}}
  catch{if(current===selection)$('notice').textContent='This photo could not be opened. Choose a JPEG or PNG.'}
  finally{URL.revokeObjectURL(url)}
};
$('save').onclick=()=>{if(!download)return;const url=URL.createObjectURL(download.blob),link=document.createElement('a');link.href=url;link.download=download.name;document.body.appendChild(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),60000)};
$('share').onclick=async()=>{if(file)try{await navigator.share({files:[file]})}catch(e){if(e.name!=='AbortError')$('notice').textContent='Sharing is unavailable. Download the flyer to share it.'}};
render();
</script>`;
