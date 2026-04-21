/* ===========================
DOM UTILS
funções reutilizáveis
=========================== */

function resolveElement(target) {
    if (!target) return null;

    if (typeof target === "string") {
        return document.querySelector(target);
    }

    return target;
}

/* selecionar elemento */
export function select(selector) {
    return document.querySelector(selector);
}

/* selecionar vários */
export function selectAll(selector) {
    return document.querySelectorAll(selector);
}

/* alterar texto */
export function setElementText(target, value) {
    const element = resolveElement(target);
    if (!element) return;

    element.textContent = value;
}

/* alterar html */
export function setElementHTML(target, html) {
    const element = resolveElement(target);
    if (!element) return;

    element.innerHTML = html;
}

/* mostrar elemento */
export function showElement(target, display = "block") {
    const element = resolveElement(target);
    if (!element) return;

    element.style.display = display;
    element.classList.remove("hidden");
}

/* esconder elemento */
export function hideElement(target) {
    const element = resolveElement(target);
    if (!element) return;

    element.style.display = "none";
    element.classList.add("hidden");
}

/* adicionar classe */
export function addClass(target, className) {
    const element = resolveElement(target);
    if (!element) return;

    element.classList.add(className);
}

/* remover classe */
export function removeClass(target, className) {
    const element = resolveElement(target);
    if (!element) return;

    element.classList.remove(className);
}

/* toggle classe */
export function toggleClass(target, className) {
    const element = resolveElement(target);
    if (!element) return;

    element.classList.toggle(className);
}

/* adicionar evento */
export function addEvent(target, event, callback, options) {
    const element = resolveElement(target);
    if (!element) return;

    element.addEventListener(event, callback, options);
}

/* remover evento */
export function removeEvent(target, event, callback, options) {
    const element = resolveElement(target);
    if (!element) return;

    element.removeEventListener(event, callback, options);
}

/* criar elemento */
export function createElement(tag, className = "") {
    const element = document.createElement(tag);

    if (className) {
        element.className = className;
    }

    return element;
}

/* limpar elemento */
export function clearElement(target) {
    const element = resolveElement(target);
    if (!element) return;

    element.innerHTML = "";
}