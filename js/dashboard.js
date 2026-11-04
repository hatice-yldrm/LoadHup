let selectedUserId = 0;
let selectedCarrierUserId = 0;


const itemsPerPage = 6;

let allListings = [];
let companyOffersCurrentPage = 1;
const companyOffersItemsPerPage = 6;

let allCompanyOffers = [];

document.addEventListener("DOMContentLoaded", () => {

    initDashboardCounter();

    initCreateListingAPI();

    initMyListings();

    initOfferSearch();

    initOfferFilter();

    initOfferSort();

    initAcceptOffer();

    initDeleteListing();

    initMessages();

    initCarrierMessageSend();

    initProfile();

    initCarrierDashboard();

    initJobSearch();

    initJobStatusFilter();

    initJobSort();

    initConversationSearch();

    initConversationSelect();

    initMessageSend();

    initCarrierProfile();

    loadCompanyProfile();

    initAdminMenu();

    initAdminListingSearch();

    initAdminListingStatus();

    initAdminDeleteListing();

    initCompanySearch();

    initCarrierSearch();

    initReportCards();

    initMyOffers();

    initCompanyOffers();

    initNotifications();

    initCarrierOfferSearch();

    initCarrierOfferFilter();

    initCarrierOfferSort();

    initChangePassword();

    loadUserProfile();



    if (document.querySelector("#carrierJobsList")) {

        loadCarrierJobs();

    }

    if (document.querySelector("#offerCount")) {

        loadCarrierDashboardStats();

    }

    if (document.querySelector("#listingCount")) {

        loadCompanyDashboardStats();

    }
    if (document.querySelector("#recentListings")) {

        loadRecentListings();

    }
    if (document.querySelector("#recentOffers")) {

        loadRecentOffers();

    }

    if (document.querySelector("#companyOffersList")) {

        loadCompanyOffers();

    }



    if (document.querySelector("#carrierProfile")) {

        loadCarrierProfile();

    }
    const companyForm =
        document.querySelector("#companyProfileForm");

    if (companyForm) {

        loadCompanyProfile();

        companyForm.addEventListener(

            "submit",

            updateCompanyProfile

        );


    }
    const carrierForm =
        document.querySelector("#carrierProfileForm");

    if (carrierForm) {

        carrierForm.addEventListener(
            "submit",
            updateCarrierProfile
        );

    }
    if (document.querySelector("#conversationList")) {
        loadConversations();
    }

    if (document.querySelector("#carrierConversationList")) {
        loadCarrierConversations();
    }

});
function initDashboardCounter() {

    const counters = document.querySelectorAll(".dashboard-counter");

    if (!counters.length) return;

    counters.forEach(counter => {

        const target = Number(counter.dataset.target);

        if (isNaN(target)) return;

        let current = 0;

        const duration = 1200;

        const startTime = performance.now();


        function updateCounter(currentTime) {

            const elapsed = currentTime - startTime;

            const progress = Math.min(elapsed / duration, 1);

            current = Math.floor(progress * target);

            counter.textContent = current.toLocaleString("tr-TR");


            if (progress < 1) {

                requestAnimationFrame(updateCounter);

            } else {

                counter.textContent = target.toLocaleString("tr-TR");

            }

        }


        requestAnimationFrame(updateCounter);

    });

} function initMyListings() {

    const wrapper =
        document.querySelector("#listingsContainer");

    if (!wrapper) return;

    const searchInput =
        document.querySelector(
            ".company-listings-filter input"
        );

    const statusSelect =
        document.querySelector(
            ".company-listings-filter select:nth-of-type(1)"
        );

    const sortSelect =
        document.querySelector(
            ".company-listings-filter select:nth-of-type(2)"
        );



    async function loadMyListings() {

        const userJson =
            localStorage.getItem(
                "loadhubCurrentUser"
            );

        if (!userJson) {

            console.error(
                "Giriş yapan kullanıcı bulunamadı."
            );

            return;

        }


        const user =
            JSON.parse(userJson);


        console.log(
            "Giriş yapan kullanıcı:",
            user
        );


        const companyID =
            user.companyID;


        if (!companyID) {

            console.error(
                "CompanyID bulunamadı.",
                user
            );

            wrapper.innerHTML = `

                <div class="company-listings-empty">

                    <i class="fa-solid fa-triangle-exclamation"></i>

                    <h3>
                        Şirket bilgisi bulunamadı
                    </h3>

                    <p>
                        Giriş yapan kullanıcıya ait CompanyID bulunamadı.
                    </p>

                </div>

            `;

            return;

        }


        try {

            const response =
                await fetch(
                    "https://localhost:7128/api/Listings"
                );


            if (!response.ok) {

                throw new Error(
                    "İlanlar alınamadı."
                );

            }


            const data =
                await response.json();


            console.log(
                "API'den gelen ilanlar:",
                data
            );



            const listings =
                data.listings || [];



            allListings =
                listings.filter(
                    listing =>
                        Number(listing.companyID) ===
                        Number(companyID)
                );


            console.log(
                "Şirketime ait ilanlar:",
                allListings
            );



            currentPage = 1;

            renderListings();

            renderPagination();




        }
        catch (error) {

            console.error(
                "İlanlar yüklenirken hata:",
                error
            );


            wrapper.innerHTML = `

                <div class="company-listings-empty">

                    <i class="fa-solid fa-triangle-exclamation"></i>

                    <h3>
                        İlanlar yüklenemedi
                    </h3>

                    <p>
                        API bağlantısı sırasında bir hata oluştu.
                    </p>

                </div>

            `;

        }

    }


    if (searchInput) {

        searchInput.addEventListener(
            "input",
            function () {

                renderListings();

            }
        );

    }



    if (statusSelect) {

        statusSelect.addEventListener(
            "change",
            function () {

                currentPage = 1;

                renderListings();

                renderPagination();

            }
        );

    }


    if (sortSelect) {

        sortSelect.addEventListener(
            "change",
            function () {

                currentPage = 1;

                renderListings();

                renderPagination();

            }
        );

    }


    loadMyListings();

}
function initDeleteListing() {

    const deleteButtons = document.querySelectorAll(
        ".company-listing-actions .btn-danger"
    );


    if (!deleteButtons.length) return;


    deleteButtons.forEach(button => {

        button.addEventListener("click", () => {

            const card = button.closest(
                ".company-listing-card"
            );


            if (!card) return;


            const confirmed = confirm(
                "Bu ilanı silmek istediğinizden emin misiniz?"
            );


            if (confirmed) {

                card.remove();

            }

        });

    });

}

function initOfferSearch() {

    const searchInput = document.querySelector(
        ".company-offers-filter input"
    );

    const offerCards = document.querySelectorAll(
        ".company-offer-card"
    );


    if (!searchInput || !offerCards.length) return;


    searchInput.addEventListener("input", () => {

        const value = searchInput.value
            .toLowerCase()
            .trim();


        offerCards.forEach(card => {

            const text = card.textContent.toLowerCase();


            if (text.includes(value)) {

                card.style.display = "";

            } else {

                card.style.display = "none";

            }

        });

    });

}

function initOfferFilter() {

    const statusSelect = document.querySelector(
        ".company-offers-filter select:nth-of-type(1)"
    );

    const offerCards = document.querySelectorAll(
        ".company-offer-card"
    );


    if (!statusSelect || !offerCards.length) return;


    statusSelect.addEventListener("change", () => {

        const selectedStatus =
            statusSelect.value;


        offerCards.forEach(card => {

            const badge = card.querySelector(
                ".badge"
            );


            if (!badge) return;


            const cardStatus =
                badge.textContent.trim();


            if (
                selectedStatus === "Tüm Durumlar" ||
                cardStatus === selectedStatus
            ) {

                card.style.display = "";

            } else {

                card.style.display = "none";

            }

        });

    });

}

function initOfferSort() {

    const sortSelect = document.querySelector(
        ".company-offers-filter select:nth-of-type(2)"
    );

    const wrapper = document.querySelector(
        ".company-offers-wrapper"
    );


    if (!sortSelect || !wrapper) return;


    sortSelect.addEventListener("change", () => {

        const cards = [
            ...wrapper.querySelectorAll(
                ".company-offer-card"
            )
        ];


        if (sortSelect.value === "En Eski") {

            cards.reverse();

        }


        cards.forEach(card => {

            wrapper.appendChild(card);

        });

    });

}

