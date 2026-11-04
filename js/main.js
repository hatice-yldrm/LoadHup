const LISTING_API =
    "https://localhost:7128/api/Listings";
document.addEventListener("DOMContentLoaded", () => {

    initStickyNavbar();

    initMobileMenu();

    initSmoothScroll();

    initFAQ();

    initActiveMenu();

    initRegister();

    initLogin();

    loadListings();

    initListingDetail();

    loadLatestListings();

    initListingSearch();

});

function initStickyNavbar() {

    const header = document.querySelector(".header");

    if (!header) return;

    window.addEventListener("scroll", () => {

        if (window.scrollY > 40) {

            header.classList.add("sticky");

        } else {

            header.classList.remove("sticky");

        }

    });

}

function initMobileMenu() {

    const menuToggle = document.querySelector(".menu-toggle");
    const navMenu = document.querySelector(".nav-menu");

    if (!menuToggle || !navMenu) return;

    menuToggle.addEventListener("click", () => {

        navMenu.classList.toggle("active");

    });

}

function initSmoothScroll() {

    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {

        link.addEventListener("click", function (e) {

            const targetId = this.getAttribute("href");

            if (targetId === "#") return;

            const target = document.querySelector(targetId);

            if (!target) return;

            e.preventDefault();

            target.scrollIntoView({

                behavior: "smooth",
                block: "start"

            });

        });

    });

}

function initFAQ() {

    const faqItems = document.querySelectorAll(".faq-item");

    if (!faqItems.length) return;

    faqItems.forEach(item => {

        const question = item.querySelector(".faq-question");

        if (!question) return;

        question.addEventListener("click", () => {

            faqItems.forEach(faq => {

                if (faq !== item) {

                    faq.classList.remove("active");

                }

            });

            item.classList.toggle("active");

        });

    });

}

function initActiveMenu() {

    const currentPage = window.location.pathname.split("/").pop() || "index.html";

    const menuLinks = document.querySelectorAll(".nav-menu a");

    menuLinks.forEach(link => {

        const href = link.getAttribute("href");

        if (href === currentPage) {

            link.classList.add("active");

        }

    });

} function initRegister() {

    const registerForm = document.querySelector("#registerForm");

    if (!registerForm) return;

    registerForm.addEventListener("submit", async function (e) {

        e.preventDefault();

        const firstName = document.querySelector("#firstName").value.trim();
        const lastName = document.querySelector("#lastName").value.trim();
        const email = document.querySelector("#email").value.trim();
        const phone = document.querySelector("#phone").value.trim();
        const company = document.querySelector("#company").value.trim();
        const accountType = document.querySelector("#accountType").value;
        const password = document.querySelector("#password").value;
        const confirmPassword = document.querySelector("#confirmPassword").value;

        if (
            firstName === "" ||
            lastName === "" ||
            email === "" ||
            phone === "" ||
            company === "" ||
            password === ""
        ) {
            alert("Lütfen tüm alanları doldurunuz.");
            return;
        }

        if (password !== confirmPassword) {
            alert("Şifreler eşleşmiyor.");
            return;
        }

        const user = {

            fullName: firstName + " " + lastName,
            email: email,
            phone: phone,
            password: password,
            role: accountType,
            companyName: company

        };

        try {

            const response = await fetch("https://localhost:7128/api/Users", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(user)

            });

            if (response.ok) {

                alert("Kayıt başarıyla oluşturuldu.");

                registerForm.reset();

                window.location.href = "login.html";

            }
            else {

                const error = await response.text();

                alert("Kayıt başarısız.\n\n" + error);

            }

        }
        catch (error) {

            console.error(error);

            alert("API bağlantısı kurulamadı.");

        }

    });

}

