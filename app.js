(function(){
"use strict";
var D=window.CATALOG,SH=D.shop;
var IMG="https://avatars.mds.yandex.net/get-sprav-products/";
var $=function(s,r){return(r||document).querySelector(s)};
var $$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
function esc(s){return String(s).replace(/[&<>"']/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})}
function money(n){return n==null?"":String(n).replace(/\B(?=(\d{3})+(?!\d))/g," ")+" ₽"}
function img(k,size){return IMG+k+"/"+size}
function real(x){return x&&x!=="—"}
var models=D.models,byId={},cats=D.cats;
models.forEach(function(m){byId[m.id]=m;m.v.forEach(function(v){v.m=m})});
function priced(m){return m.v.filter(function(v){return v.p!=null})}
function minP(m){var a=priced(m);return a.length?Math.min.apply(null,a.map(function(v){return v.p})):null}
function maxP(m){var a=priced(m);return a.length?Math.max.apply(null,a.map(function(v){return v.p})):null}
function waText(m,v){var t=m.title;if(v){if(real(v.s))t+=" "+v.s;if(real(v.c))t+=", "+v.c}return"Здравствуйте! Интересует "+t+". Подскажите, пожалуйста, наличие и цену."}
function waLink(m,v){return"https://wa.me/"+SH.wa+"?text="+encodeURIComponent(m?waText(m,v):"Здравствуйте! Хочу задать вопрос по технике Apple.")}
function setWa(){$$("a[data-wa]").forEach(function(a){if(a.dataset.fixed)return;a.href=waLink()})}
function burger(){
var b=$(".burger"),n=$("#mnav");if(!b)return;
b.addEventListener("click",function(){var o=n.classList.toggle("open");b.setAttribute("aria-expanded",o)});
$$("a",n).forEach(function(a){a.addEventListener("click",function(){n.classList.remove("open");b.setAttribute("aria-expanded","false")})});
}
function msk(){var d=new Date(Date.now()+3*3600*1000);return d.getUTCHours()*60+d.getUTCMinutes()}
function openState(){
var el=$("#open");if(!el)return;
var t=msk(),o=t>=660&&t<1200;
el.textContent=o?"Сейчас открыто":"Сейчас закрыто";
el.className="open"+(o?"":" closed");
}
function cardHtml(m){
var lo=minP(m),hi=maxP(m),v0=priced(m).sort(function(a,b){return a.p-b.p})[0]||m.v[0];
var st=[],cl=[];
m.v.forEach(function(v){if(real(v.s)&&st.indexOf(v.s)<0)st.push(v.s);if(real(v.c)&&cl.indexOf(v.c)<0)cl.push(v.c)});
var info=[];
if(st.length)info.push(st.length>2?st.length+" вар. памяти":st.join(", "));
if(cl.length>1)info.push(cl.length+" цвета");else if(cl.length===1)info.push(cl[0]);
var allN=m.v.every(function(v){return v.n});
var pr=lo==null?"<small>Цена:</small> уточняйте":(hi!==lo?"<small>от</small>":"")+money(lo);
var href="product.html?m="+encodeURIComponent(m.id)+"&v="+encodeURIComponent(v0.i);
return'<article class="card"><a class="card__img" href="'+href+'" tabindex="-1" aria-hidden="true"><img src="'+img(v0.im,"medium")+'" alt="" loading="lazy" width="350" height="350">'+(allN?'<span class="card__tag">Без RuStore</span>':"")+'</a>'+
'<p class="card__cat">'+esc(m.cat)+'</p><h3><a href="'+href+'" style="text-decoration:none">'+esc(m.title)+'</a></h3>'+
'<p class="card__v">'+esc(info.join(" · ")||" ")+'</p><p class="card__p">'+pr+'</p>'+
'<div class="card__b"><a class="btn btn--line" href="'+href+'">Подробнее</a><a class="btn btn--soft" href="'+waLink(m,v0)+'" target="_blank" rel="noopener">Уточнить наличие</a></div></article>';
}
function home(){
setWa();
var cl=$("#cats");
cl.innerHTML=cats.map(function(c){
var ms=models.filter(function(m){return m.cat===c});
if(!ms.length)return"";
var lo=Math.min.apply(null,ms.map(minP).filter(function(x){return x!=null}));
var rep=ms[0].v[0];
var n=ms.length;
var w=n%10===1&&n%100!==11?"модель":(n%10>=2&&n%10<=4&&(n%100<10||n%100>=20)?"модели":"моделей");
return'<li><a href="?cat='+encodeURIComponent(c)+'#catalog" data-cat="'+esc(c)+'"><img src="'+img(rep.im,"small")+'" alt="" loading="lazy" width="72" height="56"><h3>'+esc(c)+'</h3><small>'+n+" "+w+'</small><span class="from">'+(isFinite(lo)?"от "+money(lo):"")+'</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg></a></li>';
}).join("");
$("#upd").textContent=fmtDate(D.updated);
$("#upd2").textContent=fmtDate(D.updated);
var S={q:"",cat:"",min:null,max:null,st:{},price:false,sort:"def",n:12},PAGE=12;
var chips=$("#chips"),grid=$("#grid");
function chipsHtml(){
var all='<button class="chip" type="button" data-c="" aria-pressed="'+(S.cat===""?"true":"false")+'">Все<small>'+models.length+'</small></button>';
return all+cats.map(function(c){
var k=models.filter(function(m){return m.cat===c}).length;
return k?'<button class="chip" type="button" data-c="'+esc(c)+'" aria-pressed="'+(S.cat===c?"true":"false")+'">'+esc(c)+'<small>'+k+'</small></button>':"";
}).join("");
}
function storages(){
var set={};
models.forEach(function(m){if(S.cat&&m.cat!==S.cat)return;m.v.forEach(function(v){if(real(v.s)&&/ГБ|ТБ|мм|"/.test(v.s))set[v.s]=1})});
var arr=Object.keys(set);
arr.sort(function(a,b){var x=parseFloat(a.split("/").pop()),y=parseFloat(b.split("/").pop());return(isNaN(x)?0:x)-(isNaN(y)?0:y)||a.localeCompare(b)});
return arr;
}
function stHtml(){
var arr=storages();
$("#stwrap").hidden=!arr.length;
$("#st").innerHTML=arr.map(function(s){return'<button class="chip" type="button" data-s="'+esc(s)+'" aria-pressed="'+(S.st[s]?"true":"false")+'">'+esc(s)+'</button>'}).join("");
}
function match(m){
if(S.cat&&m.cat!==S.cat)return false;
if(S.q){
var hay=(m.title+" "+m.cat+" "+m.v.map(function(v){return(v.s||"")+" "+(v.c||"")}).join(" ")).toLowerCase();
var ok=S.q.toLowerCase().split(/\s+/).every(function(w){return hay.indexOf(w)>=0});
if(!ok)return false;
}
var keys=Object.keys(S.st).filter(function(k){return S.st[k]});
var vs=m.v.filter(function(v){
if(keys.length&&keys.indexOf(v.s)<0)return false;
if(S.price&&v.p==null)return false;
if(S.min!=null&&(v.p==null||v.p<S.min))return false;
if(S.max!=null&&(v.p==null||v.p>S.max))return false;
return true;
});
return vs.length>0;
}
function render(){
var list=models.filter(match);
if(S.sort==="asc"||S.sort==="desc"){
list=list.slice().sort(function(a,b){
var x=minP(a),y=minP(b);
if(x==null&&y==null)return 0;if(x==null)return 1;if(y==null)return-1;
return S.sort==="asc"?x-y:y-x;
});
}else if(S.sort==="az"){list=list.slice().sort(function(a,b){return a.title.localeCompare(b.title,"ru")})}
var shown=list.slice(0,S.n);
grid.innerHTML=shown.map(cardHtml).join("");
$("#empty").hidden=list.length>0;
var n=list.length,w=n%10===1&&n%100!==11?"модель":(n%10>=2&&n%10<=4&&(n%100<10||n%100>=20)?"модели":"моделей");
$("#cnt").textContent=n?"Найдено: "+n+" "+w:"";
$("#more").hidden=list.length<=S.n;
$("#more").textContent="Показать ещё "+Math.min(PAGE,list.length-S.n);
}
function sync(){
chips.innerHTML=chipsHtml();stHtml();
var u=new URL(location.href);
if(S.cat)u.searchParams.set("cat",S.cat);else u.searchParams.delete("cat");
history.replaceState(null,"",u.pathname+u.search+u.hash);
}
function reset(){S.q="";S.min=null;S.max=null;S.st={};S.price=false;$("#q").value="";$("#pmin").value="";$("#pmax").value="";$$("[data-flag]").forEach(function(b){b.setAttribute("aria-pressed","false")});S.n=PAGE;stHtml();render()}
var p=new URLSearchParams(location.search).get("cat");
if(p&&cats.indexOf(p)>=0)S.cat=p;
sync();render();
chips.addEventListener("click",function(e){var b=e.target.closest("[data-c]");if(!b)return;S.cat=b.dataset.c;S.st={};S.n=PAGE;sync();render()});
$("#st").addEventListener("click",function(e){var b=e.target.closest("[data-s]");if(!b)return;S.st[b.dataset.s]=!S.st[b.dataset.s];b.setAttribute("aria-pressed",S.st[b.dataset.s]?"true":"false");S.n=PAGE;render()});
$("#flags").addEventListener("click",function(e){var b=e.target.closest("[data-flag]");if(!b)return;S.price=!S.price;b.setAttribute("aria-pressed",S.price?"true":"false");S.n=PAGE;render()});
var t;
$("#q").addEventListener("input",function(e){clearTimeout(t);var v=e.target.value.trim();t=setTimeout(function(){S.q=v;S.n=PAGE;render()},120)});
function num(el){var v=parseInt(el.value,10);return isNaN(v)?null:v}
["#pmin","#pmax"].forEach(function(id){$(id).addEventListener("input",function(){clearTimeout(t);t=setTimeout(function(){S.min=num($("#pmin"));S.max=num($("#pmax"));S.n=PAGE;render()},200)})});
$("#sort").addEventListener("change",function(e){S.sort=e.target.value;render()});
$("#more").addEventListener("click",function(){S.n+=PAGE;render()});
$("#reset").addEventListener("click",reset);
$("#fbtn").addEventListener("click",function(){var o=$("#filters").classList.toggle("open");this.setAttribute("aria-expanded",o)});
cl.addEventListener("click",function(e){
var a=e.target.closest("[data-cat]");if(!a)return;
e.preventDefault();S.cat=a.dataset.cat;S.st={};S.n=PAGE;sync();render();
$("#catalog").scrollIntoView({behavior:"smooth"});
});
openState();setInterval(openState,60000);
}
function fmtDate(s){var a=s.split("-");return a[2]+"."+a[1]+"."+a[0]}
function product(){
setWa();
var q=new URLSearchParams(location.search),m=byId[q.get("m")],app=$("#app");
if(!m){
document.title="Товар не найден — Apple RU Store";
app.innerHTML='<div class="empty"><b>Такого товара нет в каталоге</b><a class="btn btn--ac" href="./#catalog">Перейти в каталог</a></div>';
return;
}
var cur=m.v.filter(function(v){return v.i===q.get("v")})[0]||priced(m).sort(function(a,b){return a.p-b.p})[0]||m.v[0];
var sts=[],cls=[];
m.v.forEach(function(v){if(real(v.s)&&sts.indexOf(v.s)<0)sts.push(v.s);if(real(v.c)&&cls.indexOf(v.c)<0)cls.push(v.c)});
var pics=[];
m.v.forEach(function(v){if(pics.indexOf(v.im)<0)pics.push(v.im)});
var mainIm=cur.im;
function pick(s,c){
var a=m.v.filter(function(v){return v.s===s&&v.c===c})[0];
if(!a&&s!==undefined&&c===undefined)a=m.v.filter(function(v){return v.s===s})[0];
return a;
}
function draw(){
var title=m.title+(real(cur.s)?", "+cur.s:"")+(real(cur.c)?", "+cur.c:"");
var wa=waLink(m,cur);
var storeLink=SH.site+"/service/item/TYCOON_"+cur.i;
var av=cur.u||m.u||SH.avito;
var avLabel=(cur.u||m.u)?"Объявление на Авито":"Все объявления магазина на Авито";
var spec=[["Категория",m.cat],["Модель",m.title]];
m.facts.forEach(function(f){spec.push(f)});
if(real(cur.s))spec.push([/мм$/.test(cur.s)?"Размер":"Память",cur.s]);
if(real(cur.c))spec.push(["Цвет",cur.c]);
if(cur.n)spec.push(["Отметка магазина","Устройство без приложения RuStore"]);
spec.push(["Код в каталоге магазина",cur.i]);
var price=cur.p!=null?money(cur.p)+"<small>Цена из каталога магазина на "+fmtDate(D.updated)+"</small>":"Цену уточняйте<small>В каталоге магазина цена не указана или вызывает сомнение</small>";
var rel=models.filter(function(x){return x.cat===m.cat&&x.id!==m.id}).slice(0,4);
var html='<nav class="crumbs" aria-label="Навигация"><a href="./">Главная</a> / <a href="./?cat='+encodeURIComponent(m.cat)+'#catalog">'+esc(m.cat)+'</a> / '+esc(m.title)+'</nav>'+
'<div class="prod"><div><div class="gal__main"><img src="'+img(mainIm,"XXL")+'" alt="'+esc(title)+'" width="800" height="800"></div>'+
(pics.length>1?'<div class="gal__th">'+pics.map(function(k){return'<button type="button" data-im="'+k+'" aria-pressed="'+(k===mainIm?"true":"false")+'" aria-label="Фото"><img src="'+img(k,"small")+'" alt="" width="60" height="60"></button>'}).join("")+'</div>':"")+
'</div><div class="prod__info"><h1>'+esc(title)+'</h1><p class="prod__price">'+price+'</p>'+
'<p class="prod__note">Не является офертой. Наличие и итоговую цену подтверждает продавец.</p>'+
(sts.length>1?'<div class="opt"><h3>Память</h3><div class="chips">'+sts.map(function(s){var ok=!!pick(s,cur.c);return'<button class="chip'+(ok?"":" off")+'" type="button" data-s="'+esc(s)+'" aria-pressed="'+(s===cur.s?"true":"false")+'">'+esc(s)+'</button>'}).join("")+'</div></div>':"")+
(cls.length>1?'<div class="opt"><h3>Цвет</h3><div class="chips">'+cls.map(function(c){var ok=!!pick(cur.s,c);return'<button class="chip'+(ok?"":" off")+'" type="button" data-c="'+esc(c)+'" aria-pressed="'+(c===cur.c?"true":"false")+'">'+esc(c)+'</button>'}).join("")+'</div></div>':"")+
'<div class="prod__cta"><a class="btn btn--ac" href="'+wa+'" target="_blank" rel="noopener">Уточнить наличие в WhatsApp</a></div>'+
'<div class="prod__cta2"><a class="btn btn--line btn--sm" href="https://t.me/'+SH.tg+'" target="_blank" rel="noopener">Telegram</a><a class="btn btn--line btn--sm" href="tel:'+SH.phone+'">Позвонить</a><a class="btn btn--soft btn--sm" href="'+av+'" target="_blank" rel="noopener">'+avLabel+'</a><a class="btn btn--soft btn--sm" href="'+storeLink+'" target="_blank" rel="noopener">Карточка в каталоге магазина</a></div>'+
'<dl class="spec">'+spec.map(function(r){return'<div><dt>'+esc(r[0])+'</dt><dd>'+esc(r[1])+'</dd></div>'}).join("")+'</dl></div></div>'+
'<div class="info3"><div><h3>Состояние</h3><p>Магазин продаёт новую технику и устройства из trade-in. Состояние этой позиции уточняйте у продавца до покупки.</p></div><div><h3>Гарантия</h3><p>От магазина: 1 год на новую технику, 100 дней на устройства из trade-in.</p></div><div><h3>Доставка</h3><p>По центру Ростова-на-Дону бесплатно, 1 день. Самовывоз: ул. Суворова, 77/61, ежедневно 11:00–20:00.</p></div></div>'+
(rel.length?'<div class="rel"><h2>Ещё в разделе «'+esc(m.cat)+'»</h2><div class="grid">'+rel.map(cardHtml).join("")+'</div></div>':"")+
'<div style="height:64px"></div>';
app.innerHTML=html;
document.title=title+(cur.p!=null?" — "+money(cur.p):"")+" — Apple RU Store";
setMeta(title);
$("a.btn--ac",app).dataset.fixed="1";
$$("[data-wa]").forEach(function(a){if(a.closest("main"))return;a.href=wa;a.dataset.fixed="1"});
var u=new URL(location.href);u.searchParams.set("m",m.id);u.searchParams.set("v",cur.i);history.replaceState(null,"",u.pathname+u.search);
$$("[data-im]",app).forEach(function(b){b.addEventListener("click",function(){mainIm=b.dataset.im;$(".gal__main img",app).src=img(mainIm,"XXL");$$("[data-im]",app).forEach(function(x){x.setAttribute("aria-pressed",x===b?"true":"false")})})});
$$("[data-s]",app).forEach(function(b){b.addEventListener("click",function(){var v=pick(b.dataset.s,cur.c)||pick(b.dataset.s);if(v){cur=v;mainIm=v.im;draw()}})});
$$("[data-c]",app).forEach(function(b){b.addEventListener("click",function(){var v=pick(cur.s,b.dataset.c)||m.v.filter(function(x){return x.c===b.dataset.c})[0];if(v){cur=v;mainIm=v.im;draw()}})});
}
function setMeta(title){
var d=title+(cur.p!=null?" — "+money(cur.p):"")+". Уточнить наличие и условия покупки — Apple RU Store, Ростов-на-Дону.";
var md=$('meta[name="description"]');if(md)md.content=d;
var old=$("#ld");if(old)old.remove();
var o={"@context":"https://schema.org","@type":"Product","name":title,"image":[img(mainIm,"XXL")],"category":m.cat,"sku":cur.i,};
var br=["iPhone","MacBook","iPad","Apple Watch","AirPods"].indexOf(m.cat)>=0?"Apple":(["Samsung","Dyson","Sony","Marshall"].indexOf(m.brand)>=0?m.brand:"");
if(br)o.brand={"@type":"Brand","name":br};
if(cur.p!=null)o.offers={"@type":"Offer","price":cur.p,"priceCurrency":"RUB","url":location.href,"seller":{"@type":"Organization","name":"Apple RU Store"}};
var s=document.createElement("script");s.type="application/ld+json";s.id="ld";s.textContent=JSON.stringify(o);document.head.appendChild(s);
}
draw();
}
burger();
if(document.body.classList.contains("pp"))product();else home();
})();
