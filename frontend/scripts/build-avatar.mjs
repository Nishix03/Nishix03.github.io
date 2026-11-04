import sharp from 'sharp';
import path from 'node:path';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../', import.meta.url));
const width = 600, height = 780, count = 48;
const sourcePixels = await sharp(path.join(root, 'art/avatar/hero-final-source.png'))
  .resize(300,390,{fit:'fill',kernel:'nearest'}).ensureAlpha().raw().toBuffer();
// Match the dark emerald metal of the other portraits, retaining the exact
// earring pixels and shading. Skin is more saturated and stays untouched.
for(let y=234;y<289;y++) for(let x=185;x<212;x++) {
  const p=(y*300+x)*4;
  const r=sourcePixels[p],g=sourcePixels[p+1],b=sourcePixels[p+2];
  if(sourcePixels[p+3] && g>60 && r/g>0.82 && b/g>0.8) {
    const light=g/255;
    sourcePixels[p]=Math.round(12+29*light);
    sourcePixels[p+1]=Math.round(35+52*light);
    sourcePixels[p+2]=Math.round(29+42*light);
  }
}
const pixelBase = await sharp(sourcePixels,{raw:{width:300,height:390,channels:4}}).png().toBuffer();
const base = await sharp(pixelBase).resize(width,height,{kernel:'nearest'}).ensureAlpha().raw().toBuffer();
const clamp = n => Math.max(0,Math.min(1,n));
const mask = (x,y,l,t,r,b,e=5) => clamp((x-l)/e)*clamp((r-x)/e)*clamp((y-t)/e)*clamp((b-y)/e);
const cloth = new Uint8Array(width*height);
for(let y=8;y<448;y++) for(let x=8;x<width-8;x++) {
  let safe=true;
  for(let dy=-6;dy<=6&&safe;dy+=2) for(let dx=-6;dx<=6;dx+=2) {
    const p=((y+dy)*width+x+dx)*4;
    if(base[p+3]<245||base[p+1]>118){safe=false;break;}
  }
  cloth[y*width+x]=Number(safe);
}
const outputDir=path.join(root,'art/avatar/keyframes-final');
await mkdir(outputDir,{recursive:true});
const loop=[];
for(let i=0;i<count;i++) {
  const t=i/count*Math.PI*2;
  const pixels=Buffer.from(base);
  for(let y=0;y<height;y++) for(let x=0;x<width;x++) {
    const lx=x/2,ly=y/2;
    let dx=0,dy=0;
    if(cloth[y*width+x]) {
      const weight=mask(lx,ly,72,-16,299,166,14)+mask(lx,ly,0,166,65,224,10)+mask(lx,ly,246,166,300,224,10);
      dx=weight*(2.2*Math.sin(t-ly/55)+0.3*Math.sin(2*t-ly/35));
      dy=weight*1.5*Math.sin(t-ly/55+0.3);
    }
    // Reference: https://www.youtube.com/watch?v=GzyiYB8BoRs&t=2s
    // Small floating oscillations, eased at both extremes. Each loose item has
    // a different lag; chains stay attached and their ends follow a shallow arc.
    const hoop=mask(lx,ly,185,234,201,254,4);
    const chain=mask(lx,ly,191,247,207,279,4)*clamp((ly-247)/27);
    const star=mask(lx,ly,190,269,212,290,4);
    dx+=hoop*0.7*Math.sin(t-0.25);
    dx+=chain*2*Math.sin(t-0.55)+star*3.2*Math.sin(t-0.8);
    dy+=star*0.9*(1-Math.cos(t-0.8));
    const pendant=mask(lx,ly,157,118,180,143,4)*clamp((145-ly)/15);
    dx+=pendant*3*Math.sin(t-1);
    dy+=pendant*0.8*(1-Math.cos(t-1));
    dx+=mask(lx,ly,136,143,205,174,8)*0.9*Math.sin(t-0.7);
    dx+=mask(lx,ly,42,238,68,270)*1.1*Math.sin(t-1.25);
    dy+=mask(lx,ly,210,247,231,287)*0.8*Math.sin(t-1.5);
    // Only the lower curl ends follow the breeze. Roots, forehead, arms and
    // face stay fixed; nearby clumps have a small lag rather than moving as a slab.
    const hair=mask(lx,ly,16,286,244,389,10)*clamp((ly-286)/45);
    dx+=hair*(4.4*Math.sin(t-0.4-ly/120)+0.7*Math.sin(2*t-lx/60));
    dy+=hair*1.5*Math.sin(t-0.8-lx/100);
    const sx=Math.round(x-dx),sy=Math.round(y-dy);
    if(sx<0||sx>=width||sy<0||sy>=height)continue;
    const p=(y*width+x)*4,q=(sy*width+sx)*4;
    if(hair>0) {
      for(let c=0;c<4;c++)pixels[p+c]=base[q+c];
      continue;
    }
    if(base[p+3]<245||base[q+3]<245)continue;
    for(let c=0;c<3;c++)pixels[p+c]=base[q+c];
  }
  const frame=await sharp(pixels,{raw:{width,height,channels:4}}).png().toBuffer();
  loop.push(frame);
  await writeFile(path.join(outputDir,`${String(i).padStart(2,'0')}.png`),frame);
}
// Recover the original site's water/foam layer, excluding its former avatar.
// Cyan and white are unambiguous water colors; connected mint pixels are foam.
const waterSheet=path.join(root,'art/avatar/reference-published-entry.webp');
const entryFrames=[];
for(let i=0;i<24;i++) {
  if(i===23){entryFrames.push(loop[0]);continue;}
  const rgba=await sharp(waterSheet).extract({left:i*300,top:0,width:300,height:390})
    .ensureAlpha().raw().toBuffer();
  const selected=new Uint8Array(300*390),foam=new Uint8Array(300*390),queue=[];
  for(let n=0;n<selected.length;n++) {
    const p=n*4,r=rgba[p],g=rgba[p+1],b=rgba[p+2];
    if(!rgba[p+3])continue;
    const cyan=g>125&&g>r+35&&b>g-12;
    const white=r>185&&g>200&&b>210&&Math.max(r,g,b)-Math.min(r,g,b)<30;
    if(cyan||white){selected[n]=1;queue.push(n);}
    else if(Math.abs(r-201)<12&&Math.abs(g-247)<12&&Math.abs(b-222)<12)foam[n]=1;
  }
  for(let k=0;k<queue.length;k++) {
    const n=queue[k],x=n%300;
    for(const next of [x>0?n-1:-1,x<299?n+1:-1,n-300,n+300]) {
      if(next>=0&&next<selected.length&&foam[next]&&!selected[next]) {
        selected[next]=1;queue.push(next);
      }
    }
  }
  for(let n=0;n<selected.length;n++)if(!selected[n])rgba[n*4+3]=0;
  const water=await sharp(rgba,{raw:{width:300,height:390,channels:4}})
    .resize(width,height,{kernel:'nearest'}).png().toBuffer();
  const t=i/23,eased=1-(1-t)**3;
  const scale=0.94+0.06*eased;
  const sw=Math.round(width*scale),sh=Math.round(height*scale);
  const opacity=clamp((i-1)/10);
  const character=await sharp(loop[0]).resize(sw,sh,{kernel:'nearest'}).ensureAlpha().raw().toBuffer();
  for(let p=3;p<character.length;p+=4)character[p]=Math.round(character[p]*opacity);
  const art=await sharp(character,{raw:{width:sw,height:sh,channels:4}}).png().toBuffer();
  entryFrames.push(await sharp({create:{width,height,channels:4,background:'#00000000'}})
    .composite([
      {input:art,left:Math.round((width-sw)/2+16*(1-eased)),top:Math.round(-100*(1-eased))},
      {input:water,left:0,top:0},
    ]).png().toBuffer());
}
for(const clip of ['entry','rest-0','rest-1']) {
  const frames=[];
  for(let i=0;i<24;i++) {
    const input=clip==='entry'?entryFrames[i]:loop[i+(clip==='rest-1'?24:0)];
    const frame=await sharp({create:{width,height,channels:4,background:'#00000000'}})
      .composite([{input,left:0,top:0}]).png().toBuffer();
    frames.push({input:frame,left:i*width,top:0});
  }
  await sharp({create:{width:14400,height,channels:4,background:'#00000000'}})
    .composite(frames).webp({lossless:true}).toFile(path.join(root,`public/avatar/hero-${clip}.webp`));
}
const entryPreview=await Promise.all(entryFrames.map(input=>sharp(input).flatten({background:'#07110c'}).png().toBuffer()));
await sharp(entryPreview,{join:{animated:true}})
  .gif({delay:Array.from({length:24},(_,i)=>i===23?1400:i%3===2?40:30),loop:0})
  .toFile(path.join(root,'art/avatar/hero-entry-immersion-preview.gif'));
