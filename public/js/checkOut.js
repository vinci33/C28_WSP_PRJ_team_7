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
                payment_status: "testing-processing",
                payment_method: "testing-credit card",
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
            console.log(`Unable update ${err}`);
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
                const result = await resp.json();
                if (res.ok) {
                    console.log(`Delivery info updated`);
                }
            } catch (err) {
                console.error(`Unable to submit  info`);
            }
        } else {
            console.log(err.message);
        }
    })
}

async function loadSummary() {
    try {
        let res = await fetch('/cartItemsByUserId');
        let summary = await res.json();
        if (summary.length == 0) {
            throw new Error('Unable to Load Summary')
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
        console.log(summary);
        console.log(summaryWithTotalPri);
        console.log(total_amount);


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