function initAcceptOffer() {

    const acceptButtons = document.querySelectorAll(
        ".company-offer-actions .btn-primary"
    );


    if (!acceptButtons.length) return;


    acceptButtons.forEach(button => {

        button.addEventListener("click", () => {

            const card = button.closest(
                ".company-offer-card"
            );


            if (!card) return;


            const badge = card.querySelector(
                ".badge"
            );


            if (!badge) return;


            const confirmed = confirm(
                "Bu teklifi kabul etmek istediğinizden emin misiniz?"
            );


            if (!confirmed) return;


            badge.textContent =
                "Kabul Edildi";


            badge.classList.remove(
                "waiting",
                "completed"
            );


            badge.classList.add(
                "active"
            );


            button.remove();


            alert(
                "Teklif başarıyla kabul edildi."
            );

        });

    });

}
function initMessages() {

    const searchInput =
        document.querySelector(".company-chat-search input");

    if (searchInput) {

        searchInput.addEventListener("input", () => {

            const value =
                searchInput.value.toLowerCase();

            document.querySelectorAll(".company-chat-item")
                .forEach(item => {

                    item.style.display =
                        item.innerText.toLowerCase().includes(value)
                            ? "flex"
                            : "none";

                });

        });

    }

    const attachmentButton =
        document.querySelector(".company-chat-attachment");

    if (attachmentButton) {

        attachmentButton.addEventListener("click", () => {

            alert("Dosya gönderme özelliği yakında aktif olacaktır.");

        });

    }

}
function initProfile() {

    const profileForms =
        document.querySelectorAll(
            ".company-profile-form"
        );


    if (!profileForms.length) return;


    profileForms.forEach(form => {

        form.addEventListener(
            "submit",
            (event) => {

                event.preventDefault();


                const submitButton =
                    form.querySelector(
                        "button[type='submit']"
                    );


                if (!submitButton) return;


                const originalText =
                    submitButton.innerHTML;

                submitButton.innerHTML = `

                    <i class="fa-solid fa-spinner fa-spin"></i>

                    Güncelleniyor...

                `;


                submitButton.disabled = true;
                setTimeout(() => {

                    submitButton.innerHTML = `

                        <i class="fa-solid fa-circle-check"></i>

                        Güncellendi

                    `;
                    setTimeout(() => {

                        submitButton.innerHTML =
                            originalText;


                        submitButton.disabled =
                            false;

                    }, 2000);


                }, 800);

            }
        );

    });

}
function initCarrierDashboard() {

    initDashboardButtons();

    initDashboardAnimations();

}



function initDashboardButtons() {

    const actionCards = document.querySelectorAll(".carrier-action-card");

    if (!actionCards.length) return;

    actionCards.forEach(card => {

        card.addEventListener("click", () => {

            card.classList.add("clicked");

        });

    });

}

function initDashboardAnimations() {

    const cards = document.querySelectorAll(
        ".carrier-stat-card, .carrier-dashboard-card, .carrier-action-card"
    );

    if (!cards.length) return;

    cards.forEach((card, index) => {

        card.style.opacity = "0";

        card.style.transform = "translateY(20px)";

        setTimeout(() => {

            card.style.transition = "opacity .5s ease, transform .5s ease";

            card.style.opacity = "1";

            card.style.transform = "translateY(0)";

        }, index * 100);

    });

}
function initJobSearch() {

    const searchInput = document.querySelector("#jobSearch");

    if (!searchInput) return;

    searchInput.addEventListener("input", () => {

        filterJobs();

    });

}
function initJobStatusFilter() {

    const statusFilter = document.querySelector("#jobStatusFilter");

    if (!statusFilter) return;

    statusFilter.addEventListener("change", () => {

        filterJobs();

    });

}
function initJobSort() {

    const sortFilter = document.querySelector("#jobSortFilter");

    if (!sortFilter) return;

    sortFilter.addEventListener("change", () => {

        sortJobs();

    });

}

function filterJobs() {

    const searchInput = document.querySelector("#jobSearch");

    const statusFilter = document.querySelector("#jobStatusFilter");

    const jobCards = document.querySelectorAll(".carrier-job-card");

    if (!searchInput || !statusFilter || !jobCards.length) return;


    const searchValue = searchInput.value
        .toLowerCase()
        .trim();

    const selectedStatus = statusFilter.value;


    jobCards.forEach(card => {

        const cardText = card.textContent
            .toLowerCase();

        const cardStatus = card.dataset.status;


        const matchesSearch =
            cardText.includes(searchValue);


        const matchesStatus =
            selectedStatus === "all" ||
            cardStatus === selectedStatus;


        if (matchesSearch && matchesStatus) {

            card.classList.remove("hidden");

        } else {

            card.classList.add("hidden");

        }

    });

}

function sortJobs() {

    const sortFilter = document.querySelector("#jobSortFilter");

    const jobsList = document.querySelector(".carrier-jobs-list");

    const jobCards = Array.from(
        document.querySelectorAll(".carrier-job-card")
    );

    if (!sortFilter || !jobsList || !jobCards.length) return;


    const sortValue = sortFilter.value;


    jobCards.sort((a, b) => {

        const dateA = new Date(
            a.dataset.date
        );

        const dateB = new Date(
            b.dataset.date
        );


        if (sortValue === "newest") {

            return dateB - dateA;

        }

        if (sortValue === "oldest") {

            return dateA - dateB;

        }

    });


    jobCards.forEach(card => {

        jobsList.appendChild(card);

    });

}

function initConversationSearch() {

    const searchInput = document.querySelector("#conversationSearch");

    const conversations = document.querySelectorAll(".carrier-conversation");

    if (!searchInput || !conversations.length) return;


    searchInput.addEventListener("input", () => {

        const searchText = searchInput.value
            .toLowerCase()
            .trim();


        conversations.forEach(conversation => {

            const conversationText = conversation.textContent
                .toLowerCase();


            if (conversationText.includes(searchText)) {

                conversation.style.display = "flex";

            } else {

                conversation.style.display = "none";

            }

        });

    });

}

function initConversationSelect() {

    const conversations = document.querySelectorAll(".carrier-conversation");

    if (!conversations.length) return;


    conversations.forEach(conversation => {

        conversation.addEventListener("click", () => {

            conversations.forEach(item => {

                item.classList.remove("active");

            });


            conversation.classList.add("active");


            const messageCount = conversation.querySelector(
                ".carrier-message-count"
            );


            if (messageCount) {

                messageCount.remove();

            }

        });

    });

}

function initMessageSend() {

    const form = document.querySelector("#messageForm");

    if (!form) return;

    console.log("initMessageSend çalıştı");

    form.addEventListener("submit", async function (e) {

        e.preventDefault();

        console.log("SUBMIT ÇALIŞTI");

        if (selectedUserId == 0) {
            alert("Önce bir sohbet seçiniz.");
            return;
        }

        const currentUser =
            JSON.parse(localStorage.getItem("loadhubCurrentUser"));

        const input =
            document.querySelector("#messageInput");

        const text =
            input.value.trim();

        if (text == "")
            return;

        await fetch("https://localhost:7128/api/Messages", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                senderID: currentUser.userID,

                receiverID: selectedUserId,

                content: text

            })

        });

        input.value = "";

        await loadMessages(
            selectedUserId,
            document.querySelector(".company-chat-user h3").textContent
        );

        await loadConversations();

    });

}

function escapeMessage(message) {

    const div = document.createElement("div");

    div.textContent = message;

    return div.innerHTML;

}
function initCarrierProfile() {

    const profileForms = document.querySelectorAll(
        ".carrier-profile-form"
    );

    if (!profileForms.length) return;


    profileForms.forEach(form => {

        form.addEventListener("submit", (e) => {

            e.preventDefault();


            const button = form.querySelector(
                ".carrier-profile-actions .btn"
            );

            if (!button) return;


            const originalText = button.innerHTML;


            button.innerHTML = `
                <i class="fa-solid fa-check"></i>
                Kaydedildi
            `;


            button.disabled = true;


            setTimeout(() => {

                button.innerHTML = originalText;

                button.disabled = false;

            }, 2000);

        });

    });

}

function initAdminMenu() {

    const menuToggle =
        document.querySelector("#adminMenuToggle");

    const navMenu =
        document.querySelector(".admin-nav-menu");


    if (!menuToggle || !navMenu) return;


    menuToggle.addEventListener("click", () => {

        navMenu.classList.toggle("active");

    });

    document.addEventListener("click", (e) => {

        if (
            !navMenu.contains(e.target) &&
            !menuToggle.contains(e.target)
        ) {

            navMenu.classList.remove("active");

        }

    });

}
function initAdminListingSearch() {

    const search = document.querySelector("#adminListingSearch");

    if (!search) return;

    search.addEventListener("keyup", function () {

        const value = this.value.toLowerCase();

        document.querySelectorAll(".admin-listing-card").forEach(card => {

            card.style.display =
                card.innerText.toLowerCase().includes(value)
                    ? "block"
                    : "none";

        });

    });

}

function initAdminListingStatus() {

    document.querySelectorAll(".listing-status-select").forEach(select => {

        select.addEventListener("change", function () {

            alert("İlan durumu güncellendi.");

        });

    });

}

function initAdminDeleteListing() {

    document.querySelectorAll(".delete-listing").forEach(btn => {

        btn.addEventListener("click", function () {

            if (confirm("Bu ilan silinsin mi?")) {

                this.closest(".admin-listing-card").remove();

            }

        });

    });

}
function initCompanySearch() {

    const search = document.querySelector("#companySearch");

    if (!search) return;

    search.addEventListener("keyup", function () {

        const value = this.value.toLowerCase();

        document.querySelectorAll(".company-card").forEach(card => {

            const company =
                card.querySelector("h3").textContent.toLowerCase();

            if (company.includes(value)) {

                card.style.display = "flex";

            } else {

                card.style.display = "none";

            }

        });

    });

}
function initCarrierSearch() {

    const search = document.querySelector("#carrierSearch");

    if (!search) return;

    search.addEventListener("keyup", function () {

        const value = this.value.toLowerCase();

        document.querySelectorAll(".company-card").forEach(card => {

            const name = card.querySelector("h3").textContent.toLowerCase();

            card.style.display = name.includes(value) ? "flex" : "none";

        });

    });

}
function initReportCards() {

    const cards = document.querySelectorAll(".report-card");

    if (!cards.length) return;

    cards.forEach(card => {

        card.addEventListener("mouseenter", () => {

            card.style.transform = "translateY(-8px)";

        });

        card.addEventListener("mouseleave", () => {

            card.style.transform = "translateY(0)";

        });

    });

}