function initLogin() {

    const loginForm = document.querySelector("#loginForm");

    if (!loginForm) return;

    loginForm.addEventListener("submit", async function (e) {

        e.preventDefault();

        const email =
            document.querySelector("#email").value.trim();

        const password =
            document.querySelector("#password").value;

        try {

            const adminResponse =
                await fetch(
                    "https://localhost:7128/api/Admin/login",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify({
                            email: email,
                            password: password
                        })
                    }
                );


            if (adminResponse.ok) {

                const admin =
                    await adminResponse.json();



                localStorage.removeItem("userID");
                localStorage.removeItem("companyID");
                localStorage.removeItem("carrierID");


                localStorage.setItem(
                    "loadhubLoggedIn",
                    "true"
                );

                localStorage.setItem(
                    "loadhubRole",
                    "admin"
                );

                localStorage.setItem(
                    "loadhubCurrentUser",
                    JSON.stringify(admin)
                );


                window.location.href =
                    "admin/dashboard.html";


                return;

            }

        }
        catch (err) {

            console.log(
                "Admin girişi başarısız, normal kullanıcı girişi deneniyor."
            );

        }

        try {

            const response =
                await fetch(
                    "https://localhost:7128/api/Users/login",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify({
                            email: email,
                            password: password
                        })
                    }
                );


            // Giriş başarısızsa
            if (!response.ok) {

                alert(
                    "E-posta veya şifre hatalı."
                );

                return;

            }


            const user =
                await response.json();


            console.log(
                "Giriş yapan kullanıcı:",
                user
            );



            localStorage.removeItem(
                "companyID"
            );

            localStorage.removeItem(
                "carrierID"
            );



            localStorage.setItem(
                "userID",
                user.userID
            );

            localStorage.setItem(
                "loadhubLoggedIn",
                "true"
            );

            localStorage.setItem(
                "loadhubCurrentUser",
                JSON.stringify(user)
            );

            localStorage.setItem(
                "loadhubRole",
                user.role
            );


            if (
                user.role === "Company" &&
                user.companyID != null
            ) {

                localStorage.setItem(
                    "companyID",
                    user.companyID
                );

                console.log(
                    "Company ID:",
                    user.companyID
                );

            }


            if (
                user.role === "Carrier" &&
                user.carrierID != null
            ) {

                localStorage.setItem(
                    "carrierID",
                    user.carrierID
                );

                console.log(
                    "Carrier ID:",
                    user.carrierID
                );

            }



            if (
                user.role === "Company"
            ) {

                window.location.href =
                    "company/dashboard.html";

            }



            else if (
                user.role === "Carrier"
            ) {

                window.location.href =
                    "carrier/dashboard.html";

            }


            else {

                alert(
                    "Geçersiz kullanıcı rolü."
                );

            }

        }
        catch (err) {

            console.error(
                "Login hatası:",
                err
            );

            alert(
                "API bağlantısı kurulamadı."
            );

        }

    });

}


document.addEventListener(
    "DOMContentLoaded",
    initLogin
);
function initFAQ() {

    const items = document.querySelectorAll(".faq-item");

    items.forEach(item => {

        const question = item.querySelector(".faq-question");

        question.addEventListener("click", () => {

            item.classList.toggle("active");

        });

    });

}
async function loadListings(
    url = "https://localhost:7128/api/Listings"
) {

    const listingGrid =
        document.querySelector("#listingGrid");

    if (!listingGrid)
        return;

    try {

        const separator =
            url.includes("?")
                ? "&"
                : "?";

        const response =
            await fetch(
                `${url}${separator}page=${currentPage}&pageSize=${pageSize}`
            );

        if (!response.ok) {

            throw new Error(
                "İlanlar alınamadı."
            );

        }

        const data =
            await response.json();

        const listings =
            data.listings;

        listingGrid.innerHTML = "";

        if (!listings || listings.length === 0) {

            listingGrid.innerHTML = `
                <p>
                    Aradığınız kriterlere uygun ilan bulunamadı.
                </p>
            `;

            createPagination(0);

            return;

        }

        listings.forEach(listing => {

            const card =
                document.createElement("div");

            card.className =
                "listing-card reveal active";

            card.innerHTML = `

                <div class="listing-top">

                    <span class="listing-status">

                        ${listing.status || "Aktif"}

                    </span>

                    <span class="listing-date">

                        ${formatDate(listing.loadingDate)}

                    </span>

                </div>

                <h3>

                    ${listing.fromCity}
                    →
                    ${listing.toCity}

                </h3>

                <ul class="listing-info">

                    <li>

                        <i class="fa-solid fa-weight-hanging"></i>

                        ${listing.weight} Ton

                    </li>

                    <li>

                        <i class="fa-solid fa-box"></i>

                        ${listing.cargoName}

                    </li>

                    <li>

                        <i class="fa-solid fa-calendar"></i>

                        ${formatDate(listing.loadingDate)}

                    </li>

                </ul>

                <a
                    href="listing-detail.html?id=${listing.listingID}"
                    class="btn btn-outline">

                    Detay Gör

                </a>

            `;

            listingGrid.appendChild(card);

        });

        createPagination(data.totalCount);

    }
    catch (error) {

        console.error(error);

        listingGrid.innerHTML = `
            <p>
                İlanlar yüklenirken bir hata oluştu.
            </p>
        `;

    }

}
let currentPage = 1;
const pageSize = 6;

