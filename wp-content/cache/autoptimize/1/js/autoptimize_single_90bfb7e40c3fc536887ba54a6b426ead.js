(function(){let cookieManager=Cookies.noConflict();let setCookie=function setCookie(name,value,override){if(!override&&typeof(cookieManager.get(name))!='undefined'){return;}
var host=window.location.host
host=host.substring(host.indexOf('.')+1)
cookieManager.set(name,value,{domain:'.'+host,expires:90,path:'/',});}
let strUrl=window.location.href;let query={};var posQuery=strUrl.indexOf("?");if(posQuery>=0){let strQuery=strUrl.substr(posQuery+1);strQuery.split("&").forEach(function parsePart(part){if(!part){return;}
part=part.split("+").join(" ")
let posEq=part.indexOf("=");let key=posEq>-1?part.substr(0,posEq):part;key=key.toLowerCase();let additional=['a','CXD_token','atoken','affid','Referrer_Code','Referrer_Type','Referrer_Group','email','AA_Number','ref'];if(key.substr(0,4)!='utm_'&&!additional.includes(key)){return;}
let value=posEq>-1?decodeURIComponent(part.substr(posEq+1)):"";if(key=='a'){try{var decoded=atob(value);let refer_arr=decoded.split('/');var Referrer_Code=(typeof refer_arr[0]!=='undefined')?refer_arr[0]:'';var Referrer_Type=(typeof refer_arr[1]!=='undefined')?refer_arr[1]:'';var Referrer_Group=(typeof refer_arr[2]!=='undefined')?refer_arr[2]:'';setCookie('Referrer_Code',Referrer_Code,true);setCookie('Referrer_Type',Referrer_Type,true);setCookie('Referrer_Group',Referrer_Group,true);}catch(e){}}
setCookie(key,value,true);});}
setCookie('ref_landing',window.location.protocol+"//"+window.location.host+window.location.pathname);setCookie('ref_referer',document.referrer);})();