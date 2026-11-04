const API_URL =
    "https://localhost:7128/api/Admin";



let adminUsers = [];

let adminCompanies = [];

let adminCarriers = [];



function checkAdminAccess() {

    if (
        !window.location.pathname.includes("/admin/")
    ) {

        return;

    }


    const loggedIn =
        localStorage.getItem(
            "loadhubLoggedIn"
        );


    const role =
        localStorage.getItem(
            "loadhubRole"
        );


    const normalizedRole =
        role
            ? role.toLowerCase()
            : "";


    if (
        loggedIn !== "true" ||
        normalizedRole !== "admin"
    ) {

        alert(
            "Bu sayfaya erişim yetkiniz yok."
        );


        window.location.href =
            "../login.html";


        return false;

    }


    return true;

}


function initAdminLogout() {

    const logoutButton =
        document.querySelector(
            "#adminLogout"
        );


    if (!logoutButton) {

        return;

    }




    if (
        logoutButton.dataset.initialized ===
        "true"
    ) {

        return;

    }


    logoutButton.dataset.initialized =
        "true";


    logoutButton.addEventListener(
        "click",
        function (event) {

            event.preventDefault();


            const confirmed =
                confirm(
                    "Çıkış yapmak istediğinize emin misiniz?"
                );


            if (!confirmed) {

                return;

            }



            localStorage.removeItem(
                "loadhubLoggedIn"
            );


            localStorage.removeItem(
                "loadhubRole"
            );


            localStorage.removeItem(
                "loadhubCurrentUser"
            );



            localStorage.removeItem(
                "adminLoggedIn"
            );


            localStorage.removeItem(
                "adminUser"
            );


            window.location.replace(
                "../login.html"
            );

        }
    );

}



async function readAdminResponse(
    response
) {

    const text =
        await response.text();


    if (!text) {

        return {};

    }


    try {

        return JSON.parse(
            text
        );

    }
    catch {

        return {

            message:
                text

        };

    }

}

function escapeAdminText(
    text
) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        text ?? "";


    return div.innerHTML;

}


function formatAdminDate(
    date
) {

    if (!date) {

        return "-";

    }


    const parsedDate =
        new Date(
            date
        );


    if (
        isNaN(
            parsedDate.getTime()
        )
    ) {

        return "-";

    }


    return parsedDate.toLocaleDateString(
        "tr-TR"
    );

}


async function loadAdminStats() {

    const totalUsers =
        document.querySelector(
            "#totalUsers"
        );


    const totalCompanies =
        document.querySelector(
            "#totalCompanies"
        );


    const totalCarriers =
        document.querySelector(
            "#totalCarriers"
        );


    const totalListings =
        document.querySelector(
            "#totalListings"
        );


    if (
        !totalUsers &&
        !totalCompanies &&
        !totalCarriers &&
        !totalListings
    ) {

        return;

    }


    try {

        const response =
            await fetch(
                `${API_URL}/stats`
            );


        if (!response.ok) {

            throw new Error(
                "İstatistikler alınamadı."
            );

        }


        const data =
            await readAdminResponse(
                response
            );


        if (totalUsers) {

            totalUsers.textContent =
                data.totalUsers ??
                0;

        }


        if (totalCompanies) {

            totalCompanies.textContent =
                data.totalCompanies ??
                0;

        }


        if (totalCarriers) {

            totalCarriers.textContent =
                data.totalCarriers ??
                0;

        }


        if (totalListings) {

            totalListings.textContent =
                data.totalListings ??
                0;

        }

    }
    catch (error) {

        console.error(
            "Admin stats hatası:",
            error
        );

    }

}


async function loadAdminUsers() {

    const tableBody =
        document.querySelector(
            "#usersTableBody"
        );


    if (!tableBody) {

        return;

    }


    tableBody.innerHTML = `

        <tr>

            <td
                colspan="7"
                class="admin-table-empty">

                <i class="fa-solid fa-spinner fa-spin"></i>

                Kullanıcılar yükleniyor...

            </td>

        </tr>

    `;


    try {

        const response =
            await fetch(
                `${API_URL}/users`
            );


        if (!response.ok) {

            throw new Error(
                "Kullanıcılar alınamadı."
            );

        }


        const data =
            await readAdminResponse(
                response
            );


        adminUsers =
            Array.isArray(data)
                ? data
                : [];


        renderAdminUsers();


        initAdminUserDelete();


    }
    catch (error) {

        console.error(
            "Kullanıcı yükleme hatası:",
            error
        );


        tableBody.innerHTML = `

            <tr>

                <td
                    colspan="7"
                    class="admin-table-empty">

                    Kullanıcılar yüklenemedi.

                </td>

            </tr>

        `;

    }

}