function createPagination(totalCount) {

    const pagination =
        document.querySelector("#pagination");

    if (!pagination)
        return;

    pagination.innerHTML = "";

    const totalPages =
        Math.ceil(totalCount / pageSize);

    if (totalPages <= 1)
        return;

    const prev =
        document.createElement("button");

    prev.innerHTML =
        '<i class="fa-solid fa-angle-left"></i>';

    prev.disabled =
        currentPage === 1;

    prev.onclick = () => {

        currentPage--;

        loadListings();

    };

    pagination.appendChild(prev);


    for (let i = 1; i <= totalPages; i++) {

        const button =
            document.createElement("button");

        button.textContent = i;

        if (i === currentPage) {

            button.classList.add("active");

        }

        button.onclick = () => {

            currentPage = i;

            loadListings();

        };

        pagination.appendChild(button);

    }

    const next =
        document.createElement("button");

    next.innerHTML =
        '<i class="fa-solid fa-angle-right"></i>';

    next.disabled =
        currentPage === totalPages;

    next.onclick = () => {

        currentPage++;

        loadListings();

    };

    pagination.appendChild(next);

}


function formatDate(dateString) {

    if (!dateString) return "-";

    const date = new Date(dateString);

    return date.toLocaleDateString(
        "tr-TR"
    );


}

async function initListingDetail() {

    const offerButton = document.querySelector("#offerButton");
    const offerFormContainer = document.querySelector("#offerFormContainer");
    const offerForm = document.querySelector("#offerForm");

    if (!offerButton || !offerForm || !offerFormContainer) {
        return;
    }


    const params = new URLSearchParams(window.location.search);

    const listingId = params.get("id");


    if (!listingId) {

        alert("İlan bilgisi bulunamadı.");

        return;

    }


    await loadListingDetail(listingId);


    offerButton.addEventListener("click", () => {

        if (offerFormContainer.style.display === "none") {

            offerFormContainer.style.display = "block";

            offerButton.textContent = "Teklif Formunu Kapat";

        } else {

            offerFormContainer.style.display = "none";

            offerButton.textContent = "Teklif Ver";

        }

    });

    offerForm.addEventListener("submit", async (event) => {

        event.preventDefault();


        const currentUser =
            JSON.parse(
                localStorage.getItem("loadhubCurrentUser")
            );


        if (!currentUser) {

            alert("Teklif verebilmek için giriş yapmalısınız.");

            window.location.href = "login.html";

            return;

        }

        if (!currentUser.carrierID && !currentUser.CarrierID) {

            alert("Nakliye firması bilgileriniz bulunamadı.");

            return;

        }


        const carrierId =
            currentUser.carrierID ||
            currentUser.CarrierID;


        const price =
            Number(
                document.querySelector("#offerPrice").value
            );


        const vehicleCount =
            Number(
                document.querySelector("#vehicleCount").value
            );


        const deliveryTime =
            document.querySelector("#deliveryTime").value.trim();


        if (!price || price <= 0) {

            alert("Lütfen geçerli bir teklif fiyatı girin.");

            return;

        }


        if (!vehicleCount || vehicleCount <= 0) {

            alert("Lütfen geçerli bir araç sayısı girin.");

            return;

        }


        if (!deliveryTime) {

            alert("Lütfen teslimat süresini girin.");

            return;

        }


        const offerData = {

            listingID: Number(listingId),

            carrierID: Number(carrierId),

            price: price,

            vehicleCount: vehicleCount,

            deliveryTime: deliveryTime

        };


        try {

            const response =
                await fetch(
                    "https://localhost:7128/api/Offers",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify(offerData)

                    }
                );


            if (!response.ok) {

                throw new Error(
                    "Teklif gönderilemedi."
                );

            }


            const result =
                await response.json();


            alert(
                result.message ||
                "Teklif başarıyla gönderildi."
            );


            offerForm.reset();

            offerFormContainer.style.display =
                "none";

            offerButton.textContent =
                "Teklif Ver";


        } catch (error) {

            console.error(
                "Teklif gönderme hatası:",
                error
            );


            alert(
                "Teklif gönderilirken bir hata oluştu."
            );

        }

    });

}