async function loadCompanyProfile() {

    const form =
        document.querySelector("#companyProfileForm");

    if (!form)
        return;

    const currentUser =
        JSON.parse(localStorage.getItem("loadhubCurrentUser"));

    if (!currentUser)
        return;

    try {

        const response =
            await fetch(`https://localhost:7128/api/Companies/${currentUser.companyID}`);

        if (!response.ok) {

            throw new Error("Firma bulunamadı.");

        }

        const company =
            await response.json();

        document.querySelector("#companyTitle").textContent =
            company.companyName ?? "";

        document.querySelector("#companyName").value =
            company.companyName ?? "";

        document.querySelector("#companyEmail").value =
            company.email ?? "";

        document.querySelector("#companyPhone").value =
            company.phone ?? "";

    }

    catch (error) {

        console.error(error);

    }

}
async function loadCarrierProfile() {

    if (!window.location.pathname.includes("/carrier/"))
        return;

    const currentUser =
        JSON.parse(localStorage.getItem("loadhubCurrentUser"));

    if (!currentUser)
        return;

    try {

        const response =
            await fetch(`https://localhost:7128/api/Carriers/${currentUser.carrierID}`);

        if (!response.ok)
            throw new Error("Carrier bulunamadı");

        const carrier =
            await response.json();

        document.querySelector("#carrierCompanyTitle").textContent =
            carrier.companyName;

        document.querySelector("#carrierCompanyName").value =
            carrier.companyName ?? "";

        document.querySelector("#carrierEmail").value =
            carrier.email ?? "";

        document.querySelector("#carrierPhone").value =
            carrier.phone ?? "";

        document.querySelector("#carrierVehicleCount").value =
            carrier.vehicleCount ?? 0;

    }
    catch (err) {

        console.log(err);

    }

} function initCreateListingAPI() {

    const form = document.querySelector("#listingForm");

    if (!form) return;

    form.addEventListener("submit", async function (e) {

        e.preventDefault();

        // LocalStorage'dan giriş yapan kullanıcıyı al
        const user = JSON.parse(
            localStorage.getItem("loadhubCurrentUser")
        );

        if (!user) {

            alert("Lütfen önce giriş yapın.");

            return;

        }

        console.log("Giriş yapan kullanıcı:", user);

        // Kullanıcının CompanyID'sini al
        const companyID =
            user.CompanyID ||
            user.companyID;

        if (!companyID) {

            alert(
                "Şirket ID bulunamadı. Lütfen çıkış yapıp tekrar giriş yapın."
            );

            console.error(
                "Kullanıcı bilgilerinde CompanyID yok:",
                user
            );

            return;

        }

        const listing = {

            companyID: Number(companyID),

            cargoName:
                document.querySelector("#cargoName").value,

            fromCity:
                document.querySelector("#fromCity").value,

            toCity:
                document.querySelector("#toCity").value,

            weight:
                Number(
                    document.querySelector("#weight").value
                ),

            loadingDate:
                document.querySelector("#loadingDate").value,

            description:
                document.querySelector("#description").value,

            status: "Aktif"

        };


        console.log(
            "API'ye gönderilecek ilan:",
            listing
        );


        try {

            const response = await fetch(
                "https://localhost:7128/api/Listings",
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify(listing)

                }
            );


            console.log(
                "API Response Status:",
                response.status
            );


            if (response.ok) {

                alert(
                    "İlan başarıyla oluşturuldu."
                );

                form.reset();

            }
            else {

                const errorText =
                    await response.text();

                console.error(
                    "API Hatası:",
                    errorText
                );

                alert(
                    "İlan oluşturulamadı:\n" +
                    errorText
                );

            }

        }
        catch (error) {

            console.error(
                "Fetch Hatası:",
                error
            );

            alert(
                "API bağlantısı kurulamadı."
            );

        }

    });

}
async function initMyOffers() {

    const offersList =
        document.querySelector("#offersList");

    const offersEmpty =
        document.querySelector("#offersEmpty");

    if (!offersList) return;

    const userData =
        localStorage.getItem("loadhubCurrentUser");


    if (!userData) {

        alert("Tekliflerinizi görmek için giriş yapmalısınız.");

        window.location.href =
            "../login.html";

        return;

    }


    const currentUser =
        JSON.parse(userData);

    const carrierId =
        currentUser.carrierID ||
        currentUser.CarrierID;


    if (!carrierId) {

        alert(
            "Nakliye firması bilgileriniz bulunamadı."
        );

        return;

    }


    try {


        const offersResponse =
            await fetch(
                "https://localhost:7128/api/Offers"
            );


        if (!offersResponse.ok) {

            throw new Error(
                "Teklifler alınamadı."
            );

        }


        const allOffers =
            await offersResponse.json();




        const carrierOffers =
            allOffers.filter(
                offer =>
                    Number(
                        offer.carrierID ??
                        offer.CarrierID
                    ) === Number(carrierId)
            );


        offersList.innerHTML = "";


        if (!carrierOffers.length) {

            offersEmpty.style.display =
                "block";

            return;

        }


        offersEmpty.style.display =
            "none";

        for (const offer of carrierOffers) {

            const listingId =
                offer.listingID ??
                offer.ListingID;


            try {

                const listingResponse =
                    await fetch(
                        `https://localhost:7128/api/Listings/${listingId}`
                    );


                if (!listingResponse.ok) {

                    continue;

                }


                const listing =
                    await listingResponse.json();


                createOfferCard(
                    offer,
                    listing,
                    offersList
                );


            } catch (error) {

                console.error(
                    "İlan bilgisi alınamadı:",
                    error
                );

            }

        }


        initMyOffersSearch();



        initMyOffersFilter();


        initMyOffersSort();


    } catch (error) {

        console.error(
            "Teklifler yüklenirken hata:",
            error
        );

        alert(
            "Teklifler yüklenirken bir hata oluştu."
        );

    }

}



function createOfferCard(
    offer,
    listing,
    offersList
) {

    const offerId =
        offer.offerID ??
        offer.OfferID;


    const listingId =
        offer.listingID ??
        offer.ListingID;


    const price =
        offer.price ??
        offer.Price;


    const vehicleCount =
        offer.vehicleCount ??
        offer.VehicleCount;


    const deliveryTime =
        offer.deliveryTime ??
        offer.DeliveryTime;


    const offerDate =
        offer.offerDate ??
        offer.OfferDate;


    const fromCity =
        listing.fromCity ??
        listing.FromCity;


    const toCity =
        listing.toCity ??
        listing.ToCity;


    const cargoName =
        listing.cargoName ??
        listing.CargoName;


    const weight =
        listing.weight ??
        listing.Weight;


    const status =
        listing.status ??
        listing.Status ??
        "Bekliyor";


    let statusClass =
        "pending";


    if (
        status === "Kabul Edildi" ||
        status === "accepted"
    ) {

        statusClass =
            "accepted";

    }
    else if (
        status === "Reddedildi" ||
        status === "rejected"
    ) {

        statusClass =
            "rejected";

    }


    const formattedDate =
        formatOfferDate(
            offerDate
        );



    const card =
        document.createElement(
            "div"
        );


    card.className =
        "carrier-offer-card";


    card.dataset.status =
        statusClass;


    card.dataset.date =
        offerDate || "";


    card.innerHTML = `

        <div class="carrier-offer-top">

            <div>

                <h3>
                    ${fromCity} → ${toCity}
                </h3>

                <span class="carrier-offer-date">

                    ${formattedDate}
                    tarihinde teklif verildi

                </span>

            </div>


            <span class="carrier-offer-badge ${statusClass}">

                ${status}

            </span>

        </div>


        <div class="carrier-offer-info">


            <div>

                <i class="fa-solid fa-weight-hanging"></i>

                <strong>

                    ${weight} Ton

                </strong>

                <span>

                    Yük Ağırlığı

                </span>

            </div>


            <div>

                <i class="fa-solid fa-truck"></i>

                <strong>

                    ${vehicleCount} Araç

                </strong>

                <span>

                    Araç Sayısı

                </span>

            </div>


            <div>

                <i class="fa-solid fa-money-bill-wave"></i>

                <strong>

                    ${Number(price).toLocaleString("tr-TR")} ₺

                </strong>

                <span>

                    Teklif Tutarı

                </span>

            </div>


            <div>

                <i class="fa-solid fa-clock"></i>

                <strong>

                    ${deliveryTime}

                </strong>

                <span>

                    Teslimat Süresi

                </span>

            </div>


        </div>


        <div class="carrier-offer-actions">


            <a href="../listing-detail.html?id=${listingId}"
               class="btn btn-outline">

                <i class="fa-solid fa-eye"></i>

                İlanı Gör

            </a>


        </div>

    `;


    offersList.appendChild(
        card
    );

}


function initMyOffersSearch() {

    const searchInput =
        document.querySelector(
            "#offerSearch"
        );


    const offersList =
        document.querySelector(
            "#offersList"
        );


    if (
        !searchInput ||
        !offersList
    ) {

        return;

    }


    searchInput.addEventListener(
        "input",
        filterMyOffers
    );

}



function initMyOffersFilter() {

    const statusFilter =
        document.querySelector(
            "#offerStatusFilter"
        );


    if (!statusFilter) return;


    statusFilter.addEventListener(
        "change",
        filterMyOffers
    );

}


