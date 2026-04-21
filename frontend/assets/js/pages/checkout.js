import { formatPrice } from "../utils/format.js";

import {
    getCart,
    getCartTotal,
    clearCart,
    isCartEmpty
} from "../utils/cart.js";

import { initCartBadge } from "../components/cart-header.js";
import { initFavoritesBadge } from "../components/favorites-header.js";

import { createOrder } from "../services/order.service.js";

import { showToast } from "../utils/toast.js";


const checkoutItemsContainer =
    document.getElementById("checkoutItems");

const checkoutEmptyState =
    document.getElementById("checkoutEmptyState");

const checkoutContent =
    document.getElementById("checkoutContent");

const checkoutForm =
    document.getElementById("checkoutForm");

const checkoutSuccess =
    document.getElementById("checkoutSuccess");


const summaryItemsCount =
    document.getElementById("summaryItemsCount");

const topSummaryItemsCount =
    document.getElementById("topSummaryItemsCount");

const summarySubtotal =
    document.getElementById("summarySubtotal");

const summaryFreight =
    document.getElementById("summaryFreight");

const summaryTotal =
    document.getElementById("summaryTotal");


const customerName =
    document.getElementById("customerName");

const customerEmail =
    document.getElementById("customerEmail");

const customerPhone =
    document.getElementById("customerPhone");

const customerCpf =
    document.getElementById("customerCpf");

const zipCode =
    document.getElementById("zipCode");

const street =
    document.getElementById("street");

const number =
    document.getElementById("number");

const neighborhood =
    document.getElementById("neighborhood");

const city =
    document.getElementById("city");

const state =
    document.getElementById("state");

const paymentMethod =
    document.getElementById("paymentMethod");


const confirmationName =
    document.getElementById("confirmationName");

const confirmationTotal =
    document.getElementById("confirmationTotal");

const confirmationItems =
    document.getElementById("confirmationItems");

const confirmationPayment =
    document.getElementById("confirmationPayment");


const FALLBACK_IMAGE =
    "https://via.placeholder.com/120x120?text=Minha+Loja";


/* frete */

function calculateFreight(subtotal){

    if(subtotal >= 500){

        return 0;

    }

    return 24.90;

}


/* item visual */

function createCheckoutItemMarkup(item){

    const image =
        item.image?.trim() ||
        FALLBACK_IMAGE;

    const quantity =
        Number(item.quantity || 0);

    const lineTotal =
        Number(item.price || 0) *
        quantity;

    return `

        <article class="checkout-item interactive-lift">

            <div class="checkout-item__image-wrapper">

                <img

                    class="checkout-item__image"

                    src="${image}"

                    alt="${item.name}"

                    onerror="this.onerror=null;this.src='${FALLBACK_IMAGE}'"

                >

            </div>


            <div class="checkout-item__content">

                <span class="checkout-item__category">

                    ${item.category || "Sem categoria"}

                </span>


                <h3 class="checkout-item__title">

                    ${item.name}

                </h3>


                <div class="checkout-item__meta">

                    <span>

                        Qtd:

                        <strong>

                            ${quantity}

                        </strong>

                    </span>


                    <span>

                        Unitário:

                        <strong>

                            ${formatPrice(item.price)}

                        </strong>

                    </span>

                </div>

            </div>


            <div class="checkout-item__total">

                <strong>

                    ${formatPrice(lineTotal)}

                </strong>

            </div>

        </article>

    `;

}


/* render */