function renderAdminUsers() {

    const tableBody =
        document.querySelector(
            "#usersTableBody"
        );


    if (!tableBody) {

        return;

    }


    const searchInput =
        document.querySelector(
            "#adminUserSearch"
        );


    const secondSearchInput =
        document.querySelector(
            "#userSearch"
        );


    const typeFilter =
        document.querySelector(
            "#userTypeFilter"
        );


    const statusFilter =
        document.querySelector(
            "#userStatusFilter"
        );


    const searchValue =
        (
            searchInput?.value ||
            secondSearchInput?.value ||
            ""
        )
            .toLowerCase()
            .trim();


    const selectedType =
        typeFilter
            ? typeFilter.value
            : "all";


    const selectedStatus =
        statusFilter
            ? statusFilter.value
            : "all";


    const filteredUsers =
        adminUsers.filter(
            user => {

                const name =
                    (
                        user.fullName ||
                        user.FullName ||
                        ""
                    )
                        .toLowerCase();


                const email =
                    (
                        user.email ||
                        user.Email ||
                        ""
                    )
                        .toLowerCase();


                const phone =
                    (
                        user.phone ||
                        user.Phone ||
                        ""
                    )
                        .toLowerCase();


                const role =
                    (
                        user.role ||
                        user.Role ||
                        ""
                    );


                const normalizedRole =
                    role.toLowerCase();


                const matchesSearch =
                    !searchValue ||
                    name.includes(
                        searchValue
                    ) ||
                    email.includes(
                        searchValue
                    ) ||
                    phone.includes(
                        searchValue
                    );


                const matchesType =
                    selectedType ===
                    "all" ||
                    (
                        selectedType ===
                        "company" &&
                        normalizedRole ===
                        "company"
                    ) ||
                    (
                        selectedType ===
                        "carrier" &&
                        normalizedRole ===
                        "carrier"
                    );


                const userStatus =
                    (
                        user.status ||
                        user.Status ||
                        "active"
                    )
                        .toLowerCase();


                const matchesStatus =
                    selectedStatus ===
                    "all" ||
                    userStatus ===
                    selectedStatus;


                return (
                    matchesSearch &&
                    matchesType &&
                    matchesStatus
                );

            }
        );


    tableBody.innerHTML = "";


    if (
        filteredUsers.length === 0
    ) {

        tableBody.innerHTML = `

            <tr>

                <td
                    colspan="7"
                    class="admin-table-empty">

                    <i class="fa-solid fa-user-slash"></i>

                    <br><br>

                    Arama kriterlerine uygun kullanıcı bulunamadı.

                </td>

            </tr>

        `;


        return;

    }


    filteredUsers.forEach(
        user => {


            const userID =
                user.userID ||
                user.UserID;


            const fullName =
                user.fullName ||
                user.FullName ||
                "-";


            const email =
                user.email ||
                user.Email ||
                "-";


            const phone =
                user.phone ||
                user.Phone ||
                "-";


            const role =
                user.role ||
                user.Role ||
                "-";


            const registerDate =
                user.registerDate ||
                user.RegisterDate;


            const status =
                user.status ||
                user.Status ||
                "Aktif";


            const normalizedRole =
                role.toLowerCase();


            const roleText =
                normalizedRole ===
                    "company"

                    ? "Şirket"

                    : normalizedRole ===
                        "carrier"

                        ? "Nakliye Firması"

                        : role;


            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>

                    ${escapeAdminText(
                fullName
            )}

                </td>


                <td>

                    ${escapeAdminText(
                email
            )}

                </td>


                <td>

                    ${escapeAdminText(
                phone
            )}

                </td>


                <td>

                    ${escapeAdminText(
                roleText
            )}

                </td>


                <td>

                    ${formatAdminDate(
                registerDate
            )}

                </td>


                <td>

                    <span class="admin-badge active">

                        ${escapeAdminText(
                status ===
                    "active"
                    ? "Aktif"
                    : status
            )}

                    </span>

                </td>


                <td>

                    <div class="admin-table-actions">

                        <button
                            type="button"
                            class="admin-action-btn delete delete-user"
                            data-id="${userID}"
                            title="Kullanıcıyı Sil">

                            <i class="fa-solid fa-trash"></i>

                        </button>

                    </div>

                </td>

            `;


            tableBody.appendChild(
                row
            );

        }
    );

}


function initAdminUserFilters() {

    const searchInputs =
        document.querySelectorAll(
            "#adminUserSearch, #userSearch"
        );


    searchInputs.forEach(
        input => {

            input.addEventListener(
                "input",
                function () {

                    // İki arama alanı aynı değeri kullansın

                    searchInputs.forEach(
                        otherInput => {

                            if (
                                otherInput !==
                                input
                            ) {

                                otherInput.value =
                                    input.value;

                            }

                        }
                    );


                    renderAdminUsers();

                    initAdminUserDelete();

                }
            );

        }
    );


    const typeFilter =
        document.querySelector(
            "#userTypeFilter"
        );


    if (typeFilter) {

        typeFilter.addEventListener(
            "change",
            function () {

                renderAdminUsers();

                initAdminUserDelete();

            }
        );

    }


    const statusFilter =
        document.querySelector(
            "#userStatusFilter"
        );


    if (statusFilter) {

        statusFilter.addEventListener(
            "change",
            function () {

                renderAdminUsers();

                initAdminUserDelete();

            }
        );

    }

}


function initAdminUserDelete() {

    document
        .querySelectorAll(
            ".delete-user"
        )
        .forEach(
            button => {


                if (
                    button.dataset.initialized ===
                    "true"
                ) {

                    return;

                }


                button.dataset.initialized =
                    "true";


                button.addEventListener(
                    "click",
                    async function () {


                        const userId =
                            this.dataset.id;


                        if (!userId) {

                            alert(
                                "Kullanıcı ID bulunamadı."
                            );

                            return;

                        }


                        const confirmed =
                            confirm(
                                "Bu kullanıcıyı silmek istediğinize emin misiniz?"
                            );


                        if (!confirmed) {

                            return;

                        }


                        try {

                            const response =
                                await fetch(
                                    `${API_URL}/users/${userId}`,
                                    {
                                        method:
                                            "DELETE"
                                    }
                                );


                            const data =
                                await readAdminResponse(
                                    response
                                );


                            if (!response.ok) {

                                throw new Error(
                                    data.message ||
                                    "Kullanıcı silinemedi."
                                );

                            }


                            alert(
                                data.message ||
                                "Kullanıcı başarıyla silindi."
                            );


                            loadAdminUsers();

                            loadAdminStats();


                        }
                        catch (error) {

                            console.error(
                                "Kullanıcı silme hatası:",
                                error
                            );


                            alert(
                                error.message
                            );

                        }

                    }
                );

            }
        );

}



async function loadAdminCompanies() {

    const wrapper =
        document.querySelector(
            "#adminCompaniesWrapper"
        );


    if (!wrapper) {

        return;

    }


    wrapper.innerHTML = `

        <div class="admin-loading">

            <i class="fa-solid fa-spinner fa-spin"></i>

            <span>
                Şirketler yükleniyor...
            </span>

        </div>

    `;


    try {

        const response =
            await fetch(
                `${API_URL}/companies`
            );


        if (!response.ok) {

            throw new Error(
                "Şirketler alınamadı."
            );

        }


        const data =
            await readAdminResponse(
                response
            );


        adminCompanies =
            Array.isArray(data)
                ? data
                : [];


        renderAdminCompanies();


    }
    catch (error) {

        console.error(
            "Şirket yükleme hatası:",
            error
        );


        wrapper.innerHTML = `

            <div class="admin-empty">

                <i class="fa-solid fa-triangle-exclamation"></i>

                <h3>
                    Şirketler yüklenemedi.
                </h3>

                <p>
                    API bağlantısını kontrol edin.
                </p>

            </div>

        `;

    }

}



function renderAdminCompanies() {

    const wrapper =
        document.querySelector(
            "#adminCompaniesWrapper"
        );


    if (!wrapper) {

        return;

    }


    const searchInput =
        document.querySelector(
            "#companySearch"
        );


    const searchValue =
        (
            searchInput?.value ||
            ""
        )
            .toLowerCase()
            .trim();


    const filteredCompanies =
        adminCompanies.filter(
            company => {


                const companyName =
                    (
                        company.companyName ||
                        company.CompanyName ||
                        ""
                    )
                        .toLowerCase();


                const fullName =
                    (
                        company.fullName ||
                        company.FullName ||
                        ""
                    )
                        .toLowerCase();


                const email =
                    (
                        company.email ||
                        company.Email ||
                        ""
                    )
                        .toLowerCase();


                return (
                    !searchValue ||
                    companyName.includes(
                        searchValue
                    ) ||
                    fullName.includes(
                        searchValue
                    ) ||
                    email.includes(
                        searchValue
                    )
                );

            }
        );


    wrapper.innerHTML = "";


    if (
        filteredCompanies.length === 0
    ) {

        wrapper.innerHTML = `

            <div class="admin-empty">

                <i class="fa-solid fa-building-circle-xmark"></i>

                <h3>
                    Şirket bulunamadı.
                </h3>

                <p>
                    Arama kriterlerinize uygun şirket bulunamadı.
                </p>

            </div>

        `;


        return;

    }


    filteredCompanies.forEach(
        company => {


            const companyID =
                company.companyID ||
                company.CompanyID;


            const companyName =
                company.companyName ||
                company.CompanyName ||
                "-";


            const fullName =
                company.fullName ||
                company.FullName ||
                "-";


            const email =
                company.email ||
                company.Email ||
                "-";


            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "admin-company-card";


            card.innerHTML = `

                <div class="admin-company-info">

                    <h3>

                        ${escapeAdminText(
                companyName
            )}

                    </h3>


                    <p>

                        Yetkili :

                        ${escapeAdminText(
                fullName
            )}

                    </p>


                    <span>

                        ${escapeAdminText(
                email
            )}

                    </span>

                </div>


                <div class="admin-company-status active">

                    Aktif

                </div>


                <div class="admin-company-actions">

                    <button
                        type="button"
                        class="btn btn-danger delete-company"
                        data-id="${companyID}">

                        <i class="fa-solid fa-trash"></i>

                        Sil

                    </button>

                </div>

            `;


            wrapper.appendChild(
                card
            );

        }
    );


    initAdminCompanyDelete();

}


function initAdminCompanySearch() {

    const searchInput =
        document.querySelector(
            "#companySearch"
        );


    if (!searchInput) {

        return;

    }


    searchInput.addEventListener(
        "input",
        function () {

            renderAdminCompanies();

        }
    );

}


function initAdminCompanyDelete() {

    document
        .querySelectorAll(
            ".delete-company"
        )
        .forEach(
            button => {


                if (
                    button.dataset.initialized ===
                    "true"
                ) {

                    return;

                }


                button.dataset.initialized =
                    "true";


                button.addEventListener(
                    "click",
                    async function () {


                        const id =
                            this.dataset.id;


                        if (!id) {

                            return;

                        }


                        const confirmed =
                            confirm(
                                "Bu şirketi silmek istediğinize emin misiniz?"
                            );


                        if (!confirmed) {

                            return;

                        }


                        try {

                            const response =
                                await fetch(
                                    `${API_URL}/companies/${id}`,
                                    {
                                        method:
                                            "DELETE"
                                    }
                                );


                            const data =
                                await readAdminResponse(
                                    response
                                );


                            if (!response.ok) {

                                throw new Error(
                                    data.message ||
                                    "Şirket silinemedi."
                                );

                            }


                            alert(
                                data.message ||
                                "Şirket başarıyla silindi."
                            );


                            loadAdminCompanies();

                            loadAdminStats();


                        }
                        catch (error) {

                            console.error(
                                "Şirket silme hatası:",
                                error
                            );


                            alert(
                                error.message
                            );

                        }

                    }
                );

            }
        );

}


async function loadAdminCarriers() {

    const wrapper =
        document.querySelector(
            "#adminCarriersWrapper"
        );


    if (!wrapper) {

        return;

    }


    wrapper.innerHTML = `

        <div class="admin-loading">

            <i class="fa-solid fa-spinner fa-spin"></i>

            <span>
                Nakliye firmaları yükleniyor...
            </span>

        </div>

    `;


    try {

        const response =
            await fetch(
                `${API_URL}/carriers`
            );


        if (!response.ok) {

            throw new Error(
                "Nakliye firmaları alınamadı."
            );

        }


        const data =
            await readAdminResponse(
                response
            );


        adminCarriers =
            Array.isArray(data)
                ? data
                : [];


        renderAdminCarriers();

    }
    catch (error) {

        console.error(
            "Nakliye firması yükleme hatası:",
            error
        );


        wrapper.innerHTML = `

            <div class="admin-empty">

                <i class="fa-solid fa-triangle-exclamation"></i>

                <h3>
                    Nakliye firmaları yüklenemedi.
                </h3>

                <p>
                    API bağlantısını kontrol edin.
                </p>

            </div>

        `;

    }

}

function renderAdminCarriers() {

    const wrapper =
        document.querySelector(
            "#adminCarriersWrapper"
        );


    if (!wrapper) {

        return;

    }


    const searchInput =
        document.querySelector(
            "#carrierSearch"
        );


    const searchValue =
        (
            searchInput?.value ||
            ""
        )
            .toLowerCase()
            .trim();


    const filteredCarriers =
        adminCarriers.filter(
            carrier => {


                const companyName =
                    (
                        carrier.companyName ||
                        carrier.CompanyName ||
                        ""
                    )
                        .toLowerCase();


                const fullName =
                    (
                        carrier.fullName ||
                        carrier.FullName ||
                        ""
                    )
                        .toLowerCase();


                const email =
                    (
                        carrier.email ||
                        carrier.Email ||
                        ""
                    )
                        .toLowerCase();


                return (
                    !searchValue ||
                    companyName.includes(
                        searchValue
                    ) ||
                    fullName.includes(
                        searchValue
                    ) ||
                    email.includes(
                        searchValue
                    )
                );

            }
        );


    wrapper.innerHTML = "";


    if (
        filteredCarriers.length === 0
    ) {

        wrapper.innerHTML = `

            <div class="admin-empty">

                <i class="fa-solid fa-truck-ramp-box"></i>

                <h3>
                    Nakliye firması bulunamadı.
                </h3>

                <p>
                    Arama kriterlerinize uygun nakliye firması bulunamadı.
                </p>

            </div>

        `;


        return;

    }


    filteredCarriers.forEach(
        carrier => {


            const carrierID =
                carrier.carrierID ||
                carrier.CarrierID;


            const companyName =
                carrier.companyName ||
                carrier.CompanyName ||
                "-";


            const fullName =
                carrier.fullName ||
                carrier.FullName ||
                "-";


            const vehicleCount =
                carrier.vehicleCount ??
                carrier.VehicleCount ??
                0;


            const email =
                carrier.email ||
                carrier.Email ||
                "-";


            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "admin-carrier-card";


            card.innerHTML = `

                <div class="admin-carrier-info">

                    <h3>

                        ${escapeAdminText(
                companyName
            )}

                    </h3>


                    <p>

                        Yetkili :

                        ${escapeAdminText(
                fullName
            )}

                    </p>


                    <span>

                        <i class="fa-solid fa-truck"></i>

                        ${vehicleCount}
                        Araç

                    </span>


                    <span>

                        ${escapeAdminText(
                email
            )}

                    </span>

                </div>


                <div class="admin-carrier-status active">

                    Aktif

                </div>


                <div class="admin-carrier-actions">

                    <button
                        type="button"
                        class="btn btn-danger delete-carrier"
                        data-id="${carrierID}">

                        <i class="fa-solid fa-trash"></i>

                        Sil

                    </button>

                </div>

            `;


            wrapper.appendChild(
                card
            );

        }
    );


    initAdminCarrierDelete();

}


function initAdminCarrierSearch() {

    const searchInput =
        document.querySelector(
            "#carrierSearch"
        );


    if (!searchInput) {

        return;

    }


    searchInput.addEventListener(
        "input",
        function () {

            renderAdminCarriers();

        }
    );

}



function initAdminCarrierDelete() {

    document
        .querySelectorAll(
            ".delete-carrier"
        )
        .forEach(
            button => {


                if (
                    button.dataset.initialized ===
                    "true"
                ) {

                    return;

                }


                button.dataset.initialized =
                    "true";


                button.addEventListener(
                    "click",
                    async function () {


                        const id =
                            this.dataset.id;


                        if (!id) {

                            return;

                        }


                        const confirmed =
                            confirm(
                                "Bu nakliye firmasını silmek istediğinize emin misiniz?"
                            );


                        if (!confirmed) {

                            return;

                        }


                        try {

                            const response =
                                await fetch(
                                    `${API_URL}/carriers/${id}`,
                                    {
                                        method:
                                            "DELETE"
                                    }
                                );


                            const data =
                                await readAdminResponse(
                                    response
                                );


                            if (!response.ok) {

                                throw new Error(
                                    data.message ||
                                    "Nakliye firması silinemedi."
                                );

                            }


                            alert(
                                data.message ||
                                "Nakliye firması başarıyla silindi."
                            );


                            loadAdminCarriers();

                            loadAdminStats();


                        }
                        catch (error) {

                            console.error(
                                "Nakliye firması silme hatası:",
                                error
                            );


                            alert(
                                error.message
                            );

                        }

                    }
                );

            }
        );

}

async function loadAdminRecentUsers() {

    const tableBody =
        document.querySelector(
            "#adminRecentUsersBody"
        );


    if (!tableBody) {

        return;

    }


    try {

        const response =
            await fetch(
                `${API_URL}/users`
            );


        if (!response.ok) {

            return;

        }


        const users =
            await readAdminResponse(
                response
            );


        const userList =
            Array.isArray(users)
                ? users
                : [];


        const latestUsers =
            userList
                .sort(
                    (
                        a,
                        b
                    ) => {

                        const dateA =
                            new Date(
                                a.registerDate ||
                                a.RegisterDate ||
                                0
                            );


                        const dateB =
                            new Date(
                                b.registerDate ||
                                b.RegisterDate ||
                                0
                            );


                        return dateB - dateA;

                    }
                )
                .slice(
                    0,
                    5
                );


        tableBody.innerHTML = "";


        if (
            latestUsers.length === 0
        ) {

            tableBody.innerHTML = `

                <tr>

                    <td colspan="4">

                        Henüz kullanıcı bulunmuyor.

                    </td>

                </tr>

            `;


            return;

        }


        latestUsers.forEach(
            user => {


                const role =
                    user.role ||
                    user.Role ||
                    "-";


                const normalizedRole =
                    role.toLowerCase();


                const roleText =
                    normalizedRole ===
                        "company"

                        ? "Şirket"

                        : normalizedRole ===
                            "carrier"

                            ? "Nakliye Firması"

                            : role;


                const row =
                    document.createElement(
                        "tr"
                    );


                row.innerHTML = `

                    <td>

                        ${escapeAdminText(
                    user.fullName ||
                    user.FullName ||
                    "-"
                )}

                    </td>


                    <td>

                        ${escapeAdminText(
                    user.email ||
                    user.Email ||
                    "-"
                )}

                    </td>


                    <td>

                        ${escapeAdminText(
                    roleText
                )}

                    </td>


                    <td>

                        <span class="admin-badge active">

                            Aktif

                        </span>

                    </td>

                `;


                tableBody.appendChild(
                    row
                );

            }
        );

    }
    catch (error) {

        console.error(
            "Son kullanıcılar yüklenemedi:",
            error
        );

    }

}


document.addEventListener(
    "DOMContentLoaded",
    function () {




        const hasAccess =
            checkAdminAccess();


        if (
            hasAccess === false
        ) {

            return;

        }


        initAdminLogout();

        loadAdminStats();

        loadAdminRecentUsers();

        loadAdminUsers();

        initAdminUserFilters();

        loadAdminCompanies();

        initAdminCompanySearch();


        loadAdminCarriers();

        initAdminCarrierSearch();


    }
);