function filterMyOffers() {
    if (!document.querySelector("#myOffersWrapper")) {
        return;
    }

    const searchInput =
        document.querySelector(
            "#offerSearch"
        );


    const statusFilter =
        document.querySelector(
            "#offerStatusFilter"
        );


    const cards =
        document.querySelectorAll(
            "#offersList .carrier-offer-card"
        );


    const searchValue =
        searchInput.value
            .toLowerCase()
            .trim();


    const selectedStatus =
        statusFilter.value;


    let visibleCount =
        0;


    cards.forEach(
        card => {

            const text =
                card.textContent
                    .toLowerCase();


            const cardStatus =
                card.dataset.status;


            const matchesSearch =
                text.includes(
                    searchValue
                );


            const matchesStatus =
                selectedStatus === "all" ||
                cardStatus === selectedStatus;


            if (
                matchesSearch &&
                matchesStatus
            ) {

                card.style.display =
                    "";

                visibleCount++;

            }
            else {

                card.style.display =
                    "none";

            }

        }
    );


    const offersEmpty =
        document.querySelector(
            "#offersEmpty"
        );


    if (offersEmpty) {

        offersEmpty.style.display =
            visibleCount === 0
                ? "block"
                : "none";

    }

}

function initMyOffersSort() {

    const sortSelect =
        document.querySelector(
            "#offerSort"
        );


    const offersList =
        document.querySelector(
            "#offersList"
        );


    if (
        !sortSelect ||
        !offersList
    ) {

        return;

    }


    sortSelect.addEventListener(
        "change",
        () => {

            const cards =
                [
                    ...offersList.querySelectorAll(
                        ".carrier-offer-card"
                    )
                ];


            cards.sort(
                (
                    a,
                    b
                ) => {

                    const dateA =
                        new Date(
                            a.dataset.date
                        );


                    const dateB =
                        new Date(
                            b.dataset.date
                        );


                    if (
                        sortSelect.value ===
                        "oldest"
                    ) {

                        return dateA - dateB;

                    }


                    return dateB - dateA;

                }
            );


            cards.forEach(
                card => {

                    offersList.appendChild(
                        card
                    );

                }
            );

        }
    );

}


function formatOfferDate(
    dateString
) {

    if (!dateString) {

        return "-";

    }


    const date =
        new Date(
            dateString
        );


    return date.toLocaleDateString(
        "tr-TR",
        {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        }
    );

} async function initCompanyOffers() {

    const wrapper =
        document.querySelector(
            "#companyOffersWrapper"
        );

    const emptyMessage =
        document.querySelector(
            "#companyOffersEmpty"
        );

    const pagination =
        document.querySelector(
            "#companyOffersPagination"
        );


    if (!wrapper) return;


    const userData =
        localStorage.getItem(
            "loadhubCurrentUser"
        );


    if (!userData) {

        alert(
            "Giriş yapmalısınız."
        );

        window.location.href =
            "../login.html";

        return;

    }


    const user =
        JSON.parse(userData);


    const companyID =
        user.companyID ||
        user.CompanyID;


    if (!companyID) {

        alert(
            "Şirket bilgisi bulunamadı."
        );

        return;

    }


    try {


        const listingsResponse =
            await fetch(
                "https://localhost:7128/api/Listings?page=1&pageSize=1000"
            );


        if (!listingsResponse.ok) {

            throw new Error(
                "İlanlar alınamadı."
            );

        }


        const listingsData =
            await listingsResponse.json();



        const listings =
            Array.isArray(listingsData)
                ? listingsData
                : listingsData.listings || [];

        allListings = listings;


        const companyListings =
            listings.filter(
                x =>

                    Number(
                        x.companyID ||
                        x.CompanyID
                    )
                    ===
                    Number(companyID)

            );


        const listingIDs =
            companyListings.map(
                x =>

                    Number(
                        x.listingID ||
                        x.ListingID
                    )

            );


        const offersResponse =
            await fetch(
                "https://localhost:7128/api/Offers"
            );


        if (!offersResponse.ok) {

            throw new Error(
                "Teklifler alınamadı."
            );

        }


        const offersData =
            await offersResponse.json();


        const offers =
            Array.isArray(offersData)
                ? offersData
                : offersData.offers || [];

        allCompanyOffers =
            offers.filter(
                offer => {

                    const offerListingID =
                        Number(
                            offer.listingID ||
                            offer.ListingID
                        );


                    return listingIDs.includes(
                        offerListingID
                    );

                }
            );



        companyOffersCurrentPage = 1;



        renderCompanyOffers();


    }
    catch (error) {

        console.error(
            "Teklif yükleme hatası:",
            error
        );


        wrapper.innerHTML =
            `
            <h3>
                Teklifler yüklenemedi.
            </h3>
            `;


        if (pagination) {

            pagination.innerHTML = "";

        }

    }

}



function initOfferActions() {


    const acceptButtons =
        document.querySelectorAll(
            ".accept-offer"
        );


    const rejectButtons =
        document.querySelectorAll(
            ".reject-offer"
        );




    acceptButtons.forEach(
        button => {


            button.addEventListener(
                "click",
                async () => {


                    const id =
                        button.dataset.id;



                    await updateOfferStatus(
                        id,
                        "accept"
                    );


                });


        });




    rejectButtons.forEach(
        button => {


            button.addEventListener(
                "click",
                async () => {


                    const id =
                        button.dataset.id;



                    await updateOfferStatus(
                        id,
                        "reject"
                    );


                });


        });



}






async function updateOfferStatus(id, action) {



    try {


        const response =
            await fetch(

                `https://localhost:7128/api/Offers/${id}/${action}`,

                {

                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    }

                });



        if (!response.ok) {

            throw new Error();

        }



        const result =
            await response.json();



        alert(
            result.message
        );



        initCompanyOffers();



    }
    catch (error) {


        console.error(error);


        alert(
            "İşlem başarısız."
        );

    }



}
async function loadCarrierDashboardStats() {

    if (!document.querySelector("#offerCount")) {
        return;
    }

    const currentUser =
        JSON.parse(localStorage.getItem("loadhubCurrentUser"));

    if (!currentUser || !currentUser.carrierID) {
        return;
    }

    try {

        const response = await fetch(
            `https://localhost:7128/api/Dashboard/carrier/${currentUser.carrierID}`
        );

        if (!response.ok) {
            throw new Error("Dashboard bilgileri alınamadı.");
        }

        const data = await response.json();

        document.querySelector("#offerCount").textContent =
            data.offerCount;

        document.querySelector("#waitingOffers").textContent =
            data.waitingOffers;

        document.querySelector("#activeJobs").textContent =
            data.activeJobs;

        document.querySelector("#completedJobs").textContent =
            data.completedJobs;

    }
    catch (error) {

        console.error(error);

    }

}
async function loadCompanyOffers() {

    const wrapper =
        document.querySelector("#companyOffersWrapper");

    if (!wrapper) {
        return;
    }

    const currentUser =
        JSON.parse(localStorage.getItem("loadhubCurrentUser"));

    if (!currentUser) {
        return;
    }

    const companyId =
        currentUser.companyID || currentUser.CompanyID;

    if (!companyId) {
        return;
    }

    try {

        const response =
            await fetch(
                `https://localhost:7128/api/Companies/${companyId}/offers`
            );

        if (!response.ok) {

            throw new Error("Teklifler alınamadı.");

        }

        const offers =
            await response.json();

        const empty =
            document.querySelector("#companyOffersEmpty");

        wrapper.innerHTML = "";

        if (offers.length === 0) {

            empty.style.display = "block";
            return;

        }

        empty.style.display = "none";

        offers.forEach(offer => {

            wrapper.innerHTML += `

                <div class="company-offer-card">

                    <div class="company-offer-info">

                        <h3>

                            ${offer.carrierName}

                        </h3>

                        <p>

                            İlan No : ${offer.listingID}

                        </p>

                        <span>

                            ${offer.deliveryTime}

                        </span>

                    </div>

                    <div class="company-offer-price">

                        ${offer.price} ₺

                    </div>

                    <div class="company-offer-status">

                        ${offer.status}

                    </div>

                    <div class="company-offer-actions">

                        ${offer.status === "Kabul Edildi"
                    ? `
                                <button
                                    class="btn btn-success"
                                    disabled>

                                    ✔ Kabul Edildi

                                </button>
                              `
                    : `
                                <button
                                    class="btn btn-primary"
                                    onclick="acceptOffer(${offer.offerID})">

                                    Kabul Et

                                </button>

                                <button
                                    class="btn btn-danger"
                                    onclick="rejectOffer(${offer.offerID})">

                                    Reddet

                                </button>
                              `
                }

                    </div>

                </div>

            `;

        });

    }

    catch (error) {

        console.error(error);

    }

}
async function acceptOffer(id) {

    await fetch(
        `https://localhost:7128/api/Offers/${id}/accept`,
        {
            method: "PUT"
        }
    );

    alert("Teklif kabul edildi.");

    loadCompanyOffers();

}

