export interface ImageSlot { id:string; name:string; page:string; section:string; path:string; description:string; recommendedSize:string; }
export const IMAGE_REGISTRY: ImageSlot[] = [
  {id:'site-logo',name:'网站Logo',page:'全局',section:'导航栏',path:'images/longvon-logo.png',description:'左上角LONGVON品牌Logo',recommendedSize:'320×64px'},
  {id:'homepage-hero-white',name:'Hero主图·白色',page:'首页',section:'Hero区域',path:'images/ring1c/White-45-Left.jpg',description:'首页全屏Hero',recommendedSize:'1600×1200px'},
  {id:'homepage-hero-pink',name:'Hero主图·粉色',page:'首页',section:'配色切换',path:'images/ring1c/Pink-45-Left.jpg',description:'粉色配色',recommendedSize:'1200×1200px'},
  {id:'homepage-hero-blue',name:'Hero主图·蓝色',page:'首页',section:'配色切换',path:'images/ring1c/Blue-45-Left.jpg',description:'蓝色配色',recommendedSize:'1200×1200px'},
  {id:'homepage-hero-black',name:'Hero主图·黑色',page:'首页',section:'配色切换',path:'images/ring1c/Black-45-Left.jpg',description:'黑色配色',recommendedSize:'1200×1200px'},
  {id:'homepage-sleep',name:'睡眠功能配图',page:'首页',section:'睡眠区域',path:'images/ring1c/White-45-Right.jpg',description:'睡眠展示',recommendedSize:'800×800px'},
  {id:'homepage-osa',name:'OSA功能配图',page:'首页',section:'OSA区域',path:'images/ring1c/Blue-45-Left.jpg',description:'OSA展示',recommendedSize:'800×800px'},
  {id:'homepage-heart',name:'心脏功能配图',page:'首页',section:'心脏区域',path:'images/ring1c/Pink-45-Left.jpg',description:'心脏展示',recommendedSize:'600×600px'},
  {id:'homepage-stress',name:'压力功能配图',page:'首页',section:'压力区域',path:'images/ring1c/Black-45-Right.jpg',description:'压力展示',recommendedSize:'600×600px'},
  {id:'homepage-specs',name:'产品规格配图',page:'首页',section:'规格区域',path:'images/ring1c/Black.jpg',description:'规格展示',recommendedSize:'800×800px'},
  {id:'ring1c-color-white',name:'四色展示·白色',page:'Ring1C产品页',section:'Hero',path:'images/ring1c/White-45-Left.jpg',description:'产品页白色',recommendedSize:'600×600px'},
  {id:'ring1c-color-pink',name:'四色展示·粉色',page:'Ring1C产品页',section:'Hero',path:'images/ring1c/Pink-45-Left.jpg',description:'产品页粉色',recommendedSize:'600×600px'},
  {id:'ring1c-color-blue',name:'四色展示·蓝色',page:'Ring1C产品页',section:'Hero',path:'images/ring1c/Blue-45-Left.jpg',description:'产品页蓝色',recommendedSize:'600×600px'},
  {id:'ring1c-color-black',name:'四色展示·黑色',page:'Ring1C产品页',section:'Hero',path:'images/ring1c/Black-45-Left.jpg',description:'产品页黑色',recommendedSize:'600×600px'},
  {id:'ring1c-white-front',name:'产品正面·白色',page:'Ring1C产品页',section:'工艺区',path:'images/ring1c/White.jpg',description:'白色正面',recommendedSize:'600×600px'},
  {id:'ring1c-pink-front',name:'产品正面·粉色',page:'Ring1C产品页',section:'工艺区',path:'images/ring1c/Pink.jpg',description:'粉色正面',recommendedSize:'600×600px'},
  {id:'ring1c-blue-front',name:'产品正面·蓝色',page:'Ring1C产品页',section:'工艺区',path:'images/ring1c/Blue.jpg',description:'蓝色正面',recommendedSize:'600×600px'},
  {id:'ring1c-black-front',name:'产品正面·黑色',page:'Ring1C产品页',section:'工艺区',path:'images/ring1c/Black.jpg',description:'黑色正面',recommendedSize:'600×600px'},
];
export function getImagesByPage():Record<string,ImageSlot[]>{return IMAGE_REGISTRY.reduce((acc,s)=>{if(!acc[s.page])acc[s.page]=[];acc[s.page].push(s);return acc;},{} as Record<string,ImageSlot[]>);}
export function getImageSlotById(id:string):ImageSlot|undefined{return IMAGE_REGISTRY.find(s=>s.id===id);}