async function loadListingDetail(listingId) {

    try {

        const response =
            await fetch(
                `https://localhost:7128/api/Listings/${listingId}`
            );


        if (!response.ok) {

            throw new Error(
                "İlan bulunamadı."
            );

        }


        const listing =
            await response.json();

        const listingRoute =
            document.querySelector("#listingRoute");


        if (listingRoute) {

            listingRoute.textContent =
                `${listing.fromCity} → ${listing.toCity}`;

        }

        const cargoName =
            document.querySelector("#listingCargoName");


        if (cargoName) {

            cargoName.textContent =
                listing.cargoName;

        }


        const weight =
            document.querySelector("#listingWeight");


        if (weight) {

            weight.textContent =
                `${listing.weight} Ton`;

        }

        const loadingDate =
            document.querySelector("#listingLoadingDate");


        if (loadingDate) {

            loadingDate.textContent =
                formatDate(listing.loadingDate);

        }

        const fromCity =
            document.querySelector("#listingFromCity");


        if (fromCity) {

            fromCity.textContent =
                listing.fromCity;

        }
        const toCity =
            document.querySelector("#listingToCity");


        if (toCity) {

            toCity.textContent =
                listing.toCity;

        }


    } catch (error) {

        console.error(
            "İlan yükleme hatası:",
            error
        );


        alert(
            "İlan bilgileri alınamadı."
        );

    }

}
async function loadLatestListings() {

    const container =
        document.querySelector("#latestListings");

    if (!container)
        return;

    try {

        const response =
            await fetch(`${LISTING_API}/latest`);

        const listings =
            await response.json();

        container.innerHTML = "";

        listings.forEach(listing => {

            container.innerHTML += `

                <div class="listing-card">

                    <span class="listing-status new">

                        🟢 ${listing.status}

                    </span>

                    <h3>

                        ${listing.fromCity}
                        ➜
                        ${listing.toCity}

                    </h3>

                    <ul>

                        <li>

                            <i class="fa-solid fa-box"></i>

                            ${listing.cargoName}

                        </li>

                        <li>

                            <i class="fa-solid fa-weight-hanging"></i>

                            ${listing.weight} Ton

                        </li>

                        <li>

                            <i class="fa-solid fa-calendar-days"></i>

                            ${new Date(listing.loadingDate).toLocaleDateString("tr-TR")}

                        </li>

                    </ul>

                    <a
                        href="listing-detail.html?id=${listing.listingID}"
                        class="btn btn-primary">

                        Detayları Gör

                    </a>

                </div>

            `;

        });

    }
    catch (error) {

        console.error(error);

    }

}
function initListingSearch() {

    const button =
        document.querySelector("#searchListingBtn");

    if (!button)
        return;

    button.addEventListener("click", () => {

        const fromCity =
            document.querySelector("#fromCityFilter").value;

        const toCity =
            document.querySelector("#toCityFilter").value;

        const cargo =
            document.querySelector("#cargoFilter").value;

        let url =
            "https://localhost:7128/api/Listings";

        const params =
            new URLSearchParams();

        if (fromCity)
            params.append("fromCity", fromCity);

        if (toCity)
            params.append("toCity", toCity);

        if (cargo)
            params.append("cargoName", cargo);

        if (params.toString() !== "") {

            url +=
                "?" + params.toString();

        }

        loadListings(url);

    });

}