async function rejectOffer(id) {

    await fetch(
        `https://localhost:7128/api/Offers/${id}/reject`,
        {
            method: "PUT"
        }
    );

    alert("Teklif reddedildi.");

    loadCompanyOffers();

}
async function loadCarrierJobs() {
    if (!document.querySelector("#carrierJobsList")) {
        return;
    }

    const currentUser =
        JSON.parse(localStorage.getItem("loadhubCurrentUser"));

    if (!currentUser) {

        window.location.href = "../login.html";
        return;

    }

    const carrierId =
        currentUser.carrierID || currentUser.CarrierID;

    if (!carrierId) {

        alert("Taşıyıcı bilgisi bulunamadı.");
        return;

    }

    try {

        const response =
            await fetch(`https://localhost:7128/api/Jobs/carrier/${carrierId}`);

        if (!response.ok) {

            throw new Error("İşler alınamadı.");

        }

        const jobs =
            await response.json();

        const list =
            document.querySelector("#carrierJobsList");

        const empty =
            document.querySelector("#jobsEmpty");

        list.innerHTML = "";

        if (jobs.length === 0) {

            empty.style.display = "block";
            return;

        }

        empty.style.display = "none";

        jobs.forEach(job => {

            let badgeClass = "active";

            if (job.status === "Tamamlandı")
                badgeClass = "completed";

            if (job.status === "Bekliyor")
                badgeClass = "waiting";

            list.innerHTML += `

            <div class="carrier-job-card">

                <div class="carrier-job-card-top">

                    <div>

                        <span class="carrier-job-label">
                            Taşıma İşi
                        </span>

                        <h3>
                            ${job.fromCity} → ${job.toCity}
                        </h3>

                    </div>

                    <span class="carrier-badge ${badgeClass}">
                        ${job.status}
                    </span>

                </div>

                <div class="carrier-job-info">

                    <div>

                        <i class="fa-solid fa-box"></i>

                        <div>

                            <strong>${job.cargoName}</strong>

                            <span>Yük Türü</span>

                        </div>

                    </div>

                    <div>

                        <i class="fa-solid fa-turkish-lira-sign"></i>

                        <div>

                            <strong>${job.price} ₺</strong>

                            <span>Anlaşılan Ücret</span>

                        </div>

                    </div>

                    <div>

                        <i class="fa-solid fa-calendar"></i>

                        <div>

                            <strong>${formatDate(job.startDate)}</strong>

                            <span>Başlangıç Tarihi</span>

                        </div>

                    </div>

                </div>

                <div class="carrier-job-card-bottom">

                    <button
                        class="btn btn-primary complete-job"
                        data-id="${job.jobID}"
                        ${job.status === "Tamamlandı" ? "disabled" : ""}>

                        ${job.status === "Tamamlandı"
                    ? "✔ Tamamlandı"
                    : "İşi Tamamla"}

                    </button>

                </div>

            </div>

            `;

        });

        initCompleteButtons();

    }

    catch (error) {

        console.error(error);

        alert("İşler yüklenemedi.");

    }

}
function initCompleteButtons() {

    const buttons =
        document.querySelectorAll(".complete-job");

    buttons.forEach(button => {

        button.addEventListener("click", async () => {

            const jobId =
                button.dataset.id;

            const result =
                confirm("Bu işi tamamlamak istediğinize emin misiniz?");

            if (!result)
                return;

            try {

                const response =
                    await fetch(`https://localhost:7128/api/Jobs/${jobId}/complete`, {

                        method: "PUT"

                    });

                if (!response.ok) {

                    throw new Error();

                }

                alert("İş başarıyla tamamlandı.");

                loadCarrierJobs();

                if (typeof loadCarrierDashboardStats === "function") {

                    loadCarrierDashboardStats();

                }

            }

            catch {

                alert("İş tamamlanamadı.");

            }

        });

    });

}
async function loadCompanyDashboardStats() {
    if (!document.querySelector("#listingCount")) {
        return;
    }

    if (!document.querySelector("#listingCount")) {
        return;
    }

    const currentUser =
        JSON.parse(localStorage.getItem("loadhubCurrentUser"));

    if (!currentUser || !currentUser.companyID) {
        return;
    }

    try {

        const response = await fetch(
            `https://localhost:7128/api/Dashboard/company/${currentUser.companyID}`
        );

        if (!response.ok) {
            throw new Error("Dashboard bilgileri alınamadı.");
        }

        const data = await response.json();

        document.querySelector("#listingCount").textContent =
            data.listingCount;

        document.querySelector("#activeListingCount").textContent =
            data.activeListingCount;

        document.querySelector("#offerCount").textContent =
            data.offerCount;

        document.querySelector("#completedJobCount").textContent =
            data.completedJobCount;

    }
    catch (error) {

        console.error(error);

    }

}
async function updateCompanyProfile(event) {

    event.preventDefault();

    const currentUser =
        JSON.parse(localStorage.getItem("loadhubCurrentUser"));

    if (!currentUser)
        return;

    const company = {

        companyID: currentUser.companyID,

        userID: currentUser.userID,

        companyName:
            document.querySelector("#companyName").value,

        taxNumber:
            document.querySelector("#taxNumber").value,

        address:
            document.querySelector("#address").value,

        city: "",

        phone:
            document.querySelector("#companyPhone").value,

        email:
            document.querySelector("#companyEmail").value

    };

    console.log(company);

    try {

        const response = await fetch(
            `https://localhost:7128/api/Companies/${currentUser.companyID}`,
            {

                method: "PUT",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify(company)

            });

        console.log(await response.text());

        if (!response.ok) {

            throw new Error();

        }

        alert("Profil başarıyla güncellendi.");

        loadCompanyProfile();

    }

    catch (error) {

        console.error(error);

        alert("Profil güncellenemedi.");

    }

}
async function updateCarrierProfile(event) {

    event.preventDefault();

    const currentUser =
        JSON.parse(localStorage.getItem("loadhubCurrentUser"));

    if (!currentUser)
        return;

    const carrier = {

        companyName:
            document.querySelector("#carrierCompanyName").value,

        email:
            document.querySelector("#carrierEmail").value,

        phone:
            document.querySelector("#carrierPhone").value,

        vehicleCount:
            parseInt(document.querySelector("#carrierVehicleCount").value)

    };

    try {

        const response =
            await fetch(`https://localhost:7128/api/Carriers/${currentUser.carrierID}`, {

                method: "PUT",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify(carrier)

            });

        if (!response.ok)
            throw new Error();

        alert("Profil başarıyla güncellendi.");

        loadCarrierProfile();

    }
    catch (err) {

        console.log(err);

        alert("Profil güncellenemedi.");

    }

}
async function loadRecentListings() {

    const list =
        document.querySelector("#recentListings");

    if (!list)
        return;

    const currentUser =
        JSON.parse(localStorage.getItem("loadhubCurrentUser"));

    if (!currentUser)
        return;

    try {

        const response =
            await fetch(`https://localhost:7128/api/Dashboard/company/${currentUser.companyID}/recent-listings`);

        if (!response.ok)
            throw new Error();

        const listings =
            await response.json();

        list.innerHTML = "";

        listings.forEach(item => {

            let badgeClass = "waiting";

            if (item.status === "Aktif")
                badgeClass = "active";

            if (item.status === "Tamamlandı")
                badgeClass = "completed";

            list.innerHTML += `
                <li>
                    <span>${item.fromCity} → ${item.toCity}</span>
                    <span class="badge ${badgeClass}">
                        ${item.status}
                    </span>
                </li>
            `;

        });

    }
    catch (error) {

        console.log(error);

    }

}
async function loadRecentOffers() {

    const list =
        document.querySelector("#recentOffers");

    if (!list)
        return;

    const currentUser =
        JSON.parse(localStorage.getItem("loadhubCurrentUser"));

    if (!currentUser)
        return;

    try {

        const response =
            await fetch(`https://localhost:7128/api/Dashboard/company/${currentUser.companyID}/recent-offers`);

        if (!response.ok)
            throw new Error();

        const offers =
            await response.json();

        list.innerHTML = "";

        offers.forEach(item => {

            list.innerHTML += `
                <li>
                    <span>${item.companyName}</span>
                    <strong>${item.price.toLocaleString("tr-TR")} ₺</strong>
                </li>
            `;

        });

    }

    catch (error) {

        console.log(error);

    }

}
async function loadConversations() {

    const currentUser =
        JSON.parse(localStorage.getItem("loadhubCurrentUser"));

    if (!currentUser) return;

    const response =
        await fetch(`https://localhost:7128/api/Messages/conversations/${currentUser.userID}`);

    const data =
        await response.json();

    const list =
        document.querySelector("#conversationList");

    list.innerHTML = "";

    for (const item of data) {

        const otherId =
            item.senderID == currentUser.userID
                ? item.receiverID
                : item.senderID;

        const userResponse =
            await fetch(`https://localhost:7128/api/Users/${otherId}`);

        const user =
            await userResponse.json();

        const div =
            document.createElement("div");

        div.className = "company-chat-item";

        div.innerHTML = `

            <div class="company-chat-avatar">
                <i class="fa-solid fa-user"></i>
            </div>

            <div class="company-chat-item-info">

                <div class="company-chat-item-top">

                    <h3>${user.fullName}</h3>

                    <span>
                        ${new Date(item.messageDate).toLocaleTimeString("tr-TR", {
            hour: "2-digit",
            minute: "2-digit"
        })}
                    </span>

                </div>

               <p>${item.content}</p>

            </div>

        `;

        div.addEventListener("click", function () {

            console.log("SOHBETE TIKLANDI");

            loadMessages(otherId, user.fullName);

        });

        list.appendChild(div);

    }

}
async function loadMessages(receiverId, name) {

    console.log("loadMessages çalıştı");

    selectedUserId = receiverId;

    document.querySelector(".company-chat-user h3").textContent = name;

    const currentUser =
        JSON.parse(localStorage.getItem("loadhubCurrentUser"));

    const response =
        await fetch(`https://localhost:7128/api/Messages/${currentUser.userID}/${receiverId}`);

    const messages =
        await response.json();

    const body =
        document.querySelector("#chatBody");

    body.innerHTML = "";

    messages.forEach(x => {

        const type =
            x.senderID == currentUser.userID
                ? "sent"
                : "received";

        body.innerHTML += `

        <div class="company-chat-message ${type}">

            <p>${x.content}</p>

            <span>

                ${new Date(x.messageDate).toLocaleTimeString("tr-TR", {
            hour: "2-digit",
            minute: "2-digit"
        })}

            </span>

        </div>

        `;

    });

    body.scrollTop = body.scrollHeight;

}
async function loadCarrierConversations() {

    const currentUser =
        JSON.parse(localStorage.getItem("loadhubCurrentUser"));

    if (!currentUser)
        return;

    const response =
        await fetch(
            `https://localhost:7128/api/Messages/conversations/${currentUser.userID}`);

    const data =
        await response.json();

    const list =
        document.querySelector("#carrierConversationList");

    if (!list)
        return;

    list.innerHTML = "";

    for (const item of data) {

        const otherId =
            item.senderID == currentUser.userID
                ? item.receiverID
                : item.senderID;

        const userResponse =
            await fetch(`https://localhost:7128/api/Users/${otherId}`);

        const user =
            await userResponse.json();

        const button =
            document.createElement("button");

        button.className =
            "carrier-conversation";

        button.innerHTML = `

            <div class="carrier-conversation-avatar">

                <i class="fa-solid fa-building"></i>

            </div>

            <div class="carrier-conversation-content">

                <div class="carrier-conversation-top">

                    <strong>${user.fullName}</strong>

                    <span>

                        ${new Date(item.messageDate).toLocaleTimeString("tr-TR", {
            hour: "2-digit",
            minute: "2-digit"
        })}

                    </span>

                </div>

                <p>${item.content}</p>

            </div>

        `;

        button.onclick = () =>
            loadCarrierMessages(otherId, user.fullName);

        list.appendChild(button);

    }

}
async function loadCarrierMessages(receiverId, name) {

    selectedCarrierUserId = receiverId;

    document.querySelector("#carrierChatUser").textContent = name;

    const currentUser =
        JSON.parse(localStorage.getItem("loadhubCurrentUser"));

    const response =
        await fetch(
            `https://localhost:7128/api/Messages/${currentUser.userID}/${receiverId}`);

    const messages =
        await response.json();

    const body =
        document.querySelector("#carrierChatBody");

    body.innerHTML = "";

    messages.forEach(x => {

        const type =
            x.senderID == currentUser.userID
                ? "sent"
                : "received";

        body.innerHTML += `

            <div class="carrier-message ${type}">

                <div class="carrier-message-bubble">

                    ${x.content}

                </div>

                <span>

                    ${new Date(x.messageDate).toLocaleTimeString("tr-TR", {
            hour: "2-digit",
            minute: "2-digit"
        })}

                </span>

            </div>

        `;

    });

    body.scrollTop =
        body.scrollHeight;

} function initCarrierMessageSend() {

    console.log("initCarrierMessageSend çalıştı");

    const form = document.querySelector("#carrierMessageForm");

    console.log("Form:", form);

    if (!form) {
        console.log("carrierMessageForm bulunamadı");
        return;
    }

    form.addEventListener("submit", async function (e) {

        e.preventDefault();

        console.log("SUBMIT ÇALIŞTI");
        console.log("selectedCarrierUserId =", selectedCarrierUserId);

        if (selectedCarrierUserId == 0) {

            alert("Önce soldan bir sohbet seçiniz.");

            return;
        }

        const currentUser =
            JSON.parse(localStorage.getItem("loadhubCurrentUser"));

        console.log("Current User:", currentUser);

        const input =
            document.querySelector("#messageInput");

        const text =
            input.value.trim();

        console.log("Mesaj:", text);

        if (text == "")
            return;

        const response = await fetch(
            "https://localhost:7128/api/Messages",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    senderID: currentUser.userID,

                    receiverID: selectedCarrierUserId,

                    content: text

                })

            });

        console.log("POST STATUS =", response.status);

        const result = await response.text();

        console.log("API CEVAP =", result);

        input.value = "";

        await loadCarrierMessages(
            selectedCarrierUserId,
            document.querySelector("#carrierChatUser").textContent
        );

        await loadCarrierConversations();

    });

}

