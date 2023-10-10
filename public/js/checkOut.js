const contactAlert = document.querySelector('.contact-alert')
const addressAlert = document.querySelector('.address-alert')

window.onload = function () {
    checkOut();

    document.querySelectorAll('.check-out-form input').forEach(function (e) {
        e.addEventListener('click', function () {
            contactAlert.style.display = "none";
            addressAlert.style.display = "none";
        });
    });
}

function checkOut() {
    const checkOutBtn = document.querySelector('.checkout-login-btn');
    checkOutBtn.addEventListener('click', function (e) {
        let checkOutInfo = getCheckOutInfo();
    })
}

function getCheckOutInfo() {
    let checkOutInfo = {
        contact: {
            first_name: document.querySelector('#first-name').value,
            last_name: document.querySelector('#last-name').value,
            phone: document.querySelector('#phone').value,
            email: document.querySelector('#email').value,
        }
        , address: {
            address1: document.querySelector('#address1').value,
            address2: document.querySelector('#address2').value,
            street: document.querySelector('#street').value,
            city: document.querySelector('#city').value,
            postal_code: document.querySelector('#postal-code').value,
            country: document.querySelector('#country').value,
        }

    }
    if (checkOutInfo.contact.first_name == "" || checkOutInfo.contact.last_name == "" ||
        checkOutInfo.contact.phone == "" || checkOutInfo.contact.email == "") {
        contactAlert.style.display = "block";
    }
    if (checkOutInfo.address.address1 == "" || checkOutInfo.address.address2 == "" ||
        checkOutInfo.address.street == "" || checkOutInfo.address.city == "" ||
        checkOutInfo.address.postal_code == "" || checkOutInfo.address.country == "") {
        addressAlert.style.display = "block";
    }
    console.log(checkOutInfo);
    return checkOutInfo;
}