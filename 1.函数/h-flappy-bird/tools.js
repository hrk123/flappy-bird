 /**
  * 本地化存储 封装
  */
 function setLocal(key, value) {
     if (value === 'object' && value !== null) {
         value = JSON.stringify(value);
     }
     localStorage.setItem(key, value);
 }

 /**
  * 获取本地存储值
  */
 function getLocal(key) {
     var value = localStorage.getItem(key);
     if (value === null) { return null };
     if (value[0] === '[' || value[0] === '{') {
         return JSON.parse(value);
     }
     return value;
 }