// GIF centiseconds sum to the same 6.4-second loop as the CSS.
await sharp(loop,{join:{animated:true}}).gif({delay:Array.from({length:count},(_,i)=>i%3===2?140:130),loop:0})
  .toFile(path.join(root,'art/avatar/hero-final-preview.gif'));
await sharp(loop,{join:{animated:true}}).gif({delay:Array.from({length:count},(_,i)=>i%3===2?140:130),loop:0})
  .toFile(path.join(root,'art/avatar/hero-breeze-visible-preview.gif'));
const detailLayers=[];
// Rows: pendant, earring, left wrist, right wrist; columns are successive phases.
const crops=[{left:310,top:230,width:60,height:62},{left:372,top:486,width:64,height:98},{left:80,top:472,width:64,height:78},{left:414,top:488,width:64,height:92}];
for(let row=0;row<crops.length;row++)for(let col=0;col<8;col++) {
  detailLayers.push({input:await sharp(loop[col*6]).extract(crops[row]).resize(160,180,{fit:'contain',kernel:'nearest',background:'#07110c'}).png().toBuffer(),left:col*160,top:row*180});
}
await sharp({create:{width:1280,height:720,channels:4,background:'#07110c'}}).composite(detailLayers).png()
  .toFile(path.join(root,'art/avatar/accessory-keyframes-details.png'));