function renderCheckoutItems(){

    const cart = getCart();


    if(isCartEmpty()){

        checkoutContent.style.display =
            "none";

        checkoutSuccess.style.display =
            "none";

        checkoutEmptyState.style.display =
            "block";

        return;

    }


    checkoutEmptyState.style.display =
        "none";

    checkoutContent.style.display =
        "grid";

    checkoutSuccess.style.display =
        "none";


    checkoutItemsContainer.innerHTML =

        cart
            .map(createCheckoutItemMarkup)
            .join("");


    const totalItems =
        cart.reduce(

            (total,item)=>

                total +
                Number(item.quantity || 0),

            0

        );


    const subtotal =
        getCartTotal();

    const freight =
        calculateFreight(subtotal);

    const total =
        subtotal + freight;


    summaryItemsCount.textContent =
        `${totalItems} item(s)`;


    topSummaryItemsCount.textContent =
        `${totalItems} item(s)`;


    summarySubtotal.textContent =
        formatPrice(subtotal);


    summaryFreight.textContent =
        freight === 0
            ? "Grátis"
            : formatPrice(freight);


    summaryTotal.textContent =
        formatPrice(total);

}


/* validação */

function validateForm(){

    const requiredFields = [

        customerName,

        customerEmail,

        customerPhone,

        customerCpf,

        zipCode,

        street,

        number,

        neighborhood,

        city,

        state,

        paymentMethod

    ];


    for(const field of requiredFields){

        if(!field?.value?.trim()){

            field.focus();

            showToast({

                type:"error",

                title:"Campo obrigatório",

                message:"Preencha todos os campos."

            });

            throw new Error("invalid");

        }

    }


    if(!customerEmail.value.includes("@")){

        customerEmail.focus();

        showToast({

            type:"error",

            title:"Email inválido",

            message:"Informe um email válido."

        });

        throw new Error("invalid");

    }


    if(

        String(customerCpf.value)

        .replace(/\D/g,"")

        .length < 11

    ){

        customerCpf.focus();

        showToast({

            type:"error",

            title:"CPF inválido",

            message:"Informe um CPF válido."

        });

        throw new Error("invalid");

    }

}


/* confirmação */

function renderConfirmation(orderData){

    confirmationName.textContent =
        customerName.value.trim();


    confirmationTotal.textContent =
        formatPrice(orderData.total || 0);


    confirmationItems.textContent =
        `${orderData.items_count || 0} item(s)`;


    confirmationPayment.textContent =
        paymentMethod.value;

}


/* envio */

async function handleCheckoutSubmit(event){

    event.preventDefault();


    try{

        validateForm();


        const cart =
            getCart();


        showToast({

            type:"info",

            title:"Processando pedido",

            message:"Estamos finalizando sua compra..."

        });


        const payload = {

            customer_name:
                customerName.value.trim(),

            customer_email:
                customerEmail.value.trim(),

            customer_phone:
                customerPhone.value.trim(),

            customer_cpf:
                customerCpf.value.trim(),

            zip_code:
                zipCode.value.trim(),

            street:
                street.value.trim(),

            number:
                number.value.trim(),

            neighborhood:
                neighborhood.value.trim(),

            city:
                city.value.trim(),

            state:
                state.value.trim(),

            payment_method:
                paymentMethod.value,

            items: cart

        };


        const response =
            await createOrder(payload);


        const orderData =
            response?.data ||
            response;


        renderConfirmation(orderData);


        clearCart();


        checkoutContent.style.display =
            "none";

        checkoutEmptyState.style.display =
            "none";

        checkoutSuccess.style.display =
            "block";


        showToast({

            type:"success",

            title:"Pedido realizado",

            message:"Sua compra foi finalizada com sucesso."

        });


        window.scrollTo({

            top:0,

            behavior:"smooth"

        });

    }

    catch(error){

        if(error.message === "invalid"){

            return;

        }


        showToast({

            type:"error",

            title:"Erro no pedido",

            message:
                error.message ||
                "Erro ao finalizar pedido"

        });

    }

}


/* init */

function initCheckoutPage(){

    initCartBadge();

    initFavoritesBadge();


    renderCheckoutItems();


    checkoutForm
        ?.addEventListener(

            "submit",

            handleCheckoutSubmit

        );

}


document.addEventListener(

    "DOMContentLoaded",

    initCheckoutPage

);