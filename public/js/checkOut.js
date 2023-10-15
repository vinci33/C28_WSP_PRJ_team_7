const contactAlert = document.querySelector('.contact-alert')
const addressAlert = document.querySelector('.address-alert')

window.onload = async function () {
    loadSummary();
    checkOut();
    document.querySelectorAll('.check-out-form input').forEach(function (e) {
        e.addEventListener('click', function () {
            contactAlert.style.display = "none";
            addressAlert.style.display = "none";
        });
    });
}

async function checkOut() {
    const checkOutBtn = document.querySelector('.checkout-login-btn');
    checkOutBtn.addEventListener('click', async function (e) {
        let res = await fetch('/cartItemsByUserId');
        let cartItems = await res.json();
        if (cartItems.length == 0) {
            throw new Error('Something wrong with shopping cart')
        }
        const cartItemsWithTotalPri = cartItems.map(item => {
            const product_total_price = +(item.selling_price * item.product_quantity);
            return {
                ...item,
                product_total_price,
            };
        });
        let total_amount = cartItemsWithTotalPri.reduce((previous, current) => {
            return previous + current.product_total_price;
        }, 0);
        let resOrderId = await fetch("/orders", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                user_id: cartItemsWithTotalPri[0].user_id,
                total_amount: total_amount,
                payment_status: "processing",
                payment_method: "credit_card",
            }),
        });
        if (res.ok) {
            console.log(`Order updated`);
        } else {
            console.log(`Order can not update`);
        }
        let orderId = await resOrderId.json();
        try {
            await fetch("/orderDetailItems", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    orderId: orderId,
                    cartItems: cartItemsWithTotalPri
                }),
            });

        } catch (err) {
            console.log(`Unable update order detail`);
        }

        let checkOutDetail = getCheckOutInfo();
        if (checkOutDetail.success) {
            try {
                const resp = await fetch('/deliveryConAdd', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(checkOutDetail.checkOutInfo),
                });
                const data = await resp.json();
                const orderInfo = data.data;
                const msg = data.msg;

                if (!msg.success) {
                    throw new Error(err.msg);
                } else {
                    console.log(`delivery info updated ${msg.msg}`)
                }
                // console.log("data")
                // console.log(data)
                // console.log("orderInfo")
                // console.log(orderInfo);
                // console.log("msg")
                // console.log(msg);



            } catch (err) {
                console.error(`Unable to submit  info`);
            }
        } else {
            console.log(err.message);
        }
        try {
            // await fetch("/deleteCartItems", {
            //     method: "DELETE",
            // });
        }
        catch (err) {
            console.log(`Unable to delete cart items`);
        }

    })
}

async function loadSummary() {
    try {
        let res = await fetch('/cartItemsByUserId');
        let summary = await res.json();
        if (summary.length == 0) {
            throw new Error('Shopping cart is empty')
        }
        const summaryWithTotalPri = summary.map(item => {
            const product_total_price = +(item.selling_price * item.product_quantity);
            return {
                ...item,
                product_total_price,
            };
        });
        let total_amount = summaryWithTotalPri.reduce((previous, current) => {
            return previous + current.product_total_price;
        }, 0);
        console.log(summaryWithTotalPri[0].product_name);
        console.log(summaryWithTotalPri);
        console.log(total_amount);

        const summaryTotal = document.querySelector(".total-amount");
        summaryTotal.textContent = `$ ` + total_amount.toLocaleString();
        for (let i = 0; i < summaryWithTotalPri.length; i++) {
            const tbody = document.querySelector(".t-body");

            const summaryDetail = document.createElement("tr");
            summaryDetail.classList.add("summary-detail");

            const itemCell = document.createElement("td");
            itemCell.setAttribute("scope", "row");
            itemCell.setAttribute("colspan", "2");
            itemCell.style.fontWeight = "200";
            itemCell.textContent = summaryWithTotalPri[i].product_name.replace(/_/g, " ");

            const quantityCell = document.createElement("td");
            quantityCell.classList.add("quantity", "t-detail", "body-text");
            quantityCell.textContent = summaryWithTotalPri[i].product_quantity;

            const subtotalCell = document.createElement("td");
            subtotalCell.classList.add("subtotal", "t-detail", "body-text");
            subtotalCell.textContent = `$${summaryWithTotalPri[i].product_total_price.toLocaleString()}`;

            summaryDetail.appendChild(itemCell);
            summaryDetail.appendChild(quantityCell);
            summaryDetail.appendChild(subtotalCell);

            tbody.appendChild(summaryDetail);
        }

        if (res.ok) {
            console.log(`Summary Loaded`);
        }
    } catch (err) {
        console.log(err);
    }
}

function getCheckOutInfo() {
    try {
        let checkOutInfo = {
            contact: {
                first_name: document.querySelector('#first-name').value,
                last_name: document.querySelector('#last-name').value,
                phone: document.querySelector('#phone').value.replace(/\D/g, ''),
                email: document.querySelector('#email').value,
            },
            address: {
                address1: document.querySelector('#address1').value,
                address2: document.querySelector('#address2').value,
                street: document.querySelector('#street').value,
                city: document.querySelector('#city').value,
                postal_code: document.querySelector('#postal-code').value.replace(/\D/g, ''),
                country: document.querySelector('#country').value,
            },
        };

        let success = true;
        if (
            checkOutInfo.contact.first_name == "" ||
            checkOutInfo.contact.last_name == "" ||
            checkOutInfo.contact.phone == "" ||
            checkOutInfo.contact.email == ""
        ) {
            contactAlert.style.display = 'block';
            success = false;
        }
        if (
            checkOutInfo.address.address1 == "" ||
            checkOutInfo.address.address2 == "" ||
            checkOutInfo.address.street == "" ||
            checkOutInfo.address.city == "" ||
            checkOutInfo.address.postal_code == "" ||
            checkOutInfo.address.country == ""
        ) {
            addressAlert.style.display = 'block';
            success = false;
        }
        return { checkOutInfo, success };
    } catch (err) {
        console.log(err);
        return { checkOutInfo: null, success: false };
    }
}


// const response = await fetch('/create-checkout-session', {
//     method: 'POST',
//     headers: {
//         'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({
//         cartItems: cartItems,
//         totalAmount: totalAmount,
//     }),
// });

// const data = await response.json();

// // Redirect the user to the Stripe checkout page
// stripe.redirectToCheckout({ sessionId: data.sessionId });