async function loadNotifications() {

    const currentUser =
        JSON.parse(localStorage.getItem("loadhubCurrentUser"));

    if (!currentUser)
        return;

    const list =
        document.querySelector("#notificationList");

    const badge =
        document.querySelector("#notificationBadge");

    if (!list || !badge)
        return;

    try {

        const response =
            await fetch(
                `https://localhost:7128/api/Notifications/${currentUser.userID}`
            );

        if (!response.ok)
            throw new Error("Bildirimler alınamadı.");

        const notifications =
            await response.json();

        list.innerHTML = "";

        if (!notifications || notifications.length === 0) {

            list.innerHTML = `
                <p class="notification-empty">
                    Bildirim bulunmuyor.
                </p>
            `;

            badge.textContent = "0";

            return;
        }



        notifications.forEach(notification => {

            const item =
                document.createElement("div");

            item.className =
                "notification-item";

            if (!notification.isRead) {

                item.classList.add(
                    "unread"
                );

            }

            item.innerHTML = `

                <div class="notification-icon">

                    <i class="fa-solid fa-bell"></i>

                </div>

                <div class="notification-content">

                    <strong>
                        ${escapeNotification(
                notification.title
            )}
                    </strong>

                    <p>
                        ${escapeNotification(
                notification.content
            )}
                    </p>

                    <span>
                        ${formatNotificationDate(
                notification.notificationDate
            )}
                    </span>

                </div>

            `;



            item.addEventListener(
                "click",
                async function () {

                    if (
                        notification.isRead
                    )
                        return;

                    await markNotificationAsRead(
                        notification.notificationID
                    );

                }
            );


            list.appendChild(item);

        });



        await loadUnreadNotificationCount();

    }
    catch (error) {

        console.error(
            "Bildirim yükleme hatası:",
            error
        );

    }

}



async function loadUnreadNotificationCount() {

    const currentUser =
        JSON.parse(localStorage.getItem("loadhubCurrentUser"));

    if (!currentUser)
        return;

    const badge =
        document.querySelector("#notificationBadge");

    if (!badge)
        return;

    try {

        const response =
            await fetch(
                `https://localhost:7128/api/Notifications/count/${currentUser.userID}`
            );

        if (!response.ok)
            throw new Error(
                "Bildirim sayısı alınamadı."
            );

        const count =
            await response.json();

        badge.textContent =
            count;

        if (count > 0) {

            badge.style.display =
                "inline-flex";

        }
        else {

            badge.style.display =
                "none";

        }

    }
    catch (error) {

        console.error(
            "Bildirim sayısı hatası:",
            error
        );

    }

}


async function markNotificationAsRead(
    notificationId
) {

    try {

        const response =
            await fetch(
                `https://localhost:7128/api/Notifications/${notificationId}`,
                {
                    method: "PUT"
                }
            );

        if (!response.ok)
            throw new Error(
                "Bildirim okunamadı."
            );

        await loadNotifications();

    }
    catch (error) {

        console.error(
            "Bildirim okundu hatası:",
            error
        );

    }

}

async function markAllNotificationsRead() {

    const currentUser =
        JSON.parse(localStorage.getItem("loadhubCurrentUser"));

    if (!currentUser)
        return;

    try {

        const response =
            await fetch(
                `https://localhost:7128/api/Notifications/read-all/${currentUser.userID}`,
                {
                    method: "PUT"
                }
            );

        if (!response.ok)
            throw new Error(
                "Bildirimler okunamadı."
            );

        await loadNotifications();

    }
    catch (error) {

        console.error(
            "Tüm bildirimleri okundu yapma hatası:",
            error
        );

    }

}

function initNotifications() {

    const button =
        document.querySelector("#notificationButton");

    const dropdown =
        document.querySelector("#notificationDropdown");

    const markAllButton =
        document.querySelector("#markAllNotificationsRead");

    if (!button || !dropdown) {
        return;
    }

    loadNotifications();


    button.addEventListener("click", function (event) {

        event.stopPropagation();

        dropdown.classList.toggle("active");

    });

    dropdown.addEventListener("click", function (event) {

        event.stopPropagation();

    });

    document.addEventListener("click", function () {

        dropdown.classList.remove("active");

    });

    if (markAllButton) {

        markAllButton.addEventListener(
            "click",
            async function (event) {

                event.preventDefault();

                event.stopPropagation();

                await markAllNotificationsRead();

            }
        );

    }

}

function formatNotificationDate(
    date
) {

    if (!date)
        return "";

    return new Date(
        date
    ).toLocaleString(
        "tr-TR",
        {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        }
    );

}


