export function page(body: string) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Choir members · St. Cletus Christmas Concert</title>
<style>
*{box-sizing:border-box}body{margin:0;background:#230a12;color:#fff2de;font:16px/1.5 system-ui,sans-serif}main{max-width:1000px;margin:auto;padding:clamp(20px,5vw,64px)}header{color:#eac064;font-weight:700;border-bottom:1px solid #744854;padding-bottom:14px}h1{font:600 clamp(32px,5vw,52px)/1.1 Georgia,serif;margin:30px 0 20px}label{display:block;font-weight:650;margin:14px 0}input,textarea{display:block;margin-top:5px;width:100%;padding:11px;background:#fff7ed;color:#32101b;border:1px solid #94707a;border-radius:5px;font:inherit}form{max-width:440px}button,.download{display:inline-block;background:#e9c064;color:#27121a;font:700 16px system-ui;padding:13px 18px;border:0;border-radius:5px;cursor:pointer;text-decoration:none}a{color:#f1d493}#layout{display:grid;grid-template-columns:1fr 1fr;gap:35px}canvas{width:100%;height:auto;display:block}small{font-weight:400}button:disabled{opacity:.55}footer{margin-top:28px;display:flex;align-items:center;gap:24px}footer button{background:transparent;color:#fff2de;text-decoration:underline}p:empty{display:none}@media(max-width:650px){#layout{grid-template-columns:1fr;gap:20px}}[hidden]{display:none!important}
</style></head><body><main><header>St. Cletus Choir · Christmas Concert</header>${body}</main></body></html>`;
}

export const editor = `<h1>Who Am I?</h1><div id="layout"><section>
<label>Your name<input id="performer" maxlength="45" autocomplete="name"></label>
<label>Concert role<input id="role" list="roles" maxlength="42" placeholder="Select or enter your role"></label>
<datalist id="roles"><option>Soprano</option><option>Alto</option><option>Tenor</option><option>Bass</option><option>Bass Guitar</option><option>Keyboard</option><option>Drums</option><option>Musical Director</option></datalist>
<label>Your concert moment <small>(optional)</small><textarea id="moment" maxlength="140" rows="3" placeholder="What are you looking forward to?"></textarea></label>
<label>Your portrait<input id="photo" type="file" accept="image/*"></label><p id="notice" role="status"></p>
<button id="save" disabled>Download flyer</button> <button id="share" hidden>Share flyer</button></section>
<canvas id="poster" width="1080" height="1350" aria-label="Personalised concert flyer preview"></canvas></div>
<footer><a href="/">Concert home</a><form method="post"><input type="hidden" name="action" value="logout"><button>Sign out</button></form></footer>
<script>
const $=id=>document.getElementById(id);
const canvas=$('poster'), ctx=canvas.getContext('2d');
let portrait=null, selection=0, file=null, revision=0;
function line(text,y,size,colour,weight='700',align='center',x=540,max=990){
  ctx.font=weight+' '+size+'px Arial,sans-serif';
  while(ctx.measureText(text).width>max && size>14){size--;ctx.font=weight+' '+size+'px Arial,sans-serif'}
  ctx.fillStyle=colour;ctx.textAlign=align;ctx.fillText(text,x,y);
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
  const version=++revision;file=null;$('save').disabled=true;$('share').hidden=true;
  ctx.fillStyle='#3c0818';ctx.fillRect(0,0,1080,1350);
  if(portrait){
    const scale=Math.max(1080/portrait.width,920/portrait.height);
    ctx.drawImage(portrait,(1080-portrait.width*scale)/2,(920-portrait.height*scale)*.28,portrait.width*scale,portrait.height*scale);
  }else line('Your portrait',440,46,'#c19b91');
  const shade=ctx.createLinearGradient(0,500,0,1075);
  shade.addColorStop(0,'rgba(45,5,17,0)');shade.addColorStop(.8,'#380714');shade.addColorStop(1,'#270810');
  ctx.fillStyle=shade;ctx.fillRect(0,500,1080,850);
  ctx.fillStyle='rgba(47,4,17,.84)';ctx.fillRect(666,20,394,103);
  line('ST. CLETUS CHOIR',65,37,'#fff2dc','800','right',1040,355);line('Christmas Concert',105,33,'#fff2dc','italic','right',1040,355);
  ctx.fillStyle='#650e28';ctx.fillRect(38,184,220,223);
  ['SUN','27 DEC','2026','1:00 PM'].forEach((t,i)=>line(t,237+i*49,44,'#fff3df','800','center',148,195));
  line('WHO AM I?',784,44,'#eac05b','800');line(($('performer').value.trim()||'Your name').toUpperCase(),900,110,'#fff3dc','900');
  line($('role').value.trim()||'Concert role',980,68,'#eac05b','800');
  const rows=quoteLines($('moment').value);rows.forEach((t,i)=>line(t,1010+(i+.7)*Math.min(40,112/rows.length),34,'#fff2dc','400'));
  line('Sing Unto God for Christ is Born',1165,53,'#eac05b','italic bold');
  ctx.strokeStyle='#ebd9be';ctx.lineWidth=2;ctx.strokeRect(64,1200,952,119);
  line('Christ the King Parish, Mankon',1252,42,'#fff2dc');line('Nacho, Bamenda',1296,35,'#fff2dc','400');
  if(!portrait||!$('performer').value.trim()||!$('role').value.trim())return;
  canvas.toBlob(blob=>{
    if(version!==revision||!blob)return;
    file=new File([blob],'St-Cletus-Who-Am-I.png',{type:'image/png'});
    $('save').disabled=false;$('share').hidden=!navigator.canShare?.({files:[file]});
  },'image/png');
}
['performer','role','moment'].forEach(id=>$(id).oninput=render);
$('photo').onchange=async()=>{
  const current=++selection, selected=$('photo').files[0];portrait=null;$('notice').textContent='';render();
  if(!selected)return;
  const url=URL.createObjectURL(selected),img=new Image();img.src=url;
  try{await img.decode();if(current===selection){portrait=img;render()}}
  catch{if(current===selection)$('notice').textContent='This photo could not be opened. Choose a JPEG or PNG.'}
  finally{URL.revokeObjectURL(url)}
};
$('save').onclick=()=>{if(!file)return;const url=URL.createObjectURL(file),link=document.createElement('a');link.href=url;link.download=file.name;link.click();setTimeout(()=>URL.revokeObjectURL(url),60000)};
$('share').onclick=async()=>{if(file)try{await navigator.share({files:[file]})}catch(e){if(e.name!=='AbortError')$('notice').textContent='Sharing is unavailable. Download the flyer to share it.'}};
render();
</script>`;
