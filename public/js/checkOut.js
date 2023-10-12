const contactAlert = document.querySelector('.contact-alert')
const addressAlert = document.querySelector('.address-alert')

window.onload = async function () {
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
        let checkOutDetail = getCheckOutInfo();
        if (checkOutDetail.success) {
            try {
                const resp = await fetch('/checkOut', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(checkOutDetail.checkOutInfo),
                });
                const result = await resp.json();
                if (result.success) {
                    window.location.href = './product.html';
                }
            } catch (err) {
                console.error(`Unable to submit check out info: ${err}`);
            }
        }
    });
    const resp = await fetch("/shoppingCart.html/products");
    const products = await resp.json();
    const productPost = await fetch("/create-checkout-session", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(products),
    });
    const result = await productPost.json();
    if (result.success) {
        window.location.href = 'url';
    }

}

function getCheckOutInfo() {
    try {
        let checkOutInfo = {
            contact: {
                first_name: document.querySelector('#first-name').value,
                last_name: document.querySelector('#last-name').value,
                phone: document.querySelector('#phone').value,
                email: document.querySelector('#email').value,
            },
            address: {
                address1: document.querySelector('#address1').value,
                address2: document.querySelector('#address2').value,
                street: document.querySelector('#street').value,
                city: document.querySelector('#city').value,
                postal_code: document.querySelector('#postal-code').value,
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
        console.error(err);
        return { checkOutInfo: null, success: false };
    }
}