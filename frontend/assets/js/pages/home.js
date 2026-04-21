import { getProducts } from "../services/product.service.js";
import { createProductCard } from "../components/product-card.js";
import { setElementText, showElement, hideElement } from "../utils/dom.js";
import { initCartBadge } from "../components/cart-header.js";
import { initFavoritesBadge } from "../components/favorites-header.js";
import { toggleFavorite } from "../utils/favorites.js";
import { showToast } from "../utils/toast.js";

const homeProductsContainer =
document.getElementById("homeProductsGrid");

const featuredProductsContainer =
document.getElementById("featuredProductsGrid");

let allProducts = [];

/* =========================
NORMALIZA RESPOSTA
========================= */

function getProductList(responseData){

if(Array.isArray(responseData))
return responseData;

if(Array.isArray(responseData?.items))
return responseData.items;

if(Array.isArray(responseData?.products))
return responseData.products;

if(Array.isArray(responseData?.data))
return responseData.data;

return [];

}

/* =========================
SKELETON
========================= */

function createSkeletonCards(
quantity=8){

return Array.from(
{length:quantity}
)

.map(()=>

`

<article
class="skeleton-card">

<div
class="skeleton
skeleton-card__image">
</div>

<div
class="skeleton
skeleton-card__line
skeleton-card__line--sm">
</div>

<div
class="skeleton
skeleton-card__line
skeleton-card__line--lg">
</div>

<div
class="skeleton
skeleton-card__line
skeleton-card__line--md">
</div>

<div
class="skeleton
skeleton-card__price">
</div>

<div
class="skeleton
skeleton-card__button">
</div>

<div
class="skeleton
skeleton-card__button">
</div>

</article>

`

)

.join("");

}

/* =========================
UTILS DE VITRINE
========================= */

function sortByPriceDesc(
products=[]
){

return [...products]

.sort(
(a,b)=>

Number(b.price||0)

-

Number(a.price||0)

);

}

function getFeaturedProducts(
products=[]
){

return sortByPriceDesc(
products

)

.slice(0,4);

}

function getUniqueCategories(
products=[]
){

return [

...new Set(

products

.map(

p=>p.category

)

.filter(Boolean)

)

];

}

/* mistura categorias */

function getRecommendedMix(
products=[]
){

const categories=

getUniqueCategories(

products

);

const result=[];

categories.forEach(

category=>{

const items=

products

.filter(

p=>

p.category===

category

)

.slice(0,2);

result.push(...items);

}

);

return result.slice(0,8);

}

/* =========================
FAVORITOS
========================= */

function bindFavoriteButtons(
scope=document
){

const buttons=

scope.querySelectorAll(

"[data-favorite-toggle]"

);

buttons.forEach(

button=>{

button.addEventListener(

"click",

event=>{

event.preventDefault();

event.stopPropagation();

const product={

id:

button.getAttribute(

"data-product-id"

),

name:

button.getAttribute(

"data-product-name"

),

price:Number(

button.getAttribute(

"data-product-price"

)

),

image:

button.getAttribute(

"data-product-image"

),

category:

button.getAttribute(

"data-product-category"

),

description:

button.getAttribute(

"data-product-description"

)

};

toggleFavorite(product);

showToast({

title:"Favoritos",

message:

"Produto salvo",

type:"info"

});

renderHomeSections();

}

);

}

);

}

/* =========================
RENDER
========================= */

function renderProducts(
container,

products
){

if(!container) return;

if(!products.length){

container.innerHTML=`

<div
class="empty-state">

<h3>

Nenhum produto

</h3>

<p>

Cadastre produtos

no painel admin

</p>

</div>

`;

return;

}

container.innerHTML=

products

.map(

createProductCard

)

.join("");

bindFavoriteButtons(container);

}

function renderHeroStats(){

const totalProducts=

allProducts.length;

const categories=

getUniqueCategories(

allProducts

).length;

if(!totalProducts){

setElementText(

"#heroStats",

"Catálogo em preparação"

);

return;

}

setElementText(

"#heroStats",

`

${totalProducts}

produtos •

${categories}

categorias

`

);

}

function renderHomeSections(){

const featured=

getFeaturedProducts(

allProducts

);

const mix=

getRecommendedMix(

allProducts

);

renderHeroStats();

renderProducts(

featuredProductsContainer,

featured

);

renderProducts(

homeProductsContainer,

mix

);

if(!allProducts.length){

showElement(

"#homeEmpty",

"block"

);

}

else{

hideElement(

"#homeEmpty"

);

}

}

/* =========================
LOAD
========================= */

async function loadHomeProducts(){

try{

showElement(

"#homeLoading",

"flex"

);

hideElement(

"#homeError"

);

hideElement(

"#homeEmpty"

);

/* skeleton */

if(

homeProductsContainer

){

homeProductsContainer

.innerHTML=

createSkeletonCards(8);

}

if(

featuredProductsContainer

){

featuredProductsContainer

.innerHTML=

createSkeletonCards(4);

}

const response=

await getProducts();

allProducts=

getProductList(

response

);

renderHomeSections();

}

catch(error){

console.error(error);

showElement(

"#homeError",

"block"

);

setElementText(

"#homeErrorMessage",

error.message ||

"Erro ao carregar"

);

}

finally{

hideElement(

"#homeLoading"

);

}

}

/* =========================
INIT
========================= */

document.addEventListener(

"DOMContentLoaded",

()=>{

initCartBadge();

initFavoritesBadge();

loadHomeProducts();

}

);