function escapeNotification(
    text
) {

    const div =
        document.createElement(
            "div"
        );

    div.textContent =
        text || "";

    return div.innerHTML;

}
function initCarrierOfferSearch() {

    const searchInput =
        document.querySelector("#offerSearch");

    const cards =
        document.querySelectorAll(".carrier-offer-card");

    if (!searchInput) return;

    searchInput.addEventListener("input", () => {

        const value =
            searchInput.value.toLowerCase().trim();

        cards.forEach(card => {

            if (card.textContent.toLowerCase().includes(value)) {

                card.style.display = "";

            }
            else {

                card.style.display = "none";

            }

        });

    });

}
function initCarrierOfferFilter() {

    const status =
        document.querySelector("#offerStatusFilter");

    const cards =
        document.querySelectorAll(".carrier-offer-card");

    if (!status) return;

    status.addEventListener("change", () => {

        cards.forEach(card => {

            const cardStatus =
                card.dataset.status;

            if (
                status.value === "all" ||
                status.value === cardStatus
            ) {

                card.style.display = "";

            }
            else {

                card.style.display = "none";

            }

        });

    });

}
function initCarrierOfferSort() {

    const sort =
        document.querySelector("#offerSort");

    const wrapper =
        document.querySelector("#offersList");

    if (!sort || !wrapper) return;

    sort.addEventListener("change", () => {

        const cards =
            [...wrapper.querySelectorAll(".carrier-offer-card")];

        cards.sort((a, b) => {

            const dateA =
                new Date(a.dataset.date);

            const dateB =
                new Date(b.dataset.date);

            if (sort.value === "newest") {

                return dateB - dateA;

            }

            return dateA - dateB;

        });

        cards.forEach(card => wrapper.appendChild(card));

    });

}
async function initChangePassword() {

    const carrierForm =
        document.querySelector("#changePasswordForm");

    const companyForm =
        document.querySelector("#companyPasswordForm");


    // Hiçbir şifre formu yoksa çık
    if (!carrierForm && !companyForm) {
        return;
    }


    const form =
        carrierForm || companyForm;


    form.addEventListener("submit", async function (e) {

        e.preventDefault();


        const userData =
            localStorage.getItem("loadhubCurrentUser");


        if (!userData) {

            alert(
                "Oturum bilgileriniz bulunamadı. Lütfen tekrar giriş yapın."
            );

            return;

        }


        const user =
            JSON.parse(userData);


        const userID =
            user.userID ||
            user.UserID;


        if (!userID) {

            alert(
                "Kullanıcı ID bilgisi bulunamadı."
            );

            console.log(
                "Mevcut kullanıcı:",
                user
            );

            return;

        }



        const currentPassword =
            document.querySelector(
                "#currentPassword"
            ).value.trim();


        const newPassword =
            document.querySelector(
                "#newPassword"
            ).value.trim();


        const confirmPassword =
            document.querySelector(
                "#confirmPassword"
            ).value.trim();




        if (
            !currentPassword ||
            !newPassword ||
            !confirmPassword
        ) {

            alert(
                "Lütfen tüm şifre alanlarını doldurun."
            );

            return;

        }



        if (
            newPassword !==
            confirmPassword
        ) {

            alert(
                "Yeni şifreler eşleşmiyor."
            );

            return;

        }



        if (
            currentPassword ===
            newPassword
        ) {

            alert(
                "Yeni şifreniz mevcut şifrenizden farklı olmalıdır."
            );

            return;

        }


        try {


            const response =
                await fetch(
                    "https://localhost:7128/api/Users/change-password",
                    {

                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify({

                                userID:
                                    Number(userID),

                                currentPassword:
                                    currentPassword,

                                newPassword:
                                    newPassword,

                                confirmPassword:
                                    confirmPassword

                            })

                    }
                );



            const responseText =
                await response.text();


            let result = {};


            if (responseText) {

                try {

                    result =
                        JSON.parse(
                            responseText
                        );

                }
                catch {

                    result = {
                        message:
                            responseText
                    };

                }

            }



            if (response.ok) {

                alert(
                    result.message ||
                    "Şifreniz başarıyla güncellendi."
                );


                form.reset();

            }



            else {

                console.error(
                    "Şifre değiştirme API hatası:",
                    response.status,
                    result
                );


                alert(
                    result.message ||
                    `Şifre güncellenemedi. Hata kodu: ${response.status}`
                );

            }

        }
        catch (error) {

            console.error(
                "Şifre değiştirme hatası:",
                error
            );


            alert(
                "API bağlantısı kurulamadı."
            );

        }

    });

}
async function loadUserProfile() {

    const fullNameElement =
        document.querySelector("#fullName");

    const emailElement =
        document.querySelector("#email");

    const phoneElement =
        document.querySelector("#phone");

    const roleElement =
        document.querySelector("#role");

    const registerDateElement =
        document.querySelector("#registerDate");



    if (
        !fullNameElement ||
        !emailElement ||
        !phoneElement ||
        !roleElement ||
        !registerDateElement
    ) {
        return;
    }



    const userData =
        localStorage.getItem("loadhubCurrentUser");


    if (!userData) {

        alert("Profil bilgilerini görmek için giriş yapmalısınız.");

        window.location.href =
            "../login.html";

        return;

    }


    try {

        const currentUser =
            JSON.parse(userData);


        const userId =
            currentUser.userID ??
            currentUser.UserID;


        if (!userId) {

            console.error(
                "UserID bulunamadı."
            );

            return;

        }


        const response =
            await fetch(
                `https://localhost:7128/api/Users/${userId}`
            );


        if (!response.ok) {

            throw new Error(
                "Kullanıcı bilgileri alınamadı."
            );

        }


        const user =
            await response.json();



        fullNameElement.textContent =
            user.fullName ??
            user.FullName ??
            "-";


        emailElement.textContent =
            user.email ??
            user.Email ??
            "-";


        phoneElement.textContent =
            user.phone ??
            user.Phone ??
            "-";


        roleElement.textContent =
            user.role ??
            user.Role ??
            "-";


        const registerDate =
            user.registerDate ??
            user.RegisterDate;


        if (registerDate) {

            registerDateElement.textContent =
                new Date(registerDate)
                    .toLocaleDateString(
                        "tr-TR",
                        {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric"
                        }
                    );

        } else {

            registerDateElement.textContent =
                "-";

        }


    } catch (error) {

        console.error(
            "Profil bilgileri yüklenirken hata:",
            error
        );

    }

}
function renderListings() {

    const listingsContainer =
        document.querySelector(
            "#listingsContainer"
        );

    if (!listingsContainer) return;


    const searchInput =
        document.querySelector(
            ".company-listings-filter input"
        );

    const statusSelect =
        document.querySelector(
            ".company-listings-filter select:nth-of-type(1)"
        );

    const sortSelect =
        document.querySelector(
            ".company-listings-filter select:nth-of-type(2)"
        );


    let filteredListings =
        [...allListings];


    const searchValue =
        searchInput
            ? searchInput.value
                .toLowerCase()
                .trim()
            : "";


    const statusValue =
        statusSelect
            ? statusSelect.value
            : "Tüm Durumlar";


    if (searchValue) {

        filteredListings =
            filteredListings.filter(
                listing => {

                    const text = `

                        ${listing.cargoName || ""}

                        ${listing.fromCity || ""}

                        ${listing.toCity || ""}

                        ${listing.description || ""}

                    `.toLowerCase();


                    return text.includes(
                        searchValue
                    );

                }
            );

    }



    if (
        statusValue !==
        "Tüm Durumlar"
    ) {

        filteredListings =
            filteredListings.filter(
                listing =>
                    (
                        listing.status ||
                        "Aktif"
                    ) ===
                    statusValue
            );

    }



    filteredListings.sort(
        (a, b) => {

            const dateA =
                new Date(
                    a.loadingDate
                );

            const dateB =
                new Date(
                    b.loadingDate
                );


            if (
                sortSelect &&
                sortSelect.value ===
                "En Eski"
            ) {

                return dateA - dateB;

            }


            return dateB - dateA;

        }
    );


    const startIndex =
        (currentPage - 1) *
        itemsPerPage;


    const endIndex =
        startIndex +
        itemsPerPage;


    const currentListings =
        filteredListings.slice(
            startIndex,
            endIndex
        );


    listingsContainer.innerHTML = "";


    if (
        currentListings.length === 0
    ) {

        listingsContainer.innerHTML = `

            <div class="company-listings-empty">

                <i class="fa-solid fa-file-circle-xmark"></i>

                <h3>
                    İlan Bulunamadı
                </h3>

                <p>
                    Arama veya filtre kriterlerinize uygun ilan bulunamadı.
                </p>

            </div>

        `;

        return;

    }


    currentListings.forEach(
        listing => {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "company-listing-card";


            const status =
                listing.status ||
                "Aktif";


            let statusClass =
                "active";


            if (
                status ===
                "Bekliyor"
            ) {

                statusClass =
                    "waiting";

            }
            else if (
                status ===
                "Tamamlandı"
            ) {

                statusClass =
                    "completed";

            }


            const loadingDate =
                listing.loadingDate
                    ? new Date(
                        listing.loadingDate
                    ).toLocaleDateString(
                        "tr-TR"
                    )
                    : "-";


            card.innerHTML = `

                <div class="company-listing-header">

                    <h3>
                        ${listing.fromCity || "-"}
                        →
                        ${listing.toCity || "-"}
                    </h3>

                    <span class="badge ${statusClass}">

                        ${status}

                    </span>

                </div>


                <div class="company-listing-info">

                    <div>

                        <strong>
                            ${listing.weight || 0} Ton
                        </strong>

                        <span>
                            Ağırlık
                        </span>

                    </div>


                    <div>

                        <strong>
                            ${listing.cargoName || "-"}
                        </strong>

                        <span>
                            Yük Türü
                        </span>

                    </div>


                    <div>

                        <strong>
                            0
                        </strong>

                        <span>
                            Teklif
                        </span>

                    </div>


                    <div>

                        <strong>
                            ${loadingDate}
                        </strong>

                        <span>
                            Tarih
                        </span>

                    </div>

                </div>


                <div class="company-listing-actions">

                    <a
                        href="edit-listing.html?id=${listing.listingID}"
                        class="btn btn-outline"
                    >

                        Düzenle

                    </a>


                    <a
                        href="../listing-detail.html?id=${listing.listingID}"
                        class="btn btn-outline"
                    >

                        Detay

                    </a>


                    <button
                        type="button"
                        class="btn btn-danger"
                        onclick="deleteListing(${listing.listingID})"
                    >

                        Sil

                    </button>

                </div>

            `;


            listingsContainer.appendChild(
                card
            );

        }
    );

} function renderPagination() {

    const pagination =
        document.querySelector(
            "#companyPagination"
        );

    if (!pagination) return;


    pagination.innerHTML = "";


    const totalPages =
        Math.ceil(
            allListings.length /
            itemsPerPage
        );


    if (
        totalPages <= 1
    ) {

        return;

    }


    const prevButton =
        document.createElement(
            "a"
        );


    prevButton.href =
        "#";


    prevButton.innerHTML =
        `<i class="fa-solid fa-angle-left"></i>`;


    if (
        currentPage === 1
    ) {

        prevButton.classList.add(
            "disabled"
        );

    }


    prevButton.addEventListener(
        "click",
        function (event) {

            event.preventDefault();


            if (
                currentPage > 1
            ) {

                currentPage--;


                renderListings();


                renderPagination();


                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

            }

        }
    );


    pagination.appendChild(
        prevButton
    );



    for (
        let page = 1;
        page <= totalPages;
        page++
    ) {

        const pageButton =
            document.createElement(
                "a"
            );


        pageButton.href =
            "#";


        pageButton.textContent =
            page;


        if (
            page === currentPage
        ) {

            pageButton.classList.add(
                "active"
            );

        }


        pageButton.addEventListener(
            "click",
            function (event) {

                event.preventDefault();


                currentPage =
                    page;


                renderListings();


                renderPagination();


                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

            }
        );


        pagination.appendChild(
            pageButton
        );

    }


    const nextButton =
        document.createElement(
            "a"
        );


    nextButton.href =
        "#";


    nextButton.innerHTML =
        `<i class="fa-solid fa-angle-right"></i>`;


    if (
        currentPage ===
        totalPages
    ) {

        nextButton.classList.add(
            "disabled"
        );

    }


    nextButton.addEventListener(
        "click",
        function (event) {

            event.preventDefault();


            if (
                currentPage <
                totalPages
            ) {

                currentPage++;


                renderListings();


                renderPagination();


                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

            }

        }
    );


    pagination.appendChild(
        nextButton
    );

}
function renderCompanyOffers() {

    const wrapper =
        document.querySelector(
            "#companyOffersWrapper"
        );


    const emptyMessage =
        document.querySelector(
            "#companyOffersEmpty"
        );


    if (!wrapper) return;


    wrapper.innerHTML = "";



    if (
        !allCompanyOffers ||
        allCompanyOffers.length === 0
    ) {

        if (emptyMessage) {

            emptyMessage.style.display =
                "block";

        }


        renderCompanyOffersPagination();

        return;

    }


    if (emptyMessage) {

        emptyMessage.style.display =
            "none";

    }



    const startIndex =
        (
            companyOffersCurrentPage - 1
        )
        *
        companyOffersItemsPerPage;


    const endIndex =
        startIndex +
        companyOffersItemsPerPage;


    const currentOffers =
        allCompanyOffers.slice(
            startIndex,
            endIndex
        );


    currentOffers.forEach(
        offer => {

            const listingID =
                Number(
                    offer.listingID ||
                    offer.ListingID
                );


            const listing =
                allListings.find(
                    listing =>

                        Number(
                            listing.listingID ||
                            listing.ListingID
                        )
                        ===
                        listingID

                );



            const fromCity =
                listing
                    ? (
                        listing.fromCity ||
                        listing.FromCity ||
                        ""
                    )
                    : "";


            const toCity =
                listing
                    ? (
                        listing.toCity ||
                        listing.ToCity ||
                        ""
                    )
                    : "";


            const status =
                offer.status ||
                offer.Status ||
                "Bekliyor";


            let badgeClass =
                "waiting";


            if (
                status ===
                "Kabul Edildi"
            ) {

                badgeClass =
                    "active";

            }


            if (
                status ===
                "Reddedildi"
            ) {

                badgeClass =
                    "completed";

            }


            const offerID =
                offer.offerID ||
                offer.OfferID;


            const carrierID =
                offer.carrierID ||
                offer.CarrierID;


            const price =
                offer.price ||
                offer.Price ||
                0;


            const vehicleCount =
                offer.vehicleCount ||
                offer.VehicleCount ||
                0;


            const deliveryTime =
                offer.deliveryTime ||
                offer.DeliveryTime ||
                "-";


            const offerDate =
                offer.offerDate ||
                offer.OfferDate;


            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "company-offer-card";


            card.innerHTML =
                `

                <div class="company-offer-header">

                    <h3>
                        ${fromCity} → ${toCity}
                    </h3>

                    <span class="badge ${badgeClass}">
                        ${status}
                    </span>

                </div>


                <div class="company-offer-company">

                    <i class="fa-solid fa-truck"></i>

                    <strong>
                        Taşıyıcı #${carrierID}
                    </strong>

                </div>


                <div class="company-offer-info">

                    <div>

                        <strong>
                            ${Number(price).toLocaleString("tr-TR")} ₺
                        </strong>

                        <span>
                            Teklif
                        </span>

                    </div>


                    <div>

                        <strong>
                            ${vehicleCount}
                        </strong>

                        <span>
                            Araç
                        </span>

                    </div>


                    <div>

                        <strong>
                            ${deliveryTime}
                        </strong>

                        <span>
                            Teslimat
                        </span>

                    </div>


                    <div>

                        <strong>
                            ${offerDate
                    ? new Date(
                        offerDate
                    ).toLocaleDateString(
                        "tr-TR"
                    )
                    : "-"
                }
                        </strong>

                        <span>
                            Tarih
                        </span>

                    </div>

                </div>


                <div class="company-offer-actions">


                    <a
                        href="../listing-detail.html?id=${listingID}"
                        class="btn btn-outline"
                    >

                        <i class="fa-solid fa-eye"></i>

                        Detay

                    </a>


                    ${status === "Bekliyor"

                    ?

                    `

                        <button
                            class="btn btn-primary accept-offer"
                            data-id="${offerID}"
                        >
                            Kabul Et
                        </button>


                        <button
                            class="btn btn-danger reject-offer"
                            data-id="${offerID}"
                        >
                            Reddet
                        </button>

                        `

                    :

                    ""

                }


                </div>

                `;


            wrapper.appendChild(
                card
            );

        }
    );



    renderCompanyOffersPagination();


    // Teklif kabul / red eventleri
    initOfferActions();

}
function renderCompanyOffersPagination() {

    const pagination =
        document.querySelector(
            "#companyOffersPagination"
        );


    if (!pagination) return;


    pagination.innerHTML =
        "";


    const totalPages =
        Math.ceil(
            allCompanyOffers.length /
            companyOffersItemsPerPage
        );



    if (
        totalPages <= 1
    ) {

        return;

    }



    const prevButton =
        document.createElement(
            "a"
        );


    prevButton.href =
        "#";


    prevButton.innerHTML =
        `
        <i class="fa-solid fa-angle-left"></i>
        `;


    if (
        companyOffersCurrentPage ===
        1
    ) {

        prevButton.classList.add(
            "disabled"
        );

    }


    prevButton.addEventListener(
        "click",
        function (event) {

            event.preventDefault();


            if (
                companyOffersCurrentPage >
                1
            ) {

                companyOffersCurrentPage--;


                renderCompanyOffers();


                window.scrollTo({

                    top: 0,

                    behavior: "smooth"

                });

            }

        }
    );


    pagination.appendChild(
        prevButton
    );


    for (
        let page = 1;
        page <= totalPages;
        page++
    ) {

        const pageButton =
            document.createElement(
                "a"
            );


        pageButton.href =
            "#";


        pageButton.textContent =
            page;


        if (
            page ===
            companyOffersCurrentPage
        ) {

            pageButton.classList.add(
                "active"
            );

        }


        pageButton.addEventListener(
            "click",
            function (event) {

                event.preventDefault();


                companyOffersCurrentPage =
                    page;


                renderCompanyOffers();


                window.scrollTo({

                    top: 0,

                    behavior: "smooth"

                });

            }
        );


        pagination.appendChild(
            pageButton
        );

    }


    const nextButton =
        document.createElement(
            "a"
        );


    nextButton.href =
        "#";


    nextButton.innerHTML =
        `
        <i class="fa-solid fa-angle-right"></i>
        `;


    if (
        companyOffersCurrentPage ===
        totalPages
    ) {

        nextButton.classList.add(
            "disabled"
        );

    }


    nextButton.addEventListener(
        "click",
        function (event) {

            event.preventDefault();


            if (
                companyOffersCurrentPage <
                totalPages
            ) {

                companyOffersCurrentPage++;


                renderCompanyOffers();


                window.scrollTo({

                    top: 0,

                    behavior: "smooth"

                });

            }

        }
    );


    pagination.appendChild(
        nextButton
    );

}
window.loadMessages = loadMessages;
window.loadConversations = loadConversations;
window.loadCarrierMessages = loadCarrierMessages;
window.loadCarrierConversations = loadCarrierConversations;
